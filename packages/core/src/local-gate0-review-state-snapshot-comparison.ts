import { z } from "zod";
import {
  LocalGate0ReviewStateSnapshotSchema,
  type LocalGate0ReviewStateSnapshot
} from "./local-gate0-review-state-snapshot.js";
import { LocalProtectedLoopDiagnosticStatusSchema } from "./local-protected-loop-diagnostic.js";

const CountDeltaSchema = z.number().int();

const ReviewReferenceSchema = z
  .object({
    strategy_review_bundle_id: z.string().trim().min(1),
    trace_id: z.string().trim().min(1),
    strategy_id: z.string().trim().min(1),
    strategy_version: z.string().trim().min(1)
  })
  .strict();

export const LocalGate0ReviewCountDeltaSchema = z
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

export const LocalGate0ReviewDiagnosticDeltaSchema = z
  .object({
    diagnostic_count_delta: CountDeltaSchema,
    complete_count_delta: CountDeltaSchema,
    needs_review_count_delta: CountDeltaSchema,
    blocked_count_delta: CountDeltaSchema,
    artifact_count_delta: CountDeltaSchema,
    trace_matched_artifact_count_delta: CountDeltaSchema,
    checklist_item_count_delta: CountDeltaSchema,
    checklist_needs_review_count_delta: CountDeltaSchema,
    checklist_blocked_count_delta: CountDeltaSchema,
    outside_local_review_redaction_finding_count_delta: CountDeltaSchema
  })
  .strict();

export const LocalGate0ReviewChecklistScoreDeltaSchema = z
  .object({
    checklist_count_delta: CountDeltaSchema,
    item_count_delta: CountDeltaSchema,
    complete_count_delta: CountDeltaSchema,
    needs_review_count_delta: CountDeltaSchema,
    blocked_count_delta: CountDeltaSchema
  })
  .strict();

export const LocalGate0ReviewArtifactInventoryDeltaSchema = z
  .object({
    inventory_count_delta: CountDeltaSchema,
    artifact_count_delta: CountDeltaSchema,
    present_artifact_count_delta: CountDeltaSchema,
    trace_matched_artifact_count_delta: CountDeltaSchema,
    complete_count_delta: CountDeltaSchema,
    incomplete_count_delta: CountDeltaSchema
  })
  .strict();

export const LocalGate0ReviewReferenceChangesSchema = z
  .object({
    added_count: z.number().int().nonnegative(),
    removed_count: z.number().int().nonnegative(),
    retained_count: z.number().int().nonnegative(),
    added: z.array(ReviewReferenceSchema),
    removed: z.array(ReviewReferenceSchema),
    retained: z.array(ReviewReferenceSchema)
  })
  .strict()
  .superRefine((changes, context) => {
    if (changes.added_count !== changes.added.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "added_count must match added length",
        path: ["added_count"]
      });
    }

    if (changes.removed_count !== changes.removed.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "removed_count must match removed length",
        path: ["removed_count"]
      });
    }

    if (changes.retained_count !== changes.retained.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "retained_count must match retained length",
        path: ["retained_count"]
      });
    }
  });

export const LocalGate0ReviewStateSnapshotComparisonSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    generated_at: z.string().datetime({ offset: true }),
    baseline_generated_at: z.string().datetime({ offset: true }),
    candidate_generated_at: z.string().datetime({ offset: true }),
    baseline_snapshot_status: LocalProtectedLoopDiagnosticStatusSchema,
    candidate_snapshot_status: LocalProtectedLoopDiagnosticStatusSchema,
    status_changed: z.boolean(),
    review_record_count: LocalGate0ReviewCountDeltaSchema,
    diagnostic_delta: LocalGate0ReviewDiagnosticDeltaSchema,
    checklist_score_delta: LocalGate0ReviewChecklistScoreDeltaSchema,
    artifact_inventory_delta: LocalGate0ReviewArtifactInventoryDeltaSchema,
    review_reference_changes: LocalGate0ReviewReferenceChangesSchema
  })
  .strict()
  .superRefine((comparison, context) => {
    if (
      comparison.status_changed !==
      (comparison.baseline_snapshot_status !== comparison.candidate_snapshot_status)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "status_changed must reflect snapshot status equality",
        path: ["status_changed"]
      });
    }
  });

