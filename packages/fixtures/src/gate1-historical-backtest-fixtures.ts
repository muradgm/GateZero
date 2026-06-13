import {
  Gate1BacktestResultContractSchema,
  Gate1FeesAndSlippageAssumptionContractSchema,
  Gate1HistoricalDataSnapshotContractSchema,
  Gate1ImmutableBacktestRecordContractSchema,
  Gate1ReproducibilityCheckContractSchema,
  Gate1StrategyVersionContractSchema,
  type Gate1BacktestResultContract,
  type Gate1FeesAndSlippageAssumptionContract,
  type Gate1HistoricalDataSnapshotContract,
  type Gate1ImmutableBacktestRecordContract,
  type Gate1ReproducibilityCheckContract,
  type Gate1StrategyVersionContract
} from "../../contracts/src/index.js";

const fixtureTimestamp = "2026-01-01T00:00:00.000Z";
const fixturePeriod = {
  start: "2025-01-01",
  end: "2025-01-31"
};

export const gate1HistoricalDataSnapshotFixture: Gate1HistoricalDataSnapshotContract =
  Gate1HistoricalDataSnapshotContractSchema.parse({
    historical_data_snapshot_id: "gate1-hist-data-fixture-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    contract_authority: "schema_only",
    dataset_source_label: "synthetic historical data fixture",
    instrument_universe: ["SYNTH"],
    timeframe: "1d",
    date_range: fixturePeriod,
    vendor_or_fixture_origin: "synthetic fixture",
    adjustment_policy: "not applicable for synthetic fixture",
    missing_data_policy: "reject missing required bars",
    timezone: "UTC",
    column_schema: [
      { name: "timestamp", type: "datetime", required: true },
      { name: "open", type: "number", required: true },
      { name: "high", type: "number", required: true },
      { name: "low", type: "number", required: true },
      { name: "close", type: "number", required: true }
    ],
    content_hash: "sha256:gate1-hist-data-fixture-001",
    created_at: fixtureTimestamp,
    external_access: false,
    execution_path: false
  });

export const gate1StrategyVersionFixture: Gate1StrategyVersionContract =
  Gate1StrategyVersionContractSchema.parse({
    strategy_version_id: "gate1-strategy-version-fixture-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    contract_authority: "schema_only",
    strategy_id: "gate1-strategy-fixture-001",
    strategy_version: "v0.1.0",
    strategy_family: "synthetic fixture strategy",
    parameter_schema_version: "params-v1",
    parameters: {
      lookback_days: 10,
      enabled: true
    },
    source_logic_hash: "sha256:gate1-strategy-version-fixture-001",
    created_at: fixtureTimestamp,
    author_label: "GateZero fixture",
    change_reason: "Fixture for schema-only contract validation.",
    compatibility_constraints: ["research-only schema validation"],
    produces_action_recommendation: false,
    external_access: false,
    execution_path: false
  });

export const gate1FeesAndSlippageAssumptionFixture: Gate1FeesAndSlippageAssumptionContract =
  Gate1FeesAndSlippageAssumptionContractSchema.parse({
    fees_and_slippage_assumption_id: "gate1-cost-assumption-fixture-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    contract_authority: "schema_only",
    fee_model_type: "fixed_percentage",
    commission: "0.10 percent per transaction",
    spread_assumption: "1 basis point synthetic spread",
    slippage_model_type: "fixed_bps",
    slippage: "2 basis points synthetic slippage",
    currency: "USD",
    asset_class_scope: "synthetic equity fixture",
    effective_date_range: fixturePeriod,
    rationale: "Synthetic cost assumption for deterministic schema validation.",
    source_label: "synthetic fixture",
    zero_cost_assumption: false,
    external_access: false,
    execution_path: false
  });

export const gate1ImmutableBacktestRecordFixture: Gate1ImmutableBacktestRecordContract =
  Gate1ImmutableBacktestRecordContractSchema.parse({
    immutable_backtest_record_id: "gate1-immutable-backtest-fixture-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    contract_authority: "schema_only",
    strategy_version_id: gate1StrategyVersionFixture.strategy_version_id,
    historical_data_snapshot_id: gate1HistoricalDataSnapshotFixture.historical_data_snapshot_id,
    fees_and_slippage_assumption_id:
      gate1FeesAndSlippageAssumptionFixture.fees_and_slippage_assumption_id,
    backtest_engine_version: "synthetic-engine-v1",
    input_hash: "sha256:gate1-inputs-fixture-001",
    output_hash: "sha256:gate1-outputs-fixture-001",
    created_at: fixtureTimestamp,
    reproducibility_status: "not_checked",
    validation_status: "not_checked",
    operator_note: "Synthetic immutable record fixture for schema-only validation.",
    external_access: false,
    execution_path: false
  });

export const gate1BacktestResultFixture: Gate1BacktestResultContract =
  Gate1BacktestResultContractSchema.parse({
    backtest_result_id: "gate1-backtest-result-fixture-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    contract_authority: "schema_only",
    immutable_backtest_record_id: gate1ImmutableBacktestRecordFixture.immutable_backtest_record_id,
    metric_schema_version: "metrics-v1",
    period: fixturePeriod,
    observation_count: 23,
    trade_count: 2,
    gross_return_pct: 1.2,
    net_return_after_declared_costs_pct: 0.8,
    maximum_drawdown_pct: 2.5,
    exposure_summary: {
      max_gross_exposure_pct: 50,
      max_net_exposure_pct: 50,
      average_gross_exposure_pct: 25,
      notes: ["Synthetic exposure summary for schema validation."]
    },
    warnings: ["Synthetic fixture only; not market evidence."],
    validation_status: "not_checked",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate1ReproducibilityCheckFixture: Gate1ReproducibilityCheckContract =
  Gate1ReproducibilityCheckContractSchema.parse({
    reproducibility_check_id: "gate1-repro-check-fixture-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    contract_authority: "schema_only",
    strategy_version_id: gate1StrategyVersionFixture.strategy_version_id,
    historical_data_snapshot_id: gate1HistoricalDataSnapshotFixture.historical_data_snapshot_id,
    fees_and_slippage_assumption_id:
      gate1FeesAndSlippageAssumptionFixture.fees_and_slippage_assumption_id,
    backtest_engine_version: gate1ImmutableBacktestRecordFixture.backtest_engine_version,
    input_hash: gate1ImmutableBacktestRecordFixture.input_hash,
    expected_output_hash: gate1ImmutableBacktestRecordFixture.output_hash,
    rerun_output_hash: gate1ImmutableBacktestRecordFixture.output_hash,
    environment_label: "local deterministic test fixture",
    reproducibility_status: "reproduced",
    evidence_usable: true,
    external_access: false,
    execution_path: false,
    checked_at: fixtureTimestamp
  });

export const gate1ReproducibilityMismatchFixture: Gate1ReproducibilityCheckContract =
  Gate1ReproducibilityCheckContractSchema.parse({
    ...gate1ReproducibilityCheckFixture,
    reproducibility_check_id: "gate1-repro-mismatch-fixture-001",
    rerun_output_hash: "sha256:gate1-mismatched-output-fixture-001",
    reproducibility_status: "mismatch",
    evidence_usable: false
  });
