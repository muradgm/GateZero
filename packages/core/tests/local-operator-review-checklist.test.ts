import { readFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  type StrategyDecisionTrace,
  type StrategyReviewBundle
} from "../../contracts/src/index.js";
import {
  appendLocalReviewBundleLogRecord,
  appendLocalReviewBundleLogRecordWithGuard,
  buildCanonicalStrategyDecisionTrace,
  createLocalOperatorReviewChecklist,
  createLocalOperatorReviewChecklistQuery,
  createLocalOperatorReviewChecklistQueryWithGuard,
  createLocalOperatorReviewChecklists,
  createRedactedLocalReviewBundleSummary,
  type LocalReviewBundleSummary,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-review-checklist-"));
});

afterEach(async () => {
  await rm(temporaryDirectory, { recursive: true, force: true });
});

function createLogFilePath(): string {
  return path.join(temporaryDirectory, "review-bundles.ndjson");
}

function createSummary(
  overrides: Partial<LocalReviewBundleSummary> = {}
): LocalReviewBundleSummary {
  return {
    strategy_review_bundle_id: "bundle-001",
    trace_id: "trace-001",
    strategy_id: "strategy-alpha",
    strategy_version: "v0.1.0",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    artifact_ids: {
      strategy_idea_id: "strategy-alpha",
      data_snapshot_id: "data-001",
      backtest_result_id: "backtest-001",
      metric_report_id: "metric-001",
      risk_review_id: "risk-001",
      operator_decision_id: "decision-001",
      outcome_log_id: "outcome-001",
      learning_event_id: "learning-001"
    },
    data_context: {
      source_name: "synthetic-fixture",
      source_version: "fixture-v1",
      symbol_count: 1,
      date_start: "2025-01-01",
      date_end: "2025-01-31",
      timeframe: "1d",
      timezone: "UTC",
      missing_data_behavior: "flag and block review until explained",
      corporate_action_policy: "not applicable for synthetic fixture",
      data_adjustment_policy: "not_applicable",
      quality_warning_count: 1
    },
    metric_snapshot: {
      total_return_pct: 0,
      max_drawdown_pct: 0,
      average_win_loss_ratio: 0,
      trade_count: 0,
      warning_count: 1
    },
    risk_status: {
      verdict: "research_only",
      approved: true,
      blocking_finding_count: 0,
      required_control_count: 1,
      human_approval_required: true,
      kill_switch_required: true
    },
    operator_status: {
      decision: "keep_research_only",
      outcome: "research_only_recorded"
    },
    learning_status: {
      updates_rules: false,
      updates_tests: true,
      updates_docs: false,
      risk_limit_change: "none",
      autonomy_change: "none"
    },
    warning_text: ["synthetic warning"],
    blocking_findings: [],
    required_controls: ["remain at Gate 0"],
    hashes: {
      bundle_hash: "a".repeat(64),
      trace_hash: "b".repeat(64)
    },
    recorded_at: recordedAt,
    ...overrides
  };
}

