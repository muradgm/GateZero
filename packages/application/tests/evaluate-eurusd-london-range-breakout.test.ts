import { describe, expect, it } from "vitest";
import {
  EURUSD_LONDON_RANGE_BREAKOUT_V1,
  deriveEurUsdLondonRangeBreakoutObservation,
  evaluateEurUsdLondonRangeBreakout
} from "../src/index.js";

const base = {
  candidateId: "range-breakout-001",
  decisionTimestamp: "2026-07-24T08:15:00.000Z",
  direction: "LONG" as const,
  dataReady: true,
  rangeCompleted: true,
  rangeHigh: 1.083,
  rangeLow: 1.081,
  breakoutClose: 1.0832,
  breakoutAgeCandles: 0,
  eventContextStatus: "AVAILABLE" as const,
  minutesToNearestHighImpactEvent: 90,
  invalidationPrice: 1.0809,
  sessionEnded: false,
  evidenceIds: ["range-1", "range-2", "range-3", "range-4", "breakout"],
  availableAt: "2026-07-24T08:15:00.000Z"
};

describe("EURUSD London range breakout v1", () => {
  it("defines a fixed deterministic strategy", () => {
    expect(EURUSD_LONDON_RANGE_BREAKOUT_V1).toMatchObject({
      strategyId: "EURUSD_LONDON_RANGE_BREAKOUT",
      version: "1.0.0",
      instrument: "EURUSD",
      sourceTimeframe: "15m"
    });
  });

  it("allows local paper simulation only when every range gate passes", () => {
    const result = evaluateEurUsdLondonRangeBreakout(base);

    expect(result.eligible).toBe(true);
    expect(result.recommendation).toBe("PAPER_SIMULATE");
    expect(result.ruleResults).toHaveLength(7);
    expect(result.ruleResults.every((rule) => rule.status === "PASS")).toBe(true);
  });

  it("blocks unavailable event context and mismatched invalidation", () => {
    const missingEvent = evaluateEurUsdLondonRangeBreakout({
      ...base,
      eventContextStatus: "UNAVAILABLE",
      minutesToNearestHighImpactEvent: 0
    });
    const badInvalidation = evaluateEurUsdLondonRangeBreakout({
      ...base,
      invalidationPrice: 1.0808
    });

    expect(missingEvent.recommendation).toBe("WATCH");
    expect(missingEvent.ruleResults.find((rule) => rule.gate === "EVENT_RISK_CLEAR")?.status).toBe(
      "BLOCKED"
    );
    expect(badInvalidation.recommendation).toBe("REJECT");
    expect(
      badInvalidation.ruleResults.find((rule) => rule.gate === "INVALIDATION_DEFINED")?.status
    ).toBe("BLOCKED");
  });

  it("derives the range from closed candles and excludes future evidence", () => {
    const result = deriveEurUsdLondonRangeBreakoutObservation({
      decisionTimestamp: "2026-07-24T08:15:00.000Z",
      candles15m: [
        candle("range-1", "07:00", "07:15", 1.0815, 1.082, 1.081, 1.0818),
        candle("range-2", "07:15", "07:30", 1.0818, 1.0825, 1.0814, 1.0822),
        candle("range-3", "07:30", "07:45", 1.0822, 1.083, 1.0819, 1.0826),
        candle("range-4", "07:45", "08:00", 1.0826, 1.0828, 1.0817, 1.0824),
        candle("breakout", "08:00", "08:15", 1.0824, 1.0834, 1.0823, 1.0832),
        candle("future", "08:15", "08:30", 1.0832, 1.084, 1.0831, 1.0838)
      ],
      eventContextStatus: "AVAILABLE",
      minutesToNearestHighImpactEvent: 90
    });

    expect(result.observation.rangeHigh).toBe(1.083);
    expect(result.observation.rangeLow).toBe(1.081);
    expect(result.observation.direction).toBe("LONG");
    expect(result.observation.availableAt).toBe("2026-07-24T08:15:00.000Z");
    expect(result.diagnostics.excludedFutureCandleCount).toBe(1);
    expect(result.observation.evidenceIds).not.toContain("sha256:future");
  });

  it("refuses to derive before the range closes", () => {
    expect(() =>
      deriveEurUsdLondonRangeBreakoutObservation({
        decisionTimestamp: "2026-07-24T07:45:00.000Z",
        candles15m: [
          candle("range-1", "07:00", "07:15", 1.0815, 1.082, 1.081, 1.0818),
          candle("range-2", "07:15", "07:30", 1.0818, 1.0825, 1.0814, 1.0822),
          candle("range-3", "07:30", "07:45", 1.0822, 1.083, 1.0819, 1.0826)
        ],
        eventContextStatus: "AVAILABLE",
        minutesToNearestHighImpactEvent: 90
      })
    ).toThrow(/incomplete London range/);
  });
});

function candle(
  id: string,
  opened: string,
  closed: string,
  open: number,
  high: number,
  low: number,
  close: number
) {
  return {
    candleId: id,
    sourceId: "local-historical-fixture",
    instrument: "EURUSD" as const,
    timeframe: "15m" as const,
    openedAt: `2026-07-24T${opened}:00.000Z`,
    closedAt: `2026-07-24T${closed}:00.000Z`,
    timezone: "UTC" as const,
    open,
    high,
    low,
    close,
    finalized: true as const,
    sourceHash: `sha256:${id}`,
    normalizationVersion: "normalizer-1.0.0"
  };
}
