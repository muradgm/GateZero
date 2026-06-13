import { z } from "zod";
import { ContractValidationError } from "../../contracts/src/index.js";
import {
  LOCAL_REVIEW_BUNDLE_REDACTION_POLICY,
  type LocalReviewBundleRedactionPolicyEntry
} from "./local-review-bundle-redaction.js";
import {
  type LocalReviewBundleSummary,
  type SummarizeLocalReviewBundleQueryInput,
  type SummarizeLocalReviewBundleQueryWithGuardInput,
  summarizeLocalReviewBundleQuery,
  summarizeLocalReviewBundleQueryWithGuard
} from "./local-review-bundle-summary.js";

export const REDACTED_REVIEW_BUNDLE_SUMMARY_POLICY_VERSION = "gate0-redacted-summary-v1";

export const RedactedLocalReviewBundleSummarySchema = z
  .object({
    strategy_id: z.string().trim().min(1),
    strategy_version: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    redaction: z
      .object({
        applied: z.literal(true),
        policy_version: z.literal(REDACTED_REVIEW_BUNDLE_SUMMARY_POLICY_VERSION),
        omitted_field_count: z.number().int().nonnegative()
      })
      .strict(),
    data_context: z
      .object({
        source_name: z.string().trim().min(1),
        symbol_count: z.number().int().nonnegative(),
        date_start: z.string().date(),
        date_end: z.string().date(),
        timeframe: z.string().trim().min(1),
        timezone: z.string().trim().min(1),
        data_adjustment_policy: z.enum(["raw", "adjusted", "not_applicable"]),
        quality_warning_count: z.number().int().nonnegative()
      })
      .strict(),
    metric_snapshot: z
      .object({
        total_return_pct: z.number(),
        max_drawdown_pct: z.number().min(0).max(100),
        average_win_loss_ratio: z.number(),
        trade_count: z.number().int().nonnegative(),
        warning_count: z.number().int().nonnegative()
      })
      .strict(),
    risk_status: z
      .object({
        verdict: z.string().trim().min(1),
        approved: z.boolean(),
        blocking_finding_count: z.number().int().nonnegative(),
        required_control_count: z.number().int().nonnegative(),
        human_approval_required: z.boolean(),
        kill_switch_required: z.boolean()
      })
      .strict(),
    operator_status: z
      .object({
        decision: z.string().trim().min(1),
        outcome: z.string().trim().min(1)
      })
      .strict(),
    learning_status: z
      .object({
        updates_rules: z.boolean(),
        updates_tests: z.boolean(),
        updates_docs: z.boolean(),
        risk_limit_change: z.literal("none"),
        autonomy_change: z.literal("none")
      })
      .strict(),
    recorded_at: z.string().datetime({ offset: true })
  })
  .strict();

export type RedactedLocalReviewBundleSummary = z.infer<
  typeof RedactedLocalReviewBundleSummarySchema
>;

export function createRedactedLocalReviewBundleSummary(
  summary: LocalReviewBundleSummary
): RedactedLocalReviewBundleSummary {
  const redactedSummary = RedactedLocalReviewBundleSummarySchema.parse({
    strategy_id: summary.strategy_id,
    strategy_version: summary.strategy_version,
    financial_gate: summary.financial_gate,
    scope: summary.scope,
    redaction: {
      applied: true,
      policy_version: REDACTED_REVIEW_BUNDLE_SUMMARY_POLICY_VERSION,
      omitted_field_count: LOCAL_REVIEW_BUNDLE_REDACTION_POLICY.length
    },
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
  });

  assertRedactedLocalReviewBundleSummary(redactedSummary);

  return redactedSummary;
}

export function createRedactedLocalReviewBundleSummaries(
  summaries: readonly LocalReviewBundleSummary[]
): readonly RedactedLocalReviewBundleSummary[] {
  return summaries.map((summary) => createRedactedLocalReviewBundleSummary(summary));
}

export async function createRedactedLocalReviewBundleSummaryQuery(
  input: SummarizeLocalReviewBundleQueryInput
): Promise<readonly RedactedLocalReviewBundleSummary[]> {
  const summaries = await summarizeLocalReviewBundleQuery(input);

  return createRedactedLocalReviewBundleSummaries(summaries);
}

export async function createRedactedLocalReviewBundleSummaryQueryWithGuard(
  input: SummarizeLocalReviewBundleQueryWithGuardInput
): Promise<readonly RedactedLocalReviewBundleSummary[]> {
  const summaries = await summarizeLocalReviewBundleQueryWithGuard(input);

  return createRedactedLocalReviewBundleSummaries(summaries);
}

export function assertRedactedLocalReviewBundleSummary(summary: unknown): void {
  const parsedSummary = RedactedLocalReviewBundleSummarySchema.parse(summary);
  const presentLocalOnlyField = LOCAL_REVIEW_BUNDLE_REDACTION_POLICY.find((entry) => {
    return hasFieldPath(parsedSummary, entry);
  });

  if (presentLocalOnlyField) {
    throw new ContractValidationError("redacted summary contains a local-only field");
  }
}

function hasFieldPath(
  value: RedactedLocalReviewBundleSummary,
  policyEntry: LocalReviewBundleRedactionPolicyEntry
): boolean {
  const pathParts = policyEntry.field_path.split(".");
  let currentValue: unknown = value;

  for (const pathPart of pathParts) {
    if (!isRecord(currentValue) || !(pathPart in currentValue)) {
      return false;
    }

    currentValue = currentValue[pathPart];
  }

  return true;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
