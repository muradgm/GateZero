import { describe, expect, it } from "vitest";
import { lowTradeCountFixture } from "../../fixtures/src/index.js";
import {
  assembleMetricSummary,
  calculateAverageWinLossRatio,
  calculateMaxDrawdownPct,
  calculateTotalReturnPct,
  countTrades
} from "../src/index.js";

const syntheticEquityCurve = [{ value: 100 }, { value: 120 }, { value: 90 }, { value: 110 }];

const syntheticTrades = [
  {
    entry_price: 100,
    exit_price: 112,
    quantity: 1,
    fees: 1,
    slippage: 1
  },
  {
    entry_price: 100,
    exit_price: 94,
    quantity: 1,
    fees: 1,
    slippage: 1
  },
  {
    entry_price: 50,
    exit_price: 56,
    quantity: 2,
    fees: 1,
    slippage: 1
  }
];

describe("metric utilities", () => {
  it("calculates total return deterministically", () => {
    expect(calculateTotalReturnPct(syntheticEquityCurve)).toBe(10);
    expect(calculateTotalReturnPct(syntheticEquityCurve)).toBe(10);
  });

  it("calculates max drawdown from peak to trough", () => {
    expect(calculateMaxDrawdownPct(syntheticEquityCurve)).toBe(25);
  });

  it("returns zero drawdown for flat equity", () => {
    expect(calculateMaxDrawdownPct([{ value: 100 }, { value: 100 }, { value: 100 }])).toBe(0);
  });

  it("counts trades explicitly", () => {
    expect(countTrades(syntheticTrades)).toBe(3);
  });

  it("calculates average win/loss ratio from closed trade values", () => {
    expect(calculateAverageWinLossRatio(syntheticTrades)).toBe(1.25);
  });

  it("returns zero ratio and warning when losses are absent", () => {
    const summary = assembleMetricSummary({
      equity_curve: [{ value: 100 }, { value: 105 }],
      trades: [
        {
          entry_price: 100,
          exit_price: 105,
          quantity: 1,
          fees: 0,
          slippage: 0
        }
      ]
    });

    expect(summary.average_win_loss_ratio).toBe(0);
    expect(summary.warnings).toContain(
      "average win/loss ratio unavailable from provided closed trades"
    );
  });

  it("assembles metric summary with drawdown context", () => {
    const summary = assembleMetricSummary({
      equity_curve: syntheticEquityCurve,
      trades: syntheticTrades,
      warnings: ["synthetic metric fixture"]
    });

    expect(summary).toEqual({
      total_return_pct: 10,
      max_drawdown_pct: 25,
      average_win_loss_ratio: 1.25,
      trade_count: 3,
      warnings: ["synthetic metric fixture"]
    });
  });

  it("rejects empty equity inputs", () => {
    expect(() => calculateTotalReturnPct([])).toThrow("equity curve must not be empty");
    expect(() => calculateMaxDrawdownPct([])).toThrow("equity curve must not be empty");
  });

  it("can recalculate fixture trade count", () => {
    expect(countTrades(lowTradeCountFixture.payload.trade_list)).toBe(
      lowTradeCountFixture.payload.metric_summary.trade_count
    );
  });
});