export type LocalGate0ReviewCountDelta = z.infer<typeof LocalGate0ReviewCountDeltaSchema>;
export type LocalGate0ReviewDiagnosticDelta = z.infer<typeof LocalGate0ReviewDiagnosticDeltaSchema>;
export type LocalGate0ReviewChecklistScoreDelta = z.infer<
  typeof LocalGate0ReviewChecklistScoreDeltaSchema
>;
export type LocalGate0ReviewArtifactInventoryDelta = z.infer<
  typeof LocalGate0ReviewArtifactInventoryDeltaSchema
>;
export type LocalGate0ReviewReferenceChanges = z.infer<
  typeof LocalGate0ReviewReferenceChangesSchema
>;
export type LocalGate0ReviewStateSnapshotComparison = z.infer<
  typeof LocalGate0ReviewStateSnapshotComparisonSchema
>;

export function compareLocalGate0ReviewStateSnapshots(
  baselineSnapshot: LocalGate0ReviewStateSnapshot,
  candidateSnapshot: LocalGate0ReviewStateSnapshot,
  generatedAt: string
): LocalGate0ReviewStateSnapshotComparison {
  const baseline = LocalGate0ReviewStateSnapshotSchema.parse(baselineSnapshot);
  const candidate = LocalGate0ReviewStateSnapshotSchema.parse(candidateSnapshot);

  return LocalGate0ReviewStateSnapshotComparisonSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    generated_at: generatedAt,
    baseline_generated_at: baseline.generated_at,
    candidate_generated_at: candidate.generated_at,
    baseline_snapshot_status: baseline.snapshot_status,
    candidate_snapshot_status: candidate.snapshot_status,
    status_changed: baseline.snapshot_status !== candidate.snapshot_status,
    review_record_count: countDelta(baseline.review_record_count, candidate.review_record_count),
    diagnostic_delta: createDiagnosticDelta(baseline, candidate),
    checklist_score_delta: createChecklistScoreDelta(baseline, candidate),
    artifact_inventory_delta: createArtifactInventoryDelta(baseline, candidate),
    review_reference_changes: createReviewReferenceChanges(baseline, candidate)
  });
}

function countDelta(baselineCount: number, candidateCount: number): LocalGate0ReviewCountDelta {
  return LocalGate0ReviewCountDeltaSchema.parse({
    baseline_count: baselineCount,
    candidate_count: candidateCount,
    delta: candidateCount - baselineCount
  });
}

function createDiagnosticDelta(
  baseline: LocalGate0ReviewStateSnapshot,
  candidate: LocalGate0ReviewStateSnapshot
): LocalGate0ReviewDiagnosticDelta {
  const baselineDiagnostic = baseline.diagnostic_aggregate;
  const candidateDiagnostic = candidate.diagnostic_aggregate;

  return LocalGate0ReviewDiagnosticDeltaSchema.parse({
    diagnostic_count_delta:
      candidateDiagnostic.diagnostic_count - baselineDiagnostic.diagnostic_count,
    complete_count_delta: candidateDiagnostic.complete_count - baselineDiagnostic.complete_count,
    needs_review_count_delta:
      candidateDiagnostic.needs_review_count - baselineDiagnostic.needs_review_count,
    blocked_count_delta: candidateDiagnostic.blocked_count - baselineDiagnostic.blocked_count,
    artifact_count_delta: candidateDiagnostic.artifact_count - baselineDiagnostic.artifact_count,
    trace_matched_artifact_count_delta:
      candidateDiagnostic.trace_matched_artifact_count -
      baselineDiagnostic.trace_matched_artifact_count,
    checklist_item_count_delta:
      candidateDiagnostic.checklist_item_count - baselineDiagnostic.checklist_item_count,
    checklist_needs_review_count_delta:
      candidateDiagnostic.checklist_needs_review_count -
      baselineDiagnostic.checklist_needs_review_count,
    checklist_blocked_count_delta:
      candidateDiagnostic.checklist_blocked_count - baselineDiagnostic.checklist_blocked_count,
    outside_local_review_redaction_finding_count_delta:
      candidateDiagnostic.outside_local_review_redaction_finding_count -
      baselineDiagnostic.outside_local_review_redaction_finding_count
  });
}

