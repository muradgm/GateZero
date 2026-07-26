import {
  PortfolioRiskAssessmentSchema,
  PortfolioRiskCheckpointSchema,
  PortfolioRiskContextSchema,
  type PortfolioRiskAssessment,
  type PortfolioRiskCheckpoint,
  type PortfolioRiskContext,
  type PortfolioRiskFinding,
  type PortfolioRiskPosition
} from "@traderframe/contracts";
import { hashCanonicalValue } from "./canonical-risk-review.js";

export function evaluatePortfolioRisk(input: {
  readonly assessmentId: string;
  readonly context: PortfolioRiskContext;
  readonly limitations: readonly string[];
}): PortfolioRiskAssessment {
  const context = PortfolioRiskContextSchema.parse(input.context);
  assertUniquePositionIds(context);

  const currentPositions = [...context.existingPositions];
  const afterPositions = [...currentPositions, context.candidatePosition];
  const policy = context.policy;
  const findings: PortfolioRiskFinding[] = [];

  const instrumentExposures = buildExposureMetrics({
    current: groupNotional(currentPositions, (position) => position.instrument),
    after: groupNotional(afterPositions, (position) => position.instrument),
    equity: policy.accountEquity,
    limitPct: policy.maximumInstrumentExposurePct
  });
  inspectExposureMetrics(
    findings,
    "INSTRUMENT_EXPOSURE",
    instrumentExposures,
    policy.warningUtilizationPct,
    context
  );

  const currencyExposures = buildExposureMetrics({
    current: groupCurrencyExposure(currentPositions),
    after: groupCurrencyExposure(afterPositions),
    equity: policy.accountEquity,
    limitPct: policy.maximumCurrencyExposurePct
  });
  inspectExposureMetrics(
    findings,
    "CURRENCY_EXPOSURE",
    currencyExposures,
    policy.warningUtilizationPct,
    context
  );

  const correlationExposures = buildExposureMetrics({
    current: groupNotional(currentPositions, (position) => position.correlationGroup),
    after: groupNotional(afterPositions, (position) => position.correlationGroup),
    equity: policy.accountEquity,
    limitPct: policy.maximumCorrelationExposurePct
  });
  inspectExposureMetrics(
    findings,
    "CORRELATION_EXPOSURE",
    correlationExposures,
    policy.warningUtilizationPct,
    context
  );

  const eventExposures = buildExposureMetrics({
    current: groupEventRisk(currentPositions),
    after: groupEventRisk(afterPositions),
    equity: policy.accountEquity,
    limitPct: policy.maximumEventRiskPct
  });
  inspectExposureMetrics(
    findings,
    "EVENT_EXPOSURE",
    eventExposures,
    policy.warningUtilizationPct,
    context
  );

  const currentOpenRisk = sum(currentPositions.map((position) => position.plannedRiskAmount));
  const candidateRisk = context.candidatePosition.plannedRiskAmount;
  const sessionRiskBudget = buildBudgetMetric(
    context.realizedSessionLossAmount + currentOpenRisk,
    context.realizedSessionLossAmount + currentOpenRisk + candidateRisk,
    policy.maximumSessionRiskAmount
  );
  inspectBudget(
    findings,
    "SESSION_RISK_BUDGET",
    "current session",
    sessionRiskBudget.afterCandidateAmount,
    sessionRiskBudget.limitAmount,
    policy.warningUtilizationPct,
    context
  );

  const dailyRiskBudget = buildBudgetMetric(
    context.realizedDailyLossAmount + currentOpenRisk,
    context.realizedDailyLossAmount + currentOpenRisk + candidateRisk,
    policy.maximumDailyRiskAmount
  );
  inspectBudget(
    findings,
    "DAILY_RISK_BUDGET",
    "current trading day",
    dailyRiskBudget.afterCandidateAmount,
    dailyRiskBudget.limitAmount,
    policy.warningUtilizationPct,
    context
  );

  const drawdownPct = round(
    ((policy.equityHighWaterMark - policy.accountEquity) / policy.equityHighWaterMark) * 100
  );
  inspectBudget(
    findings,
    "DRAWDOWN_LIMIT",
    "account drawdown",
    drawdownPct,
    policy.maximumDrawdownPct,
    policy.warningUtilizationPct,
    context
  );

  findings.sort((left, right) =>
    `${left.severity}:${left.code}:${left.subject}`.localeCompare(
      `${right.severity}:${right.code}:${right.subject}`
    )
  );
  const blockers = findings
    .filter((finding) => finding.severity === "BLOCKING")
    .map((finding) => finding.detail);
  const reviewReasons = findings
    .filter((finding) => finding.severity === "REVIEW")
    .map((finding) => finding.detail);
  const status =
    blockers.length > 0
      ? ("BLOCKED" as const)
      : reviewReasons.length > 0
        ? ("REVIEW_REQUIRED" as const)
        : ("CLEAR" as const);
  const contextHash = hashCanonicalValue(context);
  const payload = {
    schemaVersion: 1 as const,
    assessmentId: input.assessmentId,
    contextId: context.contextId,
    contextHash,
    policyId: policy.policyId,
    policyVersion: policy.policyVersion,
    candidatePositionId: context.candidatePosition.positionId,
    status,
    instrumentExposures,
    currencyExposures,
    correlationExposures,
    eventExposures,
    sessionRiskBudget,
    dailyRiskBudget,
    drawdownPct,
    maximumDrawdownPct: policy.maximumDrawdownPct,
    findings,
    blockers,
    reviewReasons,
    limitations: [...input.limitations],
    evaluatedAt: context.evaluatedAt,
    riskApproval: false as const,
    operatorReviewRequired: true as const,
    localSimulationOnly: true as const,
    executionPath: false as const,
    automatedAction: false as const
  };

  return PortfolioRiskAssessmentSchema.parse({
    ...payload,
    assessmentHash: hashCanonicalValue(payload)
  });
}

