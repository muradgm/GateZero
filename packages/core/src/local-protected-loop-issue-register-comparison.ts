import { z } from "zod";
import { LocalProtectedLoopEvidenceThresholdCheckIdSchema } from "./local-protected-loop-evidence-thresholds.js";
import {
  LocalProtectedLoopIssueRegisterSchema,
  LocalProtectedLoopIssueRegisterStatusSchema,
  type LocalProtectedLoopIssue,
  type LocalProtectedLoopIssueRegister
} from "./local-protected-loop-issue-register.js";

const CountDeltaSchema = z.number().int();

export const LocalProtectedLoopIssueRegisterCountDeltaSchema = z
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

export const LocalProtectedLoopIssueChangeSchema = z
  .object({
    check_id: LocalProtectedLoopEvidenceThresholdCheckIdSchema,
    baseline_present: z.boolean(),
    candidate_present: z.boolean(),
    baseline_issue_id: z.string().trim().min(1).optional(),
    candidate_issue_id: z.string().trim().min(1).optional(),
    baseline_status: z.enum(["needs_review", "blocked"]).optional(),
    candidate_status: z.enum(["needs_review", "blocked"]).optional(),
    status_changed: z.boolean(),
    observed_count_delta: CountDeltaSchema.optional(),
    threshold_count_delta: CountDeltaSchema.optional()
  })
  .strict()
  .superRefine((change, context) => {
    if (change.baseline_present !== (change.baseline_issue_id !== undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "baseline_present must reflect baseline issue id presence",
        path: ["baseline_present"]
      });
    }

    if (change.candidate_present !== (change.candidate_issue_id !== undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "candidate_present must reflect candidate issue id presence",
        path: ["candidate_present"]
      });
    }

    if (
      change.baseline_present &&
      change.candidate_present &&
      change.status_changed !== (change.baseline_status !== change.candidate_status)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "status_changed must reflect issue status equality",
        path: ["status_changed"]
      });
    }
  });

export const LocalProtectedLoopIssueRegisterComparisonSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    generated_at: z.string().datetime({ offset: true }),
    baseline_generated_at: z.string().datetime({ offset: true }),
    candidate_generated_at: z.string().datetime({ offset: true }),
    baseline_register_status: LocalProtectedLoopIssueRegisterStatusSchema,
    candidate_register_status: LocalProtectedLoopIssueRegisterStatusSchema,
    status_changed: z.boolean(),
    issue_count: LocalProtectedLoopIssueRegisterCountDeltaSchema,
    needs_review_count: LocalProtectedLoopIssueRegisterCountDeltaSchema,
    blocked_count: LocalProtectedLoopIssueRegisterCountDeltaSchema,
    added_issue_count: z.number().int().nonnegative(),
    removed_issue_count: z.number().int().nonnegative(),
    retained_issue_count: z.number().int().nonnegative(),
    changed_issue_count: z.number().int().nonnegative(),
    issue_changes: z.array(LocalProtectedLoopIssueChangeSchema)
  })
  .strict()
  .superRefine((comparison, context) => {
    if (
      comparison.status_changed !==
      (comparison.baseline_register_status !== comparison.candidate_register_status)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "status_changed must reflect register status equality",
        path: ["status_changed"]
      });
    }

    const addedCount = comparison.issue_changes.filter((change) => {
      return !change.baseline_present && change.candidate_present;
    }).length;
    const removedCount = comparison.issue_changes.filter((change) => {
      return change.baseline_present && !change.candidate_present;
    }).length;
    const retainedCount = comparison.issue_changes.filter((change) => {
      return change.baseline_present && change.candidate_present;
    }).length;
    const changedCount = comparison.issue_changes.filter((change) => {
      return (
        change.baseline_present &&
        change.candidate_present &&
        (change.status_changed ||
          change.observed_count_delta !== 0 ||
          change.threshold_count_delta !== 0)
      );
    }).length;

    if (comparison.added_issue_count !== addedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "added_issue_count must match issue changes",
        path: ["added_issue_count"]
      });
    }

    if (comparison.removed_issue_count !== removedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "removed_issue_count must match issue changes",
        path: ["removed_issue_count"]
      });
    }

    if (comparison.retained_issue_count !== retainedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "retained_issue_count must match issue changes",
        path: ["retained_issue_count"]
      });
    }

    if (comparison.changed_issue_count !== changedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "changed_issue_count must match issue changes",
        path: ["changed_issue_count"]
      });
    }
  });

