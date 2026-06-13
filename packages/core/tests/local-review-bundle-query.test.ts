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
  filterLocalReviewBundleLogRecords,
  queryLocalReviewBundleLogRecords,
  queryLocalReviewBundleLogRecordsWithGuard,
  readLocalReviewBundleLogRecords,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-review-query-"));
});

afterEach(async () => {
  await rm(temporaryDirectory, { recursive: true, force: true });
});

function createLogFilePath(): string {
  return path.join(temporaryDirectory, "review-bundles.ndjson");
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
  readonly strategyVersion?: string;
}): StrategyReviewBundle {
  const strategyVersion = options.strategyVersion ?? "v0.1.0";
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

  return {
    strategy_review_bundle_id: options.bundleId,
    financial_gate: "G0_RESEARCH",
    strategy_idea: {
      strategy_id: options.strategyId,
      title: "Synthetic review fixture",
      hypothesis: "Synthetic hypothesis used only for query validation.",
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
      generated_warnings: ["synthetic research fixture"],
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
      strategy_version: strategyVersion,
      decision: "keep_research_only",
      rationale: "Research-only fixture is retained for query validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLogId,
      strategy_id: options.strategyId,
      strategy_version: strategyVersion,
      outcome: "research_only_recorded",
      reasons: ["Research-only fixture accepted for query validation."],
      linked_operator_decision_id: ids.operatorDecisionId,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEventId,
      source_outcome_log_id: ids.outcomeLogId,
      summary: "Keep a regression test around local review bundle query utilities.",
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

async function seedReviewBundles(logFilePath: string): Promise<void> {
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
  await appendLocalReviewBundleLogRecord({
    logFilePath,
    bundle: createBundle({
      bundleId: "bundle-003",
      traceId: "trace-003",
      strategyId: "strategy-alpha",
      strategyVersion: "v0.2.0"
    }),
    recordedAt
  });
}

describe("local review bundle query utilities", () => {
  it("filters by bundle id, trace id, and strategy id", async () => {
    const logFilePath = createLogFilePath();
    await seedReviewBundles(logFilePath);

    const byBundle = await queryLocalReviewBundleLogRecords({
      logFilePath,
      query: {
        strategy_review_bundle_id: "bundle-002"
      }
    });
    const byTrace = await queryLocalReviewBundleLogRecords({
      logFilePath,
      query: {
        trace_id: "trace-003"
      }
    });
    const byStrategy = await queryLocalReviewBundleLogRecords({
      logFilePath,
      query: {
        strategy_id: "strategy-alpha"
      }
    });

    expect(byBundle.map((record) => record.strategy_review_bundle_id)).toEqual(["bundle-002"]);
    expect(byTrace.map((record) => record.trace_id)).toEqual(["trace-003"]);
    expect(byStrategy.map((record) => record.strategy_review_bundle_id)).toEqual([
      "bundle-001",
      "bundle-003"
    ]);
  });

  it("supports combined filters and empty results", async () => {
    const logFilePath = createLogFilePath();
    await seedReviewBundles(logFilePath);

    const combined = await queryLocalReviewBundleLogRecords({
      logFilePath,
      query: {
        strategy_id: "strategy-alpha",
        strategy_version: "v0.2.0"
      }
    });
    const empty = await queryLocalReviewBundleLogRecords({
      logFilePath,
      query: {
        strategy_id: "strategy-alpha",
        trace_id: "trace-002"
      }
    });

    expect(combined.map((record) => record.strategy_review_bundle_id)).toEqual(["bundle-003"]);
    expect(empty).toEqual([]);
  });

  it("preserves log order for in-memory record filtering", async () => {
    const logFilePath = createLogFilePath();
    await seedReviewBundles(logFilePath);
    const records = await readLocalReviewBundleLogRecords(logFilePath);

    const filtered = filterLocalReviewBundleLogRecords(records, {
      strategy_id: "strategy-alpha"
    });

    expect(filtered.map((record) => record.strategy_review_bundle_id)).toEqual([
      "bundle-001",
      "bundle-003"
    ]);
  });

  it("rejects empty or unknown query filters", async () => {
    const logFilePath = createLogFilePath();

    await expect(
      queryLocalReviewBundleLogRecords({
        logFilePath,
        query: {}
      })
    ).rejects.toThrow("at least one review bundle query filter is required");

    await expect(
      queryLocalReviewBundleLogRecords({
        logFilePath,
        query: {
          unsupported_filter: "value"
        } as never
      })
    ).rejects.toThrow();
  });

  it("queries through the path guard", async () => {
    const appendInput = {
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      bundle: createBundle({
        bundleId: "bundle-001",
        traceId: "trace-001",
        strategyId: "strategy-alpha"
      }),
      recordedAt
    };
    await appendLocalReviewBundleLogRecordWithGuard(appendInput);

    const records = await queryLocalReviewBundleLogRecordsWithGuard({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      query: {
        strategy_id: "strategy-alpha"
      }
    });

    expect(records.map((record) => record.strategy_review_bundle_id)).toEqual(["bundle-001"]);

    await expect(
      queryLocalReviewBundleLogRecordsWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson",
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("audit log path must stay inside the audit base directory");
  });

  it("propagates tamper detection from the validated read path", async () => {
    const logFilePath = createLogFilePath();
    await seedReviewBundles(logFilePath);

    const lines = (await readFile(logFilePath, "utf8")).trim().split(/\r?\n/);
    const firstRecord = JSON.parse(lines[0] as string) as {
      bundle: {
        strategy_idea: {
          title: string;
        };
      };
    };
    firstRecord.bundle.strategy_idea.title = "Tampered title";
    lines[0] = JSON.stringify(firstRecord);
    await writeFile(logFilePath, `${lines.join("\n")}\n`, "utf8");

    await expect(
      queryLocalReviewBundleLogRecords({
        logFilePath,
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("review bundle hash does not match bundle payload");
  });
});