export function createPortfolioRiskCheckpoint(input: {
  readonly checkpointId: string;
  readonly firstReviewAssessment: PortfolioRiskAssessment;
  readonly secondReviewAssessment: PortfolioRiskAssessment;
  readonly blockedAssessment: PortfolioRiskAssessment;
  readonly checkedAt: string;
}): PortfolioRiskCheckpoint {
  const first = PortfolioRiskAssessmentSchema.parse(input.firstReviewAssessment);
  const second = PortfolioRiskAssessmentSchema.parse(input.secondReviewAssessment);
  const blocked = PortfolioRiskAssessmentSchema.parse(input.blockedAssessment);
  const sourceHashesValid = [first, second, blocked].every((assessment) =>
    hasCanonicalHash(assessment, "assessmentHash")
  );
  const deterministic = sourceHashesValid && first.assessmentHash === second.assessmentHash;
  const portfolioBlockersExercised =
    sourceHashesValid &&
    blocked.status === "BLOCKED" &&
    blocked.findings.some(
      (finding) =>
        finding.severity === "BLOCKING" &&
        ["CORRELATION_EXPOSURE", "EVENT_EXPOSURE"].includes(finding.code)
    );
  const reasons: string[] = [];
  if (!sourceHashesValid) reasons.push("One or more portfolio assessment hashes are invalid.");
  if (!deterministic) reasons.push("Repeated portfolio risk evaluation produced different hashes.");
  if (!portfolioBlockersExercised) {
    reasons.push("Portfolio-level correlation and event blockers were not exercised.");
  }
  const status = reasons.length === 0 ? ("PASS" as const) : ("FAIL" as const);
  const payload = {
    schemaVersion: 1 as const,
    checkpointId: input.checkpointId,
    reviewAssessmentHash: first.assessmentHash,
    blockedAssessmentHash: blocked.assessmentHash,
    status,
    deterministic,
    portfolioBlockersExercised,
    operatorReviewRequired: true as const,
    reasons:
      status === "PASS"
        ? [
            "Portfolio risk evaluation is deterministic and preserves explicit review and blocking states."
          ]
        : reasons,
    checkedAt: input.checkedAt,
    riskApproval: false as const,
    executionPath: false as const,
    automatedAction: false as const
  };
  return PortfolioRiskCheckpointSchema.parse({
    ...payload,
    checkpointHash: hashCanonicalValue(payload)
  });
}

function assertUniquePositionIds(context: PortfolioRiskContext): void {
  const ids = [
    ...context.existingPositions.map((position) => position.positionId),
    context.candidatePosition.positionId
  ];
  if (new Set(ids).size !== ids.length) {
    throw new Error("portfolio risk context contains duplicate position IDs");
  }
}

function groupNotional(
  positions: readonly PortfolioRiskPosition[],
  key: (position: PortfolioRiskPosition) => string
): Map<string, number> {
  const values = new Map<string, number>();
  for (const position of positions) {
    values.set(key(position), (values.get(key(position)) ?? 0) + position.notionalAmount);
  }
  return values;
}

