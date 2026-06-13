import {
  BacktestResultSchema,
  DataSnapshotSchema,
  RiskReviewSchema,
  type BacktestResult,
  type DataSnapshot,
  type RiskReview
} from "../../contracts/src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

export type BenchmarkFixtureKind =
  | "biased_backtest"
  | "fee_slippage"
  | "missing_data"
  | "risk_veto"
  | "low_trade_count";

export interface BenchmarkFixture<TPayload> {
  readonly fixture_id: string;
  readonly kind: BenchmarkFixtureKind;
  readonly name: string;
  readonly expected_failure_tags: readonly string[];
  readonly payload: TPayload;
}

export function createSyntheticBacktestResult(
  overrides: Partial<BacktestResult> = {}
): BacktestResult {
  return BacktestResultSchema.parse({
    backtest_result_id: "bt-fixture-001",
    strategy_id: "strategy-fixture-001",
    strategy_version: "v0.1.0",
    data_source_name: "synthetic-fixture",
    data_source_version: "fixture-v1",
    symbol_universe: ["SYNTH"],
    date_range: {
      start: "2025-01-01",
      end: "2025-01-31"
    },
    timeframe: "1d",
    fee_model: "fixed synthetic fee model",
    slippage_model: "fixed synthetic slippage model",
    starting_capital: 10000,
    position_sizing_rule: "fixed fractional research sizing",
    parameters: {
      lookback_days: 10
    },
    trade_list: [
      {
        trade_id: "trade-fixture-001",
        opened_at: recordedAt,
        closed_at: "2026-01-02T00:00:00.000Z",
        symbol: "SYNTH",
        direction: "long",
        quantity: 1,
        entry_price: 100,
        exit_price: 99,
        fees: 1,
        slippage: 0.5,
        rationale: "synthetic fixture record"
      }
    ],
    equity_curve: [
      {
        timestamp: recordedAt,
        value: 10000
      },
      {
        timestamp: "2026-01-02T00:00:00.000Z",
        value: 9998.5
      }
    ],
    drawdown_curve: [
      {
        timestamp: recordedAt,
        value: 0
      },
      {
        timestamp: "2026-01-02T00:00:00.000Z",
        value: 0.015
      }
    ],
    metric_summary: {
      total_return_pct: -0.015,
      max_drawdown_pct: 0.015,
      average_win_loss_ratio: 0,
      trade_count: 1,
      warnings: ["synthetic low trade count"]
    },
    generated_warnings: ["synthetic low trade count"],
    verdict: "insufficient_evidence",
    created_at: recordedAt,
    ...overrides
  });
}

export const feeSlippageFixture: BenchmarkFixture<BacktestResult> = {
  fixture_id: "fixture-fee-slippage-001",
  kind: "fee_slippage",
  name: "Synthetic backtest with explicit fee and slippage assumptions",
  expected_failure_tags: [],
  payload: createSyntheticBacktestResult()
};

export const biasedBacktestFixture: BenchmarkFixture<BacktestResult> = {
  fixture_id: "fixture-biased-backtest-001",
  kind: "biased_backtest",
  name: "Synthetic backtest requiring bias review",
  expected_failure_tags: ["possible_future_data", "requires_bias_review"],
  payload: createSyntheticBacktestResult({
    backtest_result_id: "bt-fixture-biased-001",
    generated_warnings: ["possible future-data dependency", "requires bias review"],
    metric_summary: {
      total_return_pct: -0.015,
      max_drawdown_pct: 0.015,
      average_win_loss_ratio: 0,
      trade_count: 1,
      warnings: ["possible future-data dependency", "requires bias review"]
    },
    verdict: "requires_revision"
  })
};

export const lowTradeCountFixture: BenchmarkFixture<BacktestResult> = {
  fixture_id: "fixture-low-trade-count-001",
  kind: "low_trade_count",
  name: "Synthetic backtest with insufficient trade count",
  expected_failure_tags: ["low_trade_count"],
  payload: createSyntheticBacktestResult({
    backtest_result_id: "bt-fixture-low-count-001",
    generated_warnings: ["low trade count"],
    metric_summary: {
      total_return_pct: -0.015,
      max_drawdown_pct: 0.015,
      average_win_loss_ratio: 0,
      trade_count: 1,
      warnings: ["low trade count"]
    },
    verdict: "insufficient_evidence"
  })
};

export const missingDataFixture: BenchmarkFixture<DataSnapshot> = {
  fixture_id: "fixture-missing-data-001",
  kind: "missing_data",
  name: "Synthetic data snapshot with missing records",
  expected_failure_tags: ["missing_data"],
  payload: DataSnapshotSchema.parse({
    data_snapshot_id: "data-fixture-missing-001",
    source_name: "synthetic-fixture",
    source_version: "fixture-v1",
    symbol_universe: ["SYNTH"],
    date_range: {
      start: "2025-01-01",
      end: "2025-01-31"
    },
    timeframe: "1d",
    timezone: "UTC",
    missing_data_behavior: "flag and block review until explained",
    corporate_action_policy: "not applicable for synthetic fixture",
    data_adjustment_policy: "not_applicable",
    captured_at: recordedAt,
    quality_warnings: ["missing records in synthetic fixture"]
  })
};

export const riskVetoFixture: BenchmarkFixture<RiskReview> = {
  fixture_id: "fixture-risk-veto-001",
  kind: "risk_veto",
  name: "Synthetic risk review with blocking findings",
  expected_failure_tags: ["risk_blocked"],
  payload: RiskReviewSchema.parse({
    risk_review_id: "risk-fixture-001",
    strategy_id: "strategy-fixture-001",
    strategy_version: "v0.1.0",
    financial_gate_requested: "G0_RESEARCH",
    verdict: "blocked_by_risk",
    approved: false,
    blocking_findings: ["maximum loss condition is not sufficiently defined"],
    required_controls: ["define invalidation and review conditions"],
    max_position_size_pct: 0.25,
    max_daily_loss_pct: 1,
    max_weekly_loss_pct: 3,
    max_drawdown_before_freeze_pct: 5,
    kill_switch_required: true,
    human_approval_required: true,
    reviewer: "Risk Officer",
    reviewed_at: recordedAt
  })
};

export const benchmarkFixtures = [
  feeSlippageFixture,
  biasedBacktestFixture,
  lowTradeCountFixture,
  missingDataFixture,
  riskVetoFixture
] as const;
