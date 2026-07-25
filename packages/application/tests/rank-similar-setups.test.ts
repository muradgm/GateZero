import { describe, expect, it } from "vitest";
import { rankSimilarSetups, type HistoricalSetupCase } from "../src/rank-similar-setups.js";

const history: HistoricalSetupCase[] = [
  {
    caseId: "case-close",
    observedAt: "2026-03-10T10:00:00.000Z",
    instrument: "EUR/USD",
    market: "FX",
    trend: "Bullish",
    structure: "Pullback",
    momentum: "Stable",
    volatility: "Normal",
    evidenceDimensions: ["trend", "market_structure", "liquidity", "risk"],
    outcome: "Target reached",
    resultR: 2.1,
    lesson: "Wait for the one-hour trigger before simulation."
  },
  {
    caseId: "case-distant",
    observedAt: "2026-02-01T10:00:00.000Z",
    instrument: "XAU/USD",
    market: "Metals",
    trend: "Mixed",
    structure: "Range",
    momentum: "Conflicted",
    volatility: "Event risk",
    evidenceDimensions: ["macro", "event_risk", "risk"],
    outcome: "Rejected",
    resultR: null,
    lesson: "Do not force entries inside event-driven ranges."
  }
];

const current = {
  instrument: "EUR/USD",
  market: "FX",
  trend: "Bullish",
  structure: "Pullback",
  momentum: "Stable",
  volatility: "Normal",
  evidenceDimensions: ["trend", "market_structure", "liquidity", "macro", "risk"]
};

describe("rankSimilarSetups", () => {
  it("ranks the most structurally similar case first", () => {
    const matches = rankSimilarSetups(current, history);

    expect(matches[0]?.caseId).toBe("case-close");
    expect(matches[0]?.similarityScore).toBeGreaterThan(matches[1]?.similarityScore ?? 0);
    expect(matches[0]?.matchedFeatures).toContain("Trend: Bullish");
  });

  it("reports differences instead of hiding them", () => {
    const [match] = rankSimilarSetups(current, [history[1]!]);

    expect(match?.differingFeatures.length).toBeGreaterThan(0);
    expect(match?.similarityScore).toBeLessThan(50);
  });

  it("respects the result limit and remains deterministic", () => {
    expect(rankSimilarSetups(current, history, 1)).toHaveLength(1);
    expect(rankSimilarSetups(current, history, 0)).toEqual([]);
  });
});
