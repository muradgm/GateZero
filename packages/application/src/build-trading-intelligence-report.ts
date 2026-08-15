import {
  TradingIntelligenceReportSchema,
  type EvidenceContribution,
  type TradingIntelligenceReport
} from "@traderframe/contracts";

export interface BuildTradingIntelligenceReportCommand {
  readonly reportId: string;
  readonly setupReviewId: string;
  readonly instrument: string;
  readonly generatedAt: string;
  readonly contributions: readonly EvidenceContribution[];
  readonly bullCase: TradingIntelligenceReport["bullCase"];
  readonly bearCase: TradingIntelligenceReport["bearCase"];
  readonly neutralCase: TradingIntelligenceReport["neutralCase"];
  readonly timeline: TradingIntelligenceReport["timeline"];
  readonly invalidationSummary: string;
  readonly downgradeReasons: readonly string[];
}

export function buildTradingIntelligenceReport(
  command: BuildTradingIntelligenceReportCommand
): TradingIntelligenceReport {
  const evidenceScore = boundScore(
    50 + command.contributions.reduce((sum, contribution) => sum + contribution.points, 0)
  );
  const evidenceStatus = deriveEvidenceStatus(evidenceScore, command.downgradeReasons.length);
  const reviewUrgency = deriveReviewUrgency(command.downgradeReasons.length, evidenceScore);

  return TradingIntelligenceReportSchema.parse({
    schemaVersion: 1,
    reportId: command.reportId,
    setupReviewId: command.setupReviewId,
    instrument: command.instrument,
    generatedAt: command.generatedAt,
    contributions: command.contributions,
    evidenceScore,
    evidenceStatus,
    reviewUrgency,
    bullCase: command.bullCase,
    bearCase: command.bearCase,
    neutralCase: command.neutralCase,
    timeline: command.timeline,
    invalidationSummary: command.invalidationSummary,
    downgradeReasons: command.downgradeReasons,
    operatorRequired: true,
    riskReviewRequired: true,
    automatedAction: false,
    executionPath: false,
    performanceClaim: false
  });
}

export function rankTradingIntelligenceReports(
  reports: readonly TradingIntelligenceReport[]
): readonly TradingIntelligenceReport[] {
  const urgencyWeight: Record<TradingIntelligenceReport["reviewUrgency"], number> = {
    high: 3,
    normal: 2,
    low: 1
  };

  return [...reports].sort((left, right) => {
    const urgencyDelta = urgencyWeight[right.reviewUrgency] - urgencyWeight[left.reviewUrgency];
    if (urgencyDelta !== 0) return urgencyDelta;
    if (left.evidenceScore !== right.evidenceScore) return left.evidenceScore - right.evidenceScore;
    return left.instrument.localeCompare(right.instrument);
  });
}

function deriveEvidenceStatus(
  evidenceScore: number,
  downgradeReasonCount: number
): TradingIntelligenceReport["evidenceStatus"] {
  if (downgradeReasonCount > 0) return "blocked";
  return evidenceScore >= 60 ? "reviewable" : "incomplete";
}

function deriveReviewUrgency(
  downgradeReasonCount: number,
  evidenceScore: number
): TradingIntelligenceReport["reviewUrgency"] {
  if (downgradeReasonCount > 0) return "high";
  return evidenceScore < 60 ? "normal" : "low";
}

function boundScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
