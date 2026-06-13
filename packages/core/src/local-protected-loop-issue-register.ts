import { z } from "zod";
import {
  LocalProtectedLoopEvidenceThresholdCheckIdSchema,
  LocalProtectedLoopEvidenceThresholdComparisonSchema,
  LocalProtectedLoopEvidenceThresholdResultSchema,
  LocalProtectedLoopEvidenceThresholdStatusSchema,
  type LocalProtectedLoopEvidenceThresholdCheck,
  type LocalProtectedLoopEvidenceThresholdResult,
  type LocalProtectedLoopEvidenceThresholdStatus
} from "./local-protected-loop-evidence-thresholds.js";

export const LocalProtectedLoopIssueRegisterStatusSchema = z.enum([
  "clear",
  "needs_review",
  "blocked"
]);

export const LocalProtectedLoopIssueSchema = z
  .object({
    issue_id: z.string().trim().min(1),
    check_id: LocalProtectedLoopEvidenceThresholdCheckIdSchema,
    status: LocalProtectedLoopEvidenceThresholdStatusSchema.exclude(["met"]),
    comparison: LocalProtectedLoopEvidenceThresholdComparisonSchema,
    observed_count: z.number().int().nonnegative(),
    threshold_count: z.number().int().nonnegative(),
    threshold_result_generated_at: z.string().datetime({ offset: true })
  })
  .strict();

export const LocalProtectedLoopIssueRegisterSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    register_status: LocalProtectedLoopIssueRegisterStatusSchema,
    generated_at: z.string().datetime({ offset: true }),
    threshold_result_generated_at: z.string().datetime({ offset: true }),
    issue_count: z.number().int().nonnegative(),
    needs_review_count: z.number().int().nonnegative(),
    blocked_count: z.number().int().nonnegative(),
    issues: z.array(LocalProtectedLoopIssueSchema)
  })
  .strict()
  .superRefine((register, context) => {
    if (register.issue_count !== register.issues.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "issue_count must match issues length",
        path: ["issue_count"]
      });
    }

    if (register.needs_review_count !== countIssues(register.issues, "needs_review")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "needs_review_count must match issues",
        path: ["needs_review_count"]
      });
    }

    if (register.blocked_count !== countIssues(register.issues, "blocked")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_count must match issues",
        path: ["blocked_count"]
      });
    }

    if (register.register_status !== getRegisterStatus(register.issues)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "register_status must reflect issue statuses",
        path: ["register_status"]
      });
    }
  });

export type LocalProtectedLoopIssueRegisterStatus = z.infer<
  typeof LocalProtectedLoopIssueRegisterStatusSchema
>;
export type LocalProtectedLoopIssue = z.infer<typeof LocalProtectedLoopIssueSchema>;
export type LocalProtectedLoopIssueRegister = z.infer<typeof LocalProtectedLoopIssueRegisterSchema>;

export function createLocalProtectedLoopIssueRegister(
  thresholdResultInput: LocalProtectedLoopEvidenceThresholdResult,
  generatedAt: string
): LocalProtectedLoopIssueRegister {
  const thresholdResult =
    LocalProtectedLoopEvidenceThresholdResultSchema.parse(thresholdResultInput);
  const issues = thresholdResult.checks
    .filter((check) => check.status !== "met")
    .map((check) => createIssue(thresholdResult.generated_at, check));

  return LocalProtectedLoopIssueRegisterSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    register_status: getRegisterStatus(issues),
    generated_at: generatedAt,
    threshold_result_generated_at: thresholdResult.generated_at,
    issue_count: issues.length,
    needs_review_count: countIssues(issues, "needs_review"),
    blocked_count: countIssues(issues, "blocked"),
    issues
  });
}

function createIssue(
  thresholdResultGeneratedAt: string,
  check: LocalProtectedLoopEvidenceThresholdCheck
): LocalProtectedLoopIssue {
  return LocalProtectedLoopIssueSchema.parse({
    issue_id: createIssueId(thresholdResultGeneratedAt, check.check_id),
    check_id: check.check_id,
    status: check.status,
    comparison: check.comparison,
    observed_count: check.observed_count,
    threshold_count: check.threshold_count,
    threshold_result_generated_at: thresholdResultGeneratedAt
  });
}

function createIssueId(thresholdResultGeneratedAt: string, checkId: string): string {
  return `threshold-result:${thresholdResultGeneratedAt}:${checkId}`;
}

function countIssues(
  issues: readonly LocalProtectedLoopIssue[],
  status: Exclude<LocalProtectedLoopEvidenceThresholdStatus, "met">
): number {
  return issues.filter((issue) => issue.status === status).length;
}

function getRegisterStatus(
  issues: readonly LocalProtectedLoopIssue[]
): LocalProtectedLoopIssueRegisterStatus {
  if (issues.some((issue) => issue.status === "blocked")) {
    return "blocked";
  }

  if (issues.some((issue) => issue.status === "needs_review")) {
    return "needs_review";
  }

  return "clear";
}
