import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  StrategyReviewBundleSchema,
  type StrategyDecisionTrace,
  type StrategyReviewBundle
} from "../../contracts/src/index.js";
import {
  buildCanonicalStrategyDecisionTrace,
  type StrategyDecisionTraceDraft
} from "../../core/src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";
const strategyId = "strategy-gate0-dry-run-001";
const strategyVersion = "v0.1.0";
const ids = {
  bundle: "bundle-gate0-dry-run-001",
  trace: "trace-gate0-dry-run-001",
  dataSnapshot: "data-gate0-dry-run-001",
  backtestResult: "backtest-gate0-dry-run-001",
  metricReport: "metric-gate0-dry-run-001",
  riskReview: "risk-gate0-dry-run-001",
  operatorDecision: "decision-gate0-dry-run-001",
  outcomeLog: "outcome-gate0-dry-run-001",
  learningEvent: "learning-gate0-dry-run-001"
} as const;

export interface Gate0DryRunScenarioFixture {
  readonly scenario_id: string;
  readonly name: string;
  readonly expected_loop_steps: readonly string[];
  readonly bundle: StrategyReviewBundle;
}

export const gate0DryRunScenarioFixture: Gate0DryRunScenarioFixture = {
  scenario_id: "scenario-gate0-dry-run-001",
  name: "Synthetic Gate 0 dry-run scenario requiring revision",
  expected_loop_steps: STRATEGY_DECISION_TRACE_EVENT_ORDER,
  bundle: createGate0DryRunScenarioBundle()
};

export const gate0BlockedFrictionDryRunScenarioFixture: Gate0DryRunScenarioFixture = {
  scenario_id: "scenario-gate0-dry-run-blocked-001",
  name: "Synthetic Gate 0 dry-run scenario with local loop-order friction",
  expected_loop_steps: [...STRATEGY_DECISION_TRACE_EVENT_ORDER].reverse(),
  bundle: gate0DryRunScenarioFixture.bundle
};

export const Gate0DryRunScenarioKey = {
  clear: "clear",
  friction: "friction"
} as const;

export type Gate0DryRunScenarioKey =
  (typeof Gate0DryRunScenarioKey)[keyof typeof Gate0DryRunScenarioKey];

export function listGate0DryRunScenarioKeys(): readonly Gate0DryRunScenarioKey[] {
  return [Gate0DryRunScenarioKey.clear, Gate0DryRunScenarioKey.friction];
}

export function selectGate0DryRunScenarioFixture(
  scenarioKey: Gate0DryRunScenarioKey = Gate0DryRunScenarioKey.clear
): Gate0DryRunScenarioFixture {
  const fixtureByKey: Record<Gate0DryRunScenarioKey, Gate0DryRunScenarioFixture> = {
    clear: gate0DryRunScenarioFixture,
    friction: gate0BlockedFrictionDryRunScenarioFixture
  };

  return fixtureByKey[scenarioKey];
}

export function parseGate0DryRunScenarioKey(input: string): Gate0DryRunScenarioKey {
  if (input === Gate0DryRunScenarioKey.clear || input === Gate0DryRunScenarioKey.friction) {
    return input;
  }

  throw new Error(`Unknown Gate 0 dry-run scenario key: ${input}`);
}

