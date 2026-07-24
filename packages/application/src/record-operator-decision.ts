import { ContractValidationError, SetupReviewSchema, type SetupReview } from "@traderframe/contracts";
import type { SetupReviewRepository } from "./setup-review-ports.js";

export interface RecordOperatorDecisionCommand {
  readonly setupReviewId: string;
  readonly riskReviewId: string;
  readonly decision: SetupReview["decision"];
  readonly reasons: readonly string[];
  readonly decidedAt: string;
}

export function recordOperatorDecisionService(repository: SetupReviewRepository) {
  return async function recordOperatorDecision(
    command: RecordOperatorDecisionCommand
  ): Promise<SetupReview> {
    const review = await repository.findById(command.setupReviewId);
    if (!review) {
      throw new ContractValidationError(`setup review not found: ${command.setupReviewId}`);
    }
    if (review.status !== "ready_for_risk_review") {
      throw new ContractValidationError("operator decision requires ready_for_risk_review state");
    }
    if (command.reasons.length === 0) {
      throw new ContractValidationError("operator decision requires at least one reason");
    }
    if (command.decision === "PAPER_SIMULATE" && review.supportingEvidence.length === 0) {
      throw new ContractValidationError("paper simulation requires supporting evidence");
    }

    const updated = SetupReviewSchema.parse({
      ...review,
      status: "reviewed",
      decision: command.decision,
      decisionReasons: [...command.reasons],
      riskReviewId: command.riskReviewId,
      updatedAt: command.decidedAt
    });

    await repository.save(updated);
    return updated;
  };
}
