import { describe, expect, it } from "vitest";
import {
  Gate1FeesAndSlippageAssumptionContractSchema,
  Gate1DirectionalPnlContractSchema,
  Gate1BacktestResultContractSchema,
  Gate1BacktestAssumptionRiskRegisterContractSchema,
  Gate1CandleTimingIntegrityContractSchema,
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
} from "../src/index.js";

const createdAt = "2026-01-01T00:00:00.000Z";

function createHistoricalDataSnapshot(
  overrides: Partial<Gate1HistoricalDataSnapshotContract> = {}
): Gate1HistoricalDataSnapshotContract {
  return {
    historical_data_snapshot_id: "hist-data-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    dataset_source_label: "synthetic historical data fixture",
    instrument_universe: ["SYNTH"],
    timeframe: "1d",
    date_range: {
      start: "2025-01-01",
      end: "2025-01-31"
    },
    vendor_or_fixture_origin: "synthetic fixture",
    adjustment_policy: "not applicable for synthetic fixture",
    missing_data_policy: "reject missing required bars",
    timezone: "UTC",
    column_schema: [
      { name: "timestamp", type: "datetime", required: true },
      { name: "close", type: "number", required: true }
    ],
    content_hash: "sha256:hist-data-001",
    created_at: createdAt,
    external_access: false,
    execution_path: false,
    ...overrides
  };
}

function createStrategyVersion(
  overrides: Partial<Gate1StrategyVersionContract> = {}
): Gate1StrategyVersionContract {
  return {
    strategy_version_id: "strategy-version-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    strategy_id: "strategy-001",
    strategy_version: "v0.1.0",
    strategy_family: "synthetic fixture strategy",
    parameter_schema_version: "params-v1",
    parameters: {
      lookback_days: 10,
      enabled: true
    },
    source_logic_hash: "sha256:strategy-version-001",
    created_at: createdAt,
    author_label: "GateZero fixture",
    change_reason: "Fixture for contract validation",
    compatibility_constraints: ["research-only contract tests"],
    produces_action_recommendation: false,
    external_access: false,
    execution_path: false,
    ...overrides
  };
}

function createFeesAndSlippage(
  overrides: Partial<Gate1FeesAndSlippageAssumptionContract> = {}
): Gate1FeesAndSlippageAssumptionContract {
  return {
    fees_and_slippage_assumption_id: "cost-assumption-001",
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
    effective_date_range: {
      start: "2025-01-01",
      end: "2025-01-31"
    },
    rationale: "Synthetic cost assumption for deterministic contract validation.",
    source_label: "synthetic fixture",
    zero_cost_assumption: false,
    external_access: false,
    execution_path: false,
    ...overrides
  };
}

function createImmutableBacktestRecord(
  overrides: Partial<Gate1ImmutableBacktestRecordContract> = {}
): Gate1ImmutableBacktestRecordContract {
  return {
    immutable_backtest_record_id: "immutable-backtest-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    strategy_version_id: "strategy-version-001",
    historical_data_snapshot_id: "hist-data-001",
    fees_and_slippage_assumption_id: "cost-assumption-001",
    backtest_engine_version: "synthetic-engine-v1",
    input_hash: "sha256:inputs-001",
    output_hash: "sha256:outputs-001",
    created_at: createdAt,
    reproducibility_status: "not_checked",
    validation_status: "not_checked",
    operator_note: "Fixture record for schema-only validation.",
    external_access: false,
    execution_path: false,
    ...overrides
  };
}

function createBacktestResult(
  overrides: Partial<Gate1BacktestResultContract> = {}
): Gate1BacktestResultContract {
  return {
    backtest_result_id: "backtest-result-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    immutable_backtest_record_id: "immutable-backtest-001",
    metric_schema_version: "metrics-v1",
    period: {
      start: "2025-01-01",
      end: "2025-01-31"
    },
    observation_count: 23,
    trade_count: 2,
    gross_return_pct: 1.2,
    net_return_after_declared_costs_pct: 0.8,
    maximum_drawdown_pct: 2.5,
    exposure_summary: {
      max_gross_exposure_pct: 50,
      max_net_exposure_pct: 50,
      average_gross_exposure_pct: 25,
      notes: ["Synthetic exposure summary for contract validation."]
    },
    warnings: ["Synthetic fixture only; not market evidence."],
    validation_status: "not_checked",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: createdAt,
    ...overrides
  };
}

