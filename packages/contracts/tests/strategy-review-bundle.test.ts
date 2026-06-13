import { describe, expect, it } from "vitest";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  StrategyReviewBundleSchema,
  type StrategyDecisionTrace,
  type StrategyReviewBundle
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

function createTrace(): StrategyDecisionTrace {
  return {
    trace_id: "trace-001",
    strategy_id: "strategy-001",
    strategy_version: "v0.1.0",
    financial_gate: "G0_RESEARCH",
    append_only: true,
    events: STRATEGY_DECISION_TRACE_EVENT_ORDER.map((eventType, index) => {
      const sequence = index + 1;

      return {
        trace_event_id: `trace-event-${sequence}`,
        trace_id: "trace-001",
        sequence,
        event_type: eventType,
        artifact_ref: {
          id: [
            "strategy-001",
            "data-001",
            "backtest-001",
            "metric-001",
            "risk-001",
            "decision-001",
            "outcome-001",
            "learning-001"
          ][index] as string,
          kind: eventType,
          version: "v0.1.0"
        },
        previous_event_hash: index === 0 ? null : `hash-${index}`,
        event_hash: `hash-${sequence}`,
        recorded_at: recordedAt
      };
    }),
    created_at: recordedAt,
    sealed_at: recordedAt
  };
}

function createBundle(overrides: Partial<StrategyReviewBundle> = {}): StrategyReviewBundle {
  const metricSummary = {
    total_return_pct: 0,
    max_drawdown_pct: 0,
    average_win_loss_ratio: 0,
    trade_count: 0,
    warnings: ["synthetic research fixture"]
  };

  return {
    strategy_review_bundle_id: "bundle-001",
    financial_gate: "G0_RESEARCH",
    strategy_idea: {
      strategy_id: "strategy-001",
      title: "Synthetic review fixture",
      hypothesis: "Synthetic hypothesis used only for contract validation.",
      author: "GateZero Test",
      assumptions: [
        {
          name: "fixture assumption",
          value: "synthetic data only",
          source: "unit test"
        }
      ],
      created_at: recordedAt
    },
    data_snapshot: {
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
      captured_at: recordedAt,
      quality_warnings: []
    },
    backtest_result: {
      backtest_result_id: "backtest-001",
      strategy_id: "strategy-001",
      strategy_version: "v0.1.0",
      data_source_name: "synthetic-fixture",
      data_source_version: "fixture-v1",
      symbol_universe: ["SYNTH"],
      date_range: {
        start: "2025-01-01",
        end: "2025-01-31"
      },
      timeframe: "1d",
      fee_model: "synthetic fixed fee",
      slippage_model: "synthetic fixed slippage",
      starting_capital: 10000,
      position_sizing_rule: "research-only fixed sizing",
      parameters: {
        enabled: true
      },
      trade_list: [],
      equity_curve: [{ timestamp: recordedAt, value: 10000 }],
      drawdown_curve: [{ timestamp: recordedAt, value: 0 }],
      metric_summary: metricSummary,
      generated_warnings: ["synthetic research fixture"],
      verdict: "research_only",
      created_at: recordedAt
    },
    metric_report: {
      metric_report_id: "metric-001",
      backtest_result_id: "backtest-001",
      strategy_id: "strategy-001",
      strategy_version: "v0.1.0",
      metrics: metricSummary,
      assumptions: [
        {
          name: "fixture assumption",
          value: "synthetic data only",
          source: "unit test"
        }
      ],
      risk_flags: [
        {
          code: "SYNTHETIC_FIXTURE",
          severity: "low",
          description: "Fixture is synthetic and not market evidence."
        }
      ],
      generated_at: recordedAt
    },
    risk_review: {
      risk_review_id: "risk-001",
      strategy_id: "strategy-001",
      strategy_version: "v0.1.0",
      financial_gate_requested: "G0_RESEARCH",
      verdict: "research_only",
      approved: true,
      blocking_findings: [],
      required_controls: ["remain at Gate 0"],
      max_position_size_pct: 0,
      max_daily_loss_pct: 0,
      max_weekly_loss_pct: 0,
      max_drawdown_before_freeze_pct: 0,
      kill_switch_required: true,
      human_approval_required: true,
      reviewer: "Risk Officer",
      reviewed_at: recordedAt
    },
    operator_decision: {
      operator_decision_id: "decision-001",
      strategy_id: "strategy-001",
      strategy_version: "v0.1.0",
      decision: "keep_research_only",
      rationale: "Research-only fixture is retained for validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: "outcome-001",
      strategy_id: "strategy-001",
      strategy_version: "v0.1.0",
      outcome: "research_only_recorded",
      reasons: ["Research-only fixture accepted for validation."],
      linked_operator_decision_id: "decision-001",
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: "learning-001",
      source_outcome_log_id: "outcome-001",
      summary: "Keep a regression test around full review bundle assembly.",
      evidence_used: ["outcome-001"],
      updates_rules: false,
      updates_tests: true,
      updates_docs: false,
      risk_limit_change: "none",
      autonomy_change: "none",
      created_at: recordedAt
    },
    trace: createTrace(),
    assembled_at: recordedAt,
    ...overrides
  };
}

describe("strategy review bundle contract", () => {
  it("accepts a complete Gate 0 research-only review bundle", () => {
    expect(StrategyReviewBundleSchema.parse(createBundle()).financial_gate).toBe("G0_RESEARCH");
  });

  it("rejects mismatched data snapshot metadata", () => {
    expect(() =>
      StrategyReviewBundleSchema.parse(
        createBundle({
          backtest_result: {
            ...createBundle().backtest_result,
            data_source_version: "different-version"
          }
        })
      )
    ).toThrow();
  });

  it("rejects metric reports that do not match the backtest summary", () => {
    const bundle = createBundle();

    expect(() =>
      StrategyReviewBundleSchema.parse({
        ...bundle,
        metric_report: {
          ...bundle.metric_report,
          metrics: {
            ...bundle.metric_report.metrics,
            trade_count: 1
          }
        }
      })
    ).toThrow();
  });

  it("rejects operator decisions that record a paper candidate", () => {
    const bundle = createBundle();

    expect(() =>
      StrategyReviewBundleSchema.parse({
        ...bundle,
        risk_review: {
          ...bundle.risk_review,
          verdict: "blocked_by_risk",
          approved: false,
          blocking_findings: ["synthetic risk block"]
        },
        operator_decision: {
          ...bundle.operator_decision,
          decision: "record_paper_candidate"
        }
      })
    ).toThrow();
  });

  it("rejects trace artifact references that do not match bundle artifacts", () => {
    const bundle = createBundle();
    const trace = structuredClone(bundle.trace);
    const metricEvent = trace.events[3];

    if (!metricEvent) {
      throw new Error("fixture must include metric report trace event");
    }

    trace.events[3] = {
      ...metricEvent,
      artifact_ref: {
        ...metricEvent.artifact_ref,
        id: "different-metric"
      }
    };

    expect(() =>
      StrategyReviewBundleSchema.parse({
        ...bundle,
        trace
      })
    ).toThrow();
  });
});
