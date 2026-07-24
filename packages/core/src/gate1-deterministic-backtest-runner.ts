import {
  ContractValidationError,
  Gate1BacktestReproducibilityEvidenceSchema,
  Gate1DeterministicBacktestInputSchema,
  Gate1DeterministicBacktestOutputSchema,
  type Gate1BacktestCandle,
  type Gate1BacktestReproducibilityEvidence,
  type Gate1BacktestTradeEvidence,
  type Gate1DeterministicBacktestInput,
  type Gate1DeterministicBacktestOutput
} from "../../contracts/src/index.js";
import { hashCanonicalValue } from "./trace-hashing.js";

const ENGINE_VERSION = "traderframe-reference-backtest-v1" as const;
const boundary = {
  financial_gate: "G1_BACKTESTING" as const,
  scope: "historical_backtesting_only" as const,
  runtime_authority: "local_deterministic_research" as const,
  local_only: true as const,
  evidence_only: true as const,
  operator_required: true as const,
  risk_review_required: true as const,
  external_access: false as const,
  execution_path: false as const,
  automated_action: false as const,
  approval_claim: false as const,
  performance_claim: false as const
};

const strategyLogicDescriptor = {
  engine_version: ENGINE_VERSION,
  strategy_family: "moving_average_crossover_long_only",
  signal_source: "closed_bid_candles",
  execution_timing: "next_candle_open",
  entry_side: "ask",
  exit_side: "bid",
  position_limit: 1
};

export const GATE1_REFERENCE_STRATEGY_LOGIC_HASH = hashValue(strategyLogicDescriptor);

interface OpenPosition {
  readonly signalObservedAt: string;
  readonly openedAt: string;
  readonly entryReferencePrice: number;
  readonly entryFillPrice: number;
  readonly quantity: number;
}

export function calculateGate1DatasetContentHash(candles: readonly Gate1BacktestCandle[]): string {
  return hashValue(candles);
}

export function calculateGate1BacktestOutputHash(output: Gate1DeterministicBacktestOutput): string {
  const payload = Object.fromEntries(
    Object.entries(Gate1DeterministicBacktestOutputSchema.parse(output)).filter(
      ([key]) => key !== "output_hash"
    )
  );
  return hashValue(payload);
}

export function assertGate1BacktestOutputIntegrity(output: Gate1DeterministicBacktestOutput): void {
  const parsed = Gate1DeterministicBacktestOutputSchema.parse(output);
  if (calculateGate1BacktestOutputHash(parsed) !== parsed.output_hash) {
    throw new ContractValidationError("backtest output hash does not match output evidence");
  }
}

