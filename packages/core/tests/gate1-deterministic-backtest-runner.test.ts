import { describe, expect, it } from "vitest";
import {
  gate1DeterministicBacktestInputFixture,
  gate1DeterministicBacktestOutputFixture
} from "../../fixtures/src/index.js";
import {
  GATE1_REFERENCE_STRATEGY_LOGIC_HASH,
  assertGate1BacktestOutputIntegrity,
  calculateGate1BacktestOutputHash,
  calculateGate1DatasetContentHash,
  checkGate1BacktestReproducibility,
  runGate1DeterministicBacktest
} from "../src/index.js";

describe("Gate 1 deterministic historical backtest runner", () => {
  it("runs one bounded strategy over checked-in historical candles", () => {
    const output = runGate1DeterministicBacktest(gate1DeterministicBacktestInputFixture);

    expect(output.result_status).toBe("completed");
    expect(output.trades).toHaveLength(1);
    expect(output.metrics.trade_count).toBe(1);
    expect(output.metrics.observation_count).toBe(
      gate1DeterministicBacktestInputFixture.candles.length
    );
  });

  it("produces identical evidence and hashes for identical inputs", () => {
    const first = runGate1DeterministicBacktest(gate1DeterministicBacktestInputFixture);
    const second = runGate1DeterministicBacktest(gate1DeterministicBacktestInputFixture);

    expect(second).toEqual(first);
    expect(first.input_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(first.output_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(calculateGate1BacktestOutputHash(first)).toBe(first.output_hash);
    expect(() => assertGate1BacktestOutputIntegrity(first)).not.toThrow();
    expect(
      checkGate1BacktestReproducibility({
        first,
        second,
        checkedAt: "2025-01-13T00:00:00.000Z"
      })
    ).toMatchObject({
      reproducibility_status: "reproduced",
      mismatch_reasons: []
    });
  });

  it("observes a closed-candle signal before executing at the next open", () => {
    const trade = gate1DeterministicBacktestOutputFixture.trades[0];

    expect(trade).toBeDefined();
    expect(Date.parse(trade?.signal_observed_at ?? "")).toBeLessThan(
      Date.parse(trade?.opened_at ?? "")
    );
    expect(trade?.entry_reference_price).toBe(
      gate1DeterministicBacktestInputFixture.candles[5]?.ask_open
    );
  });

  it("does not let the execution candle close alter its already-observed entry signal", () => {
    const candles = structuredClone(gate1DeterministicBacktestInputFixture.candles);
    const executionCandle = candles[5];
    if (!executionCandle) {
      throw new Error("execution candle is missing");
    }
    candles[5] = {
      ...executionCandle,
      bid_high: 151,
      ask_high: 151.1,
      bid_close: 150,
      ask_close: 150.1
    };
    const changedInput = {
      ...gate1DeterministicBacktestInputFixture,
      candles,
      dataset_content_hash: calculateGate1DatasetContentHash(candles)
    };

    const originalTrade = gate1DeterministicBacktestOutputFixture.trades[0];
    const changedTrade = runGate1DeterministicBacktest(changedInput).trades[0];

    expect(changedTrade?.opened_at).toBe(originalTrade?.opened_at);
    expect(changedTrade?.entry_reference_price).toBe(originalTrade?.entry_reference_price);
  });

  it("applies declared spread, commission, and slippage costs", () => {
    const trade = gate1DeterministicBacktestOutputFixture.trades[0];
    if (!trade) {
      throw new Error("fixture trade is missing");
    }

    expect(trade.entry_reference_price).toBeGreaterThan(
      gate1DeterministicBacktestInputFixture.candles[5]?.bid_open ?? 0
    );
    expect(trade.commission_cost).toBeGreaterThan(0);
    expect(trade.slippage_cost).toBeGreaterThan(0);
    expect(trade.net_pnl).toBeLessThan(trade.gross_pnl);
    expect(
      gate1DeterministicBacktestOutputFixture.metrics.net_return_after_declared_costs_pct
    ).toBeLessThan(gate1DeterministicBacktestOutputFixture.metrics.gross_return_pct);
  });

  it("rejects a dataset whose frozen hash does not match its candles", () => {
    expect(() =>
      runGate1DeterministicBacktest({
        ...gate1DeterministicBacktestInputFixture,
        dataset_content_hash: "0".repeat(64)
      })
    ).toThrow("dataset content hash");
  });

  it("rejects an unrecognized strategy implementation hash", () => {
    expect(GATE1_REFERENCE_STRATEGY_LOGIC_HASH).toMatch(/^[a-f0-9]{64}$/);
    expect(() =>
      runGate1DeterministicBacktest({
        ...gate1DeterministicBacktestInputFixture,
        strategy: {
          ...gate1DeterministicBacktestInputFixture.strategy,
          source_logic_hash: "0".repeat(64)
        }
      })
    ).toThrow("strategy source logic hash");
  });

  it("rejects historical exposure that exceeds available capital", () => {
    expect(() =>
      runGate1DeterministicBacktest({
        ...gate1DeterministicBacktestInputFixture,
        strategy: {
          ...gate1DeterministicBacktestInputFixture.strategy,
          quantity: 1_000
        }
      })
    ).toThrow("leveraged historical exposure");
  });

  it("returns explicit no-trade evidence when no crossover occurs", () => {
    const candles = gate1DeterministicBacktestInputFixture.candles.map((candle) => ({
      ...candle,
      bid_open: 100,
      ask_open: 100.1,
      bid_high: 100.5,
      ask_high: 100.6,
      bid_low: 99.5,
      ask_low: 99.6,
      bid_close: 100,
      ask_close: 100.1
    }));
    const output = runGate1DeterministicBacktest({
      ...gate1DeterministicBacktestInputFixture,
      candles,
      dataset_content_hash: calculateGate1DatasetContentHash(candles)
    });

    expect(output.result_status).toBe("completed_no_trades");
    expect(output.trades).toEqual([]);
    expect(output.warnings[0]).toContain("No crossover completed");
  });

  it("changes frozen evidence hashes when historical input changes", () => {
    const candles = structuredClone(gate1DeterministicBacktestInputFixture.candles);
    const finalCandle = candles.at(-1);
    if (!finalCandle) {
      throw new Error("final candle is missing");
    }
    candles[candles.length - 1] = {
      ...finalCandle,
      bid_high: finalCandle.bid_high + 1,
      ask_high: finalCandle.ask_high + 1,
      bid_close: finalCandle.bid_close + 1,
      ask_close: finalCandle.ask_close + 1
    };
    const changed = runGate1DeterministicBacktest({
      ...gate1DeterministicBacktestInputFixture,
      candles,
      dataset_content_hash: calculateGate1DatasetContentHash(candles)
    });

    expect(changed.input_hash).not.toBe(gate1DeterministicBacktestOutputFixture.input_hash);
    expect(changed.output_hash).not.toBe(gate1DeterministicBacktestOutputFixture.output_hash);
  });

  it("detects output hash mismatch during replay comparison", () => {
    const mismatch = checkGate1BacktestReproducibility({
      first: gate1DeterministicBacktestOutputFixture,
      second: {
        ...gate1DeterministicBacktestOutputFixture,
        output_hash: "0".repeat(64)
      },
      checkedAt: "2025-01-13T00:00:00.000Z"
    });

    expect(mismatch.reproducibility_status).toBe("mismatch");
    expect(mismatch.mismatch_reasons).toEqual(
      expect.arrayContaining(["second output integrity hash mismatch", "output hashes differ"])
    );
  });

  it("detects output payload tampering when the stored hash is unchanged", () => {
    const tampered = structuredClone(gate1DeterministicBacktestOutputFixture);
    const trade = tampered.trades[0];
    if (!trade) {
      throw new Error("fixture trade is missing");
    }
    tampered.trades[0] = { ...trade, net_pnl: trade.net_pnl + 100 };

    expect(() => assertGate1BacktestOutputIntegrity(tampered)).toThrow(
      "output hash does not match"
    );
  });

  it("preserves evidence-only and non-execution authority", () => {
    expect(gate1DeterministicBacktestOutputFixture).toMatchObject({
      runtime_authority: "local_deterministic_research",
      local_only: true,
      evidence_only: true,
      operator_required: true,
      risk_review_required: true,
      external_access: false,
      execution_path: false,
      automated_action: false,
      approval_claim: false,
      performance_claim: false
    });
  });
});
