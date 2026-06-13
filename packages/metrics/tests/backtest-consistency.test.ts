import { describe, expect, it } from "vitest";
import { BacktestResultSchema, type BacktestResult } from "../../contracts/src/index.js";
import { createSyntheticBacktestResult } from "../../fixtures/src/index.js";
import { checkBacktestMetricConsistency } from "../src/index.js";

function createConsistentBacktestResult(): BacktestResult {
  return createSyntheticBacktestResult({
    equity_curve: [
      {
        timestamp: "2026-01-01T00:00:00.000Z",
        value: 100
      },
      {
        timestamp: "2026-01-02T00:00:00.000Z",
        value: 120
      },
      {
        timestamp: "2026-01-03T00:00:00.000Z",
        value: 90
      },
      {
        timestamp: "2026-01-04T00:00:00.000Z",
        value: 110
      }
    ],
    drawdown_curve: [
      {
        timestamp: "2026-01-01T00:00:00.000Z",
        value: 0
      },
      {
        timestamp: "2026-01-03T00:00:00.000Z",
        value: 25
      }
    ],
    trade_list: [
      {
        trade_id: "trade-win-001",
        opened_at: "2026-01-01T00:00:00.000Z",
        closed_at: "2026-01-02T00:00:00.000Z",
        symbol: "SYNTH",
        direction: "long",
        quantity: 1,
        entry_price: 100,
        exit_price: 112,
        fees: 1,
        slippage: 1,
        rationale: "synthetic consistency fixture"
      },
      {
        trade_id: "trade-loss-001",
        opened_at: "2026-01-02T00:00:00.000Z",
        closed_at: "2026-01-03T00:00:00.000Z",
        symbol: "SYNTH",
        direction: "long",
        quantity: 1,
        entry_price: 100,
        exit_price: 94,
        fees: 1,
        slippage: 1,
        rationale: "synthetic consistency fixture"
      },
      {
        trade_id: "trade-win-002",
        opened_at: "2026-01-03T00:00:00.000Z",
        closed_at: "2026-01-04T00:00:00.000Z",
        symbol: "SYNTH",
        direction: "long",
        quantity: 2,
        entry_price: 50,
        exit_price: 56,
        fees: 1,
        slippage: 1,
        rationale: "synthetic consistency fixture"
      }
    ],
    metric_summary: {
      total_return_pct: 10,
      max_drawdown_pct: 25,
      average_win_loss_ratio: 1.25,
      trade_count: 3,
      warnings: ["synthetic consistency fixture"]
    },
    generated_warnings: ["synthetic consistency fixture"]
  });
}

describe("checkBacktestMetricConsistency", () => {
  it("returns no findings for a consistent synthetic backtest result", () => {
    const result = checkBacktestMetricConsistency(createConsistentBacktestResult());

    expect(result.findings).toEqual([]);
    expect(result.drawdown_context_present).toBe(true);
  });

  it("flags total return mismatch", () => {
    const result = checkBacktestMetricConsistency(
      createConsistentBacktestResultWithMetric({ total_return_pct: 999 })
    );

    expect(result.findings.map((finding) => finding.field)).toContain("total_return_pct");
  });

  it("flags max drawdown mismatch", () => {
    const result = checkBacktestMetricConsistency(
      createConsistentBacktestResultWithMetric({ max_drawdown_pct: 1 })
    );

    expect(result.findings.map((finding) => finding.field)).toContain("max_drawdown_pct");
  });

  it("flags trade count mismatch", () => {
    const result = checkBacktestMetricConsistency(
      createConsistentBacktestResultWithMetric({ trade_count: 99 })
    );

    expect(result.findings.map((finding) => finding.field)).toContain("trade_count");
  });

  it("flags average win/loss ratio mismatch", () => {
    const result = checkBacktestMetricConsistency(
      createConsistentBacktestResultWithMetric({ average_win_loss_ratio: 99 })
    );

    expect(result.findings.map((finding) => finding.field)).toContain("average_win_loss_ratio");
  });

  it("rejects invalid backtest payloads", () => {
    const invalidBacktest = {
      ...createConsistentBacktestResult(),
      equity_curve: []
    };

    expect(() => checkBacktestMetricConsistency(invalidBacktest as BacktestResult)).toThrow();
  });

  it("does not mutate the input object", () => {
    const backtestResult = createConsistentBacktestResult();
    const before = JSON.stringify(backtestResult);

    checkBacktestMetricConsistency(backtestResult);

    expect(JSON.stringify(backtestResult)).toBe(before);
  });
});

function createConsistentBacktestResultWithMetric(
  metricOverrides: Partial<BacktestResult["metric_summary"]>
): BacktestResult {
  const backtestResult = createConsistentBacktestResult();

  return BacktestResultSchema.parse({
    ...backtestResult,
    metric_summary: {
      ...backtestResult.metric_summary,
      ...metricOverrides
    }
  });
}
