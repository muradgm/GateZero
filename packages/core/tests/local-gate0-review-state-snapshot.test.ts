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
  createLocalGate0ReviewStateSnapshot,
  createLocalGate0ReviewStateSnapshotQuery,
  createLocalGate0ReviewStateSnapshotQueryWithGuard,
  readLocalReviewBundleLogRecords,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";
const generatedAt = "2026-01-02T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-gate0-snapshot-"));
});

afterEach(async () => {
  await rm(temporaryDirectory, { recursive: true, force: true });
});

function createLogFilePath(): string {
  return path.join(temporaryDirectory, "review-bundles.ndjson");
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
      hypothesis: "Synthetic hypothesis used only for local state snapshot validation.",
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
      rationale: "Research-only fixture is retained for local state snapshot validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLogId,
      strategy_id: options.strategyId,
      strategy_version: "v0.1.0",
      outcome: riskApproved ? "research_only_recorded" : "rejected",
      reasons: ["Research-only fixture accepted for local state snapshot validation."],
      linked_operator_decision_id: ids.operatorDecisionId,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEventId,
      source_outcome_log_id: ids.outcomeLogId,
      summary: "Keep a regression test around local Gate 0 state snapshots.",
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

describe("local Gate 0 review state snapshot", () => {
  it("creates a deterministic state snapshot from validated local records", async () => {
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

    const snapshot = createLocalGate0ReviewStateSnapshot(
      await readLocalReviewBundleLogRecords(logFilePath),
      generatedAt
    );

    expect(snapshot).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      snapshot_status: "blocked",
      review_record_count: 2,
      generated_at: generatedAt,
      diagnostic_aggregate: {
        aggregate_status: "blocked",
        diagnostic_count: 2,
        blocked_count: 1
      },
      checklist_score: {
        status: "blocked",
        checklist_count: 2,
        blocked_count: 1
      },
      artifact_inventory: {
        inventory_count: 2,
        artifact_count: 16,
        present_artifact_count: 16,
        trace_matched_artifact_count: 16,
        complete_count: 2,
        incomplete_count: 0
      }
    });
    expect(snapshot.reviews.map((review) => review.strategy_review_bundle_id)).toEqual([
      "bundle-001",
      "bundle-002"
    ]);
  });

  it("creates snapshots from the validated local query path and handles empty results", async () => {
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

    const snapshot = await createLocalGate0ReviewStateSnapshotQuery({
      logFilePath,
      query: {
        strategy_id: "strategy-alpha"
      },
      generatedAt
    });
    const emptySnapshot = await createLocalGate0ReviewStateSnapshotQuery({
      logFilePath,
      query: {
        strategy_id: "missing-strategy"
      },
      generatedAt
    });

    expect(snapshot.review_record_count).toBe(1);
    expect(snapshot.snapshot_status).toBe("needs_review");
    expect(emptySnapshot).toMatchObject({
      snapshot_status: "complete",
      review_record_count: 0,
      diagnostic_aggregate: {
        diagnostic_count: 0
      },
      checklist_score: {
        checklist_count: 0
      },
      artifact_inventory: {
        inventory_count: 0
      },
      reviews: []
    });
  });

  it("creates snapshots through the guarded local path", async () => {
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

    const snapshot = await createLocalGate0ReviewStateSnapshotQueryWithGuard({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      query: {
        strategy_id: "strategy-alpha"
      },
      generatedAt
    });

    expect(snapshot.review_record_count).toBe(1);

    await expect(
      createLocalGate0ReviewStateSnapshotQueryWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson",
        query: {
          strategy_id: "strategy-alpha"
        },
        generatedAt
      })
    ).rejects.toThrow("audit log path must stay inside the audit base directory");
  });

  it("propagates tamper detection before snapshot creation", async () => {
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
      createLocalGate0ReviewStateSnapshotQuery({
        logFilePath,
        query: {
          strategy_id: "strategy-alpha"
        },
        generatedAt
      })
    ).rejects.toThrow("review bundle hash does not match bundle payload");
  });
});
