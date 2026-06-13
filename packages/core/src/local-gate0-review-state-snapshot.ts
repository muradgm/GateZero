import { z } from "zod";
import {
  LocalProtectedLoopDiagnosticAggregateSchema,
  aggregateLocalProtectedLoopDiagnostics,
  type LocalProtectedLoopDiagnosticAggregate
} from "./local-protected-loop-diagnostic-aggregate.js";
import {
  LocalProtectedLoopDiagnosticStatusSchema,
  createLocalProtectedLoopDiagnostics
} from "./local-protected-loop-diagnostic.js";
import {
  createLocalOperatorReviewChecklist,
  type LocalOperatorReviewChecklist
} from "./local-operator-review-checklist.js";
import {
  LocalOperatorReviewScoreAggregateSchema,
  scoreLocalOperatorReviewChecklists
} from "./local-operator-review-score.js";
import {
  createLocalReviewArtifactInventories,
  type LocalReviewArtifactInventory
} from "./local-review-artifact-inventory.js";
import {
  type LocalReviewBundleQuery,
  queryLocalReviewBundleLogRecords,
  queryLocalReviewBundleLogRecordsWithGuard
} from "./local-review-bundle-query.js";
import { type LocalReviewBundleLogRecord } from "./local-review-bundle-log.js";
import { createRedactedLocalReviewBundleSummary } from "./local-review-bundle-redacted-summary.js";
import { summarizeLocalReviewBundleRecord } from "./local-review-bundle-summary.js";

export const LocalGate0ReviewArtifactInventoryAggregateSchema = z
  .object({
    inventory_count: z.number().int().nonnegative(),
    artifact_count: z.number().int().nonnegative(),
    present_artifact_count: z.number().int().nonnegative(),
    trace_matched_artifact_count: z.number().int().nonnegative(),
    complete_count: z.number().int().nonnegative(),
    incomplete_count: z.number().int().nonnegative()
  })
  .strict()
  .superRefine((aggregate, context) => {
    if (aggregate.inventory_count !== aggregate.complete_count + aggregate.incomplete_count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "inventory_count must equal complete and incomplete counts",
        path: ["inventory_count"]
      });
    }
  });

export const LocalGate0ReviewStateSnapshotSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    snapshot_status: LocalProtectedLoopDiagnosticStatusSchema,
    review_record_count: z.number().int().nonnegative(),
    generated_at: z.string().datetime({ offset: true }),
    diagnostic_aggregate: LocalProtectedLoopDiagnosticAggregateSchema,
    checklist_score: LocalOperatorReviewScoreAggregateSchema,
    artifact_inventory: LocalGate0ReviewArtifactInventoryAggregateSchema,
    reviews: z.array(
      z
        .object({
          strategy_review_bundle_id: z.string().trim().min(1),
          trace_id: z.string().trim().min(1),
          strategy_id: z.string().trim().min(1),
          strategy_version: z.string().trim().min(1)
        })
        .strict()
    )
  })
  .strict()
  .superRefine((snapshot, context) => {
    if (snapshot.snapshot_status !== snapshot.diagnostic_aggregate.aggregate_status) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "snapshot_status must match diagnostic aggregate status",
        path: ["snapshot_status"]
      });
    }

    if (snapshot.review_record_count !== snapshot.reviews.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "review_record_count must match reviews length",
        path: ["review_record_count"]
      });
    }

    if (snapshot.diagnostic_aggregate.diagnostic_count !== snapshot.review_record_count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "diagnostic count must match review_record_count",
        path: ["diagnostic_aggregate", "diagnostic_count"]
      });
    }

    if (snapshot.checklist_score.checklist_count !== snapshot.review_record_count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "checklist count must match review_record_count",
        path: ["checklist_score", "checklist_count"]
      });
    }

    if (snapshot.artifact_inventory.inventory_count !== snapshot.review_record_count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "inventory count must match review_record_count",
        path: ["artifact_inventory", "inventory_count"]
      });
    }
  });

export type LocalGate0ReviewArtifactInventoryAggregate = z.infer<
  typeof LocalGate0ReviewArtifactInventoryAggregateSchema
>;
export type LocalGate0ReviewStateSnapshot = z.infer<typeof LocalGate0ReviewStateSnapshotSchema>;

