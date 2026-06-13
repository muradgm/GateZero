import { ContractValidationError } from "../../contracts/src/index.js";

export interface EquityPoint {
  readonly value: number;
}

export interface ClosedTradeLike {
  readonly entry_price: number;
  readonly exit_price?: number;
  readonly quantity: number;
  readonly fees: number;
  readonly slippage: number;
}

export interface MetricSummaryInput {
  readonly equity_curve: readonly EquityPoint[];
  readonly trades: readonly ClosedTradeLike[];
  readonly warnings?: readonly string[];
}

export interface MetricSummary {
  readonly total_return_pct: number;
  readonly max_drawdown_pct: number;
  readonly average_win_loss_ratio: number;
  readonly trade_count: number;
  readonly warnings: readonly string[];
}

export function calculateTotalReturnPct(equityCurve: readonly EquityPoint[]): number {
  assertNonEmptyEquityCurve(equityCurve);

  const firstValue = equityCurve[0]?.value;
  const lastValue = equityCurve[equityCurve.length - 1]?.value;

  if (firstValue === undefined || lastValue === undefined || firstValue <= 0) {
    throw new ContractValidationError("equity curve must start with a positive value");
  }

  return ((lastValue - firstValue) / firstValue) * 100;
}

export function calculateMaxDrawdownPct(equityCurve: readonly EquityPoint[]): number {
  assertNonEmptyEquityCurve(equityCurve);

  let peak = requirePositiveValue(equityCurve[0]?.value, "first equity value must be positive");
  let maxDrawdown = 0;

  for (const point of equityCurve) {
    const value = requirePositiveValue(point.value, "equity values must be positive");
    peak = Math.max(peak, value);
    const drawdown = ((peak - value) / peak) * 100;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }

  return maxDrawdown;
}

export function countTrades(trades: readonly ClosedTradeLike[]): number {
  return trades.length;
}

export function calculateAverageWinLossRatio(trades: readonly ClosedTradeLike[]): number {
  const pnls = trades.map(calculateClosedTradePnl);
  const wins = pnls.filter((pnl) => pnl > 0);
  const losses = pnls.filter((pnl) => pnl < 0);

  if (wins.length === 0 || losses.length === 0) {
    return 0;
  }

  const averageWin = average(wins);
  const averageLossMagnitude = Math.abs(average(losses));

  if (averageLossMagnitude === 0) {
    return 0;
  }

  return averageWin / averageLossMagnitude;
}

export function assembleMetricSummary(input: MetricSummaryInput): MetricSummary {
  const warnings = [...(input.warnings ?? [])];
  const ratio = calculateAverageWinLossRatio(input.trades);

  if (ratio === 0) {
    warnings.push("average win/loss ratio unavailable from provided closed trades");
  }

  return {
    total_return_pct: calculateTotalReturnPct(input.equity_curve),
    max_drawdown_pct: calculateMaxDrawdownPct(input.equity_curve),
    average_win_loss_ratio: ratio,
    trade_count: countTrades(input.trades),
    warnings
  };
}

function calculateClosedTradePnl(trade: ClosedTradeLike): number {
  if (trade.exit_price === undefined) {
    return 0;
  }

  return (trade.exit_price - trade.entry_price) * trade.quantity - trade.fees - trade.slippage;
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function assertNonEmptyEquityCurve(equityCurve: readonly EquityPoint[]): void {
  if (equityCurve.length === 0) {
    throw new ContractValidationError("equity curve must not be empty");
  }
}

function requirePositiveValue(value: number | undefined, message: string): number {
  if (value === undefined || value <= 0) {
    throw new ContractValidationError(message);
  }

  return value;
}
