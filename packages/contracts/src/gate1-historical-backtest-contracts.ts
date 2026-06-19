import { z } from "zod";
import {
  DateRangeSchema,
  IdentifierSchema,
  IsoDateTimeSchema,
  NonEmptyStringSchema,
  ResearchParametersSchema
} from "./schemas.js";

export const Gate1ContractAuthoritySchema = z.literal("schema_only");
export const Gate1ContractScopeSchema = z.literal("historical_backtesting_only");

export const Gate1ColumnTypeSchema = z.enum(["string", "number", "integer", "boolean", "datetime"]);

export const Gate1HistoricalDataColumnSchema = z
  .object({
    name: NonEmptyStringSchema,
    type: Gate1ColumnTypeSchema,
    required: z.boolean()
  })
  .strict();

export const Gate1HistoricalDataSnapshotContractSchema = z
  .object({
    historical_data_snapshot_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    dataset_source_label: NonEmptyStringSchema,
    instrument_universe: z.array(NonEmptyStringSchema).min(1),
    timeframe: NonEmptyStringSchema,
    date_range: DateRangeSchema,
    vendor_or_fixture_origin: NonEmptyStringSchema,
    adjustment_policy: NonEmptyStringSchema,
    missing_data_policy: NonEmptyStringSchema,
    timezone: NonEmptyStringSchema,
    column_schema: z.array(Gate1HistoricalDataColumnSchema).min(1),
    content_hash: NonEmptyStringSchema,
    created_at: IsoDateTimeSchema,
    external_access: z.literal(false),
    execution_path: z.literal(false)
  })
  .strict();

export const Gate1StrategyVersionContractSchema = z
  .object({
    strategy_version_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    strategy_id: IdentifierSchema,
    strategy_version: NonEmptyStringSchema,
    strategy_family: NonEmptyStringSchema,
    parameter_schema_version: NonEmptyStringSchema,
    parameters: ResearchParametersSchema,
    source_logic_hash: NonEmptyStringSchema,
    created_at: IsoDateTimeSchema,
    author_label: NonEmptyStringSchema,
    change_reason: NonEmptyStringSchema,
    compatibility_constraints: z.array(NonEmptyStringSchema),
    produces_action_recommendation: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false)
  })
  .strict();

export const Gate1FeeModelTypeSchema = z.enum(["fixed_amount", "fixed_percentage", "formula"]);
export const Gate1SlippageModelTypeSchema = z.enum(["fixed_amount", "fixed_bps", "formula"]);
export const Gate1TradeDirectionSchema = z.enum(["long", "short"]);
export const Gate1PriceSideSchema = z.enum(["bid", "ask"]);

export const Gate1FeesAndSlippageAssumptionContractSchema = z
  .object({
    fees_and_slippage_assumption_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    fee_model_type: Gate1FeeModelTypeSchema,
    commission: NonEmptyStringSchema,
    spread_assumption: NonEmptyStringSchema,
    slippage_model_type: Gate1SlippageModelTypeSchema,
    slippage: NonEmptyStringSchema,
    currency: NonEmptyStringSchema,
    asset_class_scope: NonEmptyStringSchema,
    effective_date_range: DateRangeSchema,
    rationale: NonEmptyStringSchema,
    source_label: NonEmptyStringSchema,
    zero_cost_assumption: z.boolean(),
    external_access: z.literal(false),
    execution_path: z.literal(false)
  })
  .strict()
  .superRefine((assumption, context) => {
    if (assumption.zero_cost_assumption && assumption.rationale.trim().length < 20) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "zero-cost assumptions require an explicit rationale",
        path: ["rationale"]
      });
    }
  });

export const Gate1ReproducibilityStatusSchema = z.enum([
  "not_checked",
  "reproduced",
  "mismatch",
  "blocked"
]);

export const Gate1ValidationStatusSchema = z.enum(["not_checked", "passed", "failed", "blocked"]);

export const Gate1ExposureSummarySchema = z
  .object({
    max_gross_exposure_pct: z.number().nonnegative(),
    max_net_exposure_pct: z.number(),
    average_gross_exposure_pct: z.number().nonnegative(),
    notes: z.array(NonEmptyStringSchema)
  })
  .strict();

