import { z } from "zod";
import { BacktestResultSchema } from "./backtest-result.js";
import { DataSnapshotSchema } from "./data-snapshot.js";
import { FinancialGateSchema } from "./gate.js";
import { LearningEventSchema } from "./learning-event.js";
import { MetricReportSchema } from "./metric-report.js";
import { OperatorDecisionSchema } from "./operator-decision.js";
import { OutcomeLogSchema } from "./outcome-log.js";
import { RiskReviewSchema } from "./risk-review.js";
import { IdentifierSchema, IsoDateTimeSchema } from "./schemas.js";
import { StrategyDecisionTraceSchema } from "./strategy-decision-trace.js";
import { StrategyIdeaSchema } from "./strategy-idea.js";

export const StrategyReviewBundleSchema = z
  .object({
    strategy_review_bundle_id: IdentifierSchema,
    financial_gate: FinancialGateSchema,
    strategy_idea: StrategyIdeaSchema,
    data_snapshot: DataSnapshotSchema,
    backtest_result: BacktestResultSchema,
    metric_report: MetricReportSchema,
    risk_review: RiskReviewSchema,
    operator_decision: OperatorDecisionSchema,
    outcome_log: OutcomeLogSchema,
    learning_event: LearningEventSchema,
    trace: StrategyDecisionTraceSchema,
    assembled_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((bundle, context) => {
    const expectedStrategyId = bundle.strategy_idea.strategy_id;
    const expectedStrategyVersion = bundle.backtest_result.strategy_version;

    requireEqual(context, bundle.backtest_result.strategy_id, expectedStrategyId, [
      "backtest_result",
      "strategy_id"
    ]);
    requireEqual(context, bundle.metric_report.strategy_id, expectedStrategyId, [
      "metric_report",
      "strategy_id"
    ]);
    requireEqual(context, bundle.risk_review.strategy_id, expectedStrategyId, [
      "risk_review",
      "strategy_id"
    ]);
    requireEqual(context, bundle.operator_decision.strategy_id, expectedStrategyId, [
      "operator_decision",
      "strategy_id"
    ]);
    requireEqual(context, bundle.outcome_log.strategy_id, expectedStrategyId, [
      "outcome_log",
      "strategy_id"
    ]);
    requireEqual(context, bundle.trace.strategy_id, expectedStrategyId, ["trace", "strategy_id"]);

    requireEqual(context, bundle.metric_report.strategy_version, expectedStrategyVersion, [
      "metric_report",
      "strategy_version"
    ]);
    requireEqual(context, bundle.risk_review.strategy_version, expectedStrategyVersion, [
      "risk_review",
      "strategy_version"
    ]);
    requireEqual(context, bundle.operator_decision.strategy_version, expectedStrategyVersion, [
      "operator_decision",
      "strategy_version"
    ]);
    requireEqual(context, bundle.outcome_log.strategy_version, expectedStrategyVersion, [
      "outcome_log",
      "strategy_version"
    ]);
    requireEqual(context, bundle.trace.strategy_version, expectedStrategyVersion, [
      "trace",
      "strategy_version"
    ]);

    requireEqual(
      context,
      bundle.backtest_result.data_source_name,
      bundle.data_snapshot.source_name,
      ["backtest_result", "data_source_name"]
    );
    requireEqual(
      context,
      bundle.backtest_result.data_source_version,
      bundle.data_snapshot.source_version,
      ["backtest_result", "data_source_version"]
    );
    requireStringArrayEqual(
      context,
      bundle.backtest_result.symbol_universe,
      bundle.data_snapshot.symbol_universe,
      ["backtest_result", "symbol_universe"]
    );
    requireEqual(
      context,
      bundle.backtest_result.date_range.start,
      bundle.data_snapshot.date_range.start,
      ["backtest_result", "date_range", "start"]
    );
    requireEqual(
      context,
      bundle.backtest_result.date_range.end,
      bundle.data_snapshot.date_range.end,
      ["backtest_result", "date_range", "end"]
    );
    requireEqual(context, bundle.backtest_result.timeframe, bundle.data_snapshot.timeframe, [
      "backtest_result",
      "timeframe"
    ]);

    requireEqual(
      context,
      bundle.metric_report.backtest_result_id,
      bundle.backtest_result.backtest_result_id,
      ["metric_report", "backtest_result_id"]
    );
    requireMetricSummaryEqual(
      context,
      bundle.metric_report.metrics,
      bundle.backtest_result.metric_summary,
      ["metric_report", "metrics"]
    );

    requireEqual(context, bundle.risk_review.financial_gate_requested, bundle.financial_gate, [
      "risk_review",
      "financial_gate_requested"
    ]);

    if (bundle.risk_review.approved && bundle.risk_review.blocking_findings.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "approved risk reviews must not include blocking findings",
        path: ["risk_review", "blocking_findings"]
      });
    }

    requireOutcomeForDecision(
      context,
      bundle.operator_decision.decision,
      bundle.outcome_log.outcome
    );
    requireEqual(
      context,
      bundle.outcome_log.linked_operator_decision_id,
      bundle.operator_decision.operator_decision_id,
      ["outcome_log", "linked_operator_decision_id"]
    );
    requireEqual(
      context,
      bundle.learning_event.source_outcome_log_id,
      bundle.outcome_log.outcome_log_id,
      ["learning_event", "source_outcome_log_id"]
    );

    requireTraceArtifactRefs(bundle, context);
  });

