import { z } from "zod";
import {
  LocalGate0ReviewStateAssemblySchema,
  type LocalGate0ReviewStateAssembly
} from "./local-gate0-review-state-assembly.js";
import { LocalProtectedLoopIssueRegisterStatusSchema } from "./local-protected-loop-issue-register.js";

export const LocalGate0ReviewStateAssemblySummarySchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    summary_status: LocalProtectedLoopIssueRegisterStatusSchema,
    generated_at: z.string().datetime({ offset: true }),
    assembly_generated_at: z.string().datetime({ offset: true }),
    snapshot_generated_at: z.string().datetime({ offset: true }),
    threshold_result_generated_at: z.string().datetime({ offset: true }),
    issue_register_generated_at: z.string().datetime({ offset: true }),
    has_comparisons: z.boolean(),
    review_counts: z
      .object({
        review_record_count: z.number().int().nonnegative(),
        diagnostic_count: z.number().int().nonnegative(),
        checklist_count: z.number().int().nonnegative(),
        artifact_inventory_count: z.number().int().nonnegative()
      })
      .strict(),
    threshold_counts: z
      .object({
        check_count: z.number().int().nonnegative(),
        met_count: z.number().int().nonnegative(),
        needs_review_count: z.number().int().nonnegative(),
        blocked_count: z.number().int().nonnegative()
      })
      .strict(),
    issue_counts: z
      .object({
        issue_count: z.number().int().nonnegative(),
        needs_review_count: z.number().int().nonnegative(),
        blocked_count: z.number().int().nonnegative()
      })
      .strict(),
    comparison_counts: z
      .object({
        snapshot_status_changed: z.boolean(),
        threshold_status_changed: z.boolean(),
        issue_register_status_changed: z.boolean(),
        added_review_count: z.number().int().nonnegative(),
        removed_review_count: z.number().int().nonnegative(),
        added_issue_count: z.number().int().nonnegative(),
        removed_issue_count: z.number().int().nonnegative(),
        retained_issue_count: z.number().int().nonnegative(),
        changed_issue_count: z.number().int().nonnegative()
      })
      .strict()
      .optional()
  })
  .strict()
  .superRefine((summary, context) => {
    if (summary.has_comparisons !== (summary.comparison_counts !== undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "has_comparisons must reflect comparison count presence",
        path: ["has_comparisons"]
      });
    }
  });

export type LocalGate0ReviewStateAssemblySummary = z.infer<
  typeof LocalGate0ReviewStateAssemblySummarySchema
>;

export function summarizeLocalGate0ReviewStateAssembly(
  assemblyInput: LocalGate0ReviewStateAssembly,
  generatedAt: string
): LocalGate0ReviewStateAssemblySummary {
  const assembly = LocalGate0ReviewStateAssemblySchema.parse(assemblyInput);

  return LocalGate0ReviewStateAssemblySummarySchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    summary_status: assembly.assembly_status,
    generated_at: generatedAt,
    assembly_generated_at: assembly.generated_at,
    snapshot_generated_at: assembly.snapshot.generated_at,
    threshold_result_generated_at: assembly.threshold_result.generated_at,
    issue_register_generated_at: assembly.issue_register.generated_at,
    has_comparisons: assembly.comparisons !== undefined,
    review_counts: {
      review_record_count: assembly.snapshot.review_record_count,
      diagnostic_count: assembly.snapshot.diagnostic_aggregate.diagnostic_count,
      checklist_count: assembly.snapshot.checklist_score.checklist_count,
      artifact_inventory_count: assembly.snapshot.artifact_inventory.inventory_count
    },
    threshold_counts: {
      check_count: assembly.threshold_result.check_count,
      met_count: assembly.threshold_result.met_count,
      needs_review_count: assembly.threshold_result.needs_review_count,
      blocked_count: assembly.threshold_result.blocked_count
    },
    issue_counts: {
      issue_count: assembly.issue_register.issue_count,
      needs_review_count: assembly.issue_register.needs_review_count,
      blocked_count: assembly.issue_register.blocked_count
    },
    comparison_counts:
      assembly.comparisons === undefined
        ? undefined
        : {
            snapshot_status_changed: assembly.comparisons.snapshot_comparison.status_changed,
            threshold_status_changed:
              assembly.comparisons.threshold_result_comparison.status_changed,
            issue_register_status_changed:
              assembly.comparisons.issue_register_comparison.status_changed,
            added_review_count:
              assembly.comparisons.snapshot_comparison.review_reference_changes.added_count,
            removed_review_count:
              assembly.comparisons.snapshot_comparison.review_reference_changes.removed_count,
            added_issue_count: assembly.comparisons.issue_register_comparison.added_issue_count,
            removed_issue_count: assembly.comparisons.issue_register_comparison.removed_issue_count,
            retained_issue_count:
              assembly.comparisons.issue_register_comparison.retained_issue_count,
            changed_issue_count: assembly.comparisons.issue_register_comparison.changed_issue_count
          }
  });
}