export function runGate1DeterministicBacktest(
  unparsedInput: Gate1DeterministicBacktestInput
): Gate1DeterministicBacktestOutput {
  const input = Gate1DeterministicBacktestInputSchema.parse(unparsedInput);
  const observedDatasetHash = calculateGate1DatasetContentHash(input.candles);

  if (observedDatasetHash !== input.dataset_content_hash) {
    throw new ContractValidationError("dataset content hash does not match supplied candles");
  }

  if (input.strategy.source_logic_hash !== GATE1_REFERENCE_STRATEGY_LOGIC_HASH) {
    throw new ContractValidationError("strategy source logic hash does not match reference runner");
  }

  const inputHash = hashValue(input);
  const runSuffix = inputHash.slice(0, 16);
  const trades: Gate1BacktestTradeEvidence[] = [];
  const equityCurve: { timestamp: string; value: number }[] = [];
  const closes = input.candles.map((candle) => candle.bid_close);
  const commissionRate = input.costs.commission_bps_per_side / 10_000;
  const slippageRate = input.costs.slippage_bps_per_side / 10_000;
  let position: OpenPosition | undefined;
  let realizedPnl = 0;
  let maxGrossExposurePct = 0;

  for (let index = 0; index < input.candles.length; index += 1) {
    const candle = requireCandle(input.candles[index]);

    if (index >= input.strategy.long_window + 1) {
      const previousShort = movingAverage(closes, index - 1, input.strategy.short_window);
      const previousLong = movingAverage(closes, index - 1, input.strategy.long_window);
      const currentShort = movingAverage(closes, index, input.strategy.short_window);
      const currentLong = movingAverage(closes, index, input.strategy.long_window);
      const signalCandle = requireCandle(input.candles[index - 1]);
      const crossedUp = previousShort <= previousLong && currentShort > currentLong;
      const crossedDown = previousShort >= previousLong && currentShort < currentLong;

      if (!position && crossedUp) {
        const notional = candle.ask_open * input.strategy.quantity;
        const availableEquity = input.starting_capital + realizedPnl;

        if (notional > availableEquity) {
          throw new ContractValidationError(
            "strategy quantity would create leveraged historical exposure"
          );
        }

        const entryFillPrice = candle.ask_open * (1 + slippageRate);
        position = {
          signalObservedAt: signalCandle.timestamp,
          openedAt: candle.timestamp,
          entryReferencePrice: candle.ask_open,
          entryFillPrice,
          quantity: input.strategy.quantity
        };
        maxGrossExposurePct = Math.max(
          maxGrossExposurePct,
          (notional / input.starting_capital) * 100
        );
      } else if (position && crossedDown) {
        const closed = closePosition({
          position,
          exitReferencePrice: candle.bid_open,
          closedAt: candle.timestamp,
          closeReason: "opposite_cross",
          tradeIndex: trades.length,
          runSuffix,
          commissionRate,
          slippageRate
        });
        trades.push(closed);
        realizedPnl += closed.net_pnl;
        position = undefined;
      }
    }

    const isLastCandle = index === input.candles.length - 1;
    if (position && isLastCandle) {
      const closed = closePosition({
        position,
        exitReferencePrice: candle.bid_close,
        closedAt: candle.timestamp,
        closeReason: "end_of_data",
        tradeIndex: trades.length,
        runSuffix,
        commissionRate,
        slippageRate
      });
      trades.push(closed);
      realizedPnl += closed.net_pnl;
      position = undefined;
    }

    const unrealizedPnl = position
      ? (candle.bid_close - position.entryFillPrice) * position.quantity -
        position.entryReferencePrice * position.quantity * commissionRate
      : 0;
    equityCurve.push({
      timestamp: candle.timestamp,
      value: round(input.starting_capital + realizedPnl + unrealizedPnl)
    });
  }

  const totalGrossPnl = trades.reduce((sum, trade) => sum + trade.gross_pnl, 0);
  const totalCommission = trades.reduce((sum, trade) => sum + trade.commission_cost, 0);
  const totalSlippage = trades.reduce((sum, trade) => sum + trade.slippage_cost, 0);
  const totalNetPnl = trades.reduce((sum, trade) => sum + trade.net_pnl, 0);
  const warnings =
    trades.length === 0
      ? ["No crossover completed; output remains valid no-trade research evidence."]
      : trades.some((trade) => trade.close_reason === "end_of_data")
        ? ["An open historical position was closed at the final candle for bounded evidence."]
        : [];

  const outputWithoutHash = {
    ...boundary,
    backtest_run_id: `gate1-runtime-run-${runSuffix}`,
    immutable_backtest_record_id: `gate1-runtime-record-${runSuffix}`,
    backtest_result_id: `gate1-runtime-result-${runSuffix}`,
    backtest_engine_version: ENGINE_VERSION,
    historical_data_snapshot_id: input.historical_data_snapshot_id,
    strategy_version_id: input.strategy.strategy_version_id,
    fees_and_slippage_assumption_id: input.costs.fees_and_slippage_assumption_id,
    instrument: input.instrument,
    input_hash: inputHash,
    result_status: trades.length > 0 ? ("completed" as const) : ("completed_no_trades" as const),
    trades,
    equity_curve: equityCurve,
    metrics: {
      observation_count: input.candles.length,
      trade_count: trades.length,
      gross_return_pct: round((totalGrossPnl / input.starting_capital) * 100),
      net_return_after_declared_costs_pct: round((totalNetPnl / input.starting_capital) * 100),
      maximum_drawdown_pct: calculateMaximumDrawdownPct(equityCurve),
      total_commission_cost: round(totalCommission),
      total_slippage_cost: round(totalSlippage),
      max_gross_exposure_pct: round(maxGrossExposurePct)
    },
    warnings,
    limitations: [
      "Reference runner supports one long-only moving-average crossover strategy.",
      "Historical results are evidence only and do not imply future performance.",
      "No optimization, parameter sweep, external data access, or execution route exists."
    ],
    created_at: input.as_of
  };

  return Gate1DeterministicBacktestOutputSchema.parse({
    ...outputWithoutHash,
    output_hash: hashValue(outputWithoutHash)
  });
}

