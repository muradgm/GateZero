import {
  ContractValidationError,
  SetupReviewSchema,
  type SetupReview
} from "@traderframe/contracts";
import type { SetupReviewRepository } from "./setup-review-ports.js";

export interface RequestRiskReviewCommand {
  readonly setupReviewId: string;
  readonly requestedAt: string;
}

export function requestRiskReviewService(repository: SetupReviewRepository) {
  return async function requestRiskReview(command: RequestRiskReviewCommand): Promise<SetupReview> {
    const review = await repository.findById(command.setupReviewId);
    if (!review) {
      throw new ContractValidationError(`setup review not found: ${command.setupReviewId}`);
    }
    if (review.status !== "draft") {
      throw new ContractValidationError(`risk review can only be requested from draft state`);
    }
    if (review.supportingEvidence.length === 0) {
      throw new ContractValidationError("risk review requires supporting evidence");
    }

    const updated = SetupReviewSchema.parse({
      ...review,
      status: "ready_for_risk_review",
      decision: "WATCH",
      decisionReasons: ["Risk review requested; operator decision remains pending."],
      updatedAt: command.requestedAt
    });

    await repository.save(updated);
    return updated;
  };
}
