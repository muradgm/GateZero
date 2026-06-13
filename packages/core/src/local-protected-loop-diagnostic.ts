import { z } from "zod";
import { createLocalOperatorReviewChecklist } from "./local-operator-review-checklist.js";
import {
  LocalOperatorReviewScoreStatusSchema,
  scoreLocalOperatorReviewChecklist,
  type LocalOperatorReviewScore
} from "./local-operator-review-score.js";
import {
  createLocalReviewArtifactInventory,
  type LocalReviewArtifactInventory
} from "./local-review-artifact-inventory.js";
import {
  type LocalReviewBundleQuery,
  queryLocalReviewBundleLogRecords,
  queryLocalReviewBundleLogRecordsWithGuard
} from "./local-review-bundle-query.js";
import { type LocalReviewBundleLogRecord } from "./local-review-bundle-log.js";
import {
  checkLocalReviewBundleSummaryRedaction,
  type LocalReviewBundleRedactionCheck
} from "./local-review-bundle-redaction.js";
import { createRedactedLocalReviewBundleSummary } from "./local-review-bundle-redacted-summary.js";
import { summarizeLocalReviewBundleRecord } from "./local-review-bundle-summary.js";

export const LocalProtectedLoopDiagnosticStatusSchema = z.enum([
  "complete",
  "needs_review",
  "blocked"
]);

export const LocalProtectedLoopDiagnosticSchema = z
  .object({
    strategy_review_bundle_id: z.string().trim().min(1),
    trace_id: z.string().trim().min(1),
    strategy_id: z.string().trim().min(1),
    strategy_version: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    diagnostic_status: LocalProtectedLoopDiagnosticStatusSchema,
    artifact_inventory: z
      .object({
        complete: z.boolean(),
        artifact_count: z.number().int().nonnegative(),
        trace_matched_artifact_count: z.number().int().nonnegative()
      })
      .strict(),
    checklist_score: z
      .object({
        status: LocalOperatorReviewScoreStatusSchema,
        item_count: z.number().int().nonnegative(),
        needs_review_count: z.number().int().nonnegative(),
        blocked_count: z.number().int().nonnegative()
      })
      .strict(),
    redaction_status: z
      .object({
        local_operator_findings: z.literal(0),
        outside_local_review_findings: z.number().int().nonnegative()
      })
      .strict(),
    generated_at: z.string().datetime({ offset: true })
  })
  .strict();

export type LocalProtectedLoopDiagnosticStatus = z.infer<
  typeof LocalProtectedLoopDiagnosticStatusSchema
>;
export type LocalProtectedLoopDiagnostic = z.infer<typeof LocalProtectedLoopDiagnosticSchema>;

export interface CreateLocalProtectedLoopDiagnosticQueryInput {
  readonly logFilePath: string;
  readonly query: LocalReviewBundleQuery;
  readonly generatedAt: string;
}

export interface CreateLocalProtectedLoopDiagnosticQueryWithGuardInput {
  readonly baseDirectory: string;
  readonly relativeLogPath: string;
  readonly query: LocalReviewBundleQuery;
  readonly generatedAt: string;
}

interface DiagnosticParts {
  readonly score: LocalOperatorReviewScore;
  readonly inventory: LocalReviewArtifactInventory;
  readonly localRedactionCheck: LocalReviewBundleRedactionCheck;
  readonly outsideRedactionCheck: LocalReviewBundleRedactionCheck;
}

export function createLocalProtectedLoopDiagnostic(
  record: LocalReviewBundleLogRecord,
  generatedAt: string
): LocalProtectedLoopDiagnostic {
  const summary = summarizeLocalReviewBundleRecord(record);
  const redactedSummary = createRedactedLocalReviewBundleSummary(summary);
  const checklist = createLocalOperatorReviewChecklist(summary, redactedSummary);
  const score = scoreLocalOperatorReviewChecklist(checklist);
  const inventory = createLocalReviewArtifactInventory(record);
  const localRedactionCheck = checkLocalReviewBundleSummaryRedaction(
    summary,
    "local_operator_review"
  );
  const outsideRedactionCheck = checkLocalReviewBundleSummaryRedaction(
    summary,
    "outside_local_review"
  );

  return createDiagnosticFromParts(record, generatedAt, {
    score,
    inventory,
    localRedactionCheck,
    outsideRedactionCheck
  });
}

export function createLocalProtectedLoopDiagnostics(
  records: readonly LocalReviewBundleLogRecord[],
  generatedAt: string
): readonly LocalProtectedLoopDiagnostic[] {
  return records.map((record) => createLocalProtectedLoopDiagnostic(record, generatedAt));
}

export async function createLocalProtectedLoopDiagnosticQuery(
  input: CreateLocalProtectedLoopDiagnosticQueryInput
): Promise<readonly LocalProtectedLoopDiagnostic[]> {
  const records = await queryLocalReviewBundleLogRecords(input);

  return createLocalProtectedLoopDiagnostics(records, input.generatedAt);
}

export async function createLocalProtectedLoopDiagnosticQueryWithGuard(
  input: CreateLocalProtectedLoopDiagnosticQueryWithGuardInput
): Promise<readonly LocalProtectedLoopDiagnostic[]> {
  const records = await queryLocalReviewBundleLogRecordsWithGuard(input);

  return createLocalProtectedLoopDiagnostics(records, input.generatedAt);
}

function createDiagnosticFromParts(
  record: LocalReviewBundleLogRecord,
  generatedAt: string,
  parts: DiagnosticParts
): LocalProtectedLoopDiagnostic {
  return LocalProtectedLoopDiagnosticSchema.parse({
    strategy_review_bundle_id: record.strategy_review_bundle_id,
    trace_id: record.trace_id,
    strategy_id: record.strategy_id,
    strategy_version: record.strategy_version,
    financial_gate: record.financial_gate,
    scope: "research_only",
    diagnostic_status: getDiagnosticStatus(parts.inventory, parts.score),
    artifact_inventory: {
      complete: parts.inventory.complete,
      artifact_count: parts.inventory.artifact_count,
      trace_matched_artifact_count: parts.inventory.trace_matched_artifact_count
    },
    checklist_score: {
      status: parts.score.status,
      item_count: parts.score.item_count,
      needs_review_count: parts.score.needs_review_count,
      blocked_count: parts.score.blocked_count
    },
    redaction_status: {
      local_operator_findings: parts.localRedactionCheck.finding_count,
      outside_local_review_findings: parts.outsideRedactionCheck.finding_count
    },
    generated_at: generatedAt
  });
}

function getDiagnosticStatus(
  inventory: LocalReviewArtifactInventory,
  score: LocalOperatorReviewScore
): LocalProtectedLoopDiagnosticStatus {
  if (!inventory.complete || score.status === "blocked") {
    return "blocked";
  }

  if (score.status === "needs_review") {
    return "needs_review";
  }

  return "complete";
}
