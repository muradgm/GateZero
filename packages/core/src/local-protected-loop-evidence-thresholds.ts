import { z } from "zod";
import {
  LocalGate0ReviewStateSnapshotSchema,
  type LocalGate0ReviewStateSnapshot
} from "./local-gate0-review-state-snapshot.js";

export const LocalProtectedLoopEvidenceThresholdStatusSchema = z.enum([
  "met",
  "needs_review",
  "blocked"
]);

export const LocalProtectedLoopEvidenceThresholdCheckIdSchema = z.enum([
  "review_record_minimum",
  "trace_artifact_coverage",
  "artifact_inventory_completion",
  "checklist_blocked_maximum",
  "diagnostic_blocked_maximum",
  "redaction_finding_maximum"
]);

export const LocalProtectedLoopEvidenceThresholdComparisonSchema = z.enum(["minimum", "maximum"]);

export const LocalProtectedLoopEvidenceThresholdProfileSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    minimum_review_record_count: z.number().int().nonnegative(),
    required_artifact_count_per_review: z.number().int().nonnegative(),
    maximum_incomplete_artifact_inventory_count: z.number().int().nonnegative(),
    maximum_checklist_blocked_count: z.number().int().nonnegative(),
    maximum_diagnostic_blocked_count: z.number().int().nonnegative(),
    maximum_outside_local_review_redaction_finding_count: z.number().int().nonnegative()
  })
  .strict();

export const LocalProtectedLoopEvidenceThresholdCheckSchema = z
  .object({
    check_id: LocalProtectedLoopEvidenceThresholdCheckIdSchema,
    comparison: LocalProtectedLoopEvidenceThresholdComparisonSchema,
    unmet_status: z.enum(["needs_review", "blocked"]),
    status: LocalProtectedLoopEvidenceThresholdStatusSchema,
    passed: z.boolean(),
    observed_count: z.number().int().nonnegative(),
    threshold_count: z.number().int().nonnegative()
  })
  .strict()
  .superRefine((check, context) => {
    const passed =
      check.comparison === "minimum"
        ? check.observed_count >= check.threshold_count
        : check.observed_count <= check.threshold_count;

    if (check.passed !== passed) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "passed must reflect observed and threshold counts",
        path: ["passed"]
      });
    }

    if (check.status !== (passed ? "met" : check.unmet_status)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "status must reflect passed and unmet_status",
        path: ["status"]
      });
    }
  });

export const LocalProtectedLoopEvidenceThresholdResultSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    threshold_status: LocalProtectedLoopEvidenceThresholdStatusSchema,
    generated_at: z.string().datetime({ offset: true }),
    snapshot_generated_at: z.string().datetime({ offset: true }),
    review_record_count: z.number().int().nonnegative(),
    check_count: z.number().int().nonnegative(),
    met_count: z.number().int().nonnegative(),
    needs_review_count: z.number().int().nonnegative(),
    blocked_count: z.number().int().nonnegative(),
    profile: LocalProtectedLoopEvidenceThresholdProfileSchema,
    checks: z.array(LocalProtectedLoopEvidenceThresholdCheckSchema)
  })
  .strict()
  .superRefine((result, context) => {
    if (result.check_count !== result.checks.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "check_count must match checks length",
        path: ["check_count"]
      });
    }

    if (result.met_count !== countChecks(result.checks, "met")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "met_count must match checks",
        path: ["met_count"]
      });
    }

    if (result.needs_review_count !== countChecks(result.checks, "needs_review")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "needs_review_count must match checks",
        path: ["needs_review_count"]
      });
    }

    if (result.blocked_count !== countChecks(result.checks, "blocked")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_count must match checks",
        path: ["blocked_count"]
      });
    }

    if (result.threshold_status !== getThresholdStatus(result.checks)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "threshold_status must reflect check statuses",
        path: ["threshold_status"]
      });
    }
  });

export type LocalProtectedLoopEvidenceThresholdStatus = z.infer<
  typeof LocalProtectedLoopEvidenceThresholdStatusSchema
>;
export type LocalProtectedLoopEvidenceThresholdProfile = z.infer<
  typeof LocalProtectedLoopEvidenceThresholdProfileSchema
>;
export type LocalProtectedLoopEvidenceThresholdCheck = z.infer<
  typeof LocalProtectedLoopEvidenceThresholdCheckSchema
>;
export type LocalProtectedLoopEvidenceThresholdResult = z.infer<
  typeof LocalProtectedLoopEvidenceThresholdResultSchema
