import { z } from "zod";
import {
  ContractValidationError,
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  type StrategyDecisionTraceEventType
} from "../../contracts/src/index.js";
import {
  type LocalReviewBundleQuery,
  queryLocalReviewBundleLogRecords,
  queryLocalReviewBundleLogRecordsWithGuard
} from "./local-review-bundle-query.js";
import { type LocalReviewBundleLogRecord } from "./local-review-bundle-log.js";

export const LocalReviewArtifactInventoryItemSchema = z
  .object({
    artifact_type: z.enum(STRATEGY_DECISION_TRACE_EVENT_ORDER),
    artifact_id: z.string().trim().min(1),
    bundle_artifact_present: z.literal(true),
    trace_event_present: z.boolean(),
    trace_reference_matches: z.boolean()
  })
  .strict();

export const LocalReviewArtifactInventorySchema = z
  .object({
    strategy_review_bundle_id: z.string().trim().min(1),
    trace_id: z.string().trim().min(1),
    strategy_id: z.string().trim().min(1),
    strategy_version: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    artifact_count: z.number().int().nonnegative(),
    present_artifact_count: z.number().int().nonnegative(),
    trace_matched_artifact_count: z.number().int().nonnegative(),
    complete: z.boolean(),
    artifacts: z.array(LocalReviewArtifactInventoryItemSchema)
  })
  .strict()
  .superRefine((inventory, context) => {
    if (inventory.artifact_count !== STRATEGY_DECISION_TRACE_EVENT_ORDER.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "artifact_count must match protected loop length",
        path: ["artifact_count"]
      });
    }

    if (inventory.present_artifact_count !== inventory.artifacts.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "present_artifact_count must match artifacts length",
        path: ["present_artifact_count"]
      });
    }

    const matchedCount = inventory.artifacts.filter((artifact) => {
      return artifact.trace_event_present && artifact.trace_reference_matches;
    }).length;

    if (inventory.trace_matched_artifact_count !== matchedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "trace_matched_artifact_count must match trace-matched artifacts",
        path: ["trace_matched_artifact_count"]
      });
    }

    if (inventory.complete !== (matchedCount === STRATEGY_DECISION_TRACE_EVENT_ORDER.length)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "complete must reflect trace-matched artifact coverage",
        path: ["complete"]
      });
    }
  });

export type LocalReviewArtifactInventoryItem = z.infer<
  typeof LocalReviewArtifactInventoryItemSchema
>;
export type LocalReviewArtifactInventory = z.infer<typeof LocalReviewArtifactInventorySchema>;

export interface CreateLocalReviewArtifactInventoryQueryInput {
  readonly logFilePath: string;
  readonly query: LocalReviewBundleQuery;
}

export interface CreateLocalReviewArtifactInventoryQueryWithGuardInput {
  readonly baseDirectory: string;
  readonly relativeLogPath: string;
  readonly query: LocalReviewBundleQuery;
}

export function createLocalReviewArtifactInventory(
  record: LocalReviewBundleLogRecord
): LocalReviewArtifactInventory {
  const artifacts = STRATEGY_DECISION_TRACE_EVENT_ORDER.map((artifactType) => {
    return createArtifactInventoryItem(record, artifactType);
  });
  const traceMatchedArtifactCount = artifacts.filter((artifact) => {
    return artifact.trace_event_present && artifact.trace_reference_matches;
  }).length;

  if (traceMatchedArtifactCount !== STRATEGY_DECISION_TRACE_EVENT_ORDER.length) {
    throw new ContractValidationError("review artifact inventory trace references do not match");
  }

  return LocalReviewArtifactInventorySchema.parse({
    strategy_review_bundle_id: record.strategy_review_bundle_id,
    trace_id: record.trace_id,
    strategy_id: record.strategy_id,
    strategy_version: record.strategy_version,
    financial_gate: record.financial_gate,
    artifact_count: STRATEGY_DECISION_TRACE_EVENT_ORDER.length,
    present_artifact_count: artifacts.length,
    trace_matched_artifact_count: traceMatchedArtifactCount,
    complete: traceMatchedArtifactCount === STRATEGY_DECISION_TRACE_EVENT_ORDER.length,
    artifacts
  });
}

export function createLocalReviewArtifactInventories(
  records: readonly LocalReviewBundleLogRecord[]
): readonly LocalReviewArtifactInventory[] {
  return records.map((record) => createLocalReviewArtifactInventory(record));
}

export async function createLocalReviewArtifactInventoryQuery(
  input: CreateLocalReviewArtifactInventoryQueryInput
): Promise<readonly LocalReviewArtifactInventory[]> {
  const records = await queryLocalReviewBundleLogRecords(input);

  return createLocalReviewArtifactInventories(records);
}

export async function createLocalReviewArtifactInventoryQueryWithGuard(
  input: CreateLocalReviewArtifactInventoryQueryWithGuardInput
): Promise<readonly LocalReviewArtifactInventory[]> {
  const records = await queryLocalReviewBundleLogRecordsWithGuard(input);

  return createLocalReviewArtifactInventories(records);
}

function createArtifactInventoryItem(
  record: LocalReviewBundleLogRecord,
  artifactType: StrategyDecisionTraceEventType
): LocalReviewArtifactInventoryItem {
  const artifactId = getBundleArtifactId(record, artifactType);
  const traceEvent = record.bundle.trace.events.find((event) => event.event_type === artifactType);

  return LocalReviewArtifactInventoryItemSchema.parse({
    artifact_type: artifactType,
    artifact_id: artifactId,
    bundle_artifact_present: true,
    trace_event_present: traceEvent !== undefined,
    trace_reference_matches: traceEvent?.artifact_ref.id === artifactId
  });
}

function getBundleArtifactId(
  record: LocalReviewBundleLogRecord,
  artifactType: StrategyDecisionTraceEventType
): string {
  switch (artifactType) {
    case "strategy_idea":
      return record.bundle.strategy_idea.strategy_id;
    case "data_snapshot":
      return record.bundle.data_snapshot.data_snapshot_id;
    case "backtest":
      return record.bundle.backtest_result.backtest_result_id;
    case "metric_report":
      return record.bundle.metric_report.metric_report_id;
    case "risk_review":
      return record.bundle.risk_review.risk_review_id;
    case "operator_decision":
      return record.bundle.operator_decision.operator_decision_id;
    case "outcome_logged":
      return record.bundle.outcome_log.outcome_log_id;
    case "learning_event":
      return record.bundle.learning_event.learning_event_id;
  }
}
