import {
  FrozenDecisionBundleSchema,
  FrozenDecisionRecordSchema,
  type CanonicalDecisionAssessment,
  type CanonicalRiskReview,
  type FrozenDecisionBundle,
  type FrozenDecisionRecord
} from "@traderframe/contracts";
import {
  assertLocalSimulationRiskEligibility,
  hashCanonicalValue
} from "./canonical-risk-review.js";

type BundleDraft = Omit<
  FrozenDecisionBundle,
  "canonicalAssessmentHash" | "riskReviewId" | "riskReviewHash"
>;

export function freezeDecisionBundle(input: {
  readonly bundle: BundleDraft;
  readonly assessment: CanonicalDecisionAssessment;
  readonly riskReview?: CanonicalRiskReview;
  readonly frozenAt: string;
}): Readonly<FrozenDecisionRecord> {
  if (
    input.bundle.strategyId !== input.assessment.strategyId ||
    input.bundle.strategyVersion !== input.assessment.strategyVersion
  ) {
    throw new Error("frozen bundle strategy identity must match the canonical assessment");
  }

  if (input.bundle.recommendation === "PAPER_SIMULATE") {
    if (!input.riskReview) {
      throw new Error("paper simulation requires a validated risk review before freezing");
    }
    assertLocalSimulationRiskEligibility({
      assessment: input.assessment,
      riskReview: input.riskReview,
      simulationTimestamp: input.frozenAt
    });
  }

  const bundle = FrozenDecisionBundleSchema.parse({
    ...input.bundle,
    canonicalAssessmentHash: hashCanonicalValue(input.assessment),
    ...(input.riskReview
      ? {
          riskReviewId: input.riskReview.riskReviewId,
          riskReviewHash: input.riskReview.reviewHash
        }
      : {})
  });
  const record = FrozenDecisionRecordSchema.parse({
    schemaVersion: 1,
    bundle,
    bundleHash: hashCanonicalValue(bundle),
    frozenAt: input.frozenAt
  });

  return deepFreeze(record);
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) {
      deepFreeze(child);
    }
  }
  return value;
}