function createCanonicalTrace(
  traceId: string,
  strategyId: string,
  strategyVersion: string,
  artifactIds: readonly string[]
): StrategyDecisionTrace {
  const draft: StrategyDecisionTraceDraft = {
    trace_id: traceId,
    strategy_id: strategyId,
    strategy_version: strategyVersion,
    financial_gate: "G0_RESEARCH",
    append_only: true,
    events: STRATEGY_DECISION_TRACE_EVENT_ORDER.map((eventType, index) => {
      const sequence = index + 1;

      return {
        trace_event_id: `${traceId}-event-${sequence}`,
        trace_id: traceId,
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

function createBundle(options: {
  readonly bundleId: string;
  readonly traceId: string;
  readonly strategyId: string;
  readonly riskApproved?: boolean;
}): StrategyReviewBundle {
  const strategyVersion = "v0.1.0";
  const ids = {
    dataSnapshotId: `${options.bundleId}-data`,
    backtestResultId: `${options.bundleId}-backtest`,
    metricReportId: `${options.bundleId}-metric`,
    riskReviewId: `${options.bundleId}-risk`,
    operatorDecisionId: `${options.bundleId}-decision`,
    outcomeLogId: `${options.bundleId}-outcome`,
    learningEventId: `${options.bundleId}-learning`
  };
  const metricSummary = {
    total_return_pct: 0,
    max_drawdown_pct: 0,
    average_win_loss_ratio: 0,
    trade_count: 0,
    warnings: ["synthetic research fixture"]
  };
  const artifactIds = [
    options.strategyId,
    ids.dataSnapshotId,
    ids.backtestResultId,
    ids.metricReportId,
    ids.riskReviewId,
    ids.operatorDecisionId,
    ids.outcomeLogId,
    ids.learningEventId
  ];
  const riskApproved = options.riskApproved ?? true;

  return {
    strategy_review_bundle_id: options.bundleId,
    financial_gate: "G0_RESEARCH",
    strategy_idea: {
      strategy_id: options.strategyId,
      title: "Synthetic review fixture",
      hypothesis: "Synthetic hypothesis used only for checklist validation.",
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
      data_snapshot_id: ids.dataSnapshotId,
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
      quality_warnings: ["synthetic quality warning"]
    },
    backtest_result: {
      backtest_result_id: ids.backtestResultId,
      strategy_id: options.strategyId,
      strategy_version: strategyVersion,
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
      generated_warnings: ["synthetic generated warning"],
      verdict: "research_only",
      created_at: recordedAt
    },
    metric_report: {
      metric_report_id: ids.metricReportId,
      backtest_result_id: ids.backtestResultId,
      strategy_id: options.strategyId,
      strategy_version: strategyVersion,
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
      risk_review_id: ids.riskReviewId,
      strategy_id: options.strategyId,
      strategy_version: strategyVersion,
      financial_gate_requested: "G0_RESEARCH",
      verdict: riskApproved ? "research_only" : "blocked_by_risk",
      approved: riskApproved,
      blocking_findings: riskApproved ? [] : ["synthetic blocking finding"],
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
      operator_decision_id: ids.operatorDecisionId,
      strategy_id: options.strategyId,
      strategy_version: strategyVersion,
      decision: riskApproved ? "keep_research_only" : "reject",
      rationale: "Research-only fixture is retained for checklist validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLogId,
      strategy_id: options.strategyId,
      strategy_version: strategyVersion,
      outcome: riskApproved ? "research_only_recorded" : "rejected",
      reasons: ["Research-only fixture accepted for checklist validation."],
      linked_operator_decision_id: ids.operatorDecisionId,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEventId,
      source_outcome_log_id: ids.outcomeLogId,
      summary: "Keep a regression test around local operator review checklists.",
      evidence_used: [ids.outcomeLogId],
      updates_rules: false,
      updates_tests: true,
      updates_docs: false,
      risk_limit_change: "none",
      autonomy_change: "none",
      created_at: recordedAt
    },
    trace: createCanonicalTrace(options.traceId, options.strategyId, strategyVersion, artifactIds),
    assembled_at: recordedAt
  };
}

describe("local operator review checklist", () => {
  it("creates deterministic checklist items from aligned summaries", () => {
    const summary = createSummary();
    const checklist = createLocalOperatorReviewChecklist(
      summary,
      createRedactedLocalReviewBundleSummary(summary)
    );

    expect(checklist).toMatchObject({
      strategy_id: "strategy-alpha",
      strategy_version: "v0.1.0",
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      item_count: 7,
      blocked_count: 0,
      needs_review_count: 4
    });
    expect(checklist.items.map((item) => item.item_id)).toEqual([
      "gate_scope_check",
      "redaction_check",
      "data_context_check",
      "metric_warning_check",
      "risk_review_check",
      "operator_outcome_check",
      "learning_change_check"
    ]);
    expect(JSON.stringify(checklist)).not.toContain("forecast");
    expect(JSON.stringify(checklist)).not.toContain("advice");
  });

  it("rejects mismatched local and redacted summaries", () => {
    const summary = createSummary();
    const redactedSummary = {
      ...createRedactedLocalReviewBundleSummary(summary),
      strategy_id: "different-strategy"
    };

    expect(() => createLocalOperatorReviewChecklist(summary, redactedSummary)).toThrow(
      "local and redacted summaries must align"
    );
  });

  it("creates multiple checklists while preserving input order", () => {
    const firstSummary = createSummary({ strategy_id: "strategy-alpha" });
    const secondSummary = createSummary({ strategy_id: "strategy-beta" });
    const checklists = createLocalOperatorReviewChecklists([firstSummary, secondSummary]);

    expect(checklists.map((checklist) => checklist.strategy_id)).toEqual([
      "strategy-alpha",
      "strategy-beta"
    ]);
  });

  it("creates checklists from the validated local query path", async () => {
    const logFilePath = createLogFilePath();
    await appendLocalReviewBundleLogRecord({
      logFilePath,
      bundle: createBundle({
        bundleId: "bundle-001",
        traceId: "trace-001",
        strategyId: "strategy-alpha"
      }),
      recordedAt
    });
    await appendLocalReviewBundleLogRecord({
      logFilePath,
      bundle: createBundle({
        bundleId: "bundle-002",
        traceId: "trace-002",
        strategyId: "strategy-beta",
        riskApproved: false
      }),
      recordedAt
    });

    const checklists = await createLocalOperatorReviewChecklistQuery({
      logFilePath,
      query: {
        strategy_id: "strategy-beta"
      }
    });
    const empty = await createLocalOperatorReviewChecklistQuery({
      logFilePath,
      query: {
        strategy_id: "missing-strategy"
      }
    });

    expect(checklists).toHaveLength(1);
    expect(checklists[0]?.strategy_id).toBe("strategy-beta");
    expect(checklists[0]?.blocked_count).toBe(1);
    expect(empty).toEqual([]);
  });

  it("creates checklists through the guarded local path", async () => {
    const guardedInput = {
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      bundle: createBundle({
        bundleId: "bundle-001",
        traceId: "trace-001",
        strategyId: "strategy-alpha"
      }),
      recordedAt
    };
    await appendLocalReviewBundleLogRecordWithGuard(guardedInput);

    const checklists = await createLocalOperatorReviewChecklistQueryWithGuard({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      query: {
        strategy_id: "strategy-alpha"
      }
    });

    expect(checklists).toHaveLength(1);

    await expect(
      createLocalOperatorReviewChecklistQueryWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson",
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("audit log path must stay inside the audit base directory");
  });

  it("propagates tamper detection before checklist creation", async () => {
    const logFilePath = createLogFilePath();
    await appendLocalReviewBundleLogRecord({
      logFilePath,
      bundle: createBundle({
        bundleId: "bundle-001",
        traceId: "trace-001",
        strategyId: "strategy-alpha"
      }),
      recordedAt
    });

    const rawRecord = JSON.parse(await readFile(logFilePath, "utf8")) as {
      bundle: {
        strategy_idea: {
          title: string;
        };
      };
    };
    rawRecord.bundle.strategy_idea.title = "Tampered title";
    await writeFile(logFilePath, `${JSON.stringify(rawRecord)}\n`, "utf8");

    await expect(
      createLocalOperatorReviewChecklistQuery({
        logFilePath,
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("review bundle hash does not match bundle payload");
  });
});
