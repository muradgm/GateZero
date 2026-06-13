import { z } from "zod";
import {
  Gate0DryRunOperatorChecklistItemIdSchema,
  Gate0DryRunOperatorChecklistSchema,
  Gate0DryRunOperatorChecklistStatusSchema,
  type Gate0DryRunOperatorChecklist,
  type Gate0DryRunOperatorChecklistItem
} from "./gate0-dry-run-operator-checklist.js";

export const Gate0DryRunChecklistSummaryItemRefSchema = z
  .object({
    item_id: Gate0DryRunOperatorChecklistItemIdSchema,
    status: Gate0DryRunOperatorChecklistStatusSchema
  })
  .strict();

export const Gate0DryRunChecklistSummarySchema = z
  .object({
    scenario_id: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    bundle_id: z.string().trim().min(1),
    checklist_status: Gate0DryRunOperatorChecklistStatusSchema,
    item_count: z.number().int().nonnegative(),
    complete_count: z.number().int().nonnegative(),
    blocked_count: z.number().int().nonnegative(),
    blocked_item_ids: z.array(Gate0DryRunOperatorChecklistItemIdSchema),
    item_refs: z.array(Gate0DryRunChecklistSummaryItemRefSchema)
  })
  .strict()
  .superRefine((summary, context) => {
    if (summary.item_count !== summary.item_refs.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "item_count must match item refs length",
        path: ["item_count"]
      });
    }

    const completeCount = summary.item_refs.filter((item) => item.status === "complete").length;
    const blockedCount = summary.item_refs.filter((item) => item.status === "blocked").length;

    if (summary.complete_count !== completeCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "complete_count must match item refs",
        path: ["complete_count"]
      });
    }

    if (summary.blocked_count !== blockedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_count must match item refs",
        path: ["blocked_count"]
      });
    }

    if (summary.blocked_item_ids.length !== blockedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_item_ids length must match blocked_count",
        path: ["blocked_item_ids"]
      });
    }

    const expectedStatus = blockedCount === 0 ? "complete" : "blocked";

    if (summary.checklist_status !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "checklist_status must reflect item refs",
        path: ["checklist_status"]
      });
    }
  });

export type Gate0DryRunChecklistSummaryItemRef = z.infer<
  typeof Gate0DryRunChecklistSummaryItemRefSchema
>;
export type Gate0DryRunChecklistSummary = z.infer<typeof Gate0DryRunChecklistSummarySchema>;

export function summarizeGate0DryRunOperatorChecklist(
  checklistInput: Gate0DryRunOperatorChecklist
): Gate0DryRunChecklistSummary {
  const checklist = Gate0DryRunOperatorChecklistSchema.parse(checklistInput);
  const itemRefs = checklist.items.map((item) => createItemRef(item));

  return Gate0DryRunChecklistSummarySchema.parse({
    scenario_id: checklist.scenario_id,
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    bundle_id: checklist.bundle_id,
    checklist_status: checklist.checklist_status,
    item_count: checklist.item_count,
    complete_count: checklist.complete_count,
    blocked_count: checklist.blocked_count,
    blocked_item_ids: checklist.items
      .filter((item) => item.status === "blocked")
      .map((item) => item.item_id),
    item_refs: itemRefs
  });
}

function createItemRef(item: Gate0DryRunOperatorChecklistItem): Gate0DryRunChecklistSummaryItemRef {
  return Gate0DryRunChecklistSummaryItemRefSchema.parse({
    item_id: item.item_id,
    status: item.status
  });
}
