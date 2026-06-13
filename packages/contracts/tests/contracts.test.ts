import { describe, expect, it } from "vitest";
import {
  BacktestResultSchema,
  DataSnapshotSchema,
  FinancialGateSchema,
  LearningEventSchema,
  OperatorDecisionSchema,
  RiskReviewSchema,
  RiskVerdictSchema,
  StrategyReviewDecisionEventSchema
} from "../src/index.js";

const reviewedAt = "2026-01-01T00:00:00.000Z";

const assumption = {
  name: "fee assumption",
  value: "0.10 percent per transaction",
  source: "synthetic fixture"
};

const riskFlag = {
  code: "LOW_SAMPLE_SIZE",
  severity: "medium",
  description: "Fixture has a small number of records"
};

const backtestResult = {
  backtest_result_id: "bt-001",
  strategy_id: "strat-001",
  strategy_version: "v0.1.0",
  data_source_name: "synthetic-fixture",
  data_source_version: "fixture-v1",
  symbol_universe: ["SYNTH"],
  date_range: {
    start: "2025-01-01",
    end: "2025-01-31"
  },
  timeframe: "1d",
  fee_model: "fixed percentage fee",
  slippage_model: "fixed basis point slippage",
  starting_capital: 10000,
  position_sizing_rule: "fixed fractional research sizing",
  parameters: {
    lookback_days: 10,
    enabled: true
  },
  trade_list: [
    {
      trade_id: "trade-001",
      opened_at: reviewedAt,
      closed_at: "2026-01-02T00:00:00.000Z",
      symbol: "SYNTH",
      direction: "long",
      quantity: 1,
      entry_price: 100,
      exit_price: 101,
      fees: 1,
      slippage: 0.5,
      rationale: "fixture trade for contract validation"
    }
  ],
  equity_curve: [{ timestamp: reviewedAt, value: 10000 }],
  drawdown_curve: [{ timestamp: reviewedAt, value: 0 }],
  metric_summary: {
    total_return_pct: 0.5,
    max_drawdown_pct: 1,
    average_win_loss_ratio: 1.2,
    trade_count: 1,
    warnings: ["low sample size"]
  },
  generated_warnings: ["low sample size"],
  verdict: "research_only",
  created_at: reviewedAt
};

const dataSnapshot = {
  data_snapshot_id: "data-001",
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
  captured_at: reviewedAt,
  quality_warnings: []
};

