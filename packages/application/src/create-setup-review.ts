import {
  ContractValidationError,
  SetupReviewSchema,
  type SetupReview
} from "@traderframe/contracts";
import type { CreateSetupReviewCommand, SetupReviewRepository } from "./setup-review-ports.js";

export interface CreateSetupReviewDependencies {
  readonly repository: SetupReviewRepository;
}

export function createSetupReviewService(dependencies: CreateSetupReviewDependencies) {
  return async function createSetupReview(command: CreateSetupReviewCommand): Promise<SetupReview> {
    const existing = await dependencies.repository.findById(command.setupReviewId);
    if (existing) {
      throw new ContractValidationError(`setup review already exists: ${command.setupReviewId}`);
    }

    const maximumRiskAmount = calculateMaximumLoss(command);
    const allowedRiskAmount = (command.risk.accountEquity * command.risk.maximumRiskPct) / 100;

    if (maximumRiskAmount > allowedRiskAmount) {
      throw new ContractValidationError(
        `planned maximum loss ${maximumRiskAmount} exceeds allowed risk ${allowedRiskAmount}`
      );
    }

    if (command.requestedDecision === "PAPER_SIMULATE" && command.evidence.supporting.length === 0) {
      throw new ContractValidationError("paper simulation requires supporting evidence");
    }

    if (command.requestedDecision === "PAPER_SIMULATE" && !command.risk.riskReviewId) {
      throw new ContractValidationError("paper simulation requires a completed risk review");
    }

    const review = SetupReviewSchema.parse({
      schemaVersion: 1,
      setupReviewId: command.setupReviewId,
      researchCaseId: command.researchCaseId,
      instrument: command.instrument,
      strategyFamily: command.strategyFamily,
      gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      status: command.risk.riskReviewId ? "reviewed" : "ready_for_risk_review",
      thesis: command.thesis,
      supportingEvidence: command.evidence.supporting,
      contradictingEvidence: command.evidence.contradicting,
      backtestEvidenceId: command.evidence.backtestEvidenceId,
      invalidation: {
        ...command.invalidation,
        action: "reject_or_exit_paper_setup"
      },
      riskPlan: {
        accountCurrency: command.risk.accountCurrency,
        accountEquity: command.risk.accountEquity,
        maximumRiskPct: command.risk.maximumRiskPct,
        maximumRiskAmount,
        plannedEntry: command.risk.plannedEntry,
        plannedStop: command.risk.plannedStop,
        plannedTarget: command.risk.plannedTarget,
        quantity: command.risk.quantity,
        estimatedFees: command.risk.estimatedFees,
        estimatedSlippage: command.risk.estimatedSlippage,
        portfolioExposurePctAfterEntry: command.risk.portfolioExposurePctAfterEntry,
        correlationWarning: command.risk.correlationWarning
      },
      decision: command.requestedDecision,
      decisionReasons: [...command.decisionReasons],
      limitations: [...command.limitations],
      operatorRequired: true,
      riskReviewRequired: true,
      riskReviewId: command.risk.riskReviewId,
      externalAccess: false,
      executionPath: false,
      automatedAction: false,
      approvalClaim: false,
      performanceClaim: false,
      createdAt: command.now,
      updatedAt: command.now
    });

    await dependencies.repository.save(review);
    return review;
  };
}

function calculateMaximumLoss(command: CreateSetupReviewCommand): number {
  const priceRisk = Math.abs(command.risk.plannedEntry - command.risk.plannedStop);
  const marketLoss = priceRisk * command.risk.quantity;
  return roundMoney(marketLoss + command.risk.estimatedFees + command.risk.estimatedSlippage);
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
