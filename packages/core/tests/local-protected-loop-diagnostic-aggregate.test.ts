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
  aggregateLocalProtectedLoopDiagnosticQuery,
  aggregateLocalProtectedLoopDiagnosticQueryWithGuard,
  aggregateLocalProtectedLoopDiagnostics,
  appendLocalReviewBundleLogRecord,
  appendLocalReviewBundleLogRecordWithGuard,
  buildCanonicalStrategyDecisionTrace,
  type LocalProtectedLoopDiagnostic,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";
const generatedAt = "2026-01-02T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-loop-aggregate-"));
});

afterEach(async () => {
  await rm(temporaryDirectory, { recursive: true, force: true });
});

function createLogFilePath(): string {
  return path.join(temporaryDirectory, "review-bundles.ndjson");
}

function createDiagnostic(options: {
  readonly bundleId: string;
  readonly traceId: string;
  readonly strategyId: string;
  readonly status: LocalProtectedLoopDiagnostic["diagnostic_status"];
  readonly checklistBlockedCount?: number;
}): LocalProtectedLoopDiagnostic {
  const checklistBlockedCount = options.checklistBlockedCount ?? 0;

  return {
    strategy_review_bundle_id: options.bundleId,
    trace_id: options.traceId,
    strategy_id: options.strategyId,
    strategy_version: "v0.1.0",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    diagnostic_status: options.status,
    artifact_inventory: {
      complete: true,
      artifact_count: 8,
      trace_matched_artifact_count: 8
    },
    checklist_score: {
      status: options.status,
      item_count: 7,
      needs_review_count: options.status === "needs_review" ? 2 : 0,
      blocked_count: checklistBlockedCount
    },
    redaction_status: {
      local_operator_findings: 0,
      outside_local_review_findings: 10
    },
    generated_at: generatedAt
  };
}

