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
  readLocalReviewBundleLogRecords,
  readLocalReviewBundleLogRecordsWithGuard,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-review-bundle-log-"));
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

function createBundle(
  options: {
    readonly bundleId?: string;
    readonly traceId?: string;
    readonly strategyId?: string;
  } = {}
): StrategyReviewBundle {
  const bundleId = options.bundleId ?? "bundle-001";
  const strategyId = options.strategyId ?? "strategy-001";
  const ids = {
    strategyId,
    dataSnapshotId: `${bundleId}-data`,
    backtestResultId: `${bundleId}-backtest`,
    metricReportId: `${bundleId}-metric`,
    riskReviewId: `${bundleId}-risk`,
    operatorDecisionId: `${bundleId}-decision`,
    outcomeLogId: `${bundleId}-outcome`,
    learningEventId: `${bundleId}-learning`
  };
  const metricSummary = {
    total_return_pct: 0,
    max_drawdown_pct: 0,
    average_win_loss_ratio: 0,
    trade_count: 0,
    warnings: ["synthetic research fixture"]
  };

  return {
    strategy_review_bundle_id: bundleId,
    financial_gate: "G0_RESEARCH",
    strategy_idea: {
      strategy_id: strategyId,
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
      strategy_id: strategyId,
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
      strategy_id: strategyId,
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
      strategy_id: strategyId,
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
      strategy_id: strategyId,
      strategy_version: "v0.1.0",
      decision: "keep_research_only",
      rationale: "Research-only fixture is retained for validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLogId,
      strategy_id: strategyId,
      strategy_version: "v0.1.0",
      outcome: "research_only_recorded",
      reasons: ["Research-only fixture accepted for validation."],
      linked_operator_decision_id: ids.operatorDecisionId,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEventId,
      source_outcome_log_id: ids.outcomeLogId,
      summary: "Keep a regression test around persisted review bundle storage.",
      evidence_used: [ids.outcomeLogId],
      updates_rules: false,
      updates_tests: true,
      updates_docs: false,
      risk_limit_change: "none",
      autonomy_change: "none",
      created_at: recordedAt
    },
    trace: createCanonicalTrace(options.traceId ?? "trace-001", ids),
    assembled_at: recordedAt
  };
}

describe("local review bundle log", () => {
  it("appends and reads one accepted review bundle record", async () => {
    const logFilePath = createLogFilePath();
    const record = await appendLocalReviewBundleLogRecord({
      logFilePath,
      bundle: createBundle(),
      recordedAt
    });
    const records = await readLocalReviewBundleLogRecords(logFilePath);

    expect(record.strategy_review_bundle_id).toBe("bundle-001");
    expect(record.bundle_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(record.trace_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(records).toHaveLength(1);
    expect(records[0]?.bundle.strategy_review_bundle_id).toBe("bundle-001");
  });

  it("rejects duplicate bundle ids", async () => {
    const logFilePath = createLogFilePath();

    await appendLocalReviewBundleLogRecord({
      logFilePath,
      bundle: createBundle(),
      recordedAt
    });

    await expect(
      appendLocalReviewBundleLogRecord({
        logFilePath,
        bundle: createBundle({ traceId: "trace-002" }),
        recordedAt
      })
    ).rejects.toThrow("review bundle log already contains this bundle id");
  });

  it("rejects duplicate trace ids", async () => {
    const logFilePath = createLogFilePath();

    await appendLocalReviewBundleLogRecord({
      logFilePath,
      bundle: createBundle(),
      recordedAt
    });

    await expect(
      appendLocalReviewBundleLogRecord({
        logFilePath,
        bundle: createBundle({ bundleId: "bundle-002" }),
        recordedAt
      })
    ).rejects.toThrow("review bundle log already contains this trace id");
  });

  it("rejects tampered bundles before append", async () => {
    const bundle = createBundle();

    bundle.metric_report.metrics = {
      ...bundle.metric_report.metrics,
      trade_count: 1
    };

    await expect(
      appendLocalReviewBundleLogRecord({
        logFilePath: createLogFilePath(),
        bundle,
        recordedAt
      })
    ).rejects.toThrow();
  });

  it("rejects malformed existing log lines on read", async () => {
    const logFilePath = createLogFilePath();
    await writeFile(logFilePath, "{not-json}\n", "utf8");

    await expect(readLocalReviewBundleLogRecords(logFilePath)).rejects.toThrow(
      "review bundle log line 1 is malformed"
    );
  });

  it("rejects persisted bundle payload tampering", async () => {
    const logFilePath = createLogFilePath();
    await appendLocalReviewBundleLogRecord({
      logFilePath,
      bundle: createBundle(),
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

    await expect(readLocalReviewBundleLogRecords(logFilePath)).rejects.toThrow(
      "review bundle hash does not match bundle payload"
    );
  });

  it("appends and reads through the audit path guard", async () => {
    const guardedInput = {
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      bundle: createBundle(),
      recordedAt
    };

    await appendLocalReviewBundleLogRecordWithGuard(guardedInput);
    const records = await readLocalReviewBundleLogRecordsWithGuard(guardedInput);

    expect(records).toHaveLength(1);
    expect(records[0]?.strategy_review_bundle_id).toBe("bundle-001");

    await expect(
      readLocalReviewBundleLogRecordsWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson"
      })
    ).rejects.toThrow("audit log path must stay inside the audit base directory");
  });
});
