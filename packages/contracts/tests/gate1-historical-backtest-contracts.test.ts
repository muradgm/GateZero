import { describe, expect, it } from "vitest";
import {
  Gate1FeesAndSlippageAssumptionContractSchema,
  Gate1BacktestResultContractSchema,
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
} from "../src/index.js";

const createdAt = "2026-01-01T00:00:00.000Z";

function createHistoricalDataSnapshot(
  overrides: Partial<Gate1HistoricalDataSnapshotContract> = {}
): Gate1HistoricalDataSnapshotContract {
  return {
    historical_data_snapshot_id: "hist-data-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
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
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
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
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
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
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
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

function createReproducibilityCheck(
  overrides: Partial<Gate1ReproducibilityCheckContract> = {}
): Gate1ReproducibilityCheckContract {
  return {
    reproducibility_check_id: "repro-check-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
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

    expect(snapshot.financial_gate).toBe("G0_RESEARCH");
    expect(snapshot.scope).toBe("research_only");
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
        financial_gate: "G1_BACKTESTING"
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