function createCanonicalTrace(
  traceId: string,
  bundleIds: {
    readonly strategyId: string;
    readonly dataSnapshotId: string;
    readonly backtestResultId: string;
    readonly metricReportId: string;
    readonly riskReviewId: string;
    readonly operatorDecisionId: string;
    readonly outcomeLogId: string;
    readonly learningEventId: string;
  }
): StrategyDecisionTrace {
  const artifactIds = [
    bundleIds.strategyId,
    bundleIds.dataSnapshotId,
    bundleIds.backtestResultId,
    bundleIds.metricReportId,
    bundleIds.riskReviewId,
    bundleIds.operatorDecisionId,
    bundleIds.outcomeLogId,
    bundleIds.learningEventId
  ];

  const draft: StrategyDecisionTraceDraft = {
    trace_id: traceId,
    strategy_id: bundleIds.strategyId,
    strategy_version: "v0.1.0",
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

function createBundle(options: {
  readonly bundleId: string;
  readonly traceId: string;
  readonly strategyId: string;
  readonly riskApproved?: boolean;
}): StrategyReviewBundle {
  const riskApproved = options.riskApproved ?? true;
  const ids = {
    strategyId: options.strategyId,
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

  return {
    strategy_review_bundle_id: options.bundleId,
    financial_gate: "G0_RESEARCH",
    strategy_idea: {
      strategy_id: options.strategyId,
      title: "Synthetic review fixture",
      hypothesis: "Synthetic hypothesis used only for diagnostic aggregate validation.",
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
      generated_warnings: ["synthetic generated warning"],
      verdict: "research_only",
      created_at: recordedAt
    },
    metric_report: {
      metric_report_id: ids.metricReportId,
      backtest_result_id: ids.backtestResultId,
      strategy_id: options.strategyId,
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
      risk_review_id: ids.riskReviewId,
      strategy_id: options.strategyId,
      strategy_version: "v0.1.0",
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
      strategy_version: "v0.1.0",
      decision: riskApproved ? "keep_research_only" : "reject",
      rationale: "Research-only fixture is retained for diagnostic aggregate validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLogId,
      strategy_id: options.strategyId,
      strategy_version: "v0.1.0",
      outcome: riskApproved ? "research_only_recorded" : "rejected",
      reasons: ["Research-only fixture accepted for diagnostic aggregate validation."],
      linked_operator_decision_id: ids.operatorDecisionId,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEventId,
      source_outcome_log_id: ids.outcomeLogId,
      summary: "Keep a regression test around local diagnostic aggregation.",
      evidence_used: [ids.outcomeLogId],
      updates_rules: false,
      updates_tests: true,
      updates_docs: false,
      risk_limit_change: "none",
      autonomy_change: "none",
      created_at: recordedAt
    },
    trace: createCanonicalTrace(options.traceId, ids),
    assembled_at: recordedAt
  };
}

describe("local protected-loop diagnostic aggregate", () => {
  it("aggregates diagnostic counts deterministically", () => {
    const aggregate = aggregateLocalProtectedLoopDiagnostics(
      [
        createDiagnostic({
          bundleId: "bundle-001",
          traceId: "trace-001",
          strategyId: "strategy-alpha",
          status: "needs_review"
        }),
        createDiagnostic({
          bundleId: "bundle-002",
          traceId: "trace-002",
          strategyId: "strategy-beta",
          status: "blocked",
          checklistBlockedCount: 1
        })
      ],
      generatedAt
    );

    expect(aggregate).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      aggregate_status: "blocked",
      diagnostic_count: 2,
      complete_count: 0,
      needs_review_count: 1,
      blocked_count: 1,
      artifact_count: 16,
      trace_matched_artifact_count: 16,
      checklist_item_count: 14,
      checklist_needs_review_count: 2,
      checklist_blocked_count: 1,
      outside_local_review_redaction_finding_count: 20,
      generated_at: generatedAt
    });
  });

  it("handles empty diagnostic aggregation", () => {
    const aggregate = aggregateLocalProtectedLoopDiagnostics([], generatedAt);

    expect(aggregate).toMatchObject({
      aggregate_status: "complete",
      diagnostic_count: 0,
      complete_count: 0,
      needs_review_count: 0,
      blocked_count: 0,
      artifact_count: 0,
      trace_matched_artifact_count: 0,
      checklist_item_count: 0
    });
  });

  it("aggregates diagnostics from the validated local query path", async () => {
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

    const aggregate = await aggregateLocalProtectedLoopDiagnosticQuery({
      logFilePath,
      query: {
        strategy_version: "v0.1.0"
      },
      generatedAt
    });
    const emptyAggregate = await aggregateLocalProtectedLoopDiagnosticQuery({
      logFilePath,
      query: {
        strategy_id: "missing-strategy"
      },
      generatedAt
    });

    expect(aggregate).toMatchObject({
      aggregate_status: "blocked",
      diagnostic_count: 2,
      blocked_count: 1
    });
    expect(emptyAggregate.diagnostic_count).toBe(0);
  });

  it("aggregates diagnostics through the guarded local path", async () => {
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

    const aggregate = await aggregateLocalProtectedLoopDiagnosticQueryWithGuard({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      query: {
        strategy_id: "strategy-alpha"
      },
      generatedAt
    });

    expect(aggregate.diagnostic_count).toBe(1);

    await expect(
      aggregateLocalProtectedLoopDiagnosticQueryWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson",
        query: {
          strategy_id: "strategy-alpha"
        },
        generatedAt
      })
    ).rejects.toThrow("audit log path must stay inside the audit base directory");
  });

  it("propagates tamper detection before aggregation", async () => {
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
      aggregateLocalProtectedLoopDiagnosticQuery({
        logFilePath,
        query: {
          strategy_id: "strategy-alpha"
        },
        generatedAt
      })
    ).rejects.toThrow("review bundle hash does not match bundle payload");
  });
});
