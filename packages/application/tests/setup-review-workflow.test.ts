import { describe, expect, it } from "vitest";
import {
  InMemorySetupReviewRepository,
  createSetupReviewService,
  querySetupReviewsService,
  recordOperatorDecisionService,
  requestRiskReviewService,
  type CreateSetupReviewCommand
} from "../src/index.js";

const command: CreateSetupReviewCommand = {
  setupReviewId: "setup-review-btcusd-001",
  researchCaseId: "research-case-btcusd-001",
  instrument: "BTC/USD",
  strategyFamily: "trend_continuation_pullback",
  thesis: "Higher-timeframe trend remains intact while the lower-timeframe pullback holds support.",
  evidence: {
    supporting: [
      {
        id: "btc-context-001",
        type: "market_context",
        source: "local checked-in snapshot",
        observedAt: "2026-07-24T18:00:00.000Z",
        summary: "Daily and four-hour trend structures remain aligned.",
        limitation: "Historical local evidence only."
      }
    ],
    contradicting: [],
    backtestEvidenceId: "backtest-btcusd-001"
  },
  invalidation: {
    description: "Reject when the one-hour support structure closes below the defined threshold.",
    observable: "BTC/USD one-hour close",
    threshold: "below 116000"
  },
  risk: {
    accountCurrency: "USD",
    accountEquity: 10_000,
    maximumRiskPct: 1,
    plannedEntry: 118_000,
    plannedStop: 117_000,
    plannedTarget: 121_000,
    quantity: 0.05,
    estimatedFees: 10,
    estimatedSlippage: 10,
    portfolioExposurePctAfterEntry: 15,
    correlationWarning: false
  },
  requestedDecision: "WATCH",
  decisionReasons: ["Formal review is still required."],
  limitations: ["The setup uses a bounded local snapshot."],
  now: "2026-07-24T18:30:00.000Z"
};

describe("setup review workflow", () => {
  it("moves through draft, risk review, and reviewed operator decision", async () => {
    const repository = new InMemorySetupReviewRepository();
    const create = createSetupReviewService({ repository });
    const requestRiskReview = requestRiskReviewService(repository);
    const recordDecision = recordOperatorDecisionService(repository);

    const draft = await create(command);
    const pending = await requestRiskReview({
      setupReviewId: draft.setupReviewId,
      requestedAt: "2026-07-24T18:40:00.000Z"
    });
    const reviewed = await recordDecision({
      setupReviewId: pending.setupReviewId,
      riskReviewId: "risk-review-btcusd-001",
      decision: "PAPER_SIMULATE",
      reasons: ["Evidence and declared risk passed manual review."],
      decidedAt: "2026-07-24T18:50:00.000Z"
    });

    expect(draft.status).toBe("draft");
    expect(pending.status).toBe("ready_for_risk_review");
    expect(reviewed.status).toBe("reviewed");
    expect(reviewed.decision).toBe("PAPER_SIMULATE");
    expect(reviewed.executionPath).toBe(false);
  });

  it("returns decision-oriented summaries for the browser workspace", async () => {
    const repository = new InMemorySetupReviewRepository();
    await createSetupReviewService({ repository })(command);

    const summaries = await querySetupReviewsService(repository)();

    expect(summaries).toHaveLength(1);
    expect(summaries[0]).toMatchObject({
      instrument: "BTC/USD",
      status: "draft",
      decision: "WATCH",
      supportingEvidenceCount: 1
    });
  });
});
