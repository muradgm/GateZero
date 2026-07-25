import type { RawMarketCandle } from "@traderframe/contracts";
import { describe, expect, it } from "vitest";
import { validateAndNormalizeMarketCandles } from "../src/index.js";

const base = {
  sourceId: "historical-eurusd-001",
  instrument: "EURUSD" as const,
  timeframe: "15m" as const,
  checkedAt: "2026-07-25T19:30:00.000Z",
  normalizationVersion: "market-normalization-v1"
};

function candle(timestamp: string, overrides: Partial<RawMarketCandle> = {}): RawMarketCandle {
  return {
    sourceId: base.sourceId,
    instrument: "EURUSD",
    timeframe: "15m",
    timestamp,
    timezone: "UTC",
    open: 1.1,
    high: 1.101,
    low: 1.099,
    close: 1.1005,
    volume: 100,
    finalized: true,
    ...overrides
  };
}

describe("validateAndNormalizeMarketCandles", () => {
  it("normalizes valid finalized candles into deterministic UTC records", () => {
    const result = validateAndNormalizeMarketCandles({
      ...base,
      candles: [candle("2026-07-24T08:00:00.000Z"), candle("2026-07-24T08:15:00.000Z")]
    });

    expect(result.failures).toEqual([]);
    expect(result.normalizedRecordCount).toBe(2);
    expect(result.normalizedCandles[0]).toMatchObject({
      openedAt: "2026-07-24T08:00:00.000Z",
      closedAt: "2026-07-24T08:15:00.000Z",
      timezone: "UTC",
      finalized: true
    });
    expect(result.normalizedCandles[0].sourceHash).toMatch(/^fnv1a-/);
  });

  it("rejects duplicate timestamps", () => {
    const result = validateAndNormalizeMarketCandles({
      ...base,
      candles: [candle("2026-07-24T08:00:00.000Z"), candle("2026-07-24T08:00:00.000Z")]
    });

    expect(result.failures.some((item) => item.code === "DUPLICATE_TIMESTAMP")).toBe(true);
    expect(result.normalizedRecordCount).toBe(1);
  });

  it("rejects malformed OHLC and incomplete candles", () => {
    const result = validateAndNormalizeMarketCandles({
      ...base,
      candles: [
        candle("2026-07-24T08:00:00.000Z", { high: 1.098 }),
        candle("2026-07-24T08:15:00.000Z", { finalized: false })
      ]
    });

    expect(result.failures.map((item) => item.code)).toEqual(expect.arrayContaining(["INVALID_OHLC", "INCOMPLETE_CANDLE"]));
    expect(result.normalizedRecordCount).toBe(0);
  });

  it("detects unclassified interval gaps", () => {
    const result = validateAndNormalizeMarketCandles({
      ...base,
      candles: [candle("2026-07-24T08:00:00.000Z"), candle("2026-07-24T08:45:00.000Z")]
    });

    expect(result.failures.some((item) => item.code === "DATA_GAP_UNCLASSIFIED")).toBe(true);
  });

  it("normalizes explicit source offsets to UTC", () => {
    const result = validateAndNormalizeMarketCandles({
      ...base,
      candles: [candle("2026-07-24T10:00:00+02:00", { timezone: "Europe/Berlin" })]
    });

    expect(result.failures).toEqual([]);
    expect(result.normalizedCandles[0].openedAt).toBe("2026-07-24T08:00:00.000Z");
  });

  it("blocks instrument and timeframe mismatches", () => {
    const result = validateAndNormalizeMarketCandles({
      ...base,
      candles: [
        candle("2026-07-24T08:00:00.000Z", { instrument: "GBPUSD" }),
        candle("2026-07-24T08:15:00.000Z", { timeframe: "1H" })
      ]
    });

    expect(result.failures.map((item) => item.code)).toEqual(expect.arrayContaining(["INSTRUMENT_MISMATCH", "TIMEFRAME_MISMATCH"]));
  });
});