>;

export function evaluateLocalProtectedLoopEvidenceThresholds(
  snapshotInput: LocalGate0ReviewStateSnapshot,
  profileInput: LocalProtectedLoopEvidenceThresholdProfile,
  generatedAt: string
): LocalProtectedLoopEvidenceThresholdResult {
  const snapshot = LocalGate0ReviewStateSnapshotSchema.parse(snapshotInput);
  const profile = LocalProtectedLoopEvidenceThresholdProfileSchema.parse(profileInput);
  const checks = createThresholdChecks(snapshot, profile);

  return LocalProtectedLoopEvidenceThresholdResultSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    threshold_status: getThresholdStatus(checks),
    generated_at: generatedAt,
    snapshot_generated_at: snapshot.generated_at,
    review_record_count: snapshot.review_record_count,
    check_count: checks.length,
    met_count: countChecks(checks, "met"),
    needs_review_count: countChecks(checks, "needs_review"),
    blocked_count: countChecks(checks, "blocked"),
    profile,
    checks
  });
}

function createThresholdChecks(
  snapshot: LocalGate0ReviewStateSnapshot,
  profile: LocalProtectedLoopEvidenceThresholdProfile
): readonly LocalProtectedLoopEvidenceThresholdCheck[] {
  return [
    createMinimumCheck(
      "review_record_minimum",
      snapshot.review_record_count,
      profile.minimum_review_record_count,
      "needs_review"
    ),
    createMinimumCheck(
      "trace_artifact_coverage",
      snapshot.artifact_inventory.trace_matched_artifact_count,
      snapshot.review_record_count * profile.required_artifact_count_per_review,
      "blocked"
    ),
    createMaximumCheck(
      "artifact_inventory_completion",
      snapshot.artifact_inventory.incomplete_count,
      profile.maximum_incomplete_artifact_inventory_count,
      "blocked"
    ),
    createMaximumCheck(
      "checklist_blocked_maximum",
      snapshot.checklist_score.blocked_count,
      profile.maximum_checklist_blocked_count,
      "blocked"
    ),
    createMaximumCheck(
      "diagnostic_blocked_maximum",
      snapshot.diagnostic_aggregate.blocked_count,
      profile.maximum_diagnostic_blocked_count,
      "blocked"
    ),
    createMaximumCheck(
      "redaction_finding_maximum",
      snapshot.diagnostic_aggregate.outside_local_review_redaction_finding_count,
      profile.maximum_outside_local_review_redaction_finding_count,
      "needs_review"
    )
  ];
}

function createMinimumCheck(
  checkId: LocalProtectedLoopEvidenceThresholdCheck["check_id"],
  observedCount: number,
  thresholdCount: number,
  unmetStatus: "needs_review" | "blocked"
): LocalProtectedLoopEvidenceThresholdCheck {
  const passed = observedCount >= thresholdCount;

  return LocalProtectedLoopEvidenceThresholdCheckSchema.parse({
    check_id: checkId,
    comparison: "minimum",
    unmet_status: unmetStatus,
    status: passed ? "met" : unmetStatus,
    passed,
    observed_count: observedCount,
    threshold_count: thresholdCount
  });
}

function createMaximumCheck(
  checkId: LocalProtectedLoopEvidenceThresholdCheck["check_id"],
  observedCount: number,
  thresholdCount: number,
  unmetStatus: "needs_review" | "blocked"
): LocalProtectedLoopEvidenceThresholdCheck {
  const passed = observedCount <= thresholdCount;

  return LocalProtectedLoopEvidenceThresholdCheckSchema.parse({
    check_id: checkId,
    comparison: "maximum",
    unmet_status: unmetStatus,
    status: passed ? "met" : unmetStatus,
    passed,
    observed_count: observedCount,
    threshold_count: thresholdCount
  });
}

function countChecks(
  checks: readonly LocalProtectedLoopEvidenceThresholdCheck[],
  status: LocalProtectedLoopEvidenceThresholdStatus
): number {
  return checks.filter((check) => check.status === status).length;
}

function getThresholdStatus(
  checks: readonly LocalProtectedLoopEvidenceThresholdCheck[]
): LocalProtectedLoopEvidenceThresholdStatus {
  if (checks.some((check) => check.status === "blocked")) {
    return "blocked";
  }

  if (checks.some((check) => check.status === "needs_review")) {
    return "needs_review";
  }

  return "met";
}
