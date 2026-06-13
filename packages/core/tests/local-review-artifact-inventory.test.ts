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
  createLocalReviewArtifactInventories,
  createLocalReviewArtifactInventory,
  createLocalReviewArtifactInventoryQuery,
  createLocalReviewArtifactInventoryQueryWithGuard,
  readLocalReviewBundleLogRecords,
  type LocalReviewBundleLogRecord,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-artifact-inventory-"));
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
}): StrategyReviewBundle {
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
      hypothesis: "Synthetic hypothesis used only for artifact inventory validation.",
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
      quality_warnings: []
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
      generated_warnings: ["synthetic research fixture"],
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
      operator_decision_id: ids.operatorDecisionId,
      strategy_id: options.strategyId,
      strategy_version: "v0.1.0",
      decision: "keep_research_only",
      rationale: "Research-only fixture is retained for artifact inventory validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLogId,
      strategy_id: options.strategyId,
      strategy_version: "v0.1.0",
      outcome: "research_only_recorded",
      reasons: ["Research-only fixture accepted for artifact inventory validation."],
      linked_operator_decision_id: ids.operatorDecisionId,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEventId,
      source_outcome_log_id: ids.outcomeLogId,
      summary: "Keep a regression test around local artifact inventories.",
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

describe("local review artifact inventory", () => {
  it("creates one complete protected-loop artifact inventory", async () => {
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
    const records = await readLocalReviewBundleLogRecords(logFilePath);
    const record = records[0];

    if (!record) {
      throw new Error("fixture must include one review bundle record");
    }

    const inventory = createLocalReviewArtifactInventory(record);

    expect(inventory).toMatchObject({
      strategy_review_bundle_id: "bundle-001",
      trace_id: "trace-001",
      financial_gate: "G0_RESEARCH",
      artifact_count: 8,
      present_artifact_count: 8,
      trace_matched_artifact_count: 8,
      complete: true
    });
    expect(inventory.artifacts.map((artifact) => artifact.artifact_type)).toEqual(
      STRATEGY_DECISION_TRACE_EVENT_ORDER
    );
  });

  it("creates multiple inventories while preserving input order", async () => {
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
        strategyId: "strategy-beta"
      }),
      recordedAt
    });

    const inventories = createLocalReviewArtifactInventories(
      await readLocalReviewBundleLogRecords(logFilePath)
    );

    expect(inventories.map((inventory) => inventory.strategy_review_bundle_id)).toEqual([
      "bundle-001",
      "bundle-002"
    ]);
  });

  it("creates inventories from the validated local query path", async () => {
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

    const inventories = await createLocalReviewArtifactInventoryQuery({
      logFilePath,
      query: {
        strategy_id: "strategy-alpha"
      }
    });
    const emptyInventories = await createLocalReviewArtifactInventoryQuery({
      logFilePath,
      query: {
        strategy_id: "missing-strategy"
      }
    });

    expect(inventories).toHaveLength(1);
    expect(inventories[0]?.complete).toBe(true);
    expect(emptyInventories).toEqual([]);
  });

  it("creates inventories through the guarded local path", async () => {
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

    const inventories = await createLocalReviewArtifactInventoryQueryWithGuard({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      query: {
        strategy_id: "strategy-alpha"
      }
    });

    expect(inventories).toHaveLength(1);

    await expect(
      createLocalReviewArtifactInventoryQueryWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson",
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("audit log path must stay inside the audit base directory");
  });

  it("rejects records whose trace references do not match bundle artifacts", async () => {
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
    const records = await readLocalReviewBundleLogRecords(logFilePath);
    const record = structuredClone(records[0]) as LocalReviewBundleLogRecord;
    const metricEvent = record.bundle.trace.events[3];

    if (!metricEvent) {
      throw new Error("fixture must include metric trace event");
    }

    record.bundle.trace.events[3] = {
      ...metricEvent,
      artifact_ref: {
        ...metricEvent.artifact_ref,
        id: "different-metric"
      }
    };

    expect(() => createLocalReviewArtifactInventory(record)).toThrow(
      "review artifact inventory trace references do not match"
    );
  });

  it("propagates tamper detection before inventory creation", async () => {
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
      createLocalReviewArtifactInventoryQuery({
        logFilePath,
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("review bundle hash does not match bundle payload");
  });
});