export function checkGate1BacktestReproducibility(input: {
  readonly first: Gate1DeterministicBacktestOutput;
  readonly second: Gate1DeterministicBacktestOutput;
  readonly checkedAt: string;
}): Gate1BacktestReproducibilityEvidence {
  const first = Gate1DeterministicBacktestOutputSchema.parse(input.first);
  const second = Gate1DeterministicBacktestOutputSchema.parse(input.second);
  const mismatchReasons: string[] = [];

  if (calculateGate1BacktestOutputHash(first) !== first.output_hash) {
    mismatchReasons.push("first output integrity hash mismatch");
  }
  if (calculateGate1BacktestOutputHash(second) !== second.output_hash) {
    mismatchReasons.push("second output integrity hash mismatch");
  }
  if (first.input_hash !== second.input_hash) {
    mismatchReasons.push("input hashes differ");
  }
  if (first.output_hash !== second.output_hash) {
    mismatchReasons.push("output hashes differ");
  }

  return Gate1BacktestReproducibilityEvidenceSchema.parse({
    ...boundary,
    reproducibility_check_id: `gate1-repro-${first.input_hash.slice(0, 16)}`,
    first_backtest_run_id: first.backtest_run_id,
    second_backtest_run_id: second.backtest_run_id,
    input_hash: first.input_hash,
    first_output_hash: first.output_hash,
    second_output_hash: second.output_hash,
    reproducibility_status: mismatchReasons.length === 0 ? "reproduced" : "mismatch",
    mismatch_reasons: mismatchReasons,
    checked_at: input.checkedAt
  });
}

function closePosition(input: {
  readonly position: OpenPosition;
  readonly exitReferencePrice: number;
  readonly closedAt: string;
  readonly closeReason: "opposite_cross" | "end_of_data";
  readonly tradeIndex: number;
  readonly runSuffix: string;
  readonly commissionRate: number;
  readonly slippageRate: number;
}): Gate1BacktestTradeEvidence {
  const exitFillPrice = input.exitReferencePrice * (1 - input.slippageRate);
  const grossPnl =
    (input.exitReferencePrice - input.position.entryReferencePrice) * input.position.quantity;
  const commissionCost =
    (input.position.entryReferencePrice + input.exitReferencePrice) *
    input.position.quantity *
    input.commissionRate;
  const slippageCost =
    (input.position.entryFillPrice - input.position.entryReferencePrice) * input.position.quantity +
    (input.exitReferencePrice - exitFillPrice) * input.position.quantity;

  return {
    trade_id: `gate1-runtime-trade-${input.runSuffix}-${input.tradeIndex + 1}`,
    direction: "long",
    signal_observed_at: input.position.signalObservedAt,
    opened_at: input.position.openedAt,
    closed_at: input.closedAt,
    entry_reference_price: round(input.position.entryReferencePrice),
    entry_fill_price: round(input.position.entryFillPrice),
    exit_reference_price: round(input.exitReferencePrice),
    exit_fill_price: round(exitFillPrice),
    quantity: input.position.quantity,
    gross_pnl: round(grossPnl),
    commission_cost: round(commissionCost),
    slippage_cost: round(slippageCost),
    net_pnl: round(grossPnl - commissionCost - slippageCost),
    close_reason: input.closeReason
  };
}

function movingAverage(closes: readonly number[], endExclusive: number, window: number): number {
  const values = closes.slice(endExclusive - window, endExclusive);
  if (values.length !== window) {
    throw new ContractValidationError("moving-average window does not have enough closed candles");
  }

  return values.reduce((sum, value) => sum + value, 0) / window;
}

function calculateMaximumDrawdownPct(equityCurve: readonly { readonly value: number }[]): number {
  let peak = equityCurve[0]?.value ?? 0;
  let maximumDrawdown = 0;

  for (const point of equityCurve) {
    peak = Math.max(peak, point.value);
    if (peak > 0) {
      maximumDrawdown = Math.max(maximumDrawdown, ((peak - point.value) / peak) * 100);
    }
  }

  return round(maximumDrawdown);
}

function requireCandle(candle: Gate1BacktestCandle | undefined): Gate1BacktestCandle {
  if (!candle) {
    throw new ContractValidationError("expected candle is missing");
  }
  return candle;
}

function round(value: number): number {
  return Number(value.toFixed(10));
}

function hashValue(value: unknown): string {
  return hashCanonicalValue(value as Parameters<typeof hashCanonicalValue>[0]);
}
