import { describe, expect, it } from "vitest";
import {
  Gate1BacktestCandleSchema,
  Gate1BacktestReproducibilityEvidenceSchema,
  Gate1DeterministicBacktestInputSchema,
  Gate1DeterministicBacktestOutputSchema
} from "../src/index.js";
import {
  gate1DeterministicBacktestInputFixture,
  gate1DeterministicBacktestOutputFixture,
  gate1DeterministicBacktestReproducibilityFixture
} from "../../fixtures/src/index.js";

describe("Gate 1 deterministic backtest runner contracts", () => {
  it("accepts the bounded runtime input fixture", () => {
    expect(
      Gate1DeterministicBacktestInputSchema.parse(gate1DeterministicBacktestInputFixture)
    ).toEqual(gate1DeterministicBacktestInputFixture);
  });

  it("rejects incoherent bid/ask candles", () => {
    expect(() =>
      Gate1BacktestCandleSchema.parse({
        ...gate1DeterministicBacktestInputFixture.candles[0],
        ask_open: 99
      })
    ).toThrow("ask open must not be below bid open");
  });

  it("rejects missing or irregular candle intervals", () => {
    const candles = structuredClone(gate1DeterministicBacktestInputFixture.candles);
    const candle = candles[5];
    if (!candle) {
      throw new Error("fixture candle is missing");
    }
    candles[5] = { ...candle, timestamp: "2025-01-07T00:00:00.000Z" };

    expect(() =>
      Gate1DeterministicBacktestInputSchema.parse({
        ...gate1DeterministicBacktestInputFixture,
        candles
      })
    ).toThrow("declared interval");
  });

  it("rejects candles after the input as-of time", () => {
    expect(() =>
      Gate1DeterministicBacktestInputSchema.parse({
        ...gate1DeterministicBacktestInputFixture,
        as_of: "2025-01-05T00:00:00.000Z"
      })
    ).toThrow("after the input as-of time");
  });

  it("rejects invalid moving-average window ordering", () => {
    expect(() =>
      Gate1DeterministicBacktestInputSchema.parse({
        ...gate1DeterministicBacktestInputFixture,
        strategy: {
          ...gate1DeterministicBacktestInputFixture.strategy,
          short_window: 4,
          long_window: 3
        }
      })
    ).toThrow("short window");
  });

  it("accepts coherent output and reproducibility evidence", () => {
    expect(
      Gate1DeterministicBacktestOutputSchema.parse(gate1DeterministicBacktestOutputFixture)
    ).toEqual(gate1DeterministicBacktestOutputFixture);
    expect(
      Gate1BacktestReproducibilityEvidenceSchema.parse(
        gate1DeterministicBacktestReproducibilityFixture
      )
    ).toEqual(gate1DeterministicBacktestReproducibilityFixture);
  });

  it("rejects output status or metric counts that disagree with trades", () => {
    expect(() =>
      Gate1DeterministicBacktestOutputSchema.parse({
        ...gate1DeterministicBacktestOutputFixture,
        result_status: "completed_no_trades",
        metrics: {
          ...gate1DeterministicBacktestOutputFixture.metrics,
          trade_count: 0
        }
      })
    ).toThrow("result status");
  });

  it("rejects a false reproducibility disposition", () => {
    expect(() =>
      Gate1BacktestReproducibilityEvidenceSchema.parse({
        ...gate1DeterministicBacktestReproducibilityFixture,
        reproducibility_status: "mismatch",
        mismatch_reasons: ["Claimed mismatch."]
      })
    ).toThrow("reproducibility disposition");
  });
});