export type StrategyReviewBundle = z.infer<typeof StrategyReviewBundleSchema>;

type IssuePath = (string | number)[];

type MetricSummary = z.infer<typeof BacktestResultSchema>["metric_summary"];

function requireEqual(
  context: z.RefinementCtx,
  actual: string,
  expected: string,
  path: IssuePath
): void {
  if (actual !== expected) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `expected ${expected}`,
      path
    });
  }
}

function requireStringArrayEqual(
  context: z.RefinementCtx,
  actual: readonly string[],
  expected: readonly string[],
  path: IssuePath
): void {
  if (actual.length !== expected.length || actual.some((item, index) => item !== expected[index])) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "expected matching ordered values",
      path
    });
  }
}

function requireMetricSummaryEqual(
  context: z.RefinementCtx,
  actual: MetricSummary,
  expected: MetricSummary,
  path: IssuePath
): void {
  const numericFields = [
    "total_return_pct",
    "max_drawdown_pct",
    "average_win_loss_ratio",
    "trade_count"
  ] as const;

  numericFields.forEach((field) => {
    if (actual[field] !== expected[field]) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `expected metric ${field} to match backtest summary`,
        path: [...path, field]
      });
    }
  });

  requireStringArrayEqual(context, actual.warnings, expected.warnings, [...path, "warnings"]);
}

function requireOutcomeForDecision(
  context: z.RefinementCtx,
  decision: StrategyReviewBundle["operator_decision"]["decision"],
  outcome: StrategyReviewBundle["outcome_log"]["outcome"]
): void {
  const expectedOutcomeByDecision = {
    reject: "rejected",
    revise: "revision_requested",
    keep_research_only: "research_only_recorded"
  } as const;

  if (outcome !== expectedOutcomeByDecision[decision]) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `expected outcome ${expectedOutcomeByDecision[decision]} for operator decision`,
      path: ["outcome_log", "outcome"]
    });
  }
}

function requireTraceArtifactRefs(bundle: StrategyReviewBundle, context: z.RefinementCtx): void {
  const expectedRefs = [
    bundle.strategy_idea.strategy_id,
    bundle.data_snapshot.data_snapshot_id,
    bundle.backtest_result.backtest_result_id,
    bundle.metric_report.metric_report_id,
    bundle.risk_review.risk_review_id,
    bundle.operator_decision.operator_decision_id,
    bundle.outcome_log.outcome_log_id,
    bundle.learning_event.learning_event_id
  ];

  expectedRefs.forEach((expectedId, index) => {
    const event = bundle.trace.events[index];

    if (!event) {
      return;
    }

    requireEqual(context, event.artifact_ref.id, expectedId, [
      "trace",
      "events",
      index,
      "artifact_ref",
      "id"
    ]);
  });
}