export type LocalProtectedLoopIssueRegisterCountDelta = z.infer<
  typeof LocalProtectedLoopIssueRegisterCountDeltaSchema
>;
export type LocalProtectedLoopIssueChange = z.infer<typeof LocalProtectedLoopIssueChangeSchema>;
export type LocalProtectedLoopIssueRegisterComparison = z.infer<
  typeof LocalProtectedLoopIssueRegisterComparisonSchema
>;

export function compareLocalProtectedLoopIssueRegisters(
  baselineRegisterInput: LocalProtectedLoopIssueRegister,
  candidateRegisterInput: LocalProtectedLoopIssueRegister,
  generatedAt: string
): LocalProtectedLoopIssueRegisterComparison {
  const baselineRegister = LocalProtectedLoopIssueRegisterSchema.parse(baselineRegisterInput);
  const candidateRegister = LocalProtectedLoopIssueRegisterSchema.parse(candidateRegisterInput);
  const issueChanges = createIssueChanges(baselineRegister.issues, candidateRegister.issues);

  return LocalProtectedLoopIssueRegisterComparisonSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    generated_at: generatedAt,
    baseline_generated_at: baselineRegister.generated_at,
    candidate_generated_at: candidateRegister.generated_at,
    baseline_register_status: baselineRegister.register_status,
    candidate_register_status: candidateRegister.register_status,
    status_changed: baselineRegister.register_status !== candidateRegister.register_status,
    issue_count: countDelta(baselineRegister.issue_count, candidateRegister.issue_count),
    needs_review_count: countDelta(
      baselineRegister.needs_review_count,
      candidateRegister.needs_review_count
    ),
    blocked_count: countDelta(baselineRegister.blocked_count, candidateRegister.blocked_count),
    added_issue_count: issueChanges.filter((change) => {
      return !change.baseline_present && change.candidate_present;
    }).length,
    removed_issue_count: issueChanges.filter((change) => {
      return change.baseline_present && !change.candidate_present;
    }).length,
    retained_issue_count: issueChanges.filter((change) => {
      return change.baseline_present && change.candidate_present;
    }).length,
    changed_issue_count: issueChanges.filter((change) => {
      return (
        change.baseline_present &&
        change.candidate_present &&
        (change.status_changed ||
          change.observed_count_delta !== 0 ||
          change.threshold_count_delta !== 0)
      );
    }).length,
    issue_changes: issueChanges
  });
}

function countDelta(
  baselineCount: number,
  candidateCount: number
): LocalProtectedLoopIssueRegisterCountDelta {
  return LocalProtectedLoopIssueRegisterCountDeltaSchema.parse({
    baseline_count: baselineCount,
    candidate_count: candidateCount,
    delta: candidateCount - baselineCount
  });
}

function createIssueChanges(
  baselineIssues: readonly LocalProtectedLoopIssue[],
  candidateIssues: readonly LocalProtectedLoopIssue[]
): readonly LocalProtectedLoopIssueChange[] {
  const baselineByCheckId = new Map(baselineIssues.map((issue) => [issue.check_id, issue]));
  const candidateByCheckId = new Map(candidateIssues.map((issue) => [issue.check_id, issue]));
  const checkIds = Array.from(
    new Set([...baselineByCheckId.keys(), ...candidateByCheckId.keys()])
  ).sort();

  return checkIds.map((checkId) => {
    return createIssueChange(
      baselineByCheckId.get(checkId),
      candidateByCheckId.get(checkId),
      checkId
    );
  });
}

function createIssueChange(
  baselineIssue: LocalProtectedLoopIssue | undefined,
  candidateIssue: LocalProtectedLoopIssue | undefined,
  checkId: LocalProtectedLoopIssue["check_id"]
): LocalProtectedLoopIssueChange {
  const bothPresent = baselineIssue !== undefined && candidateIssue !== undefined;

  return LocalProtectedLoopIssueChangeSchema.parse({
    check_id: checkId,
    baseline_present: baselineIssue !== undefined,
    candidate_present: candidateIssue !== undefined,
    baseline_issue_id: baselineIssue?.issue_id,
    candidate_issue_id: candidateIssue?.issue_id,
    baseline_status: baselineIssue?.status,
    candidate_status: candidateIssue?.status,
    status_changed: bothPresent ? baselineIssue.status !== candidateIssue.status : false,
    observed_count_delta: bothPresent
      ? candidateIssue.observed_count - baselineIssue.observed_count
      : undefined,
    threshold_count_delta: bothPresent
      ? candidateIssue.threshold_count - baselineIssue.threshold_count
      : undefined
  });
}
