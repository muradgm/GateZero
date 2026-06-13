import { z } from "zod";
import {
  type LocalOperatorReviewChecklist,
  type LocalOperatorReviewChecklistItemStatus,
  createLocalOperatorReviewChecklistQuery,
  createLocalOperatorReviewChecklistQueryWithGuard
} from "./local-operator-review-checklist.js";
import {
  type SummarizeLocalReviewBundleQueryInput,
  type SummarizeLocalReviewBundleQueryWithGuardInput
} from "./local-review-bundle-summary.js";

export const LocalOperatorReviewScoreStatusSchema = z.enum(["complete", "needs_review", "blocked"]);

export const LocalOperatorReviewScoreSchema = z
  .object({
    strategy_id: z.string().trim().min(1),
    strategy_version: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    status: LocalOperatorReviewScoreStatusSchema,
    item_count: z.number().int().nonnegative(),
    complete_count: z.number().int().nonnegative(),
    needs_review_count: z.number().int().nonnegative(),
    blocked_count: z.number().int().nonnegative(),
    source_recorded_at: z.string().datetime({ offset: true })
  })
  .strict()
  .superRefine((score, context) => {
    const totalCount = score.complete_count + score.needs_review_count + score.blocked_count;

    if (score.item_count !== totalCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "item_count must equal status counts",
        path: ["item_count"]
      });
    }
  });

export const LocalOperatorReviewScoreAggregateSchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    status: LocalOperatorReviewScoreStatusSchema,
    checklist_count: z.number().int().nonnegative(),
    item_count: z.number().int().nonnegative(),
    complete_count: z.number().int().nonnegative(),
    needs_review_count: z.number().int().nonnegative(),
    blocked_count: z.number().int().nonnegative(),
    scores: z.array(LocalOperatorReviewScoreSchema)
  })
  .strict()
  .superRefine((aggregate, context) => {
    if (aggregate.checklist_count !== aggregate.scores.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "checklist_count must match scores length",
        path: ["checklist_count"]
      });
    }

    const itemCount = sumScores(aggregate.scores, "item_count");
    const completeCount = sumScores(aggregate.scores, "complete_count");
    const needsReviewCount = sumScores(aggregate.scores, "needs_review_count");
    const blockedCount = sumScores(aggregate.scores, "blocked_count");

    if (aggregate.item_count !== itemCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "item_count must match score totals",
        path: ["item_count"]
      });
    }

    if (aggregate.complete_count !== completeCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "complete_count must match score totals",
        path: ["complete_count"]
      });
    }

    if (aggregate.needs_review_count !== needsReviewCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "needs_review_count must match score totals",
        path: ["needs_review_count"]
      });
    }

    if (aggregate.blocked_count !== blockedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_count must match score totals",
        path: ["blocked_count"]
      });
    }
  });

export type LocalOperatorReviewScoreStatus = z.infer<typeof LocalOperatorReviewScoreStatusSchema>;
export type LocalOperatorReviewScore = z.infer<typeof LocalOperatorReviewScoreSchema>;
export type LocalOperatorReviewScoreAggregate = z.infer<
  typeof LocalOperatorReviewScoreAggregateSchema
>;

export function scoreLocalOperatorReviewChecklist(
  checklist: LocalOperatorReviewChecklist
): LocalOperatorReviewScore {
  const completeCount = countChecklistItemsByStatus(checklist, "complete");
  const needsReviewCount = countChecklistItemsByStatus(checklist, "needs_review");
  const blockedCount = countChecklistItemsByStatus(checklist, "blocked");

  return LocalOperatorReviewScoreSchema.parse({
    strategy_id: checklist.strategy_id,
    strategy_version: checklist.strategy_version,
    financial_gate: checklist.financial_gate,
    scope: checklist.scope,
    status: getScoreStatus(blockedCount, needsReviewCount),
    item_count: checklist.item_count,
    complete_count: completeCount,
    needs_review_count: needsReviewCount,
    blocked_count: blockedCount,
    source_recorded_at: checklist.source_recorded_at
  });
}

export function scoreLocalOperatorReviewChecklists(
  checklists: readonly LocalOperatorReviewChecklist[]
): LocalOperatorReviewScoreAggregate {
  const scores = checklists.map((checklist) => scoreLocalOperatorReviewChecklist(checklist));
  const blockedCount = sumScores(scores, "blocked_count");
  const needsReviewCount = sumScores(scores, "needs_review_count");

  return LocalOperatorReviewScoreAggregateSchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    status: getScoreStatus(blockedCount, needsReviewCount),
    checklist_count: scores.length,
    item_count: sumScores(scores, "item_count"),
    complete_count: sumScores(scores, "complete_count"),
    needs_review_count: needsReviewCount,
    blocked_count: blockedCount,
    scores
  });
}

export async function scoreLocalOperatorReviewChecklistQuery(
  input: SummarizeLocalReviewBundleQueryInput
): Promise<LocalOperatorReviewScoreAggregate> {
  const checklists = await createLocalOperatorReviewChecklistQuery(input);

  return scoreLocalOperatorReviewChecklists(checklists);
}

export async function scoreLocalOperatorReviewChecklistQueryWithGuard(
  input: SummarizeLocalReviewBundleQueryWithGuardInput
): Promise<LocalOperatorReviewScoreAggregate> {
  const checklists = await createLocalOperatorReviewChecklistQueryWithGuard(input);

  return scoreLocalOperatorReviewChecklists(checklists);
}

function countChecklistItemsByStatus(
  checklist: LocalOperatorReviewChecklist,
  status: LocalOperatorReviewChecklistItemStatus
): number {
  return checklist.items.filter((item) => item.status === status).length;
}

function getScoreStatus(
  blockedCount: number,
  needsReviewCount: number
): LocalOperatorReviewScoreStatus {
  if (blockedCount > 0) {
    return "blocked";
  }

  if (needsReviewCount > 0) {
    return "needs_review";
  }

  return "complete";
}

function sumScores(
  scores: readonly LocalOperatorReviewScore[],
  key: "item_count" | "complete_count" | "needs_review_count" | "blocked_count"
): number {
  return scores.reduce((total, score) => total + score[key], 0);
}