export const Gate1BacktestResultContractSchema = z
  .object({
    backtest_result_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    immutable_backtest_record_id: IdentifierSchema,
    metric_schema_version: NonEmptyStringSchema,
    period: DateRangeSchema,
    observation_count: z.number().int().positive(),
    trade_count: z.number().int().nonnegative(),
    gross_return_pct: z.number(),
    net_return_after_declared_costs_pct: z.number(),
    maximum_drawdown_pct: z.number().min(0).max(100),
    exposure_summary: Gate1ExposureSummarySchema,
    warnings: z.array(NonEmptyStringSchema),
    validation_status: Gate1ValidationStatusSchema,
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    created_at: IsoDateTimeSchema
  })
  .strict();

function nearlyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= 0.000001;
}

export const Gate1DirectionalPnlContractSchema = z
  .object({
    directional_pnl_check_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    instrument: NonEmptyStringSchema,
    asset_class_scope: NonEmptyStringSchema,
    account_currency: NonEmptyStringSchema,
    quote_currency: NonEmptyStringSchema,
    position_direction: Gate1TradeDirectionSchema,
    entry_price: z.number().positive(),
    entry_price_side: Gate1PriceSideSchema,
    exit_price: z.number().positive(),
    exit_price_side: Gate1PriceSideSchema,
    quantity: z.number().positive(),
    quantity_unit: NonEmptyStringSchema,
    contract_size: z.number().positive(),
    gross_pnl_quote_currency: z.number(),
    conversion_rate_to_account_currency: z.number().positive(),
    gross_pnl_account_currency: z.number(),
    total_declared_costs_account_currency: z.number().nonnegative(),
    net_pnl_account_currency: z.number(),
    formula_label: NonEmptyStringSchema,
    assumptions: z.array(NonEmptyStringSchema).min(1),
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    created_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((check, context) => {
    if (check.position_direction === "long") {
      if (check.entry_price_side !== "ask") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "long PnL checks must enter on ask",
          path: ["entry_price_side"]
        });
      }

      if (check.exit_price_side !== "bid") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "long PnL checks must exit on bid",
          path: ["exit_price_side"]
        });
      }
    }

    if (check.position_direction === "short") {
      if (check.entry_price_side !== "bid") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "short PnL checks must enter on bid",
          path: ["entry_price_side"]
        });
      }

      if (check.exit_price_side !== "ask") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "short PnL checks must exit on ask",
          path: ["exit_price_side"]
        });
      }
    }

    const directionalMove =
      check.position_direction === "long"
        ? check.exit_price - check.entry_price
        : check.entry_price - check.exit_price;
    const expectedGrossQuote = directionalMove * check.quantity * check.contract_size;
    const expectedGrossAccount = expectedGrossQuote * check.conversion_rate_to_account_currency;
    const expectedNetAccount = expectedGrossAccount - check.total_declared_costs_account_currency;

    if (!nearlyEqual(check.gross_pnl_quote_currency, expectedGrossQuote)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "gross quote-currency PnL must match directional price movement",
        path: ["gross_pnl_quote_currency"]
      });
    }

    if (!nearlyEqual(check.gross_pnl_account_currency, expectedGrossAccount)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "gross account-currency PnL must match converted quote-currency PnL",
        path: ["gross_pnl_account_currency"]
      });
    }

    if (!nearlyEqual(check.net_pnl_account_currency, expectedNetAccount)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "net account-currency PnL must subtract declared costs from gross PnL",
        path: ["net_pnl_account_currency"]
      });
    }
  });

export const Gate1PnlEvidenceReferenceContractSchema = z
  .object({
    pnl_evidence_reference_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    backtest_result_id: IdentifierSchema,
    directional_pnl_check_ids: z.array(IdentifierSchema).min(1),
    reference_scope: z.literal("backtest_result_to_directional_pnl"),
    rationale: NonEmptyStringSchema,
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    created_at: IsoDateTimeSchema
  })
  .strict();

export const Gate1CostConsistencyStatusSchema = z.enum(["not_checked", "checked", "blocked"]);
export const Gate1AssumptionCheckStatusSchema = z.enum(["not_checked", "checked", "blocked"]);
export const Gate1RiskSeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export const Gate1RiskDispositionSchema = z.enum(["open", "mitigated", "accepted_as_limitation"]);

export const Gate1PnlEvidenceBundleContractSchema = z
  .object({
    pnl_evidence_bundle_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    pnl_evidence_reference_id: IdentifierSchema,
    directional_pnl_check_ids: z.array(IdentifierSchema).min(1),
    included_instruments: z.array(NonEmptyStringSchema).min(1),
    includes_cross_currency_case: z.boolean(),
    includes_jpy_precision_case: z.boolean(),
    declared_cost_consistency_status: Gate1CostConsistencyStatusSchema,
    limitations: z.array(NonEmptyStringSchema).min(1),
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    created_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((bundle, context) => {
    if (bundle.declared_cost_consistency_status !== "checked") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PnL evidence bundles require checked declared cost consistency",
        path: ["declared_cost_consistency_status"]
      });
    }
  });

