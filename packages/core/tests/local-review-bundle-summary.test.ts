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
  summarizeLocalReviewBundleQuery,
  summarizeLocalReviewBundleQueryWithGuard,
  summarizeLocalReviewBundleRecord,
  summarizeLocalReviewBundleRecords,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-review-summary-"));
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
  readonly riskApproved?: boolean;
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
  const riskApproved = options.riskApproved ?? true;

  return {
    strategy_review_bundle_id: options.bundleId,
    financial_gate: "G0_RESEARCH",
    strategy_idea: {
      strategy_id: options.strategyId,
      title: "Synthetic review fixture",
      hypothesis: "Synthetic hypothesis used only for summary validation.",
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
      rationale: "Research-only fixture is retained for summary validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLogId,
      strategy_id: options.strategyId,
      strategy_version: strategyVersion,
      outcome: riskApproved ? "research_only_recorded" : "rejected",
      reasons: ["Research-only fixture accepted for summary validation."],
      linked_operator_decision_id: ids.operatorDecisionId,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEventId,
      source_outcome_log_id: ids.outcomeLogId,
      summary: "Keep a regression test around local review bundle summaries.",
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
      strategyId: "strategy-beta",
      riskApproved: false
    }),
    recordedAt
  });
}

describe("local review bundle summaries", () => {
  it("creates a deterministic claim-neutral summary from a validated record", async () => {
    const logFilePath = createLogFilePath();
    await seedReviewBundles(logFilePath);
    const records = await readLocalReviewBundleLogRecords(logFilePath);
    const firstRecord = records[0];

    if (!firstRecord) {
      throw new Error("fixture must include a first review bundle record");
    }

    const summary = summarizeLocalReviewBundleRecord(firstRecord);

    expect(summary).toMatchObject({
      strategy_review_bundle_id: "bundle-001",
      trace_id: "trace-001",
      strategy_id: "strategy-alpha",
      strategy_version: "v0.1.0",
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      data_context: {
        source_name: "synthetic-fixture",
        symbol_count: 1,
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
      }
    });
    expect(summary.warning_text).toEqual([
      "synthetic quality warning",
      "synthetic generated warning",
      "synthetic research fixture"
    ]);
    expect(JSON.stringify(summary)).not.toContain("execute");
    expect(JSON.stringify(summary)).not.toContain("prediction");
  });

  it("summarizes multiple records while preserving log order", async () => {
    const logFilePath = createLogFilePath();
    await seedReviewBundles(logFilePath);
    const records = await readLocalReviewBundleLogRecords(logFilePath);

    const summaries = summarizeLocalReviewBundleRecords(records);

    expect(summaries.map((summary) => summary.strategy_review_bundle_id)).toEqual([
      "bundle-001",
      "bundle-002"
    ]);
    expect(summaries[1]?.risk_status).toMatchObject({
      verdict: "blocked_by_risk",
      approved: false,
      blocking_finding_count: 1
    });
  });

  it("summarizes query results and allows empty result sets", async () => {
    const logFilePath = createLogFilePath();
    await seedReviewBundles(logFilePath);

    const matching = await summarizeLocalReviewBundleQuery({
      logFilePath,
      query: {
        strategy_id: "strategy-beta"
      }
    });
    const empty = await summarizeLocalReviewBundleQuery({
      logFilePath,
      query: {
        trace_id: "missing-trace"
      }
    });

    expect(matching.map((summary) => summary.strategy_review_bundle_id)).toEqual(["bundle-002"]);
    expect(empty).toEqual([]);
  });

  it("summarizes through the path guard", async () => {
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

    const summaries = await summarizeLocalReviewBundleQueryWithGuard({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      query: {
        strategy_id: "strategy-alpha"
      }
    });

    expect(summaries.map((summary) => summary.strategy_review_bundle_id)).toEqual(["bundle-001"]);

    await expect(
      summarizeLocalReviewBundleQueryWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson",
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("audit log path must stay inside the audit base directory");
  });

  it("propagates tamper detection from the validated local query path", async () => {
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
      summarizeLocalReviewBundleQuery({
        logFilePath,
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("review bundle hash does not match bundle payload");
  });
});
