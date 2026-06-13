import { z } from "zod";
import {
  LocalProtectedLoopDiagnosticStatusSchema,
  createLocalProtectedLoopDiagnosticQuery,
  createLocalProtectedLoopDiagnosticQueryWithGuard,
  type LocalProtectedLoopDiagnostic,
  type LocalProtectedLoopDiagnosticStatus
} from "./local-protected-loop-diagnostic.js";
import {
  type CreateLocalProtectedLoopDiagnosticQueryInput,
  type CreateLocalProtectedLoopDiagnosticQueryWithGuardInput
} from "./local-protected-loop-diagnostic.js";

export const LocalProtectedLoopDiagnosticAggregateSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    aggregate_status: LocalProtectedLoopDiagnosticStatusSchema,
    diagnostic_count: z.number().int().nonnegative(),
    complete_count: z.number().int().nonnegative(),
    needs_review_count: z.number().int().nonnegative(),
    blocked_count: z.number().int().nonnegative(),
    artifact_count: z.number().int().nonnegative(),
    trace_matched_artifact_count: z.number().int().nonnegative(),
    checklist_item_count: z.number().int().nonnegative(),
    checklist_needs_review_count: z.number().int().nonnegative(),
    checklist_blocked_count: z.number().int().nonnegative(),
    outside_local_review_redaction_finding_count: z.number().int().nonnegative(),
    generated_at: z.string().datetime({ offset: true }),
    diagnostics: z.array(
      z
        .object({
          strategy_review_bundle_id: z.string().trim().min(1),
          trace_id: z.string().trim().min(1),
          strategy_id: z.string().trim().min(1),
          diagnostic_status: LocalProtectedLoopDiagnosticStatusSchema
        })
        .strict()
    )
  })
  .strict()
  .superRefine((aggregate, context) => {
    if (aggregate.diagnostic_count !== aggregate.diagnostics.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "diagnostic_count must match diagnostics length",
        path: ["diagnostic_count"]
      });
    }

    if (aggregate.complete_count !== countDiagnosticRefs(aggregate.diagnostics, "complete")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "complete_count must match diagnostics",
        path: ["complete_count"]
      });
    }

    if (
      aggregate.needs_review_count !== countDiagnosticRefs(aggregate.diagnostics, "needs_review")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "needs_review_count must match diagnostics",
        path: ["needs_review_count"]
      });
    }

    if (aggregate.blocked_count !== countDiagnosticRefs(aggregate.diagnostics, "blocked")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_count must match diagnostics",
        path: ["blocked_count"]
      });
    }
  });

export type LocalProtectedLoopDiagnosticAggregate = z.infer<
  typeof LocalProtectedLoopDiagnosticAggregateSchema
>;

type DiagnosticRef = LocalProtectedLoopDiagnosticAggregate["diagnostics"][number];

export function aggregateLocalProtectedLoopDiagnostics(
  diagnostics: readonly LocalProtectedLoopDiagnostic[],
  generatedAt: string
): LocalProtectedLoopDiagnosticAggregate {
  const blockedCount = countDiagnostics(diagnostics, "blocked");
  const needsReviewCount = countDiagnostics(diagnostics, "needs_review");

  return LocalProtectedLoopDiagnosticAggregateSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    aggregate_status: getAggregateStatus(blockedCount, needsReviewCount),
    diagnostic_count: diagnostics.length,
    complete_count: countDiagnostics(diagnostics, "complete"),
    needs_review_count: needsReviewCount,
    blocked_count: blockedCount,
    artifact_count: sumDiagnostics(diagnostics, "artifact_inventory", "artifact_count"),
    trace_matched_artifact_count: sumDiagnostics(
      diagnostics,
      "artifact_inventory",
      "trace_matched_artifact_count"
    ),
    checklist_item_count: sumDiagnostics(diagnostics, "checklist_score", "item_count"),
    checklist_needs_review_count: sumDiagnostics(
      diagnostics,
      "checklist_score",
      "needs_review_count"
    ),
    checklist_blocked_count: sumDiagnostics(diagnostics, "checklist_score", "blocked_count"),
    outside_local_review_redaction_finding_count: sumDiagnostics(
      diagnostics,
      "redaction_status",
      "outside_local_review_findings"
    ),
    generated_at: generatedAt,
    diagnostics: diagnostics.map((diagnostic) => {
      return {
        strategy_review_bundle_id: diagnostic.strategy_review_bundle_id,
        trace_id: diagnostic.trace_id,
        strategy_id: diagnostic.strategy_id,
        diagnostic_status: diagnostic.diagnostic_status
      };
    })
  });
}

export async function aggregateLocalProtectedLoopDiagnosticQuery(
  input: CreateLocalProtectedLoopDiagnosticQueryInput
): Promise<LocalProtectedLoopDiagnosticAggregate> {
  const diagnostics = await createLocalProtectedLoopDiagnosticQuery(input);

  return aggregateLocalProtectedLoopDiagnostics(diagnostics, input.generatedAt);
}

export async function aggregateLocalProtectedLoopDiagnosticQueryWithGuard(
  input: CreateLocalProtectedLoopDiagnosticQueryWithGuardInput
): Promise<LocalProtectedLoopDiagnosticAggregate> {
  const diagnostics = await createLocalProtectedLoopDiagnosticQueryWithGuard(input);

  return aggregateLocalProtectedLoopDiagnostics(diagnostics, input.generatedAt);
}

function countDiagnostics(
  diagnostics: readonly LocalProtectedLoopDiagnostic[],
  status: LocalProtectedLoopDiagnosticStatus
): number {
  return diagnostics.filter((diagnostic) => diagnostic.diagnostic_status === status).length;
}

function countDiagnosticRefs(
  diagnostics: readonly DiagnosticRef[],
  status: LocalProtectedLoopDiagnosticStatus
): number {
  return diagnostics.filter((diagnostic) => diagnostic.diagnostic_status === status).length;
}

function getAggregateStatus(
  blockedCount: number,
  needsReviewCount: number
): LocalProtectedLoopDiagnosticStatus {
  if (blockedCount > 0) {
    return "blocked";
  }

  if (needsReviewCount > 0) {
    return "needs_review";
  }

  return "complete";
}

function sumDiagnostics(
  diagnostics: readonly LocalProtectedLoopDiagnostic[],
  section: "artifact_inventory" | "checklist_score" | "redaction_status",
  key:
    | "artifact_count"
    | "trace_matched_artifact_count"
    | "item_count"
    | "needs_review_count"
    | "blocked_count"
    | "outside_local_review_findings"
): number {
  return diagnostics.reduce((total, diagnostic) => {
    const sectionValue = diagnostic[section] as Record<string, number | boolean>;
    const value = sectionValue[key];

    return typeof value === "number" ? total + value : total;
  }, 0);
}