function createDirectionalPnl(
  overrides: Partial<Gate1DirectionalPnlContract> = {}
): Gate1DirectionalPnlContract {
  return {
    directional_pnl_check_id: "directional-pnl-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    instrument: "EURUSD",
    asset_class_scope: "forex spot fixture",
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
    formula_label: "directional price movement times quantity and contract size",
    assumptions: ["Synthetic EURUSD fixture; no external account connectivity or order route."],
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: createdAt,
    ...overrides
  };
}

function createPnlEvidenceReference(
  overrides: Partial<Gate1PnlEvidenceReferenceContract> = {}
): Gate1PnlEvidenceReferenceContract {
  return {
    pnl_evidence_reference_id: "pnl-reference-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    backtest_result_id: "backtest-result-001",
    directional_pnl_check_ids: ["directional-pnl-001", "directional-pnl-short-001"],
    reference_scope: "backtest_result_to_directional_pnl",
    rationale: "Connects schema-only PnL checks to the synthetic backtest result fixture.",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: createdAt,
    ...overrides
  };
}

function createPnlEvidenceBundle(
  overrides: Partial<Gate1PnlEvidenceBundleContract> = {}
): Gate1PnlEvidenceBundleContract {
  return {
    pnl_evidence_bundle_id: "pnl-bundle-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    pnl_evidence_reference_id: "pnl-reference-001",
    directional_pnl_check_ids: [
      "directional-pnl-001",
      "directional-pnl-short-001",
      "directional-pnl-cross-001",
      "directional-pnl-jpy-001"
    ],
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
    created_at: createdAt,
    ...overrides
  };
}

function createSpreadBidAskAlignment(
  overrides: Partial<Gate1SpreadBidAskAlignmentContract> = {}
): Gate1SpreadBidAskAlignmentContract {
  return {
    spread_bid_ask_alignment_id: "spread-alignment-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    historical_data_snapshot_id: "hist-data-bid-ask-001",
    fees_and_slippage_assumption_id: "cost-assumption-001",
    bid_ask_columns_present: true,
    spread_assumption_declared: true,
    alignment_status: "checked",
    limitations: ["Synthetic bid/ask alignment check; not market evidence."],
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: createdAt,
    ...overrides
  };
}

function createCandleTimingIntegrity(
  overrides: Partial<Gate1CandleTimingIntegrityContract> = {}
): Gate1CandleTimingIntegrityContract {
  return {
    candle_timing_integrity_id: "candle-timing-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    historical_data_snapshot_id: "hist-data-bid-ask-001",
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
    created_at: createdAt,
    ...overrides
  };
}

function createLookaheadBiasBlocker(
  overrides: Partial<Gate1LookaheadBiasBlockerContract> = {}
): Gate1LookaheadBiasBlockerContract {
  return {
    lookahead_bias_blocker_id: "lookahead-blocker-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    strategy_version_id: "strategy-version-001",
    uses_only_closed_candles: true,
    indicator_warmup_policy: "Warmup candles cannot produce evidence rows.",
    higher_timeframe_policy: "Higher timeframe values are usable only after close.",
    blocker_status: "checked",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: createdAt,
    ...overrides
  };
}

function createSameCandleAmbiguity(
  overrides: Partial<Gate1SameCandleAmbiguityContract> = {}
): Gate1SameCandleAmbiguityContract {
  return {
    same_candle_ambiguity_id: "same-candle-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    backtest_result_id: "backtest-result-001",
    ambiguity_policy:
      "Same-candle stop and target hits are ambiguous unless intrabar order is known.",
    stop_target_sequence_policy: "Ambiguous cases are blocked from evidence use.",
    ambiguity_status: "checked",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: createdAt,
    ...overrides
  };
}