export interface CreateLocalGate0ReviewStateSnapshotQueryInput {
  readonly logFilePath: string;
  readonly query: LocalReviewBundleQuery;
  readonly generatedAt: string;
}

export interface CreateLocalGate0ReviewStateSnapshotQueryWithGuardInput {
  readonly baseDirectory: string;
  readonly relativeLogPath: string;
  readonly query: LocalReviewBundleQuery;
  readonly generatedAt: string;
}

export function createLocalGate0ReviewStateSnapshot(
  records: readonly LocalReviewBundleLogRecord[],
  generatedAt: string
): LocalGate0ReviewStateSnapshot {
  const diagnostics = createLocalProtectedLoopDiagnostics(records, generatedAt);
  const diagnosticAggregate = aggregateLocalProtectedLoopDiagnostics(diagnostics, generatedAt);
  const checklistScore = scoreLocalOperatorReviewChecklists(createChecklists(records));
  const artifactInventory = aggregateArtifactInventories(
    createLocalReviewArtifactInventories(records)
  );

  return createSnapshot(
    records,
    generatedAt,
    diagnosticAggregate,
    checklistScore,
    artifactInventory
  );
}

export async function createLocalGate0ReviewStateSnapshotQuery(
  input: CreateLocalGate0ReviewStateSnapshotQueryInput
): Promise<LocalGate0ReviewStateSnapshot> {
  const records = await queryLocalReviewBundleLogRecords(input);

  return createLocalGate0ReviewStateSnapshot(records, input.generatedAt);
}

export async function createLocalGate0ReviewStateSnapshotQueryWithGuard(
  input: CreateLocalGate0ReviewStateSnapshotQueryWithGuardInput
): Promise<LocalGate0ReviewStateSnapshot> {
  const records = await queryLocalReviewBundleLogRecordsWithGuard(input);

  return createLocalGate0ReviewStateSnapshot(records, input.generatedAt);
}

function createSnapshot(
  records: readonly LocalReviewBundleLogRecord[],
  generatedAt: string,
  diagnosticAggregate: LocalProtectedLoopDiagnosticAggregate,
  checklistScore: ReturnType<typeof scoreLocalOperatorReviewChecklists>,
  artifactInventory: LocalGate0ReviewArtifactInventoryAggregate
): LocalGate0ReviewStateSnapshot {
  return LocalGate0ReviewStateSnapshotSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    snapshot_status: diagnosticAggregate.aggregate_status,
    review_record_count: records.length,
    generated_at: generatedAt,
    diagnostic_aggregate: diagnosticAggregate,
    checklist_score: checklistScore,
    artifact_inventory: artifactInventory,
    reviews: records.map((record) => {
      return {
        strategy_review_bundle_id: record.strategy_review_bundle_id,
        trace_id: record.trace_id,
        strategy_id: record.strategy_id,
        strategy_version: record.strategy_version
      };
    })
  });
}

function createChecklists(
  records: readonly LocalReviewBundleLogRecord[]
): readonly LocalOperatorReviewChecklist[] {
  return records.map((record) => {
    const summary = summarizeLocalReviewBundleRecord(record);
    const redactedSummary = createRedactedLocalReviewBundleSummary(summary);

    return createLocalOperatorReviewChecklist(summary, redactedSummary);
  });
}

function aggregateArtifactInventories(
  inventories: readonly LocalReviewArtifactInventory[]
): LocalGate0ReviewArtifactInventoryAggregate {
  const completeCount = inventories.filter((inventory) => inventory.complete).length;

  return LocalGate0ReviewArtifactInventoryAggregateSchema.parse({
    inventory_count: inventories.length,
    artifact_count: sumInventories(inventories, "artifact_count"),
    present_artifact_count: sumInventories(inventories, "present_artifact_count"),
    trace_matched_artifact_count: sumInventories(inventories, "trace_matched_artifact_count"),
    complete_count: completeCount,
    incomplete_count: inventories.length - completeCount
  });
}

function sumInventories(
  inventories: readonly LocalReviewArtifactInventory[],
  key: "artifact_count" | "present_artifact_count" | "trace_matched_artifact_count"
): number {
  return inventories.reduce((total, inventory) => total + inventory[key], 0);
}
