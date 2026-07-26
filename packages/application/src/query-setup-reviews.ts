import type { SetupReview } from "@traderframe/contracts";
import type { SetupReviewRepository } from "./setup-review-ports.js";

export interface SetupReviewSummary {
  readonly setupReviewId: string;
  readonly instrument: string;
  readonly strategyFamily: string;
  readonly status: SetupReview["status"];
  readonly decision: SetupReview["decision"];
  readonly supportingEvidenceCount: number;
  readonly contradictingEvidenceCount: number;
  readonly maximumRiskAmount: number;
  readonly maximumRiskPct: number;
  readonly updatedAt: string;
}

export function querySetupReviewsService(repository: SetupReviewRepository) {
  return async function querySetupReviews(): Promise<readonly SetupReviewSummary[]> {
    const reviews = await repository.list();

    return reviews
      .map((review) => ({
        setupReviewId: review.setupReviewId,
        instrument: review.instrument,
        strategyFamily: review.strategyFamily,
        status: review.status,
        decision: review.decision,
        supportingEvidenceCount: review.supportingEvidence.length,
        contradictingEvidenceCount: review.contradictingEvidence.length,
        maximumRiskAmount: review.riskPlan.maximumRiskAmount,
        maximumRiskPct: review.riskPlan.maximumRiskPct,
        updatedAt: review.updatedAt
      }))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  };
}
