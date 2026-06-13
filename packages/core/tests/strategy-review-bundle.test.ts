import { describe, expect, it } from "vitest";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  type StrategyDecisionTrace,
  type StrategyReviewBundle
} from "../../contracts/src/index.js";
import {
  assertCanonicalStrategyDecisionTraceHashes,
  buildCanonicalStrategyDecisionTrace,
  createImmutableStrategyReviewBundle,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

function createCanonicalTrace(): StrategyDecisionTrace {
  const artifactIds = [
    "strategy-001",
    "data-001",
    "backtest-001",
    "metric-001",
    "risk-001",
    "decision-001",
    "outcome-001",
    "learning-001"
  ];

  const draft: StrategyDecisionTraceDraft = {
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
          id: artifactIds[index] as string,
          kind: eventType,
          version: "v0.1.0"
        },
        recorded_at: recordedAt
      };
    }),
    created_at: recordedAt,
    sealed_at: recordedAt
  };

  return structuredClone(buildCanonicalStrategyDecisionTrace(draft)) as StrategyDecisionTrace;
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
    trace: createCanonicalTrace(),
    assembled_at: recordedAt,
    ...overrides
  };
}

describe("strategy review bundle assembly", () => {
  it("validates trace hashes and freezes an accepted bundle", () => {
    const bundle = createImmutableStrategyReviewBundle(createBundle());

    expect(() => assertCanonicalStrategyDecisionTraceHashes(bundle.trace)).not.toThrow();
    expect(Object.isFrozen(bundle)).toBe(true);
    expect(Object.isFrozen(bundle.trace.events[0])).toBe(true);
  });

  it("rejects trace hash tampering before assembly", () => {
    const bundle = createBundle();
    const backtestEvent = bundle.trace.events[2];

    if (!backtestEvent) {
      throw new Error("fixture must include backtest trace event");
    }

    bundle.trace.events[2] = {
      ...backtestEvent,
      artifact_ref: {
        ...backtestEvent.artifact_ref,
        id: "tampered-backtest"
      }
    };

    expect(() => createImmutableStrategyReviewBundle(bundle)).toThrow();
  });
});