describe("Gate 0 contracts", () => {
  it("allows only the Gate 0 financial gate", () => {
    expect(FinancialGateSchema.parse("G0_RESEARCH")).toBe("G0_RESEARCH");
    expect(() => FinancialGateSchema.parse("G1_BACKTESTING")).toThrow();
  });

  it("validates a reproducible backtest result with drawdown context", () => {
    expect(BacktestResultSchema.parse(backtestResult).metric_summary.max_drawdown_pct).toBe(1);
  });

  it("requires explicit data snapshot metadata", () => {
    expect(DataSnapshotSchema.parse(dataSnapshot).timezone).toBe("UTC");

    expect(() =>
      DataSnapshotSchema.parse({
        ...dataSnapshot,
        timezone: undefined
      })
    ).toThrow();
  });

  it("rejects backtest results without runtime-required fields", () => {
    const invalidBacktest = {
      ...backtestResult,
      fee_model: undefined
    };

    expect(() => BacktestResultSchema.parse(invalidBacktest)).toThrow();
  });

  it("models risk blocking as hard state", () => {
    const blockedReview = {
      risk_review_id: "risk-001",
      strategy_id: "strat-001",
      strategy_version: "v0.1.0",
      financial_gate_requested: "G0_RESEARCH",
      verdict: "blocked_by_risk",
      approved: false,
      blocking_findings: ["drawdown assumption is not reviewable"],
      required_controls: ["revise drawdown evidence"],
      max_position_size_pct: 0.25,
      max_daily_loss_pct: 1,
      max_weekly_loss_pct: 3,
      max_drawdown_before_freeze_pct: 5,
      kill_switch_required: true,
      human_approval_required: true,
      reviewer: "Risk Officer",
      reviewed_at: reviewedAt
    };

    expect(RiskReviewSchema.parse(blockedReview).approved).toBe(false);
  });

  it("rejects blocked risk reviews that claim approval", () => {
    const invalidReview = {
      risk_review_id: "risk-001",
      strategy_id: "strat-001",
      strategy_version: "v0.1.0",
      financial_gate_requested: "G0_RESEARCH",
      verdict: "blocked_by_risk",
      approved: true,
      blocking_findings: ["risk veto"],
      required_controls: ["revise"],
      max_position_size_pct: 0.25,
      max_daily_loss_pct: 1,
      max_weekly_loss_pct: 3,
      max_drawdown_before_freeze_pct: 5,
      kill_switch_required: true,
      human_approval_required: true,
      reviewer: "Risk Officer",
      reviewed_at: reviewedAt
    };

    expect(() => RiskReviewSchema.parse(invalidReview)).toThrow();
  });

  it("does not permit live readiness verdicts in Phase 0", () => {
    expect(() => RiskVerdictSchema.parse("live_candidate")).toThrow();
  });

  it("blocks paper-candidate risk verdict validation in Phase 0", () => {
    expect(() =>
      RiskReviewSchema.parse({
        risk_review_id: "risk-001",
        strategy_id: "strat-001",
        strategy_version: "v0.1.0",
        financial_gate_requested: "G0_RESEARCH",
        verdict: "paper_candidate",
        approved: true,
        blocking_findings: [],
        required_controls: ["future phase blocked"],
        max_position_size_pct: 0,
        max_daily_loss_pct: 0,
        max_weekly_loss_pct: 0,
        max_drawdown_before_freeze_pct: 0,
        kill_switch_required: true,
        human_approval_required: true,
        reviewer: "Risk Officer",
        reviewed_at: reviewedAt
      })
    ).toThrow();
  });

  it("rejects operator decisions that imply unsupported action", () => {
    expect(() =>
      OperatorDecisionSchema.parse({
        operator_decision_id: "decision-001",
        strategy_id: "strat-001",
        strategy_version: "v0.1.0",
        decision: "execute_now",
        rationale: "not allowed",
        decided_by: "operator",
        decided_at: reviewedAt
      })
    ).toThrow();
  });

  it("requires assumptions and risk flags on the strategy review decision event", () => {
    const decisionEvent = {
      strategy_review_decision_event_id: "event-001",
      strategy_idea_ref: { id: "idea-001", version: "v0.1.0" },
      data_snapshot_ref: { id: "data-001", version: "fixture-v1" },
      backtest_result_ref: { id: "bt-001", version: "v0.1.0" },
      metric_report_ref: { id: "metric-001", version: "v0.1.0" },
      risk_review_ref: { id: "risk-001", version: "v0.1.0" },
      operator_decision_ref: { id: "decision-001", version: "v0.1.0" },
      financial_gate: "G0_RESEARCH",
      maturity_level: "risk_reviewed",
      assumptions: [assumption],
      risk_flags: [riskFlag],
      final_verdict: "research_only",
      recorded_at: reviewedAt
    };

    expect(StrategyReviewDecisionEventSchema.parse(decisionEvent).final_verdict).toBe(
      "research_only"
    );

    expect(() =>
      StrategyReviewDecisionEventSchema.parse({
        ...decisionEvent,
        assumptions: []
      })
    ).toThrow();

    expect(() =>
      StrategyReviewDecisionEventSchema.parse({
        ...decisionEvent,
        risk_flags: []
      })
    ).toThrow();
  });

  it("prevents learning events from changing risk or autonomy", () => {
    const learningEvent = {
      learning_event_id: "learn-001",
      source_outcome_log_id: "outcome-001",
      summary: "Add a regression fixture for a rejected strategy review.",
      evidence_used: ["outcome-001"],
      updates_rules: false,
      updates_tests: true,
      updates_docs: false,
      risk_limit_change: "none",
      autonomy_change: "none",
      created_at: reviewedAt
    };

    expect(LearningEventSchema.parse(learningEvent).autonomy_change).toBe("none");

    expect(() =>
      LearningEventSchema.parse({
        ...learningEvent,
        risk_limit_change: "increase"
      })
    ).toThrow();
  });
});