function createGate0DryRunScenarioBundle(): StrategyReviewBundle {
  const metricSummary = {
    total_return_pct: 0,
    max_drawdown_pct: 0,
    average_win_loss_ratio: 0,
    trade_count: 0,
    warnings: ["synthetic dry-run fixture requires revision"]
  };

  return StrategyReviewBundleSchema.parse({
    strategy_review_bundle_id: ids.bundle,
    financial_gate: "G0_RESEARCH",
    strategy_idea: {
      strategy_id: strategyId,
      title: "Synthetic Gate 0 dry-run strategy idea",
      hypothesis: "Synthetic evidence is assembled only to verify the local review loop.",
      author: "GateZero Test",
      assumptions: [
        {
          name: "synthetic input",
          value: "fixture data only",
          source: "TRD-037"
        }
      ],
      created_at: recordedAt
    },
    data_snapshot: {
      data_snapshot_id: ids.dataSnapshot,
      source_name: "synthetic-dry-run-fixture",
      source_version: "fixture-v1",
      symbol_universe: ["SYNTH"],
      date_range: {
        start: "2025-01-01",
        end: "2025-01-31"
      },
      timeframe: "1d",
      timezone: "UTC",
      missing_data_behavior: "flag for review before any later phase",
      corporate_action_policy: "not applicable for synthetic fixture",
      data_adjustment_policy: "not_applicable",
      captured_at: recordedAt,
      quality_warnings: ["synthetic fixture is not market evidence"]
    },
    backtest_result: {
      backtest_result_id: ids.backtestResult,
      strategy_id: strategyId,
      strategy_version: strategyVersion,
      data_source_name: "synthetic-dry-run-fixture",
      data_source_version: "fixture-v1",
      symbol_universe: ["SYNTH"],
      date_range: {
        start: "2025-01-01",
        end: "2025-01-31"
      },
      timeframe: "1d",
      fee_model: "synthetic fixed fee assumption",
      slippage_model: "synthetic fixed slippage assumption",
      starting_capital: 10000,
      position_sizing_rule: "research-only zero-allocation sizing",
      parameters: {
        enabled: true,
        fixture: "gate0-dry-run"
      },
      trade_list: [],
      equity_curve: [{ timestamp: recordedAt, value: 10000 }],
      drawdown_curve: [{ timestamp: recordedAt, value: 0 }],
      metric_summary: metricSummary,
      generated_warnings: ["synthetic dry-run fixture requires revision"],
      verdict: "requires_revision",
      created_at: recordedAt
    },
    metric_report: {
      metric_report_id: ids.metricReport,
      backtest_result_id: ids.backtestResult,
      strategy_id: strategyId,
      strategy_version: strategyVersion,
      metrics: metricSummary,
      assumptions: [
        {
          name: "synthetic input",
          value: "fixture data only",
          source: "TRD-037"
        }
      ],
      risk_flags: [
        {
          code: "SYNTHETIC_FIXTURE",
          severity: "medium",
          description: "Dry-run fixture exists only to verify local review mechanics."
        }
      ],
      generated_at: recordedAt
    },
    risk_review: {
      risk_review_id: ids.riskReview,
      strategy_id: strategyId,
      strategy_version: strategyVersion,
      financial_gate_requested: "G0_RESEARCH",
      verdict: "requires_revision",
      approved: false,
      blocking_findings: ["synthetic fixture does not establish actionable evidence"],
      required_controls: ["keep review local and revise evidence inputs"],
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
      operator_decision_id: ids.operatorDecision,
      strategy_id: strategyId,
      strategy_version: strategyVersion,
      decision: "revise",
      rationale: "Synthetic dry-run evidence requires revision before any later phase.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLog,
      strategy_id: strategyId,
      strategy_version: strategyVersion,
      outcome: "revision_requested",
      reasons: ["Synthetic dry-run evidence is retained only for local loop validation."],
      linked_operator_decision_id: ids.operatorDecision,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEvent,
      source_outcome_log_id: ids.outcomeLog,
      summary: "Keep a deterministic dry-run scenario around the local protected loop.",
      evidence_used: [ids.outcomeLog],
      updates_rules: false,
      updates_tests: true,
      updates_docs: false,
      risk_limit_change: "none",
      autonomy_change: "none",
      created_at: recordedAt
    },
    trace: createDryRunTrace(),
    assembled_at: recordedAt
  });
}

function createDryRunTrace(): StrategyDecisionTrace {
  const artifactIds = [
    strategyId,
    ids.dataSnapshot,
    ids.backtestResult,
    ids.metricReport,
    ids.riskReview,
    ids.operatorDecision,
    ids.outcomeLog,
    ids.learningEvent
  ];
  const draft: StrategyDecisionTraceDraft = {
    trace_id: ids.trace,
    strategy_id: strategyId,
    strategy_version: strategyVersion,
    financial_gate: "G0_RESEARCH",
    append_only: true,
    events: STRATEGY_DECISION_TRACE_EVENT_ORDER.map((eventType, index) => {
      const sequence = index + 1;

      return {
        trace_event_id: `${ids.trace}-event-${sequence}`,
        trace_id: ids.trace,
        sequence,
        event_type: eventType,
        artifact_ref: {
          id: artifactIds[index] as string,
          kind: eventType,
          version: strategyVersion
        },
        recorded_at: recordedAt
      };
    }),
    created_at: recordedAt,
    sealed_at: recordedAt
  };

  return structuredClone(buildCanonicalStrategyDecisionTrace(draft)) as StrategyDecisionTrace;
}
