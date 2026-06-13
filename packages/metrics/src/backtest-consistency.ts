import {
  BacktestResultSchema,
  type BacktestResult,
  type TradeRecord
} from "../../contracts/src/index.js";
import { assembleMetricSummary, type ClosedTradeLike, type MetricSummary } from "./metric-utils.js";

export type MetricConsistencyField =
  | "total_return_pct"
  | "max_drawdown_pct"
  | "average_win_loss_ratio"
  | "trade_count";

export interface MetricConsistencyFinding {
  readonly field: MetricConsistencyField;
  readonly stored_value: number;
  readonly recalculated_value: number;
  readonly difference: number;
}

export interface BacktestConsistencyResult {
  readonly backtest_result_id: string;
  readonly strategy_id: string;
  readonly strategy_version: string;
  readonly recalculated_metric_summary: MetricSummary;
  readonly findings: readonly MetricConsistencyFinding[];
  readonly drawdown_context_present: boolean;
}

export interface CheckBacktestMetricConsistencyOptions {
  readonly tolerance?: number;
}

export function checkBacktestMetricConsistency(
  backtestResult: BacktestResult,
  options: CheckBacktestMetricConsistencyOptions = {}
): BacktestConsistencyResult {
  const parsedBacktestResult = BacktestResultSchema.parse(backtestResult);
  const tolerance = options.tolerance ?? 1e-9;
  const recalculatedMetricSummary = assembleMetricSummary({
    equity_curve: parsedBacktestResult.equity_curve,
    trades: parsedBacktestResult.trade_list.map(toClosedTradeLike),
    warnings: parsedBacktestResult.metric_summary.warnings
  });
  const findings = [
    compareMetric(
      "total_return_pct",
      parsedBacktestResult.metric_summary.total_return_pct,
      recalculatedMetricSummary.total_return_pct,
      tolerance
    ),
    compareMetric(
      "max_drawdown_pct",
      parsedBacktestResult.metric_summary.max_drawdown_pct,
      recalculatedMetricSummary.max_drawdown_pct,
      tolerance
    ),
    compareMetric(
      "average_win_loss_ratio",
      parsedBacktestResult.metric_summary.average_win_loss_ratio,
      recalculatedMetricSummary.average_win_loss_ratio,
      tolerance
    ),
    compareMetric(
      "trade_count",
      parsedBacktestResult.metric_summary.trade_count,
      recalculatedMetricSummary.trade_count,
      tolerance
    )
  ].filter((finding): finding is MetricConsistencyFinding => finding !== null);

  return {
    backtest_result_id: parsedBacktestResult.backtest_result_id,
    strategy_id: parsedBacktestResult.strategy_id,
    strategy_version: parsedBacktestResult.strategy_version,
    recalculated_metric_summary: recalculatedMetricSummary,
    findings,
    drawdown_context_present: parsedBacktestResult.drawdown_curve.length > 0
  };
}

function compareMetric(
  field: MetricConsistencyField,
  storedValue: number,
  recalculatedValue: number,
  tolerance: number
): MetricConsistencyFinding | null {
  const difference = storedValue - recalculatedValue;

  if (Math.abs(difference) <= tolerance) {
    return null;
  }

  return {
    field,
    stored_value: storedValue,
    recalculated_value: recalculatedValue,
    difference
  };
}

function toClosedTradeLike(trade: TradeRecord): ClosedTradeLike {
  return {
    entry_price: trade.entry_price,
    exit_price: trade.exit_price,
    quantity: trade.quantity,
    fees: trade.fees,
    slippage: trade.slippage
  };
}
