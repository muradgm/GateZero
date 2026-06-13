import { z } from "zod";
import { ContractValidationError } from "../../contracts/src/index.js";
import { getLocalReviewBundleRedactionPolicy } from "./local-review-bundle-redaction.js";
import {
  RedactedLocalReviewBundleSummarySchema,
  createRedactedLocalReviewBundleSummaries,
  createRedactedLocalReviewBundleSummary,
  type RedactedLocalReviewBundleSummary
} from "./local-review-bundle-redacted-summary.js";
import {
  type LocalReviewBundleSummary,
  type SummarizeLocalReviewBundleQueryInput,
  type SummarizeLocalReviewBundleQueryWithGuardInput,
  summarizeLocalReviewBundleQuery,
  summarizeLocalReviewBundleQueryWithGuard
} from "./local-review-bundle-summary.js";

export const LocalOperatorReviewChecklistItemStatusSchema = z.enum([
  "complete",
  "needs_review",
  "blocked"
]);

export const LocalOperatorReviewChecklistItemIdSchema = z.enum([
  "gate_scope_check",
  "redaction_check",
  "data_context_check",
  "metric_warning_check",
  "risk_review_check",
  "operator_outcome_check",
  "learning_change_check"
]);

export const LocalOperatorReviewChecklistItemSchema = z
  .object({
    item_id: LocalOperatorReviewChecklistItemIdSchema,
    label: z.string().trim().min(1),
    status: LocalOperatorReviewChecklistItemStatusSchema,
    evidence: z.string().trim().min(1),
    required_review: z.string().trim().min(1)
  })
  .strict();

export const LocalOperatorReviewChecklistSchema = z
  .object({
    strategy_id: z.string().trim().min(1),
    strategy_version: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    source_recorded_at: z.string().datetime({ offset: true }),
    item_count: z.number().int().nonnegative(),
    blocked_count: z.number().int().nonnegative(),
    needs_review_count: z.number().int().nonnegative(),
    items: z.array(LocalOperatorReviewChecklistItemSchema)
  })
  .strict()
  .superRefine((checklist, context) => {
    if (checklist.item_count !== checklist.items.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "item_count must match items length",
        path: ["item_count"]
      });
    }

    if (checklist.blocked_count !== countItemsByStatus(checklist.items, "blocked")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_count must match blocked items",
        path: ["blocked_count"]
      });
    }

    if (checklist.needs_review_count !== countItemsByStatus(checklist.items, "needs_review")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "needs_review_count must match needs_review items",
        path: ["needs_review_count"]
      });
    }
  });

export type LocalOperatorReviewChecklistItemStatus = z.infer<
  typeof LocalOperatorReviewChecklistItemStatusSchema
>;
export type LocalOperatorReviewChecklistItemId = z.infer<
  typeof LocalOperatorReviewChecklistItemIdSchema
>;
export type LocalOperatorReviewChecklistItem = z.infer<
  typeof LocalOperatorReviewChecklistItemSchema
>;
export type LocalOperatorReviewChecklist = z.infer<typeof LocalOperatorReviewChecklistSchema>;

export function createLocalOperatorReviewChecklist(
  summary: LocalReviewBundleSummary,
  redactedSummary: RedactedLocalReviewBundleSummary = createRedactedLocalReviewBundleSummary(
    summary
  )
): LocalOperatorReviewChecklist {
  const parsedRedactedSummary = RedactedLocalReviewBundleSummarySchema.parse(redactedSummary);
  assertSummaryAlignment(summary, parsedRedactedSummary);

  const items: LocalOperatorReviewChecklistItem[] = [
    createGateScopeItem(summary, parsedRedactedSummary),
    createRedactionItem(parsedRedactedSummary),
    createDataContextItem(summary),
    createMetricWarningItem(summary),
    createRiskReviewItem(summary),
    createOperatorOutcomeItem(summary),
    createLearningChangeItem(summary)
  ];

  return LocalOperatorReviewChecklistSchema.parse({
    strategy_id: summary.strategy_id,
    strategy_version: summary.strategy_version,
    financial_gate: summary.financial_gate,
    scope: summary.scope,
    source_recorded_at: summary.recorded_at,
    item_count: items.length,
    blocked_count: countItemsByStatus(items, "blocked"),
    needs_review_count: countItemsByStatus(items, "needs_review"),
    items
  });
}