export const Gate1SpreadBidAskAlignmentContractSchema = z
  .object({
    spread_bid_ask_alignment_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    historical_data_snapshot_id: IdentifierSchema,
    fees_and_slippage_assumption_id: IdentifierSchema,
    bid_ask_columns_present: z.literal(true),
    spread_assumption_declared: z.literal(true),
    alignment_status: Gate1AssumptionCheckStatusSchema,
    limitations: z.array(NonEmptyStringSchema).min(1),
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    created_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((alignment, context) => {
    if (alignment.alignment_status !== "checked") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "spread to bid/ask alignment must be checked",
        path: ["alignment_status"]
      });
    }
  });

export const Gate1CandleTimingIntegrityContractSchema = z
  .object({
    candle_timing_integrity_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    historical_data_snapshot_id: IdentifierSchema,
    timestamp_timezone: NonEmptyStringSchema,
    candle_close_policy: NonEmptyStringSchema,
    session_calendar_policy: NonEmptyStringSchema,
    missing_candle_policy: NonEmptyStringSchema,
    timing_status: Gate1AssumptionCheckStatusSchema,
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    created_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((timing, context) => {
    if (timing.timing_status !== "checked") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "candle timing integrity must be checked",
        path: ["timing_status"]
      });
    }
  });

export const Gate1LookaheadBiasBlockerContractSchema = z
  .object({
    lookahead_bias_blocker_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    strategy_version_id: IdentifierSchema,
    uses_only_closed_candles: z.literal(true),
    indicator_warmup_policy: NonEmptyStringSchema,
    higher_timeframe_policy: NonEmptyStringSchema,
    blocker_status: Gate1AssumptionCheckStatusSchema,
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    created_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((blocker, context) => {
    if (blocker.blocker_status !== "checked") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "lookahead-bias blocker status must be checked",
        path: ["blocker_status"]
      });
    }
  });

export const Gate1SameCandleAmbiguityContractSchema = z
  .object({
    same_candle_ambiguity_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    backtest_result_id: IdentifierSchema,
    ambiguity_policy: NonEmptyStringSchema,
    stop_target_sequence_policy: NonEmptyStringSchema,
    ambiguity_status: Gate1AssumptionCheckStatusSchema,
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    created_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((ambiguity, context) => {
    if (ambiguity.ambiguity_status !== "checked") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "same-candle ambiguity status must be checked",
        path: ["ambiguity_status"]
      });
    }
  });

export const Gate1BacktestAssumptionRiskSchema = z
  .object({
    risk_id: IdentifierSchema,
    area: NonEmptyStringSchema,
    severity: Gate1RiskSeveritySchema,
    description: NonEmptyStringSchema,
    mitigation: NonEmptyStringSchema,
    disposition: Gate1RiskDispositionSchema
  })
  .strict();

export const Gate1BacktestAssumptionRiskRegisterContractSchema = z
  .object({
    backtest_assumption_risk_register_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    risks: z.array(Gate1BacktestAssumptionRiskSchema).min(1),
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    created_at: IsoDateTimeSchema
  })
  .strict();

export const Gate1ReproducibilityCheckContractSchema = z
  .object({
    reproducibility_check_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    strategy_version_id: IdentifierSchema,
    historical_data_snapshot_id: IdentifierSchema,
    fees_and_slippage_assumption_id: IdentifierSchema,
    backtest_engine_version: NonEmptyStringSchema,
    input_hash: NonEmptyStringSchema,
    expected_output_hash: NonEmptyStringSchema,
    rerun_output_hash: NonEmptyStringSchema,
    environment_label: NonEmptyStringSchema,
    reproducibility_status: Gate1ReproducibilityStatusSchema,
    evidence_usable: z.boolean(),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    checked_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((check, context) => {
    const hashesMatch = check.expected_output_hash === check.rerun_output_hash;

    if (hashesMatch && check.reproducibility_status === "mismatch") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "matching hashes cannot use mismatch reproducibility status",
        path: ["reproducibility_status"]
      });
    }

    if (!hashesMatch && check.reproducibility_status === "reproduced") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "mismatched hashes cannot use reproduced status",
        path: ["reproducibility_status"]
      });
    }

    if (check.reproducibility_status !== "reproduced" && check.evidence_usable) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "only reproduced checks can be evidence usable",
        path: ["evidence_usable"]
      });
    }
  });