function groupCurrencyExposure(positions: readonly PortfolioRiskPosition[]): Map<string, number> {
  const net = new Map<string, number>();
  for (const position of positions) {
    const baseSign = position.side === "LONG" ? 1 : -1;
    net.set(
      position.baseCurrency,
      (net.get(position.baseCurrency) ?? 0) + baseSign * position.notionalAmount
    );
    net.set(
      position.quoteCurrency,
      (net.get(position.quoteCurrency) ?? 0) - baseSign * position.notionalAmount
    );
  }
  return new Map([...net.entries()].map(([currency, value]) => [currency, Math.abs(value)]));
}

function groupEventRisk(positions: readonly PortfolioRiskPosition[]): Map<string, number> {
  const values = new Map<string, number>();
  for (const position of positions) {
    for (const eventId of position.eventIds) {
      values.set(eventId, (values.get(eventId) ?? 0) + position.plannedRiskAmount);
    }
  }
  return values;
}

function buildExposureMetrics(input: {
  readonly current: ReadonlyMap<string, number>;
  readonly after: ReadonlyMap<string, number>;
  readonly equity: number;
  readonly limitPct: number;
}) {
  const subjects = [...new Set([...input.current.keys(), ...input.after.keys()])].sort();
  return subjects.map((subject) => ({
    subject,
    currentPct: round(((input.current.get(subject) ?? 0) / input.equity) * 100),
    afterCandidatePct: round(((input.after.get(subject) ?? 0) / input.equity) * 100),
    limitPct: input.limitPct
  }));
}

function inspectExposureMetrics(
  findings: PortfolioRiskFinding[],
  code: PortfolioRiskFinding["code"],
  metrics: readonly {
    readonly subject: string;
    readonly afterCandidatePct: number;
    readonly limitPct: number;
  }[],
  warningUtilizationPct: number,
  context: PortfolioRiskContext
): void {
  for (const metric of metrics) {
    inspectBudget(
      findings,
      code,
      metric.subject,
      metric.afterCandidatePct,
      metric.limitPct,
      warningUtilizationPct,
      context
    );
  }
}

function inspectBudget(
  findings: PortfolioRiskFinding[],
  code: PortfolioRiskFinding["code"],
  subject: string,
  measuredValue: number,
  limitValue: number,
  warningUtilizationPct: number,
  context: PortfolioRiskContext
): void {
  const utilizationPct = (measuredValue / limitValue) * 100;
  if (measuredValue > limitValue) {
    findings.push({
      code,
      severity: "BLOCKING",
      subject,
      measuredValue,
      limitValue,
      detail: `${subject} exceeds the fixed ${labelFor(code)} limit.`,
      evidenceVersionIds: evidenceFor(context, code, subject)
    });
  } else if (utilizationPct >= warningUtilizationPct) {
    findings.push({
      code,
      severity: "REVIEW",
      subject,
      measuredValue,
      limitValue,
      detail: `${subject} is near the fixed ${labelFor(code)} limit and requires operator review.`,
      evidenceVersionIds: evidenceFor(context, code, subject)
    });
  }
}

function evidenceFor(
  context: PortfolioRiskContext,
  code: PortfolioRiskFinding["code"],
  subject: string
): string[] {
  const positions = [...context.existingPositions, context.candidatePosition].filter((position) => {
    if (code === "INSTRUMENT_EXPOSURE") return position.instrument === subject;
    if (code === "CURRENCY_EXPOSURE") {
      return position.baseCurrency === subject || position.quoteCurrency === subject;
    }
    if (code === "CORRELATION_EXPOSURE") return position.correlationGroup === subject;
    if (code === "EVENT_EXPOSURE") return position.eventIds.includes(subject);
    return true;
  });
  return [
    ...new Set([
      ...context.evidenceVersionIds,
      ...positions.flatMap((position) => position.evidenceVersionIds)
    ])
  ].sort();
}

function buildBudgetMetric(
  currentAmount: number,
  afterCandidateAmount: number,
  limitAmount: number
) {
  return {
    currentAmount: round(currentAmount),
    afterCandidateAmount: round(afterCandidateAmount),
    limitAmount,
    utilizationPct: round((afterCandidateAmount / limitAmount) * 100)
  };
}

function labelFor(code: PortfolioRiskFinding["code"]): string {
  return code.toLowerCase().replaceAll("_", " ");
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 10_000) / 10_000;
}

function hasCanonicalHash<T extends Record<string, unknown>, K extends keyof T>(
  value: T,
  hashKey: K
): boolean {
  const payload = Object.fromEntries(
    Object.entries(value).filter(([key]) => key !== String(hashKey))
  );
  return value[hashKey] === hashCanonicalValue(payload);
}
