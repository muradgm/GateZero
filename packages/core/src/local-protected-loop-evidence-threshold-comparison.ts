import { z } from "zod";
import {
  LocalProtectedLoopEvidenceThresholdCheckIdSchema,
  LocalProtectedLoopEvidenceThresholdResultSchema,
  LocalProtectedLoopEvidenceThresholdStatusSchema,
  type LocalProtectedLoopEvidenceThresholdCheck,
  type LocalProtectedLoopEvidenceThresholdResult
} from "./local-protected-loop-evidence-thresholds.js";

const CountDeltaSchema = z.number().int();

export const LocalProtectedLoopEvidenceThresholdCountDeltaSchema = z
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

export const LocalProtectedLoopEvidenceThresholdCheckChangeSchema = z
  .object({
    check_id: LocalProtectedLoopEvidenceThresholdCheckIdSchema,
    baseline_present: z.boolean(),
    candidate_present: z.boolean(),
    baseline_status: LocalProtectedLoopEvidenceThresholdStatusSchema.optional(),
    candidate_status: LocalProtectedLoopEvidenceThresholdStatusSchema.optional(),
    status_changed: z.boolean(),
    baseline_passed: z.boolean().optional(),
    candidate_passed: z.boolean().optional(),
    passed_changed: z.boolean(),
    observed_count_delta: CountDeltaSchema.optional(),
    threshold_count_delta: CountDeltaSchema.optional()
  })
  .strict()
  .superRefine((change, context) => {
    if (change.baseline_present !== (change.baseline_status !== undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "baseline_present must reflect baseline status presence",
        path: ["baseline_present"]
      });
    }

    if (change.candidate_present !== (change.candidate_status !== undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "candidate_present must reflect candidate status presence",
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
        message: "status_changed must reflect status equality when both checks are present",
        path: ["status_changed"]
      });
    }

    if (
      change.baseline_present &&
      change.candidate_present &&
      change.passed_changed !== (change.baseline_passed !== change.candidate_passed)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "passed_changed must reflect pass/fail equality when both checks are present",
        path: ["passed_changed"]
      });
    }
  });

export const LocalProtectedLoopEvidenceThresholdResultComparisonSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    generated_at: z.string().datetime({ offset: true }),
    baseline_generated_at: z.string().datetime({ offset: true }),
    candidate_generated_at: z.string().datetime({ offset: true }),
    baseline_threshold_status: LocalProtectedLoopEvidenceThresholdStatusSchema,
    candidate_threshold_status: LocalProtectedLoopEvidenceThresholdStatusSchema,
    status_changed: z.boolean(),
    review_record_count: LocalProtectedLoopEvidenceThresholdCountDeltaSchema,
    check_count: LocalProtectedLoopEvidenceThresholdCountDeltaSchema,
    met_count: LocalProtectedLoopEvidenceThresholdCountDeltaSchema,
    needs_review_count: LocalProtectedLoopEvidenceThresholdCountDeltaSchema,
    blocked_count: LocalProtectedLoopEvidenceThresholdCountDeltaSchema,
    changed_check_count: z.number().int().nonnegative(),
    added_check_count: z.number().int().nonnegative(),
    removed_check_count: z.number().int().nonnegative(),
    check_changes: z.array(LocalProtectedLoopEvidenceThresholdCheckChangeSchema)
  })
  .strict()
  .superRefine((comparison, context) => {
    if (
      comparison.status_changed !==
      (comparison.baseline_threshold_status !== comparison.candidate_threshold_status)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "status_changed must reflect threshold status equality",
        path: ["status_changed"]
      });
    }

    const changedCount = comparison.check_changes.filter((change) => {
      return change.status_changed || change.passed_changed;
    }).length;
    const addedCount = comparison.check_changes.filter((change) => {
      return !change.baseline_present && change.candidate_present;
    }).length;
    const removedCount = comparison.check_changes.filter((change) => {
      return change.baseline_present && !change.candidate_present;
    }).length;

    if (comparison.changed_check_count !== changedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "changed_check_count must match check changes",
        path: ["changed_check_count"]
      });
    }

    if (comparison.added_check_count !== addedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "added_check_count must match check changes",
        path: ["added_check_count"]
      });
    }

    if (comparison.removed_check_count !== removedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "removed_check_count must match check changes",
        path: ["removed_check_count"]
      });
    }
  });

export type LocalProtectedLoopEvidenceThresholdCountDelta = z.infer<
  typeof LocalProtectedLoopEvidenceThresholdCountDeltaSchema