function createBacktestAssumptionRiskRegister(
  overrides: Partial<Gate1BacktestAssumptionRiskRegisterContract> = {}
): Gate1BacktestAssumptionRiskRegisterContract {
  return {
    backtest_assumption_risk_register_id: "assumption-risk-register-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    risks: [
      {
        risk_id: "risk-lookahead-001",
        area: "lookahead bias",
        severity: "high",
        description: "Using unfinished candle values can overstate evidence quality.",
        mitigation: "Require closed-candle and warmup policies before evidence use.",
        disposition: "mitigated"
      },
      {
        risk_id: "risk-same-candle-001",
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
    created_at: createdAt,
    ...overrides
  };
}

function createReproducibilityCheck(
  overrides: Partial<Gate1ReproducibilityCheckContract> = {}
): Gate1ReproducibilityCheckContract {
  return {
    reproducibility_check_id: "repro-check-001",
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    contract_authority: "schema_only",
    strategy_version_id: "strategy-version-001",
    historical_data_snapshot_id: "hist-data-001",
    fees_and_slippage_assumption_id: "cost-assumption-001",
    backtest_engine_version: "synthetic-engine-v1",
    input_hash: "sha256:inputs-001",
    expected_output_hash: "sha256:outputs-001",
    rerun_output_hash: "sha256:outputs-001",
    environment_label: "local deterministic test fixture",
    reproducibility_status: "reproduced",
    evidence_usable: true,
    external_access: false,
    execution_path: false,
    checked_at: createdAt,
    ...overrides
  };
}

describe("Gate 1 historical backtest contracts", () => {
  it("validates a historical data snapshot contract without external access", () => {
    const snapshot = Gate1HistoricalDataSnapshotContractSchema.parse(
      createHistoricalDataSnapshot()
    );

    expect(snapshot.financial_gate).toBe("G1_BACKTESTING");
    expect(snapshot.scope).toBe("historical_backtesting_only");
    expect(snapshot.contract_authority).toBe("schema_only");
    expect(snapshot.external_access).toBe(false);
    expect(snapshot.execution_path).toBe(false);
  });

  it("requires deterministic historical data snapshot identity and content hash", () => {
    expect(() =>
      Gate1HistoricalDataSnapshotContractSchema.parse({
        ...createHistoricalDataSnapshot(),
        content_hash: ""
      })
    ).toThrow();
  });

  it("validates a strategy version contract without action recommendations", () => {
    const strategyVersion = Gate1StrategyVersionContractSchema.parse(createStrategyVersion());

    expect(strategyVersion.produces_action_recommendation).toBe(false);
    expect(strategyVersion.execution_path).toBe(false);
  });

  it("rejects strategy versions that imply action recommendations", () => {
    expect(() =>
      Gate1StrategyVersionContractSchema.parse({
        ...createStrategyVersion(),
        produces_action_recommendation: true
      })
    ).toThrow();
  });

  it("validates explicit fees and slippage assumptions", () => {
    const assumption = Gate1FeesAndSlippageAssumptionContractSchema.parse(createFeesAndSlippage());

    expect(assumption.fee_model_type).toBe("fixed_percentage");
    expect(assumption.slippage_model_type).toBe("fixed_bps");
  });

  it("requires a clear rationale for zero-cost assumptions", () => {
    expect(() =>
      Gate1FeesAndSlippageAssumptionContractSchema.parse(
        createFeesAndSlippage({
          zero_cost_assumption: true,
          rationale: "none"
        })
      )
    ).toThrow();
  });

  it("validates an immutable backtest record contract", () => {
    const record = Gate1ImmutableBacktestRecordContractSchema.parse(
      createImmutableBacktestRecord()
    );

    expect(record.reproducibility_status).toBe("not_checked");
    expect(record.validation_status).toBe("not_checked");
    expect(record.execution_path).toBe(false);
  });

  it("rejects immutable record self-revisions", () => {
    expect(() =>
      Gate1ImmutableBacktestRecordContractSchema.parse(
        createImmutableBacktestRecord({
          revision_of_record_id: "immutable-backtest-001"
        })
      )
    ).toThrow();
  });

  it("blocks scope escalation in every Gate 1 contract", () => {
    expect(() =>
      Gate1HistoricalDataSnapshotContractSchema.parse({
        ...createHistoricalDataSnapshot(),
        scope: "expanded"
      })
    ).toThrow();

    expect(() =>
      Gate1ImmutableBacktestRecordContractSchema.parse({
        ...createImmutableBacktestRecord(),
        financial_gate: "G2_EXECUTION"
      })
    ).toThrow();
  });

  it("validates a backtest result as evidence-only without approval or performance claims", () => {
    const result = Gate1BacktestResultContractSchema.parse(createBacktestResult());

    expect(result.evidence_only).toBe(true);
    expect(result.approval_claim).toBe(false);
    expect(result.performance_claim).toBe(false);
  });

  it("rejects backtest result approval or performance claims", () => {
    expect(() =>
      Gate1BacktestResultContractSchema.parse({
        ...createBacktestResult(),
        approval_claim: true
      })
    ).toThrow();

    expect(() =>
      Gate1BacktestResultContractSchema.parse({
        ...createBacktestResult(),
        performance_claim: true
      })
    ).toThrow();
  });

  it("validates long directional PnL using ask entry and bid exit", () => {
    const pnl = Gate1DirectionalPnlContractSchema.parse(createDirectionalPnl());

    expect(pnl.position_direction).toBe("long");
    expect(pnl.entry_price_side).toBe("ask");
    expect(pnl.exit_price_side).toBe("bid");
    expect(pnl.net_pnl_account_currency).toBe(93);
    expect(pnl.execution_path).toBe(false);
  });

  it("validates short directional PnL using bid entry and ask exit", () => {
    const pnl = Gate1DirectionalPnlContractSchema.parse(
      createDirectionalPnl({
        directional_pnl_check_id: "directional-pnl-short-001",
        position_direction: "short",
        entry_price: 1.101,
        entry_price_side: "bid",
        exit_price: 1.1,
        exit_price_side: "ask"
      })
    );

    expect(pnl.position_direction).toBe("short");
    expect(pnl.gross_pnl_quote_currency).toBe(100);
    expect(pnl.net_pnl_account_currency).toBe(93);
  });

  it("rejects directional PnL checks with the wrong bid or ask side", () => {
    expect(() =>
      Gate1DirectionalPnlContractSchema.parse(
        createDirectionalPnl({
          entry_price_side: "bid"
        })
      )
    ).toThrow();

    expect(() =>
      Gate1DirectionalPnlContractSchema.parse(
        createDirectionalPnl({
          position_direction: "short",
          entry_price: 1.101,
          exit_price: 1.1,
          entry_price_side: "ask",
          exit_price_side: "bid"
        })
      )
    ).toThrow();
  });

  it("rejects directional PnL checks with mismatched gross or net math", () => {
    expect(() =>
      Gate1DirectionalPnlContractSchema.parse(
        createDirectionalPnl({
          gross_pnl_quote_currency: 99
        })
      )
    ).toThrow();

    expect(() =>
      Gate1DirectionalPnlContractSchema.parse(
        createDirectionalPnl({
          net_pnl_account_currency: 100
        })
      )
    ).toThrow();
  });

  it("keeps directional PnL checks evidence-only without approval or performance claims", () => {
    expect(() =>
      Gate1DirectionalPnlContractSchema.parse({
        ...createDirectionalPnl(),
        evidence_only: false
      })
    ).toThrow();

    expect(() =>
      Gate1DirectionalPnlContractSchema.parse({
        ...createDirectionalPnl(),
        performance_claim: true
      })
    ).toThrow();
  });

  it("validates cross-currency directional PnL conversion", () => {
    const pnl = Gate1DirectionalPnlContractSchema.parse(
      createDirectionalPnl({
        directional_pnl_check_id: "directional-pnl-cross-001",
        instrument: "EURGBP",
        quote_currency: "GBP",
        entry_price: 0.86,
        exit_price: 0.861,
        gross_pnl_quote_currency: 100,
        conversion_rate_to_account_currency: 1.25,
        gross_pnl_account_currency: 125,
        total_declared_costs_account_currency: 8,
        net_pnl_account_currency: 117,
        formula_label: "cross-currency quote PnL converted into account currency"
      })
    );

    expect(pnl.instrument).toBe("EURGBP");
    expect(pnl.quote_currency).toBe("GBP");
    expect(pnl.gross_pnl_account_currency).toBe(125);
  });

  it("validates JPY-pair directional PnL precision without forex-major assumptions", () => {
    const pnl = Gate1DirectionalPnlContractSchema.parse(
      createDirectionalPnl({
        directional_pnl_check_id: "directional-pnl-jpy-001",
        instrument: "USDJPY",
        quote_currency: "JPY",
        entry_price: 150,
        exit_price: 150.1,
        gross_pnl_quote_currency: 10000,
        conversion_rate_to_account_currency: 0.0066667,
        gross_pnl_account_currency: 66.667,
        total_declared_costs_account_currency: 6,
        net_pnl_account_currency: 60.667,
        formula_label: "JPY quote-currency PnL converted into account currency"
      })
    );

    expect(pnl.instrument).toBe("USDJPY");
    expect(pnl.gross_pnl_quote_currency).toBe(10000);
    expect(pnl.net_pnl_account_currency).toBe(60.667);
  });

  it("validates backtest result to directional PnL evidence references", () => {
    const reference = Gate1PnlEvidenceReferenceContractSchema.parse(createPnlEvidenceReference());

    expect(reference.reference_scope).toBe("backtest_result_to_directional_pnl");
    expect(reference.directional_pnl_check_ids).toHaveLength(2);
    expect(reference.execution_path).toBe(false);
  });

  it("validates PnL evidence bundles with checked cost consistency", () => {
    const bundle = Gate1PnlEvidenceBundleContractSchema.parse(createPnlEvidenceBundle());

    expect(bundle.includes_cross_currency_case).toBe(true);
    expect(bundle.includes_jpy_precision_case).toBe(true);
    expect(bundle.declared_cost_consistency_status).toBe("checked");
  });

  it("rejects PnL evidence bundles when declared costs are not checked", () => {
    expect(() =>
      Gate1PnlEvidenceBundleContractSchema.parse(
        createPnlEvidenceBundle({
          declared_cost_consistency_status: "not_checked"
        })
      )
    ).toThrow();
  });

  it("rejects PnL evidence bundles with empty directional evidence references", () => {
    expect(() =>
      Gate1PnlEvidenceBundleContractSchema.parse({
        ...createPnlEvidenceBundle(),
        directional_pnl_check_ids: []
      })
    ).toThrow();
  });

  it("rejects PnL evidence bundles with approval or performance claims", () => {
    expect(() =>
      Gate1PnlEvidenceBundleContractSchema.parse({
        ...createPnlEvidenceBundle(),
        approval_claim: true
      })
    ).toThrow();

    expect(() =>
      Gate1PnlEvidenceBundleContractSchema.parse({
        ...createPnlEvidenceBundle(),
        performance_claim: true
      })
    ).toThrow();
  });

  it("validates spread assumption to bid/ask evidence alignment", () => {
    const alignment = Gate1SpreadBidAskAlignmentContractSchema.parse(createSpreadBidAskAlignment());

    expect(alignment.bid_ask_columns_present).toBe(true);
    expect(alignment.alignment_status).toBe("checked");
  });

  it("rejects unchecked spread assumption to bid/ask alignment", () => {
    expect(() =>
      Gate1SpreadBidAskAlignmentContractSchema.parse(
        createSpreadBidAskAlignment({
          alignment_status: "blocked"
        })
      )
    ).toThrow();
  });

  it("validates candle timing and timezone integrity assumptions", () => {
    const timing = Gate1CandleTimingIntegrityContractSchema.parse(createCandleTimingIntegrity());

    expect(timing.timestamp_timezone).toBe("UTC");
    expect(timing.timing_status).toBe("checked");
  });

  it("validates the lookahead-bias blocker contract", () => {
    const blocker = Gate1LookaheadBiasBlockerContractSchema.parse(createLookaheadBiasBlocker());

    expect(blocker.uses_only_closed_candles).toBe(true);
    expect(blocker.blocker_status).toBe("checked");
  });

  it("rejects lookahead-bias blockers that allow unfinished candle use", () => {
    expect(() =>
      Gate1LookaheadBiasBlockerContractSchema.parse({
        ...createLookaheadBiasBlocker(),
        uses_only_closed_candles: false
      })
    ).toThrow();
  });

  it("validates same-candle stop and target ambiguity assumptions", () => {
    const ambiguity = Gate1SameCandleAmbiguityContractSchema.parse(createSameCandleAmbiguity());

    expect(ambiguity.ambiguity_status).toBe("checked");
    expect(ambiguity.execution_path).toBe(false);
  });

  it("validates the Gate 1 backtest assumption risk register", () => {
    const riskRegister = Gate1BacktestAssumptionRiskRegisterContractSchema.parse(
      createBacktestAssumptionRiskRegister()
    );

    expect(riskRegister.risks).toHaveLength(2);
    expect(riskRegister.performance_claim).toBe(false);
  });

  it("validates a reproduced reproducibility check", () => {
    const check = Gate1ReproducibilityCheckContractSchema.parse(createReproducibilityCheck());

    expect(check.reproducibility_status).toBe("reproduced");
    expect(check.evidence_usable).toBe(true);
  });

  it("rejects mismatched reproducibility checks that claim reproduced status", () => {
    expect(() =>
      Gate1ReproducibilityCheckContractSchema.parse(
        createReproducibilityCheck({
          rerun_output_hash: "sha256:different-output",
          reproducibility_status: "reproduced"
        })
      )
    ).toThrow();
  });

  it("rejects evidence use unless reproducibility is reproduced", () => {
    expect(() =>
      Gate1ReproducibilityCheckContractSchema.parse(
        createReproducibilityCheck({
          rerun_output_hash: "sha256:different-output",
          reproducibility_status: "mismatch",
          evidence_usable: true
        })
      )
    ).toThrow();
  });
});
