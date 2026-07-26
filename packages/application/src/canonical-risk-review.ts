import { createHash } from "node:crypto";
import {
  CanonicalDecisionAssessmentSchema,
  CanonicalRiskReviewSchema,
  ContractValidationError,
  type CanonicalDecisionAssessment,
  type CanonicalRiskReview
} from "@traderframe/contracts";

export interface CreateCanonicalRiskReviewCommand {
  readonly riskReviewId: string;
  readonly assessment: CanonicalDecisionAssessment;
  readonly riskEngineVersion: string;
  readonly reviewStatus: CanonicalRiskReview["reviewStatus"];
  readonly maximumRiskPct: number;
  readonly maximumRiskAmount: number;
  readonly positionSizeUnits: number;
  readonly portfolioExposurePctAfterEntry: number;
  readonly spreadPips: number;
  readonly commissionAmount: number;
  readonly slippagePips: number;
  readonly assumptions: readonly string[];
  readonly blockers: readonly string[];
  readonly reviewedBy: string;
  readonly reviewedAt: string;
  readonly validUntil: string;
}

export function createCanonicalRiskReview(
  command: CreateCanonicalRiskReviewCommand
): CanonicalRiskReview {
  const assessment = CanonicalDecisionAssessmentSchema.parse(command.assessment);
  const payload = {
    schemaVersion: 1 as const,
    riskReviewId: command.riskReviewId,
    assessmentId: assessment.assessmentId,
    canonicalAssessmentHash: hashCanonicalValue(assessment),
    strategyId: assessment.strategyId,
    strategyVersion: assessment.strategyVersion,
    instrument: assessment.instrument,
    riskEngineVersion: command.riskEngineVersion,
    reviewStatus: command.reviewStatus,
    maximumRiskPct: command.maximumRiskPct,
    maximumRiskAmount: command.maximumRiskAmount,
    positionSizeUnits: command.positionSizeUnits,
    portfolioExposurePctAfterEntry: command.portfolioExposurePctAfterEntry,
    spreadPips: command.spreadPips,
    commissionAmount: command.commissionAmount,
    slippagePips: command.slippagePips,
    assumptions: [...command.assumptions],
    blockers: [...command.blockers],
    reviewedBy: command.reviewedBy,
    reviewedAt: command.reviewedAt,
    validUntil: command.validUntil,
    localSimulationOnly: true as const,
    executionPath: false as const,
    automatedAction: false as const
  };

  return CanonicalRiskReviewSchema.parse({
    ...payload,
    reviewHash: hashCanonicalValue(payload)
  });
}

export function assertLocalSimulationRiskEligibility(input: {
  readonly assessment: CanonicalDecisionAssessment;
  readonly riskReview: CanonicalRiskReview;
  readonly simulationTimestamp: string;
}): void {
  const assessment = CanonicalDecisionAssessmentSchema.parse(input.assessment);
  const review = CanonicalRiskReviewSchema.parse(input.riskReview);
  const expectedAssessmentHash = hashCanonicalValue(assessment);
  const reviewPayload = Object.fromEntries(
    Object.entries(review).filter(([key]) => key !== "reviewHash")
  );

  if (assessment.recommendation !== "PAPER_SIMULATE" || !assessment.eligible) {
    throw new ContractValidationError(
      "local simulation requires an eligible canonical PAPER_SIMULATE assessment"
    );
  }
  if (
    review.assessmentId !== assessment.assessmentId ||
    review.canonicalAssessmentHash !== expectedAssessmentHash ||
    review.strategyId !== assessment.strategyId ||
    review.strategyVersion !== assessment.strategyVersion
  ) {
    throw new ContractValidationError("risk review does not match the canonical assessment");
  }
  if (review.reviewHash !== hashCanonicalValue(reviewPayload)) {
    throw new ContractValidationError("risk review content hash mismatch");
  }
  if (review.reviewStatus !== "APPROVED_FOR_LOCAL_SIMULATION" || review.blockers.length > 0) {
    throw new ContractValidationError("risk review has not approved local simulation");
  }
  if (Date.parse(review.reviewedAt) > Date.parse(input.simulationTimestamp)) {
    throw new ContractValidationError("risk review was unavailable at simulation time");
  }
  if (Date.parse(review.validUntil) < Date.parse(input.simulationTimestamp)) {
    throw new ContractValidationError("risk review is stale at simulation time");
  }
}

export function hashCanonicalValue(value: unknown): string {
  return `sha256:${createHash("sha256").update(canonicalSerialize(value)).digest("hex")}`;
}

function canonicalSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalSerialize(item)).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalSerialize(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
