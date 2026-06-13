import { type LocalReviewBundleQuery } from "./local-review-bundle-query.js";
import { type LocalReviewBundleLogRecord } from "./local-review-bundle-log.js";
import {
  queryLocalReviewBundleLogRecords,
  queryLocalReviewBundleLogRecordsWithGuard
} from "./local-review-bundle-query.js";

export type ReviewBundleSummaryScope = "research_only";

export interface LocalReviewBundleSummary {
  readonly strategy_review_bundle_id: string;
  readonly trace_id: string;
  readonly strategy_id: string;
  readonly strategy_version: string;
  readonly financial_gate: "G0_RESEARCH";
  readonly scope: ReviewBundleSummaryScope;
  readonly artifact_ids: {
    readonly strategy_idea_id: string;
    readonly data_snapshot_id: string;
    readonly backtest_result_id: string;
    readonly metric_report_id: string;
    readonly risk_review_id: string;
    readonly operator_decision_id: string;
    readonly outcome_log_id: string;
    readonly learning_event_id: string;
  };
  readonly data_context: {
    readonly source_name: string;
    readonly source_version: string;
    readonly symbol_count: number;
    readonly date_start: string;
    readonly date_end: string;
    readonly timeframe: string;
    readonly timezone: string;
    readonly missing_data_behavior: string;
    readonly corporate_action_policy: string;
    readonly data_adjustment_policy: "raw" | "adjusted" | "not_applicable";
    readonly quality_warning_count: number;
  };
  readonly metric_snapshot: {
    readonly total_return_pct: number;
    readonly max_drawdown_pct: number;
    readonly average_win_loss_ratio: number;
    readonly trade_count: number;
    readonly warning_count: number;
  };
  readonly risk_status: {
    readonly verdict: string;
    readonly approved: boolean;
    readonly blocking_finding_count: number;
    readonly required_control_count: number;
    readonly human_approval_required: boolean;
    readonly kill_switch_required: boolean;
  };
  readonly operator_status: {
    readonly decision: string;
    readonly outcome: string;
  };
  readonly learning_status: {
    readonly updates_rules: boolean;
    readonly updates_tests: boolean;
    readonly updates_docs: boolean;
    readonly risk_limit_change: "none";
    readonly autonomy_change: "none";
  };
  readonly warning_text: readonly string[];
  readonly blocking_findings: readonly string[];
  readonly required_controls: readonly string[];
  readonly hashes: {
    readonly bundle_hash: string;
    readonly trace_hash: string;
  };
  readonly recorded_at: string;
}

export interface SummarizeLocalReviewBundleQueryInput {
  readonly logFilePath: string;
  readonly query: LocalReviewBundleQuery;
}

export interface SummarizeLocalReviewBundleQueryWithGuardInput {
  readonly baseDirectory: string;
  readonly relativeLogPath: string;
  readonly query: LocalReviewBundleQuery;
}

export function summarizeLocalReviewBundleRecord(
  record: LocalReviewBundleLogRecord
): LocalReviewBundleSummary {
  const { bundle } = record;

  return {
    strategy_review_bundle_id: record.strategy_review_bundle_id,
    trace_id: record.trace_id,
    strategy_id: record.strategy_id,
    strategy_version: record.strategy_version,
    financial_gate: record.financial_gate,
    scope: "research_only",
    artifact_ids: {
      strategy_idea_id: bundle.strategy_idea.strategy_id,
      data_snapshot_id: bundle.data_snapshot.data_snapshot_id,
      backtest_result_id: bundle.backtest_result.backtest_result_id,
      metric_report_id: bundle.metric_report.metric_report_id,
      risk_review_id: bundle.risk_review.risk_review_id,
      operator_decision_id: bundle.operator_decision.operator_decision_id,
      outcome_log_id: bundle.outcome_log.outcome_log_id,
      learning_event_id: bundle.learning_event.learning_event_id
    },
    data_context: {
      source_name: bundle.data_snapshot.source_name,
      source_version: bundle.data_snapshot.source_version,
      symbol_count: bundle.data_snapshot.symbol_universe.length,
      date_start: bundle.data_snapshot.date_range.start,
      date_end: bundle.data_snapshot.date_range.end,
      timeframe: bundle.data_snapshot.timeframe,
      timezone: bundle.data_snapshot.timezone,
      missing_data_behavior: bundle.data_snapshot.missing_data_behavior,
      corporate_action_policy: bundle.data_snapshot.corporate_action_policy,
      data_adjustment_policy: bundle.data_snapshot.data_adjustment_policy,
      quality_warning_count: bundle.data_snapshot.quality_warnings.length
    },
    metric_snapshot: {
      total_return_pct: bundle.metric_report.metrics.total_return_pct,
      max_drawdown_pct: bundle.metric_report.metrics.max_drawdown_pct,
      average_win_loss_ratio: bundle.metric_report.metrics.average_win_loss_ratio,
      trade_count: bundle.metric_report.metrics.trade_count,
      warning_count: bundle.metric_report.metrics.warnings.length
    },
    risk_status: {
      verdict: bundle.risk_review.verdict,
      approved: bundle.risk_review.approved,
      blocking_finding_count: bundle.risk_review.blocking_findings.length,
      required_control_count: bundle.risk_review.required_controls.length,
      human_approval_required: bundle.risk_review.human_approval_required,
      kill_switch_required: bundle.risk_review.kill_switch_required
    },
    operator_status: {
      decision: bundle.operator_decision.decision,
      outcome: bundle.outcome_log.outcome
    },
    learning_status: {
      updates_rules: bundle.learning_event.updates_rules,
      updates_tests: bundle.learning_event.updates_tests,
      updates_docs: bundle.learning_event.updates_docs,
      risk_limit_change: bundle.learning_event.risk_limit_change,
      autonomy_change: bundle.learning_event.autonomy_change
    },
    warning_text: [
      ...bundle.data_snapshot.quality_warnings,
      ...bundle.backtest_result.generated_warnings,
      ...bundle.metric_report.metrics.warnings
    ],
    blocking_findings: bundle.risk_review.blocking_findings,
    required_controls: bundle.risk_review.required_controls,
    hashes: {
      bundle_hash: record.bundle_hash,
      trace_hash: record.trace_hash
    },
    recorded_at: record.recorded_at
  };
}

export function summarizeLocalReviewBundleRecords(
  records: readonly LocalReviewBundleLogRecord[]
): readonly LocalReviewBundleSummary[] {
  return records.map((record) => summarizeLocalReviewBundleRecord(record));
}

export async function summarizeLocalReviewBundleQuery(
  input: SummarizeLocalReviewBundleQueryInput
): Promise<readonly LocalReviewBundleSummary[]> {
  const records = await queryLocalReviewBundleLogRecords(input);

  return summarizeLocalReviewBundleRecords(records);
}

export async function summarizeLocalReviewBundleQueryWithGuard(
  input: SummarizeLocalReviewBundleQueryWithGuardInput
): Promise<readonly LocalReviewBundleSummary[]> {
  const records = await queryLocalReviewBundleLogRecordsWithGuard(input);

  return summarizeLocalReviewBundleRecords(records);
}
