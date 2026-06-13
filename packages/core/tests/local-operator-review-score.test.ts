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
  scoreLocalOperatorReviewChecklist,
  scoreLocalOperatorReviewChecklistQuery,
  scoreLocalOperatorReviewChecklistQueryWithGuard,
  scoreLocalOperatorReviewChecklists,
  type LocalOperatorReviewChecklist,
  type LocalOperatorReviewChecklistItem,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-review-score-"));
});

afterEach(async () => {
  await rm(temporaryDirectory, { recursive: true, force: true });
});

function createLogFilePath(): string {
  return path.join(temporaryDirectory, "review-bundles.ndjson");
}

function createChecklist(options: {
  readonly strategyId: string;
  readonly completeCount: number;
  readonly needsReviewCount: number;
  readonly blockedCount: number;
}): LocalOperatorReviewChecklist {
  const items = [
    ...createChecklistItems("complete", options.completeCount),
    ...createChecklistItems("needs_review", options.needsReviewCount),
    ...createChecklistItems("blocked", options.blockedCount)
  ];

  return {
    strategy_id: options.strategyId,
    strategy_version: "v0.1.0",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    source_recorded_at: recordedAt,
    item_count: items.length,
    blocked_count: options.blockedCount,
    needs_review_count: options.needsReviewCount,
    items
  };
}

function createChecklistItems(
  status: LocalOperatorReviewChecklistItem["status"],
  count: number
): LocalOperatorReviewChecklistItem[] {
  return Array.from({ length: count }, (_, index) => {
    return {
      item_id: "gate_scope_check",
      label: `${status} item ${index + 1}`,
      status,
      evidence: `${status} evidence`,
      required_review: "Review checklist status count."
    };
  });
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
      hypothesis: "Synthetic hypothesis used only for score validation.",
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
      rationale: "Research-only fixture is retained for score validation.",
      decided_by: "Operator",
      decided_at: recordedAt
    },
    outcome_log: {
      outcome_log_id: ids.outcomeLogId,
      strategy_id: options.strategyId,
      strategy_version: strategyVersion,
      outcome: riskApproved ? "research_only_recorded" : "rejected",
      reasons: ["Research-only fixture accepted for score validation."],
      linked_operator_decision_id: ids.operatorDecisionId,
      logged_at: recordedAt
    },
    learning_event: {
      learning_event_id: ids.learningEventId,
      source_outcome_log_id: ids.outcomeLogId,
      summary: "Keep a regression test around local checklist scoring.",
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

describe("local operator review score", () => {
  it("scores one checklist deterministically", () => {
    const score = scoreLocalOperatorReviewChecklist(
      createChecklist({
        strategyId: "strategy-alpha",
        completeCount: 3,
        needsReviewCount: 2,
        blockedCount: 0
      })
    );

    expect(score).toMatchObject({
      strategy_id: "strategy-alpha",
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      status: "needs_review",
      item_count: 5,
      complete_count: 3,
      needs_review_count: 2,
      blocked_count: 0
    });
  });

  it("aggregates multiple checklist scores and handles empty inputs", () => {
    const aggregate = scoreLocalOperatorReviewChecklists([
      createChecklist({
        strategyId: "strategy-alpha",
        completeCount: 3,
        needsReviewCount: 1,
        blockedCount: 0
      }),
      createChecklist({
        strategyId: "strategy-beta",
        completeCount: 2,
        needsReviewCount: 0,
        blockedCount: 1
      })
    ]);
    const emptyAggregate = scoreLocalOperatorReviewChecklists([]);

    expect(aggregate).toMatchObject({
      status: "blocked",
      checklist_count: 2,
      item_count: 7,
      complete_count: 5,
      needs_review_count: 1,
      blocked_count: 1
    });
    expect(emptyAggregate).toMatchObject({
      status: "complete",
      checklist_count: 0,
      item_count: 0,
      complete_count: 0,
      needs_review_count: 0,
      blocked_count: 0
    });
  });

  it("scores checklists from the validated local query path", async () => {
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

    const aggregate = await scoreLocalOperatorReviewChecklistQuery({
      logFilePath,
      query: {
        strategy_id: "strategy-beta"
      }
    });
    const emptyAggregate = await scoreLocalOperatorReviewChecklistQuery({
      logFilePath,
      query: {
        strategy_id: "missing-strategy"
      }
    });

    expect(aggregate).toMatchObject({
      status: "blocked",
      checklist_count: 1,
      blocked_count: 1
    });
    expect(emptyAggregate.checklist_count).toBe(0);
  });

  it("scores checklists through the guarded local path", async () => {
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

    const aggregate = await scoreLocalOperatorReviewChecklistQueryWithGuard({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/review-bundles.ndjson",
      query: {
        strategy_id: "strategy-alpha"
      }
    });

    expect(aggregate.checklist_count).toBe(1);

    await expect(
      scoreLocalOperatorReviewChecklistQueryWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson",
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("audit log path must stay inside the audit base directory");
  });

  it("propagates tamper detection before scoring", async () => {
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
      scoreLocalOperatorReviewChecklistQuery({
        logFilePath,
        query: {
          strategy_id: "strategy-alpha"
        }
      })
    ).rejects.toThrow("review bundle hash does not match bundle payload");
  });
});
