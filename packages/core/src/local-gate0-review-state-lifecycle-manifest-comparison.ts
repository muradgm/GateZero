import { z } from "zod";
import {
  LocalGate0AssemblySummaryBooleanChangeSchema,
  LocalGate0AssemblySummaryCountDeltaSchema
} from "./local-gate0-review-state-assembly-summary-comparison.js";
import {
  LocalGate0ReviewStateLifecycleManifestSchema,
  type LocalGate0ReviewStateLifecycleManifest
} from "./local-gate0-review-state-lifecycle-manifest.js";
import { LocalGate0ReviewStatePackageIntegrityStatusSchema } from "./local-gate0-review-state-package-integrity.js";
import { LocalProtectedLoopIssueRegisterStatusSchema } from "./local-protected-loop-issue-register.js";

export const LocalGate0LifecycleManifestComponentCountDeltaSchema = z
  .object({
    summary_count: LocalGate0AssemblySummaryCountDeltaSchema,
    summary_comparison_count: LocalGate0AssemblySummaryCountDeltaSchema,
    package_integrity_count: LocalGate0AssemblySummaryCountDeltaSchema,
    integrity_aggregate_count: LocalGate0AssemblySummaryCountDeltaSchema
  })
  .strict();

export const LocalGate0LifecycleManifestSummaryCountDeltaSchema = z
  .object({
    review_record_count: LocalGate0AssemblySummaryCountDeltaSchema,
    threshold_check_count: LocalGate0AssemblySummaryCountDeltaSchema,
    issue_count: LocalGate0AssemblySummaryCountDeltaSchema
  })
  .strict();

export const LocalGate0LifecycleManifestIntegrityCountDeltaSchema = z
  .object({
    integrity_check_count: LocalGate0AssemblySummaryCountDeltaSchema,
    integrity_needs_review_count: LocalGate0AssemblySummaryCountDeltaSchema,
    manifest_check_count: LocalGate0AssemblySummaryCountDeltaSchema,
    manifest_passed_count: LocalGate0AssemblySummaryCountDeltaSchema,
    manifest_needs_review_count: LocalGate0AssemblySummaryCountDeltaSchema
  })
  .strict();

export const LocalGate0ReviewStateLifecycleManifestComparisonSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    generated_at: z.string().datetime({ offset: true }),
    baseline_manifest_generated_at: z.string().datetime({ offset: true }),
    candidate_manifest_generated_at: z.string().datetime({ offset: true }),
    baseline_manifest_status: LocalGate0ReviewStatePackageIntegrityStatusSchema,
    candidate_manifest_status: LocalGate0ReviewStatePackageIntegrityStatusSchema,
    manifest_status_changed: z.boolean(),
    baseline_summary_status: LocalProtectedLoopIssueRegisterStatusSchema,
    candidate_summary_status: LocalProtectedLoopIssueRegisterStatusSchema,
    summary_status_changed: z.boolean(),
    summary_comparison_present: LocalGate0AssemblySummaryBooleanChangeSchema,
    integrity_aggregate_present: LocalGate0AssemblySummaryBooleanChangeSchema,
    component_count_delta: LocalGate0LifecycleManifestComponentCountDeltaSchema,
    summary_count_delta: LocalGate0LifecycleManifestSummaryCountDeltaSchema,
    integrity_count_delta: LocalGate0LifecycleManifestIntegrityCountDeltaSchema
  })
  .strict()
  .superRefine((comparison, context) => {
    if (
      comparison.manifest_status_changed !==
      (comparison.baseline_manifest_status !== comparison.candidate_manifest_status)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "manifest_status_changed must reflect manifest status equality",
        path: ["manifest_status_changed"]
      });
    }

    if (
      comparison.summary_status_changed !==
      (comparison.baseline_summary_status !== comparison.candidate_summary_status)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "summary_status_changed must reflect summary status equality",
        path: ["summary_status_changed"]
      });
    }
  });

export type LocalGate0LifecycleManifestComponentCountDelta = z.infer<
  typeof LocalGate0LifecycleManifestComponentCountDeltaSchema
