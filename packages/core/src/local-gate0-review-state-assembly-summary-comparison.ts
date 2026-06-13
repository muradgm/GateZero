import { z } from "zod";
import {
  LocalGate0ReviewStateAssemblySummarySchema,
  type LocalGate0ReviewStateAssemblySummary
} from "./local-gate0-review-state-assembly-summary.js";
import { LocalProtectedLoopIssueRegisterStatusSchema } from "./local-protected-loop-issue-register.js";

const CountDeltaSchema = z.number().int();

export const LocalGate0AssemblySummaryCountDeltaSchema = z
  .object({
    baseline_count: z.number().int().nonnegative(),
    candidate_count: z.number().int().nonnegative(),
    delta: CountDeltaSchema
  })
  .strict()
  .superRefine((countDelta, context) => {
    if (countDelta.delta !== countDelta.candidate_count - countDelta.baseline_count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "delta must equal candidate_count minus baseline_count",
        path: ["delta"]
      });
    }
  });

export const LocalGate0AssemblySummaryBooleanChangeSchema = z
  .object({
    baseline_value: z.boolean(),
    candidate_value: z.boolean(),
    changed: z.boolean()
  })
  .strict()
  .superRefine((change, context) => {
    if (change.changed !== (change.baseline_value !== change.candidate_value)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "changed must reflect boolean equality",
        path: ["changed"]
      });
    }
  });

