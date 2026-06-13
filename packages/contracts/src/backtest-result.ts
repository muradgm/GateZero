import { z } from "zod";
import {
  CurvePointSchema,
  DateRangeSchema,
  IdentifierSchema,
  IsoDateTimeSchema,
  MetricSummarySchema,
  NonEmptyStringSchema,
  ResearchParametersSchema
} from "./schemas.js";

export const BacktestVerdictSchema = z.enum([
  "insufficient_evidence",
  "requires_revision",
  "research_only"
]);

export const TradeRecordSchema = z
  .object({
    trade_id: IdentifierSchema,
    opened_at: IsoDateTimeSchema,
    closed_at: IsoDateTimeSchema.optional(),
    symbol: NonEmptyStringSchema,
    direction: z.enum(["long", "short", "flat"]),
    quantity: z.number().positive(),
    entry_price: z.number().positive(),
    exit_price: z.number().positive().optional(),
    fees: z.number().nonnegative(),
    slippage: z.number().nonnegative(),
    rationale: NonEmptyStringSchema
  })
  .strict();

export const BacktestResultSchema = z
  .object({
    backtest_result_id: IdentifierSchema,
    strategy_id: IdentifierSchema,
    strategy_version: NonEmptyStringSchema,
    data_source_name: NonEmptyStringSchema,
    data_source_version: NonEmptyStringSchema,
    symbol_universe: z.array(NonEmptyStringSchema).min(1),
    date_range: DateRangeSchema,
    timeframe: NonEmptyStringSchema,
    fee_model: NonEmptyStringSchema,
    slippage_model: NonEmptyStringSchema,
    starting_capital: z.number().positive(),
    position_sizing_rule: NonEmptyStringSchema,
    parameters: ResearchParametersSchema,
    trade_list: z.array(TradeRecordSchema),
    equity_curve: z.array(CurvePointSchema).min(1),
    drawdown_curve: z.array(CurvePointSchema).min(1),
    metric_summary: MetricSummarySchema,
    generated_warnings: z.array(NonEmptyStringSchema),
    verdict: BacktestVerdictSchema,
    created_at: IsoDateTimeSchema
  })
  .strict();

export type BacktestVerdict = z.infer<typeof BacktestVerdictSchema>;
export type TradeRecord = z.infer<typeof TradeRecordSchema>;
export type BacktestResult = z.infer<typeof BacktestResultSchema>;
