import { z } from "zod";
import {
  LocalGate0ReviewStateAssemblySummaryComparisonSchema,
  type LocalGate0ReviewStateAssemblySummaryComparison
} from "./local-gate0-review-state-assembly-summary-comparison.js";
import { LocalGate0ReviewStateAssemblySummarySchema } from "./local-gate0-review-state-assembly-summary.js";
import { LocalGate0ReviewStatePackageIntegrityAggregateSchema } from "./local-gate0-review-state-package-integrity-aggregate.js";
import {
  LocalGate0ReviewStatePackageIntegritySchema,
  LocalGate0ReviewStatePackageIntegrityStatusSchema
} from "./local-gate0-review-state-package-integrity.js";
import { LocalProtectedLoopIssueRegisterStatusSchema } from "./local-protected-loop-issue-register.js";

export const LocalGate0ReviewStateLifecycleManifestCheckStatusSchema = z.enum([
  "passed",
  "needs_review"
]);

export const LocalGate0ReviewStateLifecycleManifestInputSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    current_summary: LocalGate0ReviewStateAssemblySummarySchema,
    summary_comparison: LocalGate0ReviewStateAssemblySummaryComparisonSchema.optional(),
    package_integrity: LocalGate0ReviewStatePackageIntegritySchema,
    integrity_aggregate: LocalGate0ReviewStatePackageIntegrityAggregateSchema.optional()
  })
  .strict();

export const LocalGate0ReviewStateLifecycleManifestCheckSchema = z
  .object({
    check_key: z.enum([
      "current_summary_integrity_link",
      "summary_comparison_integrity_presence",
      "summary_comparison_candidate_link",
      "integrity_aggregate_includes_integrity",
      "integrity_aggregate_ref_matches_integrity"
    ]),
    status: LocalGate0ReviewStateLifecycleManifestCheckStatusSchema
  })
  .strict();

export const LocalGate0ReviewStateLifecycleManifestComponentCountsSchema = z
  .object({
    summary_count: z.number().int().nonnegative(),
    summary_comparison_count: z.number().int().nonnegative(),
    package_integrity_count: z.number().int().nonnegative(),
    integrity_aggregate_count: z.number().int().nonnegative()
  })
  .strict();

export const LocalGate0ReviewStateLifecycleManifestSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    generated_at: z.string().datetime({ offset: true }),
    manifest_status: LocalGate0ReviewStatePackageIntegrityStatusSchema,
    current_summary_generated_at: z.string().datetime({ offset: true }),
    current_summary_status: LocalProtectedLoopIssueRegisterStatusSchema,
    summary_comparison_present: z.boolean(),
    package_integrity_generated_at: z.string().datetime({ offset: true }),
    package_integrity_status: LocalGate0ReviewStatePackageIntegrityStatusSchema,
    integrity_aggregate_present: z.boolean(),
    integrity_aggregate_generated_at: z.string().datetime({ offset: true }).optional(),
    integrity_aggregate_status: LocalGate0ReviewStatePackageIntegrityStatusSchema.optional(),
    component_counts: LocalGate0ReviewStateLifecycleManifestComponentCountsSchema,
    review_record_count: z.number().int().nonnegative(),
    threshold_check_count: z.number().int().nonnegative(),
    issue_count: z.number().int().nonnegative(),
    integrity_check_count: z.number().int().nonnegative(),
    integrity_needs_review_count: z.number().int().nonnegative(),
    manifest_check_count: z.number().int().nonnegative(),
    manifest_passed_count: z.number().int().nonnegative(),
    manifest_needs_review_count: z.number().int().nonnegative(),
    checks: z.array(LocalGate0ReviewStateLifecycleManifestCheckSchema)
  })
  .strict()
  .superRefine((manifest, context) => {
    if (manifest.manifest_check_count !== manifest.checks.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "manifest_check_count must match checks length",
        path: ["manifest_check_count"]
      });
    }

    const passedCount = manifest.checks.filter((check) => check.status === "passed").length;
    const needsReviewCount = manifest.checks.filter(
      (check) => check.status === "needs_review"
    ).length;

    if (manifest.manifest_passed_count !== passedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "manifest_passed_count must match passed checks",
        path: ["manifest_passed_count"]
      });
    }

    if (manifest.manifest_needs_review_count !== needsReviewCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "manifest_needs_review_count must match needs_review checks",
        path: ["manifest_needs_review_count"]
      });
    }

    const expectedStatus =
      needsReviewCount > 0 ||
      manifest.package_integrity_status === "needs_review" ||
      manifest.integrity_aggregate_status === "needs_review"
        ? "needs_review"
        : "consistent";

    if (manifest.manifest_status !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "manifest_status must reflect checks and component statuses",
        path: ["manifest_status"]
      });
    }
  });

export type LocalGate0ReviewStateLifecycleManifestInput = z.infer<
  typeof LocalGate0ReviewStateLifecycleManifestInputSchema
>;
export type LocalGate0ReviewStateLifecycleManifestCheck = z.infer<
  typeof LocalGate0ReviewStateLifecycleManifestCheckSchema
