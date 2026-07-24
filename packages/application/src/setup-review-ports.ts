import type { EvidenceReference, SetupReview } from "../../contracts/src/setup-review.js";

export interface SetupReviewEvidenceInput {
  readonly supporting: readonly EvidenceReference[];
  readonly contradicting: readonly EvidenceReference[];
  readonly backtestEvidenceId: string;
}

export interface SetupReviewRiskInput {
  readonly accountCurrency: string;
  readonly accountEquity: number;
  readonly maximumRiskPct: number;
  readonly plannedEntry: number;
  readonly plannedStop: number;
  readonly plannedTarget: number;
  readonly quantity: number;
  readonly estimatedFees: number;
  readonly estimatedSlippage: number;
  readonly portfolioExposurePctAfterEntry: number;
  readonly correlationWarning: boolean;
  readonly riskReviewId?: string;
}

export interface CreateSetupReviewCommand {
  readonly setupReviewId: string;
  readonly researchCaseId: string;
  readonly instrument: string;
  readonly strategyFamily: string;
  readonly thesis: string;
  readonly evidence: SetupReviewEvidenceInput;
  readonly invalidation: {
    readonly description: string;
    readonly observable: string;
    readonly threshold: string;
  };
  readonly risk: SetupReviewRiskInput;
  readonly requestedDecision: SetupReview["decision"];
  readonly decisionReasons: readonly string[];
  readonly limitations: readonly string[];
  readonly now: string;
}

export interface SetupReviewRepository {
  save(review: SetupReview): Promise<void>;
  findById(setupReviewId: string): Promise<SetupReview | undefined>;
}