function createChecklistScoreDelta(
  baseline: LocalGate0ReviewStateSnapshot,
  candidate: LocalGate0ReviewStateSnapshot
): LocalGate0ReviewChecklistScoreDelta {
  return LocalGate0ReviewChecklistScoreDeltaSchema.parse({
    checklist_count_delta:
      candidate.checklist_score.checklist_count - baseline.checklist_score.checklist_count,
    item_count_delta: candidate.checklist_score.item_count - baseline.checklist_score.item_count,
    complete_count_delta:
      candidate.checklist_score.complete_count - baseline.checklist_score.complete_count,
    needs_review_count_delta:
      candidate.checklist_score.needs_review_count - baseline.checklist_score.needs_review_count,
    blocked_count_delta:
      candidate.checklist_score.blocked_count - baseline.checklist_score.blocked_count
  });
}

function createArtifactInventoryDelta(
  baseline: LocalGate0ReviewStateSnapshot,
  candidate: LocalGate0ReviewStateSnapshot
): LocalGate0ReviewArtifactInventoryDelta {
  return LocalGate0ReviewArtifactInventoryDeltaSchema.parse({
    inventory_count_delta:
      candidate.artifact_inventory.inventory_count - baseline.artifact_inventory.inventory_count,
    artifact_count_delta:
      candidate.artifact_inventory.artifact_count - baseline.artifact_inventory.artifact_count,
    present_artifact_count_delta:
      candidate.artifact_inventory.present_artifact_count -
      baseline.artifact_inventory.present_artifact_count,
    trace_matched_artifact_count_delta:
      candidate.artifact_inventory.trace_matched_artifact_count -
      baseline.artifact_inventory.trace_matched_artifact_count,
    complete_count_delta:
      candidate.artifact_inventory.complete_count - baseline.artifact_inventory.complete_count,
    incomplete_count_delta:
      candidate.artifact_inventory.incomplete_count - baseline.artifact_inventory.incomplete_count
  });
}

function createReviewReferenceChanges(
  baseline: LocalGate0ReviewStateSnapshot,
  candidate: LocalGate0ReviewStateSnapshot
): LocalGate0ReviewReferenceChanges {
  const baselineKeys = new Set(baseline.reviews.map((review) => getReviewReferenceKey(review)));
  const candidateKeys = new Set(candidate.reviews.map((review) => getReviewReferenceKey(review)));
  const added = candidate.reviews.filter(
    (review) => !baselineKeys.has(getReviewReferenceKey(review))
  );
  const removed = baseline.reviews.filter(
    (review) => !candidateKeys.has(getReviewReferenceKey(review))
  );
  const retained = candidate.reviews.filter((review) =>
    baselineKeys.has(getReviewReferenceKey(review))
  );

  return LocalGate0ReviewReferenceChangesSchema.parse({
    added_count: added.length,
    removed_count: removed.length,
    retained_count: retained.length,
    added,
    removed,
    retained
  });
}

function getReviewReferenceKey(review: LocalGate0ReviewStateSnapshot["reviews"][number]): string {
  return [
    review.strategy_review_bundle_id,
    review.trace_id,
    review.strategy_id,
    review.strategy_version
  ].join("|");
}