>;
export type LocalGate0ReviewStateLifecycleManifest = z.infer<
  typeof LocalGate0ReviewStateLifecycleManifestSchema
>;

export function assembleLocalGate0ReviewStateLifecycleManifest(
  input: LocalGate0ReviewStateLifecycleManifestInput,
  generatedAt: string
): LocalGate0ReviewStateLifecycleManifest {
  const parsedInput = LocalGate0ReviewStateLifecycleManifestInputSchema.parse(input);
  const checks = createManifestChecks(parsedInput);
  const passedCount = checks.filter((check) => check.status === "passed").length;
  const needsReviewCount = checks.length - passedCount;
  const aggregateStatus = parsedInput.integrity_aggregate?.aggregate_status;
  const manifestStatus =
    needsReviewCount > 0 ||
    parsedInput.package_integrity.integrity_status === "needs_review" ||
    aggregateStatus === "needs_review"
      ? "needs_review"
      : "consistent";

  return LocalGate0ReviewStateLifecycleManifestSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    generated_at: generatedAt,
    manifest_status: manifestStatus,
    current_summary_generated_at: parsedInput.current_summary.generated_at,
    current_summary_status: parsedInput.current_summary.summary_status,
    summary_comparison_present: parsedInput.summary_comparison !== undefined,
    package_integrity_generated_at: parsedInput.package_integrity.generated_at,
    package_integrity_status: parsedInput.package_integrity.integrity_status,
    integrity_aggregate_present: parsedInput.integrity_aggregate !== undefined,
    integrity_aggregate_generated_at: parsedInput.integrity_aggregate?.generated_at,
    integrity_aggregate_status: aggregateStatus,
    component_counts: {
      summary_count: 1,
      summary_comparison_count: parsedInput.summary_comparison === undefined ? 0 : 1,
      package_integrity_count: 1,
      integrity_aggregate_count: parsedInput.integrity_aggregate === undefined ? 0 : 1
    },
    review_record_count: parsedInput.current_summary.review_counts.review_record_count,
    threshold_check_count: parsedInput.current_summary.threshold_counts.check_count,
    issue_count: parsedInput.current_summary.issue_counts.issue_count,
    integrity_check_count: parsedInput.package_integrity.check_count,
    integrity_needs_review_count: parsedInput.package_integrity.needs_review_count,
    manifest_check_count: checks.length,
    manifest_passed_count: passedCount,
    manifest_needs_review_count: needsReviewCount,
    checks
  });
}

function createManifestChecks(
  input: LocalGate0ReviewStateLifecycleManifestInput
): readonly LocalGate0ReviewStateLifecycleManifestCheck[] {
  const currentSummary = LocalGate0ReviewStateAssemblySummarySchema.parse(input.current_summary);
  const summaryComparison = parseOptionalSummaryComparison(input.summary_comparison);
  const packageIntegrity = LocalGate0ReviewStatePackageIntegritySchema.parse(
    input.package_integrity
  );
  const integrityAggregate =
    input.integrity_aggregate === undefined
      ? undefined
      : LocalGate0ReviewStatePackageIntegrityAggregateSchema.parse(input.integrity_aggregate);
  const aggregateRef = integrityAggregate?.integrity_results.find(
    (integrityRef) => integrityRef.generated_at === packageIntegrity.generated_at
  );

  return [
    createManifestCheck(
      "current_summary_integrity_link",
      packageIntegrity.current_summary_generated_at === currentSummary.generated_at
    ),
    createManifestCheck(
      "summary_comparison_integrity_presence",
      packageIntegrity.summary_comparison_present === (summaryComparison !== undefined)
    ),
    createManifestCheck(
      "summary_comparison_candidate_link",
      summaryComparison === undefined ||
        summaryComparison.candidate_generated_at === currentSummary.generated_at
    ),
    createManifestCheck(
      "integrity_aggregate_includes_integrity",
      integrityAggregate === undefined || aggregateRef !== undefined
    ),
    createManifestCheck(
      "integrity_aggregate_ref_matches_integrity",
      integrityAggregate === undefined ||
        (aggregateRef !== undefined &&
          aggregateRef.integrity_status === packageIntegrity.integrity_status &&
          aggregateRef.check_count === packageIntegrity.check_count &&
          aggregateRef.needs_review_count === packageIntegrity.needs_review_count)
    )
  ];
}

function parseOptionalSummaryComparison(
  summaryComparison: LocalGate0ReviewStateAssemblySummaryComparison | undefined
): LocalGate0ReviewStateAssemblySummaryComparison | undefined {
  return summaryComparison === undefined
    ? undefined
    : LocalGate0ReviewStateAssemblySummaryComparisonSchema.parse(summaryComparison);
}

function createManifestCheck(
  checkKey: LocalGate0ReviewStateLifecycleManifestCheck["check_key"],
  passed: boolean
): LocalGate0ReviewStateLifecycleManifestCheck {
  return LocalGate0ReviewStateLifecycleManifestCheckSchema.parse({
    check_key: checkKey,
    status: passed ? "passed" : "needs_review"
  });
}
