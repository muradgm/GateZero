import { z } from "zod";
import { LocalGate0ReviewStateAssemblySummaryComparisonSchema } from "./local-gate0-review-state-assembly-summary-comparison.js";
import { LocalGate0ReviewStateAssemblySummarySchema } from "./local-gate0-review-state-assembly-summary.js";

export const LocalGate0ReviewStatePackageIntegrityCheckStatusSchema = z.enum([
  "passed",
  "needs_review"
]);

export const LocalGate0ReviewStatePackageIntegrityStatusSchema = z.enum([
  "consistent",
  "needs_review"
]);

export const LocalGate0ReviewStatePackageIntegrityInputSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    current_summary: LocalGate0ReviewStateAssemblySummarySchema,
    baseline_summary: LocalGate0ReviewStateAssemblySummarySchema.optional(),
    summary_comparison: LocalGate0ReviewStateAssemblySummaryComparisonSchema.optional()
  })
  .strict();

export const LocalGate0ReviewStatePackageIntegrityCheckSchema = z
  .object({
    check_key: z.enum([
      "current_summary_valid",
      "baseline_comparison_pairing",
      "comparison_candidate_generated_at",
      "comparison_baseline_generated_at",
      "comparison_candidate_status",
      "comparison_baseline_status",
      "comparison_count_presence"
    ]),
    status: LocalGate0ReviewStatePackageIntegrityCheckStatusSchema
  })
  .strict();

export const LocalGate0ReviewStatePackageIntegritySchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    generated_at: z.string().datetime({ offset: true }),
    current_summary_generated_at: z.string().datetime({ offset: true }),
    baseline_summary_present: z.boolean(),
    summary_comparison_present: z.boolean(),
    integrity_status: LocalGate0ReviewStatePackageIntegrityStatusSchema,
    check_count: z.number().int().nonnegative(),
    passed_count: z.number().int().nonnegative(),
    needs_review_count: z.number().int().nonnegative(),
    checks: z.array(LocalGate0ReviewStatePackageIntegrityCheckSchema)
  })
  .strict()
  .superRefine((integrity, context) => {
    if (integrity.check_count !== integrity.checks.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "check_count must match checks length",
        path: ["check_count"]
      });
    }

    const passedCount = integrity.checks.filter((check) => check.status === "passed").length;
    const needsReviewCount = integrity.checks.filter(
      (check) => check.status === "needs_review"
    ).length;

    if (integrity.passed_count !== passedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "passed_count must match passed checks",
        path: ["passed_count"]
      });
    }

    if (integrity.needs_review_count !== needsReviewCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "needs_review_count must match needs_review checks",
        path: ["needs_review_count"]
      });
    }

    const expectedStatus = needsReviewCount === 0 ? "consistent" : "needs_review";

    if (integrity.integrity_status !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "integrity_status must reflect check statuses",
        path: ["integrity_status"]
      });
    }
  });

export type LocalGate0ReviewStatePackageIntegrityCheckStatus = z.infer<
  typeof LocalGate0ReviewStatePackageIntegrityCheckStatusSchema
>;
export type LocalGate0ReviewStatePackageIntegrityStatus = z.infer<
  typeof LocalGate0ReviewStatePackageIntegrityStatusSchema
>;
export type LocalGate0ReviewStatePackageIntegrityInput = z.infer<
  typeof LocalGate0ReviewStatePackageIntegrityInputSchema
>;
export type LocalGate0ReviewStatePackageIntegrityCheck = z.infer<
  typeof LocalGate0ReviewStatePackageIntegrityCheckSchema
>;
export type LocalGate0ReviewStatePackageIntegrity = z.infer<
  typeof LocalGate0ReviewStatePackageIntegritySchema
>;

export function inspectLocalGate0ReviewStatePackageIntegrity(
  input: LocalGate0ReviewStatePackageIntegrityInput,
  generatedAt: string
): LocalGate0ReviewStatePackageIntegrity {
  const parsedInput = LocalGate0ReviewStatePackageIntegrityInputSchema.parse(input);
  const checks = createIntegrityChecks(parsedInput);
  const passedCount = checks.filter((check) => check.status === "passed").length;
  const needsReviewCount = checks.length - passedCount;

  return LocalGate0ReviewStatePackageIntegritySchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    generated_at: generatedAt,
    current_summary_generated_at: parsedInput.current_summary.generated_at,
    baseline_summary_present: parsedInput.baseline_summary !== undefined,
    summary_comparison_present: parsedInput.summary_comparison !== undefined,
    integrity_status: needsReviewCount === 0 ? "consistent" : "needs_review",
    check_count: checks.length,
    passed_count: passedCount,
    needs_review_count: needsReviewCount,
    checks
  });
}

function createIntegrityChecks(
  input: LocalGate0ReviewStatePackageIntegrityInput
): readonly LocalGate0ReviewStatePackageIntegrityCheck[] {
  const currentSummary = LocalGate0ReviewStateAssemblySummarySchema.parse(input.current_summary);
  const baselineSummary =
    input.baseline_summary === undefined
      ? undefined
      : LocalGate0ReviewStateAssemblySummarySchema.parse(input.baseline_summary);
  const summaryComparison =
    input.summary_comparison === undefined
      ? undefined
      : LocalGate0ReviewStateAssemblySummaryComparisonSchema.parse(input.summary_comparison);
  const hasPairedBaselineComparison =
    (baselineSummary === undefined) === (summaryComparison === undefined);

  return [
    createCheck("current_summary_valid", true),
    createCheck("baseline_comparison_pairing", hasPairedBaselineComparison),
    createCheck(
      "comparison_candidate_generated_at",
      summaryComparison === undefined ||
        summaryComparison.candidate_generated_at === currentSummary.generated_at
    ),
    createCheck(
      "comparison_baseline_generated_at",
      summaryComparison === undefined ||
        (baselineSummary !== undefined &&
          summaryComparison.baseline_generated_at === baselineSummary.generated_at)
    ),
    createCheck(
      "comparison_candidate_status",
      summaryComparison === undefined ||
        summaryComparison.candidate_summary_status === currentSummary.summary_status
    ),
    createCheck(
      "comparison_baseline_status",
      summaryComparison === undefined ||
        (baselineSummary !== undefined &&
          summaryComparison.baseline_summary_status === baselineSummary.summary_status)
    ),
    createCheck(
      "comparison_count_presence",
      summaryComparison === undefined ||
        (baselineSummary !== undefined &&
          summaryComparison.comparison_count_delta.baseline_present ===
            baselineSummary.has_comparisons &&
          summaryComparison.comparison_count_delta.candidate_present ===
            currentSummary.has_comparisons)
    )
  ];
}

function createCheck(
  checkKey: LocalGate0ReviewStatePackageIntegrityCheck["check_key"],
  passed: boolean
): LocalGate0ReviewStatePackageIntegrityCheck {
  return LocalGate0ReviewStatePackageIntegrityCheckSchema.parse({
    check_key: checkKey,
    status: passed ? "passed" : "needs_review"
  });
}