>;
export type LocalProtectedLoopEvidenceThresholdCheckChange = z.infer<
  typeof LocalProtectedLoopEvidenceThresholdCheckChangeSchema
>;
export type LocalProtectedLoopEvidenceThresholdResultComparison = z.infer<
  typeof LocalProtectedLoopEvidenceThresholdResultComparisonSchema
>;

export function compareLocalProtectedLoopEvidenceThresholdResults(
  baselineResultInput: LocalProtectedLoopEvidenceThresholdResult,
  candidateResultInput: LocalProtectedLoopEvidenceThresholdResult,
  generatedAt: string
): LocalProtectedLoopEvidenceThresholdResultComparison {
  const baselineResult = LocalProtectedLoopEvidenceThresholdResultSchema.parse(baselineResultInput);
  const candidateResult =
    LocalProtectedLoopEvidenceThresholdResultSchema.parse(candidateResultInput);
  const checkChanges = createCheckChanges(baselineResult.checks, candidateResult.checks);

  return LocalProtectedLoopEvidenceThresholdResultComparisonSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    generated_at: generatedAt,
    baseline_generated_at: baselineResult.generated_at,
    candidate_generated_at: candidateResult.generated_at,
    baseline_threshold_status: baselineResult.threshold_status,
    candidate_threshold_status: candidateResult.threshold_status,
    status_changed: baselineResult.threshold_status !== candidateResult.threshold_status,
    review_record_count: countDelta(
      baselineResult.review_record_count,
      candidateResult.review_record_count
    ),
    check_count: countDelta(baselineResult.check_count, candidateResult.check_count),
    met_count: countDelta(baselineResult.met_count, candidateResult.met_count),
    needs_review_count: countDelta(
      baselineResult.needs_review_count,
      candidateResult.needs_review_count
    ),
    blocked_count: countDelta(baselineResult.blocked_count, candidateResult.blocked_count),
    changed_check_count: checkChanges.filter((change) => {
      return change.status_changed || change.passed_changed;
    }).length,
    added_check_count: checkChanges.filter((change) => {
      return !change.baseline_present && change.candidate_present;
    }).length,
    removed_check_count: checkChanges.filter((change) => {
      return change.baseline_present && !change.candidate_present;
    }).length,
    check_changes: checkChanges
  });
}

function countDelta(
  baselineCount: number,
  candidateCount: number
): LocalProtectedLoopEvidenceThresholdCountDelta {
  return LocalProtectedLoopEvidenceThresholdCountDeltaSchema.parse({
    baseline_count: baselineCount,
    candidate_count: candidateCount,
    delta: candidateCount - baselineCount
  });
}

function createCheckChanges(
  baselineChecks: readonly LocalProtectedLoopEvidenceThresholdCheck[],
  candidateChecks: readonly LocalProtectedLoopEvidenceThresholdCheck[]
): readonly LocalProtectedLoopEvidenceThresholdCheckChange[] {
  const baselineById = new Map(baselineChecks.map((check) => [check.check_id, check]));
  const candidateById = new Map(candidateChecks.map((check) => [check.check_id, check]));
  const checkIds = Array.from(new Set([...baselineById.keys(), ...candidateById.keys()])).sort();

  return checkIds.map((checkId) => {
    return createCheckChange(baselineById.get(checkId), candidateById.get(checkId), checkId);
  });
}

function createCheckChange(
  baselineCheck: LocalProtectedLoopEvidenceThresholdCheck | undefined,
  candidateCheck: LocalProtectedLoopEvidenceThresholdCheck | undefined,
  checkId: LocalProtectedLoopEvidenceThresholdCheck["check_id"]
): LocalProtectedLoopEvidenceThresholdCheckChange {
  const bothPresent = baselineCheck !== undefined && candidateCheck !== undefined;

  return LocalProtectedLoopEvidenceThresholdCheckChangeSchema.parse({
    check_id: checkId,
    baseline_present: baselineCheck !== undefined,
    candidate_present: candidateCheck !== undefined,
    baseline_status: baselineCheck?.status,
    candidate_status: candidateCheck?.status,
    status_changed: bothPresent ? baselineCheck.status !== candidateCheck.status : false,
    baseline_passed: baselineCheck?.passed,
    candidate_passed: candidateCheck?.passed,
    passed_changed: bothPresent ? baselineCheck.passed !== candidateCheck.passed : false,
    observed_count_delta: bothPresent
      ? candidateCheck.observed_count - baselineCheck.observed_count
      : undefined,
    threshold_count_delta: bothPresent
      ? candidateCheck.threshold_count - baselineCheck.threshold_count
      : undefined
  });
}
