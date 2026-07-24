import { describe, expect, it } from "vitest";
import { MarketContextSchema, SetupReviewAssessmentSchema } from "../src/index.js";

const marketContext = {
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
      evidenceIds: ["evidence-001"]
    },
    {
      timeframe: "4H",
      trend: "bullish",
      structure: "pullback",
      momentum: "strengthening",
      evidenceIds: ["evidence-001"]
    }
  ],
  macroEventRisk: "low",
  correlationRisk: "low",
  observedAt: "2026-07-24T18:00:00.000Z",
  validUntil: "2026-07-24T22:00:00.000Z",
  limitations: ["Local historical context only."]
};

const assessment = {
  assessmentId: "assessment-eurusd-001",
  setupReviewId: "setup-review-eurusd-001",
  marketContextId: "market-context-eurusd-001",
  evaluatedAt: "2026-07-24T19:00:00.000Z",
  evidenceQuality: [
    {
      evidenceId: "evidence-001",
      freshness: "current",
      provenance: "verified",
      sampleSufficiency: "sufficient",
      regimeRelevance: "matched",
      independence: "independent",
      qualityScore: 90,
      limitations: ["Single strategy family only."]
    }
  ],
  supportingScore: 90,
  contradictingScore: 20,
  riskScore: 90,
  compositeScore: 88,
  confidence: "high",
  recommendation: "PAPER_SIMULATE",
  downgradeReasons: [],
  decisionReasons: ["Evidence and risk remain inside bounded criteria."],
  operatorRequired: true,
  riskReviewRequired: true,
  automatedAction: false,
  executionPath: false
};

describe("setup review intelligence contracts", () => {
  it("validates structured multi-timeframe market context", () => {
    expect(MarketContextSchema.parse(marketContext).timeframes).toHaveLength(2);
  });

  it("rejects market context whose validity ends before observation", () => {
    expect(() =>
      MarketContextSchema.parse({
        ...marketContext,
        validUntil: "2026-07-24T17:00:00.000Z"
      })
    ).toThrow("market context validity must end after observation time");
  });

  it("validates a bounded high-confidence paper-simulation assessment", () => {
    expect(SetupReviewAssessmentSchema.parse(assessment).recommendation).toBe("PAPER_SIMULATE");
  });

  it("rejects paper simulation with unresolved downgrade reasons", () => {
    expect(() =>
      SetupReviewAssessmentSchema.parse({
        ...assessment,
        downgradeReasons: ["Market context is stale."]
      })
    ).toThrow("paper simulation cannot retain unresolved downgrade reasons");
  });

  it("rejects paper simulation without high calibrated confidence", () => {
    expect(() =>
      SetupReviewAssessmentSchema.parse({
        ...assessment,
        confidence: "moderate"
      })
    ).toThrow("paper simulation requires high calibrated confidence");
  });
});