export function createLocalOperatorReviewChecklists(
  summaries: readonly LocalReviewBundleSummary[],
  redactedSummaries: readonly RedactedLocalReviewBundleSummary[] = createRedactedLocalReviewBundleSummaries(
    summaries
  )
): readonly LocalOperatorReviewChecklist[] {
  if (summaries.length !== redactedSummaries.length) {
    throw new ContractValidationError("summary and redacted summary counts must match");
  }

  return summaries.map((summary, index) => {
    const redactedSummary = redactedSummaries[index];

    if (!redactedSummary) {
      throw new ContractValidationError("redacted summary is missing");
    }

    return createLocalOperatorReviewChecklist(summary, redactedSummary);
  });
}

export async function createLocalOperatorReviewChecklistQuery(
  input: SummarizeLocalReviewBundleQueryInput
): Promise<readonly LocalOperatorReviewChecklist[]> {
  const summaries = await summarizeLocalReviewBundleQuery(input);

  return createLocalOperatorReviewChecklists(summaries);
}

export async function createLocalOperatorReviewChecklistQueryWithGuard(
  input: SummarizeLocalReviewBundleQueryWithGuardInput
): Promise<readonly LocalOperatorReviewChecklist[]> {
  const summaries = await summarizeLocalReviewBundleQueryWithGuard(input);

  return createLocalOperatorReviewChecklists(summaries);
}

function createGateScopeItem(
  summary: LocalReviewBundleSummary,
  redactedSummary: RedactedLocalReviewBundleSummary
): LocalOperatorReviewChecklistItem {
  const status =
    summary.financial_gate === "G0_RESEARCH" &&
    summary.scope === "research_only" &&
    redactedSummary.financial_gate === "G0_RESEARCH" &&
    redactedSummary.scope === "research_only"
      ? "complete"
      : "blocked";

  return createChecklistItem({
    item_id: "gate_scope_check",
    label: "Gate and scope check",
    status,
    evidence: `${summary.financial_gate}:${summary.scope}`,
    required_review: "Confirm the review remains Gate 0 research only."
  });
}

function createRedactionItem(
  redactedSummary: RedactedLocalReviewBundleSummary
): LocalOperatorReviewChecklistItem {
  const expectedOmittedFieldCount = getLocalReviewBundleRedactionPolicy().length;
  const status =
    redactedSummary.redaction.applied &&
    redactedSummary.redaction.omitted_field_count === expectedOmittedFieldCount
      ? "complete"
      : "blocked";

  return createChecklistItem({
    item_id: "redaction_check",
    label: "Redaction check",
    status,
    evidence: `omitted ${redactedSummary.redaction.omitted_field_count} local-only fields`,
    required_review: "Confirm local-only fields are absent from the redacted view."
  });
}

function createDataContextItem(
  summary: LocalReviewBundleSummary
): LocalOperatorReviewChecklistItem {
  const warningCount = summary.data_context.quality_warning_count;

  return createChecklistItem({
    item_id: "data_context_check",
    label: "Data context check",
    status: warningCount > 0 ? "needs_review" : "complete",
    evidence: `${warningCount} data quality warnings`,
    required_review: "Review data source context and quality warning counts."
  });
}

function createMetricWarningItem(
  summary: LocalReviewBundleSummary
): LocalOperatorReviewChecklistItem {
  const warningCount = summary.metric_snapshot.warning_count;

  return createChecklistItem({
    item_id: "metric_warning_check",
    label: "Metric warning check",
    status: warningCount > 0 ? "needs_review" : "complete",
    evidence: `${warningCount} metric warnings`,
    required_review: "Review metric warning counts without inferring outcome quality."
  });
}

function createRiskReviewItem(summary: LocalReviewBundleSummary): LocalOperatorReviewChecklistItem {
  const status = getRiskReviewStatus(summary);

  return createChecklistItem({
    item_id: "risk_review_check",
    label: "Risk review check",
    status,
    evidence: `${summary.risk_status.blocking_finding_count} blocking findings, ${summary.risk_status.required_control_count} required controls`,
    required_review: "Review risk findings and required controls."
  });
}

