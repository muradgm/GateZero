import { z } from "zod";
import {
  DateRangeSchema,
  IdentifierSchema,
  IsoDateTimeSchema,
  NonEmptyStringSchema,
  ResearchParametersSchema
} from "./schemas.js";

export const Gate1ContractAuthoritySchema = z.literal("schema_only");
export const Gate1ContractScopeSchema = z.literal("research_only");

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
    financial_gate: z.literal("G0_RESEARCH"),
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
    financial_gate: z.literal("G0_RESEARCH"),
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

export const Gate1FeesAndSlippageAssumptionContractSchema = z
  .object({
    fees_and_slippage_assumption_id: IdentifierSchema,
    financial_gate: z.literal("G0_RESEARCH"),
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
    financial_gate: z.literal("G0_RESEARCH"),
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

export const Gate1ReproducibilityCheckContractSchema = z
  .object({
    reproducibility_check_id: IdentifierSchema,
    financial_gate: z.literal("G0_RESEARCH"),
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
    financial_gate: z.literal("G0_RESEARCH"),
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
export type Gate1ReproducibilityCheckContract = z.infer<
  typeof Gate1ReproducibilityCheckContractSchema
>;
export type Gate1ImmutableBacktestRecordContract = z.infer<
  typeof Gate1ImmutableBacktestRecordContractSchema
>;