export const Gate1ImmutableBacktestRecordContractSchema = z
  .object({
    immutable_backtest_record_id: IdentifierSchema,
    financial_gate: z.literal("G1_BACKTESTING"),
    scope: Gate1ContractScopeSchema,
    contract_authority: Gate1ContractAuthoritySchema,
    strategy_version_id: IdentifierSchema,
    historical_data_snapshot_id: IdentifierSchema,
    fees_and_slippage_assumption_id: IdentifierSchema,
    backtest_engine_version: NonEmptyStringSchema,
    input_hash: NonEmptyStringSchema,
    output_hash: NonEmptyStringSchema,
    created_at: IsoDateTimeSchema,
    reproducibility_status: Gate1ReproducibilityStatusSchema,
    validation_status: Gate1ValidationStatusSchema,
    operator_note: NonEmptyStringSchema,
    revision_of_record_id: IdentifierSchema.optional(),
    external_access: z.literal(false),
    execution_path: z.literal(false)
  })
  .strict()
  .superRefine((record, context) => {
    if (
      record.revision_of_record_id &&
      record.revision_of_record_id === record.immutable_backtest_record_id
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "a revision must reference a different record id",
        path: ["revision_of_record_id"]
      });
    }
  });

export type Gate1ContractAuthority = z.infer<typeof Gate1ContractAuthoritySchema>;
export type Gate1ContractScope = z.infer<typeof Gate1ContractScopeSchema>;
export type Gate1HistoricalDataColumn = z.infer<typeof Gate1HistoricalDataColumnSchema>;
export type Gate1HistoricalDataSnapshotContract = z.infer<
  typeof Gate1HistoricalDataSnapshotContractSchema
>;
export type Gate1StrategyVersionContract = z.infer<typeof Gate1StrategyVersionContractSchema>;
export type Gate1FeesAndSlippageAssumptionContract = z.infer<
  typeof Gate1FeesAndSlippageAssumptionContractSchema
>;
export type Gate1ReproducibilityStatus = z.infer<typeof Gate1ReproducibilityStatusSchema>;
export type Gate1ValidationStatus = z.infer<typeof Gate1ValidationStatusSchema>;
export type Gate1ExposureSummary = z.infer<typeof Gate1ExposureSummarySchema>;
export type Gate1BacktestResultContract = z.infer<typeof Gate1BacktestResultContractSchema>;
export type Gate1DirectionalPnlContract = z.infer<typeof Gate1DirectionalPnlContractSchema>;
export type Gate1PnlEvidenceReferenceContract = z.infer<
  typeof Gate1PnlEvidenceReferenceContractSchema
>;
export type Gate1CostConsistencyStatus = z.infer<typeof Gate1CostConsistencyStatusSchema>;
export type Gate1PnlEvidenceBundleContract = z.infer<typeof Gate1PnlEvidenceBundleContractSchema>;
export type Gate1AssumptionCheckStatus = z.infer<typeof Gate1AssumptionCheckStatusSchema>;
export type Gate1RiskSeverity = z.infer<typeof Gate1RiskSeveritySchema>;
export type Gate1RiskDisposition = z.infer<typeof Gate1RiskDispositionSchema>;
export type Gate1SpreadBidAskAlignmentContract = z.infer<
  typeof Gate1SpreadBidAskAlignmentContractSchema
>;
export type Gate1CandleTimingIntegrityContract = z.infer<
  typeof Gate1CandleTimingIntegrityContractSchema
>;
export type Gate1LookaheadBiasBlockerContract = z.infer<
  typeof Gate1LookaheadBiasBlockerContractSchema
>;
export type Gate1SameCandleAmbiguityContract = z.infer<
  typeof Gate1SameCandleAmbiguityContractSchema
>;
export type Gate1BacktestAssumptionRisk = z.infer<typeof Gate1BacktestAssumptionRiskSchema>;
export type Gate1BacktestAssumptionRiskRegisterContract = z.infer<
  typeof Gate1BacktestAssumptionRiskRegisterContractSchema
>;
export type Gate1ReproducibilityCheckContract = z.infer<
  typeof Gate1ReproducibilityCheckContractSchema
>;
export type Gate1ImmutableBacktestRecordContract = z.infer<
  typeof Gate1ImmutableBacktestRecordContractSchema
>;
