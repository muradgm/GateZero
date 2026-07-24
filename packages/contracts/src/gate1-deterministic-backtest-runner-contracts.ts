import { z } from "zod";
import { IdentifierSchema, IsoDateTimeSchema, NonEmptyStringSchema } from "./schemas.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const FiniteNumberSchema = z.number().finite();

export const Gate1BacktestRuntimeBoundarySchema = z
  .object({
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: z.literal("historical_backtesting_only"),
    runtime_authority: z.literal("local_deterministic_research"),
    local_only: z.literal(true),
    evidence_only: z.literal(true),
    operator_required: z.literal(true),
    risk_review_required: z.literal(true),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    automated_action: z.literal(false),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false)
  })
  .strict();

export const Gate1BacktestCandleSchema = z
  .object({
    timestamp: IsoDateTimeSchema,
    bid_open: z.number().positive(),
    ask_open: z.number().positive(),
    bid_high: z.number().positive(),
    ask_high: z.number().positive(),
    bid_low: z.number().positive(),
    ask_low: z.number().positive(),
    bid_close: z.number().positive(),
    ask_close: z.number().positive()
  })
  .strict()
  .superRefine((candle, context) => {
    for (const side of ["bid", "ask"] as const) {
      const open = candle[`${side}_open`];
      const high = candle[`${side}_high`];
      const low = candle[`${side}_low`];
      const close = candle[`${side}_close`];

      if (high < Math.max(open, close) || low > Math.min(open, close) || low > high) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${side} OHLC values are incoherent`
        });
      }
    }

    for (const field of ["open", "high", "low", "close"] as const) {
      if (candle[`ask_${field}`] < candle[`bid_${field}`]) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `ask ${field} must not be below bid ${field}`,
          path: [`ask_${field}`]
        });
      }
    }
  });

export const Gate1MovingAverageStrategyRuntimeSchema = z
  .object({
    strategy_version_id: IdentifierSchema,
    strategy_family: z.literal("moving_average_crossover_long_only"),
    source_logic_hash: Sha256Schema,
    short_window: z.number().int().min(2),
    long_window: z.number().int().min(3),
    quantity: z.number().positive(),
    one_position_maximum: z.literal(true),
    signal_on_closed_candle_only: z.literal(true),
    execute_on_next_candle_open: z.literal(true)
  })
  .strict()
  .refine((strategy) => strategy.short_window < strategy.long_window, {
    message: "short window must be smaller than long window",
    path: ["short_window"]
  });

export const Gate1StructuredCostModelSchema = z
  .object({
    fees_and_slippage_assumption_id: IdentifierSchema,
    commission_bps_per_side: z.number().min(0).max(100),
    slippage_bps_per_side: z.number().min(0).max(100),
    spread_source: z.literal("candle_bid_ask"),
    zero_cost_assumption: z.literal(false)
  })
  .strict();

export const Gate1DeterministicBacktestInputSchema = Gate1BacktestRuntimeBoundarySchema.extend({
  historical_data_snapshot_id: IdentifierSchema,
  dataset_content_hash: Sha256Schema,
  instrument: NonEmptyStringSchema,
  timeframe: z.literal("1d"),
  interval_seconds: z.literal(86400),
  as_of: IsoDateTimeSchema,
  starting_capital: z.number().positive(),
  candles: z.array(Gate1BacktestCandleSchema).min(5),
  strategy: Gate1MovingAverageStrategyRuntimeSchema,
  costs: Gate1StructuredCostModelSchema
})
  .strict()
  .superRefine((input, context) => {
    if (input.candles.length < input.strategy.long_window + 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "dataset requires at least long_window + 2 candles",
        path: ["candles"]
      });
    }

    const asOf = Date.parse(input.as_of);
    for (let index = 0; index < input.candles.length; index += 1) {
      const candle = input.candles[index];
      const previous = input.candles[index - 1];

      if (!candle) {
        continue;
      }

      const timestamp = Date.parse(candle.timestamp);
      if (timestamp > asOf) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "candle timestamp must not be after the input as-of time",
          path: ["candles", index, "timestamp"]
        });
      }

      if (previous) {
        const interval = timestamp - Date.parse(previous.timestamp);
        if (interval !== input.interval_seconds * 1000) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "candles must be strictly ordered at the declared interval",
            path: ["candles", index, "timestamp"]
          });
        }
      }
    }
  });

export const Gate1BacktestTradeEvidenceSchema = z
  .object({
    trade_id: IdentifierSchema,
    direction: z.literal("long"),
    signal_observed_at: IsoDateTimeSchema,
    opened_at: IsoDateTimeSchema,
    closed_at: IsoDateTimeSchema,
    entry_reference_price: z.number().positive(),
    entry_fill_price: z.number().positive(),
    exit_reference_price: z.number().positive(),
    exit_fill_price: z.number().positive(),
    quantity: z.number().positive(),
    gross_pnl: FiniteNumberSchema,
    commission_cost: z.number().nonnegative(),
    slippage_cost: z.number().nonnegative(),
    net_pnl: FiniteNumberSchema,
    close_reason: z.enum(["opposite_cross", "end_of_data"])
  })
  .strict()
  .superRefine((trade, context) => {
    if (
      Date.parse(trade.signal_observed_at) >= Date.parse(trade.opened_at) ||
      Date.parse(trade.opened_at) > Date.parse(trade.closed_at)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "signals must precede entry and entry must not follow exit"
      });
    }
  });

export const Gate1BacktestEquityPointSchema = z
  .object({
    timestamp: IsoDateTimeSchema,
    value: z.number().positive()
  })
  .strict();

export const Gate1BacktestRuntimeMetricsSchema = z
  .object({
    observation_count: z.number().int().positive(),
    trade_count: z.number().int().nonnegative(),
    gross_return_pct: FiniteNumberSchema,
    net_return_after_declared_costs_pct: FiniteNumberSchema,
    maximum_drawdown_pct: z.number().min(0).max(100),
    total_commission_cost: z.number().nonnegative(),
    total_slippage_cost: z.number().nonnegative(),
    max_gross_exposure_pct: z.number().nonnegative()
  })
  .strict();

export const Gate1DeterministicBacktestOutputSchema = Gate1BacktestRuntimeBoundarySchema.extend({
  backtest_run_id: IdentifierSchema,
  immutable_backtest_record_id: IdentifierSchema,
  backtest_result_id: IdentifierSchema,
  backtest_engine_version: z.literal("traderframe-reference-backtest-v1"),
  historical_data_snapshot_id: IdentifierSchema,
  strategy_version_id: IdentifierSchema,
  fees_and_slippage_assumption_id: IdentifierSchema,
  instrument: NonEmptyStringSchema,
  input_hash: Sha256Schema,
  output_hash: Sha256Schema,
  result_status: z.enum(["completed", "completed_no_trades"]),
  trades: z.array(Gate1BacktestTradeEvidenceSchema),
  equity_curve: z.array(Gate1BacktestEquityPointSchema).min(1),
  metrics: Gate1BacktestRuntimeMetricsSchema,
  warnings: z.array(NonEmptyStringSchema),
  limitations: z.array(NonEmptyStringSchema).min(1),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((output, context) => {
    if (output.metrics.trade_count !== output.trades.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "trade count must match emitted trade evidence",
        path: ["metrics", "trade_count"]
      });
    }

    if (
      (output.result_status === "completed_no_trades" && output.trades.length !== 0) ||
      (output.result_status === "completed" && output.trades.length === 0)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "result status must match emitted trades",
        path: ["result_status"]
      });
    }
  });

export const Gate1BacktestReproducibilityEvidenceSchema = Gate1BacktestRuntimeBoundarySchema.extend(
  {
    reproducibility_check_id: IdentifierSchema,
    first_backtest_run_id: IdentifierSchema,
    second_backtest_run_id: IdentifierSchema,
    input_hash: Sha256Schema,
    first_output_hash: Sha256Schema,
    second_output_hash: Sha256Schema,
    reproducibility_status: z.enum(["reproduced", "mismatch"]),
    mismatch_reasons: z.array(NonEmptyStringSchema),
    checked_at: IsoDateTimeSchema
  }
)
  .strict()
  .superRefine((check, context) => {
    const hashesMatch = check.first_output_hash === check.second_output_hash;
    if (
      (hashesMatch && check.reproducibility_status !== "reproduced") ||
      (!hashesMatch && check.reproducibility_status !== "mismatch") ||
      (hashesMatch && check.mismatch_reasons.length > 0) ||
      (!hashesMatch && check.mismatch_reasons.length === 0)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "reproducibility disposition must match output hashes"
      });
    }
  });

export type Gate1BacktestCandle = z.infer<typeof Gate1BacktestCandleSchema>;
export type Gate1DeterministicBacktestInput = z.infer<typeof Gate1DeterministicBacktestInputSchema>;
export type Gate1BacktestTradeEvidence = z.infer<typeof Gate1BacktestTradeEvidenceSchema>;
export type Gate1DeterministicBacktestOutput = z.infer<
  typeof Gate1DeterministicBacktestOutputSchema
>;
export type Gate1BacktestReproducibilityEvidence = z.infer<
  typeof Gate1BacktestReproducibilityEvidenceSchema
>;