export const LocalGate0AssemblySummaryComparisonCountDeltaSchema = z
  .object({
    baseline_present: z.boolean(),
    candidate_present: z.boolean(),
    snapshot_status_changed: LocalGate0AssemblySummaryBooleanChangeSchema.optional(),
    threshold_status_changed: LocalGate0AssemblySummaryBooleanChangeSchema.optional(),
    issue_register_status_changed: LocalGate0AssemblySummaryBooleanChangeSchema.optional(),
    added_review_count: LocalGate0AssemblySummaryCountDeltaSchema.optional(),
    removed_review_count: LocalGate0AssemblySummaryCountDeltaSchema.optional(),
    added_issue_count: LocalGate0AssemblySummaryCountDeltaSchema.optional(),
    removed_issue_count: LocalGate0AssemblySummaryCountDeltaSchema.optional(),
    retained_issue_count: LocalGate0AssemblySummaryCountDeltaSchema.optional(),
    changed_issue_count: LocalGate0AssemblySummaryCountDeltaSchema.optional()
  })
  .strict()
  .superRefine((comparisonCounts, context) => {
    const bothPresent = comparisonCounts.baseline_present && comparisonCounts.candidate_present;
    const optionalKeys = [
      "snapshot_status_changed",
      "threshold_status_changed",
      "issue_register_status_changed",
      "added_review_count",
      "removed_review_count",
      "added_issue_count",
      "removed_issue_count",
      "retained_issue_count",
      "changed_issue_count"
    ] as const;

    for (const key of optionalKeys) {
      if ((comparisonCounts[key] !== undefined) !== bothPresent) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${key} presence must reflect comparison count availability`,
          path: [key]
        });
      }
    }
  });

export const LocalGate0AssemblySummaryReviewCountDeltaSchema = z
  .object({
    review_record_count: LocalGate0AssemblySummaryCountDeltaSchema,
    diagnostic_count: LocalGate0AssemblySummaryCountDeltaSchema,
    checklist_count: LocalGate0AssemblySummaryCountDeltaSchema,
    artifact_inventory_count: LocalGate0AssemblySummaryCountDeltaSchema
  })
  .strict();

export const LocalGate0AssemblySummaryThresholdCountDeltaSchema = z
  .object({
    check_count: LocalGate0AssemblySummaryCountDeltaSchema,
    met_count: LocalGate0AssemblySummaryCountDeltaSchema,
    needs_review_count: LocalGate0AssemblySummaryCountDeltaSchema,
    blocked_count: LocalGate0AssemblySummaryCountDeltaSchema
  })
  .strict();

export const LocalGate0AssemblySummaryIssueCountDeltaSchema = z
  .object({
    issue_count: LocalGate0AssemblySummaryCountDeltaSchema,
    needs_review_count: LocalGate0AssemblySummaryCountDeltaSchema,
    blocked_count: LocalGate0AssemblySummaryCountDeltaSchema
  })
  .strict();

export const LocalGate0ReviewStateAssemblySummaryComparisonSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    generated_at: z.string().datetime({ offset: true }),
    baseline_generated_at: z.string().datetime({ offset: true }),
    candidate_generated_at: z.string().datetime({ offset: true }),
    baseline_summary_status: LocalProtectedLoopIssueRegisterStatusSchema,
    candidate_summary_status: LocalProtectedLoopIssueRegisterStatusSchema,
    status_changed: z.boolean(),
    has_comparisons: LocalGate0AssemblySummaryBooleanChangeSchema,
    review_count_delta: LocalGate0AssemblySummaryReviewCountDeltaSchema,
    threshold_count_delta: LocalGate0AssemblySummaryThresholdCountDeltaSchema,
    issue_count_delta: LocalGate0AssemblySummaryIssueCountDeltaSchema,
    comparison_count_delta: LocalGate0AssemblySummaryComparisonCountDeltaSchema
  })
  .strict()
  .superRefine((comparison, context) => {
    if (
      comparison.status_changed !==
      (comparison.baseline_summary_status !== comparison.candidate_summary_status)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "status_changed must reflect summary status equality",
        path: ["status_changed"]
      });
    }
  });

export type LocalGate0AssemblySummaryCountDelta = z.infer<
  typeof LocalGate0AssemblySummaryCountDeltaSchema
>;
export type LocalGate0AssemblySummaryBooleanChange = z.infer<
  typeof LocalGate0AssemblySummaryBooleanChangeSchema
>;
export type LocalGate0AssemblySummaryComparisonCountDelta = z.infer<
  typeof LocalGate0AssemblySummaryComparisonCountDeltaSchema
>;
export type LocalGate0ReviewStateAssemblySummaryComparison = z.infer<
  typeof LocalGate0ReviewStateAssemblySummaryComparisonSchema
>;

export function compareLocalGate0ReviewStateAssemblySummaries(
  baselineSummaryInput: LocalGate0ReviewStateAssemblySummary,
  candidateSummaryInput: LocalGate0ReviewStateAssemblySummary,
  generatedAt: string
): LocalGate0ReviewStateAssemblySummaryComparison {
  const baselineSummary = LocalGate0ReviewStateAssemblySummarySchema.parse(baselineSummaryInput);
  const candidateSummary = LocalGate0ReviewStateAssemblySummarySchema.parse(candidateSummaryInput);

  return LocalGate0ReviewStateAssemblySummaryComparisonSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    generated_at: generatedAt,
    baseline_generated_at: baselineSummary.generated_at,
    candidate_generated_at: candidateSummary.generated_at,
    baseline_summary_status: baselineSummary.summary_status,
    candidate_summary_status: candidateSummary.summary_status,
    status_changed: baselineSummary.summary_status !== candidateSummary.summary_status,
    has_comparisons: booleanChange(
      baselineSummary.has_comparisons,
      candidateSummary.has_comparisons
    ),
    review_count_delta: {
      review_record_count: countDelta(
        baselineSummary.review_counts.review_record_count,
        candidateSummary.review_counts.review_record_count
      ),
      diagnostic_count: countDelta(
        baselineSummary.review_counts.diagnostic_count,
        candidateSummary.review_counts.diagnostic_count
      ),
      checklist_count: countDelta(
        baselineSummary.review_counts.checklist_count,
        candidateSummary.review_counts.checklist_count
      ),
      artifact_inventory_count: countDelta(
        baselineSummary.review_counts.artifact_inventory_count,
        candidateSummary.review_counts.artifact_inventory_count
      )
    },
    threshold_count_delta: {
      check_count: countDelta(
        baselineSummary.threshold_counts.check_count,
        candidateSummary.threshold_counts.check_count
      ),
      met_count: countDelta(
        baselineSummary.threshold_counts.met_count,
        candidateSummary.threshold_counts.met_count
      ),
      needs_review_count: countDelta(
        baselineSummary.threshold_counts.needs_review_count,
        candidateSummary.threshold_counts.needs_review_count
      ),
      blocked_count: countDelta(
        baselineSummary.threshold_counts.blocked_count,
        candidateSummary.threshold_counts.blocked_count
      )
    },
    issue_count_delta: {
      issue_count: countDelta(
        baselineSummary.issue_counts.issue_count,
        candidateSummary.issue_counts.issue_count
      ),
      needs_review_count: countDelta(
        baselineSummary.issue_counts.needs_review_count,
        candidateSummary.issue_counts.needs_review_count
      ),
      blocked_count: countDelta(
        baselineSummary.issue_counts.blocked_count,
        candidateSummary.issue_counts.blocked_count
      )
    },
    comparison_count_delta: createComparisonCountDelta(baselineSummary, candidateSummary)
  });
}

function countDelta(
  baselineCount: number,
  candidateCount: number
): LocalGate0AssemblySummaryCountDelta {
  return LocalGate0AssemblySummaryCountDeltaSchema.parse({
    baseline_count: baselineCount,
    candidate_count: candidateCount,
    delta: candidateCount - baselineCount
  });
}

function booleanChange(
  baselineValue: boolean,
  candidateValue: boolean
): LocalGate0AssemblySummaryBooleanChange {
  return LocalGate0AssemblySummaryBooleanChangeSchema.parse({
    baseline_value: baselineValue,
    candidate_value: candidateValue,
    changed: baselineValue !== candidateValue
  });
}

function createComparisonCountDelta(
  baselineSummary: LocalGate0ReviewStateAssemblySummary,
  candidateSummary: LocalGate0ReviewStateAssemblySummary
): LocalGate0AssemblySummaryComparisonCountDelta {
  const baselineCounts = baselineSummary.comparison_counts;
  const candidateCounts = candidateSummary.comparison_counts;
  const bothPresent = baselineCounts !== undefined && candidateCounts !== undefined;

  return LocalGate0AssemblySummaryComparisonCountDeltaSchema.parse({
    baseline_present: baselineCounts !== undefined,
    candidate_present: candidateCounts !== undefined,
    snapshot_status_changed: bothPresent
      ? booleanChange(
          baselineCounts.snapshot_status_changed,
          candidateCounts.snapshot_status_changed
        )
      : undefined,
    threshold_status_changed: bothPresent
      ? booleanChange(
          baselineCounts.threshold_status_changed,
          candidateCounts.threshold_status_changed
        )
      : undefined,
    issue_register_status_changed: bothPresent
      ? booleanChange(
          baselineCounts.issue_register_status_changed,
          candidateCounts.issue_register_status_changed
        )
      : undefined,
    added_review_count: bothPresent
      ? countDelta(baselineCounts.added_review_count, candidateCounts.added_review_count)
      : undefined,
    removed_review_count: bothPresent
      ? countDelta(baselineCounts.removed_review_count, candidateCounts.removed_review_count)
      : undefined,
    added_issue_count: bothPresent
      ? countDelta(baselineCounts.added_issue_count, candidateCounts.added_issue_count)
      : undefined,
    removed_issue_count: bothPresent
      ? countDelta(baselineCounts.removed_issue_count, candidateCounts.removed_issue_count)
      : undefined,
    retained_issue_count: bothPresent
      ? countDelta(baselineCounts.retained_issue_count, candidateCounts.retained_issue_count)
      : undefined,
    changed_issue_count: bothPresent
      ? countDelta(baselineCounts.changed_issue_count, candidateCounts.changed_issue_count)
      : undefined
  });
}
