import { describe, expect, it } from "vitest";
import { ContractValidationError } from "@traderframe/contracts";
import {
  InMemorySetupReviewRepository,
  createSetupReviewService,
  type CreateSetupReviewCommand
} from "../src/index.js";

const baseCommand: CreateSetupReviewCommand = {
  setupReviewId: "setup-review-eurusd-001",
  researchCaseId: "research-case-eurusd-001",
  instrument: "EUR/USD",
  strategyFamily: "trend_continuation_pullback",
  thesis: "Daily and four-hour trend remain aligned while the one-hour pullback holds structure.",
  evidence: {
    supporting: [
      {
        id: "market-context-eurusd-001",
        type: "market_context",
        source: "local checked-in market snapshot",
        observedAt: "2026-07-24T18:00:00.000Z",
        summary: "Daily and four-hour structures remain directionally aligned.",
        limitation: "The snapshot is historical and local-only."
      }
    ],
    contradicting: [
      {
        id: "macro-risk-eurusd-001",
        type: "macro",
        source: "local macro calendar snapshot",
        observedAt: "2026-07-24T18:00:00.000Z",
        summary: "A high-impact event may increase short-term volatility.",
        limitation: "The event impact is not predicted."
      }
    ],
    backtestEvidenceId: "gate1-runtime-result-eurusd-001"
  },
  invalidation: {
    description: "The setup is invalid when the one-hour structure low fails.",
    observable: "EUR/USD one-hour close",
    threshold: "below 1.0800"
  },
  risk: {
    accountCurrency: "USD",
    accountEquity: 10_000,
    maximumRiskPct: 1,
    plannedEntry: 1.085,
    plannedStop: 1.08,
    plannedTarget: 1.095,
    quantity: 10_000,
    estimatedFees: 2,
    estimatedSlippage: 3,
    portfolioExposurePctAfterEntry: 12,
    correlationWarning: false,
    riskReviewId: "risk-review-eurusd-001"
  },
  requestedDecision: "PAPER_SIMULATE",
  decisionReasons: ["Evidence is directionally aligned and declared risk remains bounded."],
  limitations: ["One historical strategy family and one local market snapshot are represented."],
  now: "2026-07-24T18:30:00.000Z"
};

describe("createSetupReviewService", () => {
  it("assembles and persists a reviewed evidence-gated setup", async () => {
    const repository = new InMemorySetupReviewRepository();
    const createSetupReview = createSetupReviewService({ repository });

    const review = await createSetupReview(baseCommand);

    expect(review.status).toBe("reviewed");
    expect(review.decision).toBe("PAPER_SIMULATE");
    expect(review.riskPlan.maximumRiskAmount).toBe(55);
    expect(review.executionPath).toBe(false);
    expect((await repository.findById(review.setupReviewId))?.setupReviewId).toBe(
      review.setupReviewId
    );
  });

  it("blocks a planned loss above the declared account risk", async () => {
    const createSetupReview = createSetupReviewService({
      repository: new InMemorySetupReviewRepository()
    });

    await expect(
      createSetupReview({
        ...baseCommand,
        risk: {
          ...baseCommand.risk,
          quantity: 30_000
        }
      })
    ).rejects.toBeInstanceOf(ContractValidationError);
  });

  it("blocks paper simulation without a risk review", async () => {
    const createSetupReview = createSetupReviewService({
      repository: new InMemorySetupReviewRepository()
    });

    await expect(
      createSetupReview({
        ...baseCommand,
        risk: {
          ...baseCommand.risk,
          riskReviewId: undefined
        }
      })
    ).rejects.toThrow("paper simulation requires a completed risk review");
  });

  it("prevents duplicate setup review identifiers", async () => {
    const repository = new InMemorySetupReviewRepository();
    const createSetupReview = createSetupReviewService({ repository });

    await createSetupReview(baseCommand);

    await expect(createSetupReview(baseCommand)).rejects.toThrow(
      "setup review already exists"
    );
  });
});
