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
  REDACTED_REVIEW_BUNDLE_SUMMARY_POLICY_VERSION,
  RedactedLocalReviewBundleSummarySchema,
  appendLocalReviewBundleLogRecord,
  appendLocalReviewBundleLogRecordWithGuard,
  assertRedactedLocalReviewBundleSummary,
  buildCanonicalStrategyDecisionTrace,
  createRedactedLocalReviewBundleSummaries,
  createRedactedLocalReviewBundleSummary,
  createRedactedLocalReviewBundleSummaryQuery,
  createRedactedLocalReviewBundleSummaryQueryWithGuard,
  getLocalReviewBundleRedactionPolicy,
  type LocalReviewBundleSummary,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-redacted-summary-"));
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

  return {
    strategy_review_bundle_id: options.bundleId,
    financial_gate: "G0_RESEARCH",
    strategy_idea: {
      strategy_id: options.strategyId,
      title: "Synthetic review fixture",
      hypothesis: "Synthetic hypothesis used only for redacted summary validation.",
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
      rationale: "Research-only fixture is retained for redacted summary validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLogId,
      strategy_id: options.strategyId,
      strategy_version: strategyVersion,
      outcome: "research_only_recorded",
      reasons: ["Research-only fixture accepted for redacted summary validation."],
      linked_operator_decision_id: ids.operatorDecisionId,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEventId,
      source_outcome_log_id: ids.outcomeLogId,
      summary: "Keep a regression test around verified redacted summary shape.",
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

describe("local review bundle redacted summary shape", () => {
  it("creates a strict redacted summary without local-only fields", () => {
    const redactedSummary = createRedactedLocalReviewBundleSummary(createSummary());
    const serialized = JSON.stringify(redactedSummary);

    expect(redactedSummary).toMatchObject({
      strategy_id: "strategy-alpha",
      strategy_version: "v0.1.0",
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      redaction: {
        applied: true,
        policy_version: REDACTED_REVIEW_BUNDLE_SUMMARY_POLICY_VERSION,
        omitted_field_count: getLocalReviewBundleRedactionPolicy().length
      }
    });
    expect(() => assertRedactedLocalReviewBundleSummary(redactedSummary)).not.toThrow();
    expect(serialized).not.toContain("strategy_review_bundle_id");
    expect(serialized).not.toContain("trace_id");
    expect(serialized).not.toContain("artifact_ids");
    expect(serialized).not.toContain("hashes");
    expect(serialized).not.toContain("warning_text");
    expect(serialized).not.toContain("source_version");
    expect(serialized).not.toContain("missing_data_behavior");
    expect(serialized).not.toContain("corporate_action_policy");
  });

  it("rejects extra local-only fields on the redacted runtime schema", () => {
    const redactedSummary = createRedactedLocalReviewBundleSummary(createSummary());

    expect(() =>
      RedactedLocalReviewBundleSummarySchema.parse({
        ...redactedSummary,
        trace_id: "trace-001"
      })
    ).toThrow();

    expect(() =>
      RedactedLocalReviewBundleSummarySchema.parse({
        ...redactedSummary,
        data_context: {
          ...redactedSummary.data_context,
          source_version: "fixture-v1"
        }
      })
    ).toThrow();
  });

  it("redacts multiple summaries while preserving order", () => {
    const redactedSummaries = createRedactedLocalReviewBundleSummaries([
      createSummary({ strategy_id: "strategy-alpha" }),
      createSummary({ strategy_id: "strategy-beta" })
    ]);

    expect(redactedSummaries.map((summary) => summary.strategy_id)).toEqual([
      "strategy-alpha",
      "strategy-beta"
    ]);
  });

  it("creates redacted summaries from the validated local query path", async () => {
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

    const redactedSummaries = await createRedactedLocalReviewBundleSummaryQuery({
      logFilePath,
      query: {
        strategy_id: "strategy-alpha"
      }
    });
    const empty = await createRedactedLocalReviewBundleSummaryQuery({
      logFilePath,
      query: {
        strategy_id: "missing-strategy"
      }
    });

    expect(redactedSummaries).toHaveLength(1);
    expect(redactedSummaries[0]?.strategy_id).toBe("strategy-alpha");
    expect(empty).toEqual([]);
  });

  it("creates redacted summaries through the guarded local path", async () => {
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

    const redactedSummaries = await createRedactedLocalReviewBundleSummaryQueryWithGuard({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      query: {
        strategy_id: "strategy-alpha"
      }
    });

    expect(redactedSummaries).toHaveLength(1);

    await expect(
      createRedactedLocalReviewBundleSummaryQueryWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson",
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("audit log path must stay inside the audit base directory");
  });

  it("propagates tamper detection before redacted summaries are created", async () => {
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
      createRedactedLocalReviewBundleSummaryQuery({
        logFilePath,
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("review bundle hash does not match bundle payload");
  });
});
