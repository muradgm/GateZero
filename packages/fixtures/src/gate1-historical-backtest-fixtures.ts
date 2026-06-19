import {
  Gate1BacktestResultContractSchema,
  Gate1BacktestAssumptionRiskRegisterContractSchema,
  Gate1CandleTimingIntegrityContractSchema,
  Gate1DirectionalPnlContractSchema,
  Gate1FeesAndSlippageAssumptionContractSchema,
  Gate1HistoricalDataSnapshotContractSchema,
  Gate1ImmutableBacktestRecordContractSchema,
  Gate1LookaheadBiasBlockerContractSchema,
  Gate1PnlEvidenceBundleContractSchema,
  Gate1PnlEvidenceReferenceContractSchema,
  Gate1ReproducibilityCheckContractSchema,
  Gate1SameCandleAmbiguityContractSchema,
  Gate1SpreadBidAskAlignmentContractSchema,
  Gate1StrategyVersionContractSchema,
  type Gate1BacktestAssumptionRiskRegisterContract,
  type Gate1BacktestResultContract,
  type Gate1CandleTimingIntegrityContract,
  type Gate1DirectionalPnlContract,
  type Gate1FeesAndSlippageAssumptionContract,
  type Gate1HistoricalDataSnapshotContract,
  type Gate1ImmutableBacktestRecordContract,
  type Gate1LookaheadBiasBlockerContract,
  type Gate1PnlEvidenceBundleContract,
  type Gate1PnlEvidenceReferenceContract,
  type Gate1ReproducibilityCheckContract,
  type Gate1SameCandleAmbiguityContract,
  type Gate1SpreadBidAskAlignmentContract,
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
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
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

export const gate1BidAskHistoricalDataSnapshotFixture: Gate1HistoricalDataSnapshotContract =
  Gate1HistoricalDataSnapshotContractSchema.parse({
    ...gate1HistoricalDataSnapshotFixture,
    historical_data_snapshot_id: "gate1-hist-data-bid-ask-fixture-001",
    dataset_source_label: "synthetic historical bid/ask data fixture",
    instrument_universe: ["EURUSD", "EURGBP", "USDJPY"],
    column_schema: [
      { name: "timestamp", type: "datetime", required: true },
      { name: "open_bid", type: "number", required: true },
      { name: "open_ask", type: "number", required: true },
      { name: "high_bid", type: "number", required: true },
      { name: "high_ask", type: "number", required: true },
      { name: "low_bid", type: "number", required: true },
      { name: "low_ask", type: "number", required: true },
      { name: "close_bid", type: "number", required: true },
      { name: "close_ask", type: "number", required: true }
    ],
    content_hash: "sha256:gate1-hist-data-bid-ask-fixture-001"
  });

export const gate1StrategyVersionFixture: Gate1StrategyVersionContract =
  Gate1StrategyVersionContractSchema.parse({
    strategy_version_id: "gate1-strategy-version-fixture-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
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
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
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
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
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
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
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

export const gate1LongDirectionalPnlFixture: Gate1DirectionalPnlContract =
  Gate1DirectionalPnlContractSchema.parse({
    directional_pnl_check_id: "gate1-directional-pnl-long-fixture-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    instrument: "EURUSD",
    asset_class_scope: "forex spot synthetic fixture",
    account_currency: "USD",
    quote_currency: "USD",
    position_direction: "long",
    entry_price: 1.1,
    entry_price_side: "ask",
    exit_price: 1.101,
    exit_price_side: "bid",
    quantity: 1,
    quantity_unit: "standard_lot",
    contract_size: 100000,
    gross_pnl_quote_currency: 100,
    conversion_rate_to_account_currency: 1,
    gross_pnl_account_currency: 100,
    total_declared_costs_account_currency: 7,
    net_pnl_account_currency: 93,
    formula_label: "long ask-entry bid-exit directional PnL fixture",
    assumptions: ["Synthetic EURUSD fixture; no external account connectivity or order route."],
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate1ShortDirectionalPnlFixture: Gate1DirectionalPnlContract =
  Gate1DirectionalPnlContractSchema.parse({
    ...gate1LongDirectionalPnlFixture,
    directional_pnl_check_id: "gate1-directional-pnl-short-fixture-001",
    position_direction: "short",
    entry_price: 1.101,
    entry_price_side: "bid",
    exit_price: 1.1,
    exit_price_side: "ask",
    formula_label: "short bid-entry ask-exit directional PnL fixture"
  });

export const gate1CrossCurrencyDirectionalPnlFixture: Gate1DirectionalPnlContract =
  Gate1DirectionalPnlContractSchema.parse({
    ...gate1LongDirectionalPnlFixture,
    directional_pnl_check_id: "gate1-directional-pnl-cross-fixture-001",
    instrument: "EURGBP",
    quote_currency: "GBP",
    entry_price: 0.86,
    exit_price: 0.861,
    gross_pnl_quote_currency: 100,
    conversion_rate_to_account_currency: 1.25,
    gross_pnl_account_currency: 125,
    total_declared_costs_account_currency: 8,
    net_pnl_account_currency: 117,
    formula_label: "cross-currency quote PnL converted into account currency",
    assumptions: ["Synthetic EURGBP fixture; GBP quote PnL is converted into USD."]
  });

export const gate1JpyPrecisionDirectionalPnlFixture: Gate1DirectionalPnlContract =
  Gate1DirectionalPnlContractSchema.parse({
    ...gate1LongDirectionalPnlFixture,
    directional_pnl_check_id: "gate1-directional-pnl-jpy-fixture-001",
    instrument: "USDJPY",
    quote_currency: "JPY",
    entry_price: 150,
    exit_price: 150.1,
    gross_pnl_quote_currency: 10000,
    conversion_rate_to_account_currency: 0.0066667,
    gross_pnl_account_currency: 66.667,
    total_declared_costs_account_currency: 6,
    net_pnl_account_currency: 60.667,
    formula_label: "JPY quote-currency PnL converted into account currency",
    assumptions: ["Synthetic USDJPY fixture; JPY quote PnL is converted into USD."]
  });

export const gate1PnlEvidenceReferenceFixture: Gate1PnlEvidenceReferenceContract =
  Gate1PnlEvidenceReferenceContractSchema.parse({
    pnl_evidence_reference_id: "gate1-pnl-reference-fixture-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    backtest_result_id: gate1BacktestResultFixture.backtest_result_id,
    directional_pnl_check_ids: [
      gate1LongDirectionalPnlFixture.directional_pnl_check_id,
      gate1ShortDirectionalPnlFixture.directional_pnl_check_id,
      gate1CrossCurrencyDirectionalPnlFixture.directional_pnl_check_id,
      gate1JpyPrecisionDirectionalPnlFixture.directional_pnl_check_id
    ],
    reference_scope: "backtest_result_to_directional_pnl",
    rationale: "Synthetic reference from backtest result fixture to directional PnL fixtures.",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate1PnlEvidenceBundleFixture: Gate1PnlEvidenceBundleContract =
  Gate1PnlEvidenceBundleContractSchema.parse({
    pnl_evidence_bundle_id: "gate1-pnl-bundle-fixture-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    pnl_evidence_reference_id: gate1PnlEvidenceReferenceFixture.pnl_evidence_reference_id,
    directional_pnl_check_ids: gate1PnlEvidenceReferenceFixture.directional_pnl_check_ids,
    included_instruments: ["EURUSD", "EURGBP", "USDJPY"],
    includes_cross_currency_case: true,
    includes_jpy_precision_case: true,
    declared_cost_consistency_status: "checked",
    limitations: ["Synthetic schema-only bundle; not market evidence or strategy approval."],
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate1SpreadBidAskAlignmentFixture: Gate1SpreadBidAskAlignmentContract =
  Gate1SpreadBidAskAlignmentContractSchema.parse({
    spread_bid_ask_alignment_id: "gate1-spread-bid-ask-alignment-fixture-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    historical_data_snapshot_id:
      gate1BidAskHistoricalDataSnapshotFixture.historical_data_snapshot_id,
    fees_and_slippage_assumption_id:
      gate1FeesAndSlippageAssumptionFixture.fees_and_slippage_assumption_id,
    bid_ask_columns_present: true,
    spread_assumption_declared: true,
    alignment_status: "checked",
    limitations: ["Synthetic spread alignment fixture; not market evidence."],
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate1CandleTimingIntegrityFixture: Gate1CandleTimingIntegrityContract =
  Gate1CandleTimingIntegrityContractSchema.parse({
    candle_timing_integrity_id: "gate1-candle-timing-fixture-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    historical_data_snapshot_id:
      gate1BidAskHistoricalDataSnapshotFixture.historical_data_snapshot_id,
    timestamp_timezone: "UTC",
    candle_close_policy: "Signals may reference only fully closed candles.",
    session_calendar_policy: "Synthetic fixture uses continuous weekday sessions.",
    missing_candle_policy: "Missing required candles block evidence use.",
    timing_status: "checked",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate1LookaheadBiasBlockerFixture: Gate1LookaheadBiasBlockerContract =
  Gate1LookaheadBiasBlockerContractSchema.parse({
    lookahead_bias_blocker_id: "gate1-lookahead-blocker-fixture-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    strategy_version_id: gate1StrategyVersionFixture.strategy_version_id,
    uses_only_closed_candles: true,
    indicator_warmup_policy: "Warmup candles cannot produce evidence rows.",
    higher_timeframe_policy: "Higher timeframe values are usable only after close.",
    blocker_status: "checked",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate1SameCandleAmbiguityFixture: Gate1SameCandleAmbiguityContract =
  Gate1SameCandleAmbiguityContractSchema.parse({
    same_candle_ambiguity_id: "gate1-same-candle-ambiguity-fixture-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    backtest_result_id: gate1BacktestResultFixture.backtest_result_id,
    ambiguity_policy:
      "Same-candle stop and target hits are ambiguous unless intrabar order is known.",
    stop_target_sequence_policy: "Ambiguous cases are blocked from evidence use.",
    ambiguity_status: "checked",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate1BacktestAssumptionRiskRegisterFixture: Gate1BacktestAssumptionRiskRegisterContract =
  Gate1BacktestAssumptionRiskRegisterContractSchema.parse({
    backtest_assumption_risk_register_id: "gate1-assumption-risk-register-fixture-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    risks: [
      {
        risk_id: "gate1-risk-lookahead-fixture-001",
        area: "lookahead bias",
        severity: "high",
        description: "Using unfinished candle values can overstate evidence quality.",
        mitigation: "Require closed-candle and warmup policies before evidence use.",
        disposition: "mitigated"
      },
      {
        risk_id: "gate1-risk-same-candle-fixture-001",
        area: "same-candle sequencing",
        severity: "medium",
        description: "Stop and target ordering is ambiguous within a single OHLC candle.",
        mitigation: "Block ambiguous cases unless intrabar order is known.",
        disposition: "mitigated"
      }
    ],
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
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
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
