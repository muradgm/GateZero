import { describe, expect, it } from "vitest";
import {
  aggregateValidatedMarketCandles,
  selectCandlesAvailableAtDecision
} from "../src/index.js";
import type { NormalizedMarketCandle } from "@traderframe/contracts";

function sourceCandle(index: number, start = "2026-07-24T08:00:00.000Z"): NormalizedMarketCandle {
  const openedAtMs = Date.parse(start) + index * 15 * 60 * 1000;
  const openedAt = new Date(openedAtMs).toISOString();
  const closedAt = new Date(openedAtMs + 15 * 60 * 1000).toISOString();
  const open = 1.1 + index * 0.0001;
  const close = open + 0.00005;

  return {
    candleId: `EURUSD-15m-${openedAt}`,
    sourceId: "historical-eurusd-001",
    instrument: "EURUSD",
    timeframe: "15m",
    openedAt,
    closedAt,
    timezone: "UTC",
    open,
    high: close + 0.0001,
    low: open - 0.0001,
    close,
    volume: 100 + index,
    finalized: true,
    sourceHash: `fnv1a-source-${index}`,
    normalizationVersion: "market-normalization-v1"
  };
}

const base = {
  sourceId: "historical-eurusd-001",
  checkedAt: "2026-07-25T19:30:00.000Z",
  aggregationVersion: "timeframe-aggregation-v1"
};

describe("aggregateValidatedMarketCandles", () => {
  it("derives a deterministic 1H candle from four contiguous finalized 15m candles", () => {
    const result = aggregateValidatedMarketCandles({
      ...base,
      targetTimeframe: "1H",
      asOf: "2026-07-24T09:00:00.000Z",
      candles: Array.from({ length: 4 }, (_, index) => sourceCandle(index))
    });

    expect(result.failures).toEqual([]);
    expect(result.expectedSourceCandlesPerTarget).toBe(4);
    expect(result.aggregatedRecordCount).toBe(1);
    expect(result.candles[0]).toMatchObject({
      timeframe: "1H",
      openedAt: "2026-07-24T08:00:00.000Z",
      closedAt: "2026-07-24T09:00:00.000Z",
      availableAt: "2026-07-24T09:00:00.000Z",
      open: sourceCandle(0).open,
      close: sourceCandle(3).close,
      volume: 406,
      derivedFromCandleIds: Array.from({ length: 4 }, (_, index) => sourceCandle(index).candleId)
    });
    expect(result.candles[0].sourceHash).toMatch(/^fnv1a-/);
  });

  it("excludes an unclosed 4H candle at the as-of boundary", () => {
    const result = aggregateValidatedMarketCandles({
      ...base,
      targetTimeframe: "4H",
      asOf: "2026-07-24T10:00:00.000Z",
      candles: Array.from({ length: 8 }, (_, index) => sourceCandle(index))
    });

    expect(result.candles).toEqual([]);
    expect(result.failures.some((failure) => failure.code === "UNCLOSED_HIGHER_TIMEFRAME_INPUT")).toBe(true);
  });

  it("blocks a closed bucket with a missing source interval", () => {
    const candles = [sourceCandle(0), sourceCandle(1), sourceCandle(3)];
    const result = aggregateValidatedMarketCandles({
      ...base,
      targetTimeframe: "1H",
      asOf: "2026-07-24T09:00:00.000Z",
      candles
    });

    expect(result.candles).toEqual([]);
    expect(result.failures.some((failure) => failure.code === "DATA_GAP_UNCLASSIFIED")).toBe(true);
  });
});

describe("selectCandlesAvailableAtDecision", () => {
  it("allows only candles finalized by the decision timestamp", () => {
    const candles = [sourceCandle(0), sourceCandle(1)];
    const result = selectCandlesAvailableAtDecision(
      candles,
      "2026-07-24T08:20:00.000Z",
      base.checkedAt
    );

    expect(result.eligibleCandles.map((candle) => candle.candleId)).toEqual([candles[0].candleId]);
    expect(result.excludedCandleIds).toEqual([candles[1].candleId]);
    expect(result.failures[0].code).toBe("FUTURE_EVIDENCE");
  });

  it("rejects a higher-timeframe candle until its explicit availableAt boundary", () => {
    const aggregation = aggregateValidatedMarketCandles({
      ...base,
      targetTimeframe: "1H",
      asOf: "2026-07-24T09:00:00.000Z",
      candles: Array.from({ length: 4 }, (_, index) => sourceCandle(index))
    });

    const result = selectCandlesAvailableAtDecision(
      aggregation.candles,
      "2026-07-24T08:59:59.999Z",
      base.checkedAt
    );

    expect(result.eligibleCandles).toEqual([]);
    expect(result.excludedCandleIds).toEqual([aggregation.candles[0].candleId]);
    expect(result.failures[0].code).toBe("UNCLOSED_HIGHER_TIMEFRAME_INPUT");
  });
});