>;
export type LocalGate0ReviewStateLifecycleManifestComparison = z.infer<
  typeof LocalGate0ReviewStateLifecycleManifestComparisonSchema
>;

export function compareLocalGate0ReviewStateLifecycleManifests(
  baselineManifestInput: LocalGate0ReviewStateLifecycleManifest,
  candidateManifestInput: LocalGate0ReviewStateLifecycleManifest,
  generatedAt: string
): LocalGate0ReviewStateLifecycleManifestComparison {
  const baselineManifest =
    LocalGate0ReviewStateLifecycleManifestSchema.parse(baselineManifestInput);
  const candidateManifest =
    LocalGate0ReviewStateLifecycleManifestSchema.parse(candidateManifestInput);

  return LocalGate0ReviewStateLifecycleManifestComparisonSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    generated_at: generatedAt,
    baseline_manifest_generated_at: baselineManifest.generated_at,
    candidate_manifest_generated_at: candidateManifest.generated_at,
    baseline_manifest_status: baselineManifest.manifest_status,
    candidate_manifest_status: candidateManifest.manifest_status,
    manifest_status_changed: baselineManifest.manifest_status !== candidateManifest.manifest_status,
    baseline_summary_status: baselineManifest.current_summary_status,
    candidate_summary_status: candidateManifest.current_summary_status,
    summary_status_changed:
      baselineManifest.current_summary_status !== candidateManifest.current_summary_status,
    summary_comparison_present: booleanChange(
      baselineManifest.summary_comparison_present,
      candidateManifest.summary_comparison_present
    ),
    integrity_aggregate_present: booleanChange(
      baselineManifest.integrity_aggregate_present,
      candidateManifest.integrity_aggregate_present
    ),
    component_count_delta: {
      summary_count: countDelta(
        baselineManifest.component_counts.summary_count,
        candidateManifest.component_counts.summary_count
      ),
      summary_comparison_count: countDelta(
        baselineManifest.component_counts.summary_comparison_count,
        candidateManifest.component_counts.summary_comparison_count
      ),
      package_integrity_count: countDelta(
        baselineManifest.component_counts.package_integrity_count,
        candidateManifest.component_counts.package_integrity_count
      ),
      integrity_aggregate_count: countDelta(
        baselineManifest.component_counts.integrity_aggregate_count,
        candidateManifest.component_counts.integrity_aggregate_count
      )
    },
    summary_count_delta: {
      review_record_count: countDelta(
        baselineManifest.review_record_count,
        candidateManifest.review_record_count
      ),
      threshold_check_count: countDelta(
        baselineManifest.threshold_check_count,
        candidateManifest.threshold_check_count
      ),
      issue_count: countDelta(baselineManifest.issue_count, candidateManifest.issue_count)
    },
    integrity_count_delta: {
      integrity_check_count: countDelta(
        baselineManifest.integrity_check_count,
        candidateManifest.integrity_check_count
      ),
      integrity_needs_review_count: countDelta(
        baselineManifest.integrity_needs_review_count,
        candidateManifest.integrity_needs_review_count
      ),
      manifest_check_count: countDelta(
        baselineManifest.manifest_check_count,
        candidateManifest.manifest_check_count
      ),
      manifest_passed_count: countDelta(
        baselineManifest.manifest_passed_count,
        candidateManifest.manifest_passed_count
      ),
      manifest_needs_review_count: countDelta(
        baselineManifest.manifest_needs_review_count,
        candidateManifest.manifest_needs_review_count
      )
    }
  });
}

function countDelta(baselineCount: number, candidateCount: number) {
  return LocalGate0AssemblySummaryCountDeltaSchema.parse({
    baseline_count: baselineCount,
    candidate_count: candidateCount,
    delta: candidateCount - baselineCount
  });
}

function booleanChange(baselineValue: boolean, candidateValue: boolean) {
  return LocalGate0AssemblySummaryBooleanChangeSchema.parse({
    baseline_value: baselineValue,
    candidate_value: candidateValue,
    changed: baselineValue !== candidateValue
  });
}
