import { z } from "zod";
import {
  LocalGate0ReviewStatePackageIntegritySchema,
  LocalGate0ReviewStatePackageIntegrityStatusSchema,
  type LocalGate0ReviewStatePackageIntegrity,
  type LocalGate0ReviewStatePackageIntegrityStatus
} from "./local-gate0-review-state-package-integrity.js";

export const LocalGate0ReviewStatePackageIntegrityAggregateRefSchema = z
  .object({
    generated_at: z.string().datetime({ offset: true }),
    integrity_status: LocalGate0ReviewStatePackageIntegrityStatusSchema,
    check_count: z.number().int().nonnegative(),
    needs_review_count: z.number().int().nonnegative()
  })
  .strict();

export const LocalGate0ReviewStatePackageIntegrityAggregateSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    aggregate_status: LocalGate0ReviewStatePackageIntegrityStatusSchema,
    generated_at: z.string().datetime({ offset: true }),
    latest_integrity_generated_at: z.string().datetime({ offset: true }).optional(),
    integrity_result_count: z.number().int().nonnegative(),
    consistent_count: z.number().int().nonnegative(),
    needs_review_count: z.number().int().nonnegative(),
    total_check_count: z.number().int().nonnegative(),
    total_passed_count: z.number().int().nonnegative(),
    total_needs_review_check_count: z.number().int().nonnegative(),
    baseline_summary_present_count: z.number().int().nonnegative(),
    summary_comparison_present_count: z.number().int().nonnegative(),
    integrity_results: z.array(LocalGate0ReviewStatePackageIntegrityAggregateRefSchema)
  })
  .strict()
  .superRefine((aggregate, context) => {
    if (aggregate.integrity_result_count !== aggregate.integrity_results.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "integrity_result_count must match integrity result refs length",
        path: ["integrity_result_count"]
      });
    }

    if (aggregate.consistent_count !== countRefs(aggregate.integrity_results, "consistent")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "consistent_count must match integrity result refs",
        path: ["consistent_count"]
      });
    }

    if (aggregate.needs_review_count !== countRefs(aggregate.integrity_results, "needs_review")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "needs_review_count must match integrity result refs",
        path: ["needs_review_count"]
      });
    }

    const expectedStatus = aggregate.needs_review_count > 0 ? "needs_review" : "consistent";

    if (aggregate.aggregate_status !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "aggregate_status must reflect integrity result statuses",
        path: ["aggregate_status"]
      });
    }
  });

export type LocalGate0ReviewStatePackageIntegrityAggregateRef = z.infer<
  typeof LocalGate0ReviewStatePackageIntegrityAggregateRefSchema
>;
export type LocalGate0ReviewStatePackageIntegrityAggregate = z.infer<
  typeof LocalGate0ReviewStatePackageIntegrityAggregateSchema
>;

export function aggregateLocalGate0ReviewStatePackageIntegrities(
  integrityResults: readonly LocalGate0ReviewStatePackageIntegrity[],
  generatedAt: string
): LocalGate0ReviewStatePackageIntegrityAggregate {
  const parsedResults = integrityResults.map((integrityResult) =>
    LocalGate0ReviewStatePackageIntegritySchema.parse(integrityResult)
  );
  const needsReviewCount = countIntegrities(parsedResults, "needs_review");

  return LocalGate0ReviewStatePackageIntegrityAggregateSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    aggregate_status: needsReviewCount > 0 ? "needs_review" : "consistent",
    generated_at: generatedAt,
    latest_integrity_generated_at: getLatestGeneratedAt(parsedResults),
    integrity_result_count: parsedResults.length,
    consistent_count: countIntegrities(parsedResults, "consistent"),
    needs_review_count: needsReviewCount,
    total_check_count: sumIntegrities(parsedResults, "check_count"),
    total_passed_count: sumIntegrities(parsedResults, "passed_count"),
    total_needs_review_check_count: sumIntegrities(parsedResults, "needs_review_count"),
    baseline_summary_present_count: parsedResults.filter(
      (integrityResult) => integrityResult.baseline_summary_present
    ).length,
    summary_comparison_present_count: parsedResults.filter(
      (integrityResult) => integrityResult.summary_comparison_present
    ).length,
    integrity_results: parsedResults.map((integrityResult) => {
      return {
        generated_at: integrityResult.generated_at,
        integrity_status: integrityResult.integrity_status,
        check_count: integrityResult.check_count,
        needs_review_count: integrityResult.needs_review_count
      };
    })
  });
}

function countIntegrities(
  integrityResults: readonly LocalGate0ReviewStatePackageIntegrity[],
  status: LocalGate0ReviewStatePackageIntegrityStatus
): number {
  return integrityResults.filter((integrityResult) => integrityResult.integrity_status === status)
    .length;
}

function countRefs(
  integrityRefs: readonly LocalGate0ReviewStatePackageIntegrityAggregateRef[],
  status: LocalGate0ReviewStatePackageIntegrityStatus
): number {
  return integrityRefs.filter((integrityRef) => integrityRef.integrity_status === status).length;
}

function sumIntegrities(
  integrityResults: readonly LocalGate0ReviewStatePackageIntegrity[],
  key: "check_count" | "passed_count" | "needs_review_count"
): number {
  return integrityResults.reduce((total, integrityResult) => total + integrityResult[key], 0);
}

function getLatestGeneratedAt(
  integrityResults: readonly LocalGate0ReviewStatePackageIntegrity[]
): string | undefined {
  if (integrityResults.length === 0) {
    return undefined;
  }

  return integrityResults
    .map((integrityResult) => integrityResult.generated_at)
    .sort((left, right) => right.localeCompare(left))[0];
}
