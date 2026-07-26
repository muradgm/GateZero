import { describe, expect, it } from "vitest";
import { SetupReviewSchema } from "../src/index.js";

const evidence = {
  id: "evidence-001",
  type: "technical_structure",
  source: "local historical snapshot",
  observedAt: "2026-07-24T18:00:00.000Z",
  summary: "Higher-timeframe structure remains constructive.",
  limitation: "The snapshot is historical and local only."
} as const;

const setupReview = {
  schemaVersion: 1,
  setupReviewId: "setup-review-001",
  researchCaseId: "research-case-001",
  instrument: "EURUSD",
  strategyFamily: "trend_continuation_pullback",
  gate: "G2_PAPER_TRADING",
  scope: "paper_simulation_planning_only",
  status: "reviewed",
  thesis: "A bounded paper setup may be reviewed if trend continuation evidence remains valid.",
  supportingEvidence: [evidence],
  contradictingEvidence: [],
  backtestEvidenceId: "gate1-runtime-result-001",
  invalidation: {
    description: "The setup is invalid if the structural support is lost.",
    observable: "four-hour close",
    threshold: "below 1.0800",
    action: "reject_or_exit_paper_setup"
  },
  riskPlan: {
    accountCurrency: "USD",
    accountEquity: 10000,
    maximumRiskPct: 1,
    maximumRiskAmount: 100,
    plannedEntry: 1.085,
    plannedStop: 1.08,
    plannedTarget: 1.095,
    quantity: 10000,
    estimatedFees: 2,
    estimatedSlippage: 3,
    portfolioExposurePctAfterEntry: 10,
    correlationWarning: false
  },
  decision: "PAPER_SIMULATE",
  decisionReasons: ["Evidence and declared risk meet the bounded paper-review requirements."],
  limitations: ["Historical evidence does not imply future performance."],
  operatorRequired: true,
  riskReviewRequired: true,
  riskReviewId: "risk-review-001",
  externalAccess: false,
  executionPath: false,
  automatedAction: false,
  approvalClaim: false,
  performanceClaim: false,
  createdAt: "2026-07-24T18:00:00.000Z",
  updatedAt: "2026-07-24T18:05:00.000Z"
} as const;

describe("Setup review contract", () => {
  it("accepts a risk-reviewed paper-simulation decision", () => {
    expect(SetupReviewSchema.parse(setupReview).decision).toBe("PAPER_SIMULATE");
  });

  it("rejects paper simulation without supporting evidence", () => {
    expect(() =>
      SetupReviewSchema.parse({
        ...setupReview,
        supportingEvidence: []
      })
    ).toThrow();
  });

  it("rejects paper simulation without a risk review", () => {
    expect(() =>
      SetupReviewSchema.parse({
        ...setupReview,
        riskReviewId: undefined
      })
    ).toThrow();
  });

  it("rejects risk amounts above the declared account limit", () => {
    expect(() =>
      SetupReviewSchema.parse({
        ...setupReview,
        riskPlan: {
          ...setupReview.riskPlan,
          maximumRiskAmount: 101
        }
      })
    ).toThrow();
  });

  it("rejects any execution or approval authority", () => {
    expect(() =>
      SetupReviewSchema.parse({
        ...setupReview,
        executionPath: true,
        approvalClaim: true
      })
    ).toThrow();
  });
});