function createOperatorOutcomeItem(
  summary: LocalReviewBundleSummary
): LocalOperatorReviewChecklistItem {
  const status = isOperatorOutcomeAligned(summary) ? "complete" : "blocked";

  return createChecklistItem({
    item_id: "operator_outcome_check",
    label: "Operator outcome check",
    status,
    evidence: `${summary.operator_status.decision}:${summary.operator_status.outcome}`,
    required_review: "Confirm operator decision and recorded outcome are aligned."
  });
}

function createLearningChangeItem(
  summary: LocalReviewBundleSummary
): LocalOperatorReviewChecklistItem {
  const status =
    summary.learning_status.risk_limit_change === "none" &&
    summary.learning_status.autonomy_change === "none"
      ? summary.learning_status.updates_rules ||
        summary.learning_status.updates_tests ||
        summary.learning_status.updates_docs
        ? "needs_review"
        : "complete"
      : "blocked";

  return createChecklistItem({
    item_id: "learning_change_check",
    label: "Learning change check",
    status,
    evidence: `rules:${summary.learning_status.updates_rules}, tests:${summary.learning_status.updates_tests}, docs:${summary.learning_status.updates_docs}`,
    required_review: "Review learning flags while preserving risk and autonomy settings."
  });
}

function createChecklistItem(
  item: LocalOperatorReviewChecklistItem
): LocalOperatorReviewChecklistItem {
  return LocalOperatorReviewChecklistItemSchema.parse(item);
}

function getRiskReviewStatus(
  summary: LocalReviewBundleSummary
): LocalOperatorReviewChecklistItemStatus {
  if (!summary.risk_status.approved || summary.risk_status.blocking_finding_count > 0) {
    return "blocked";
  }

  if (summary.risk_status.required_control_count > 0) {
    return "needs_review";
  }

  return "complete";
}

function isOperatorOutcomeAligned(summary: LocalReviewBundleSummary): boolean {
  const expectedOutcomeByDecision: Record<string, string> = {
    reject: "rejected",
    revise: "revision_requested",
    keep_research_only: "research_only_recorded"
  };

  return (
    expectedOutcomeByDecision[summary.operator_status.decision] === summary.operator_status.outcome
  );
}

function assertSummaryAlignment(
  summary: LocalReviewBundleSummary,
  redactedSummary: RedactedLocalReviewBundleSummary
): void {
  const comparableSummary = {
    strategy_id: summary.strategy_id,
    strategy_version: summary.strategy_version,
    financial_gate: summary.financial_gate,
    scope: summary.scope,
    data_context: {
      source_name: summary.data_context.source_name,
      symbol_count: summary.data_context.symbol_count,
      date_start: summary.data_context.date_start,
      date_end: summary.data_context.date_end,
      timeframe: summary.data_context.timeframe,
      timezone: summary.data_context.timezone,
      data_adjustment_policy: summary.data_context.data_adjustment_policy,
      quality_warning_count: summary.data_context.quality_warning_count
    },
    metric_snapshot: summary.metric_snapshot,
    risk_status: summary.risk_status,
    operator_status: summary.operator_status,
    learning_status: summary.learning_status,
    recorded_at: summary.recorded_at
  };
  const comparableRedactedSummary = {
    strategy_id: redactedSummary.strategy_id,
    strategy_version: redactedSummary.strategy_version,
    financial_gate: redactedSummary.financial_gate,
    scope: redactedSummary.scope,
    data_context: redactedSummary.data_context,
    metric_snapshot: redactedSummary.metric_snapshot,
    risk_status: redactedSummary.risk_status,
    operator_status: redactedSummary.operator_status,
    learning_status: redactedSummary.learning_status,
    recorded_at: redactedSummary.recorded_at
  };

  if (JSON.stringify(comparableSummary) !== JSON.stringify(comparableRedactedSummary)) {
    throw new ContractValidationError("local and redacted summaries must align");
  }
}

function countItemsByStatus(
  items: readonly LocalOperatorReviewChecklistItem[],
  status: LocalOperatorReviewChecklistItemStatus
): number {
  return items.filter((item) => item.status === status).length;
}
