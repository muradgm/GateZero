import { describe, expect, it } from "vitest";
import type { EvidenceQuality, MarketContext, SetupReview } from "@traderframe/contracts";
import { evaluateSetupReview } from "../src/index.js";

const review: SetupReview = {
  schemaVersion: 1,
  setupReviewId: "setup-review-eurusd-001",
  researchCaseId: "research-case-eurusd-001",
  instrument: "EUR/USD",
  strategyFamily: "trend_continuation_pullback",
  gate: "G2_PAPER_TRADING",
  scope: "paper_simulation_planning_only",
  status: "reviewed",
  thesis: "Higher-timeframe trend remains aligned while the one-hour pullback holds structure.",
  supportingEvidence: [
    {
      id: "evidence-support-001",
      type: "technical_structure",
      source: "local checked-in market snapshot",
      observedAt: "2026-07-24T18:00:00.000Z",
      summary: "Daily and four-hour structures are aligned.",
      limitation: "Historical local snapshot only."
    }
  ],
  contradictingEvidence: [
    {
      id: "evidence-counter-001",
      type: "macro",
      source: "local macro snapshot",
      observedAt: "2026-07-24T18:00:00.000Z",
      summary: "Moderate event risk remains.",
      limitation: "Event impact is not predicted."
    }
  ],
  backtestEvidenceId: "backtest-eurusd-001",
  invalidation: {
    description: "One-hour structure failure invalidates the setup.",
    observable: "EUR/USD one-hour close",
    threshold: "below 1.0800",
    action: "reject_or_exit_paper_setup"
  },
  riskPlan: {
    accountCurrency: "USD",
    accountEquity: 10_000,
    maximumRiskPct: 1,
    maximumRiskAmount: 55,
    plannedEntry: 1.085,
    plannedStop: 1.08,
    plannedTarget: 1.095,
    quantity: 10_000,
    estimatedFees: 2,
    estimatedSlippage: 3,
    portfolioExposurePctAfterEntry: 12,
    correlationWarning: false
  },
  decision: "WATCH",
  decisionReasons: ["Risk review completed; operator decision remains bounded."],
  limitations: ["Single instrument and strategy family."],
  operatorRequired: true,
  riskReviewRequired: true,
  riskReviewId: "risk-review-eurusd-001",
  externalAccess: false,
  executionPath: false,
  automatedAction: false,
  approvalClaim: false,
  performanceClaim: false,
  createdAt: "2026-07-24T18:30:00.000Z",
  updatedAt: "2026-07-24T18:45:00.000Z"
};

const marketContext: MarketContext = {
  marketContextId: "market-context-eurusd-001",
  instrument: "EUR/USD",
  session: "london",
  volatilityRegime: "normal",
  liquidityCondition: "deep",
  broadBias: "bullish",
  timeframes: [
    {
      timeframe: "1D",
      trend: "bullish",
      structure: "expansion",
      momentum: "stable",
      evidenceIds: ["evidence-support-001"]
    },
    {
      timeframe: "4H",
      trend: "bullish",
      structure: "pullback",
      momentum: "strengthening",
      evidenceIds: ["evidence-support-001"]
    }
  ],
  macroEventRisk: "low",
  correlationRisk: "low",
  observedAt: "2026-07-24T18:00:00.000Z",
  validUntil: "2026-07-24T22:00:00.000Z",
  limitations: ["Local historical context only."]
};

const evidenceQuality: EvidenceQuality[] = [
  {
    evidenceId: "evidence-support-001",
    freshness: "current",
    provenance: "verified",
    sampleSufficiency: "sufficient",
    regimeRelevance: "matched",
    independence: "independent",
    qualityScore: 90,
    limitations: ["One strategy family only."]
  },
  {
    evidenceId: "evidence-counter-001",
    freshness: "current",
    provenance: "verified",
    sampleSufficiency: "not_applicable",
    regimeRelevance: "matched",
    independence: "independent",
    qualityScore: 20,
    limitations: ["Macro impact remains uncertain."]
  }
];

describe("evaluateSetupReview", () => {
  it("allows a high-quality reviewed setup to reach paper simulation", () => {
    const result = evaluateSetupReview({
      assessmentId: "assessment-eurusd-001",
      review,
      marketContext,
      evidenceQuality,
      evaluatedAt: "2026-07-24T19:00:00.000Z"
    });

    expect(result.recommendation).toBe("PAPER_SIMULATE");
    expect(result.confidence).toBe("high");
    expect(result.compositeScore).toBeGreaterThanOrEqual(80);
    expect(result.downgradeReasons).toEqual([]);
    expect(result.executionPath).toBe(false);
  });

  it("downgrades stale market context to watch", () => {
    const result = evaluateSetupReview({
      assessmentId: "assessment-eurusd-002",
      review,
      marketContext,
      evidenceQuality,
      evaluatedAt: "2026-07-25T00:00:00.000Z"
    });

    expect(result.recommendation).toBe("WATCH");
    expect(result.downgradeReasons).toContain("Market context is stale.");
  });

  it("downgrades insufficient evidence and event risk", () => {
    const result = evaluateSetupReview({
      assessmentId: "assessment-eurusd-003",
      review,
      marketContext: {
        ...marketContext,
        macroEventRisk: "high",
        volatilityRegime: "event_risk"
      },
      evidenceQuality: evidenceQuality.map((quality) =>
        quality.evidenceId === "evidence-support-001"
          ? { ...quality, sampleSufficiency: "insufficient" as const }
          : quality
      ),
      evaluatedAt: "2026-07-24T19:00:00.000Z"
    });

    expect(result.recommendation).toBe("WATCH");
    expect(result.downgradeReasons.length).toBeGreaterThan(0);
    expect(result.riskScore).toBeLessThan(100);
  });
});
