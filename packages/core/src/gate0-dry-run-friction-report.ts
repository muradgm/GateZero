import { z } from "zod";
import {
  Gate0DryRunChecklistSummarySchema,
  type Gate0DryRunChecklistSummary
} from "./gate0-dry-run-checklist-summary.js";
import { Gate0DryRunOperatorChecklistItemIdSchema } from "./gate0-dry-run-operator-checklist.js";

export const Gate0DryRunFrictionReportStatusSchema = z.enum(["clear", "friction_found"]);

export const Gate0DryRunFrictionCategorySchema = z.enum([
  "gate_scope",
  "loop_integrity",
  "trace_integrity",
  "risk_boundary",
  "operator_alignment",
  "learning_boundary"
]);

export const Gate0DryRunFrictionReportCategoryRefSchema = z
  .object({
    item_id: Gate0DryRunOperatorChecklistItemIdSchema,
    category: Gate0DryRunFrictionCategorySchema
  })
  .strict();

export const Gate0DryRunFrictionReportSchema = z
  .object({
    scenario_id: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    bundle_id: z.string().trim().min(1),
    report_status: Gate0DryRunFrictionReportStatusSchema,
    item_count: z.number().int().nonnegative(),
    blocked_count: z.number().int().nonnegative(),
    friction_category_count: z.number().int().nonnegative(),
    blocked_item_ids: z.array(Gate0DryRunOperatorChecklistItemIdSchema),
    friction_categories: z.array(Gate0DryRunFrictionReportCategoryRefSchema)
  })
  .strict()
  .superRefine((report, context) => {
    if (report.blocked_count !== report.blocked_item_ids.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_count must match blocked item IDs",
        path: ["blocked_count"]
      });
    }

    if (report.friction_category_count !== report.friction_categories.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "friction_category_count must match friction categories",
        path: ["friction_category_count"]
      });
    }

    if (report.friction_category_count !== report.blocked_count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "friction_category_count must match blocked_count",
        path: ["friction_category_count"]
      });
    }

    const expectedStatus = report.blocked_count === 0 ? "clear" : "friction_found";

    if (report.report_status !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "report_status must reflect blocked_count",
        path: ["report_status"]
      });
    }
  });

export type Gate0DryRunFrictionReportStatus = z.infer<typeof Gate0DryRunFrictionReportStatusSchema>;
export type Gate0DryRunFrictionCategory = z.infer<typeof Gate0DryRunFrictionCategorySchema>;
export type Gate0DryRunFrictionReportCategoryRef = z.infer<
  typeof Gate0DryRunFrictionReportCategoryRefSchema
>;
export type Gate0DryRunFrictionReport = z.infer<typeof Gate0DryRunFrictionReportSchema>;

export function createGate0DryRunFrictionReport(
  summaryInput: Gate0DryRunChecklistSummary
): Gate0DryRunFrictionReport {
  const summary = Gate0DryRunChecklistSummarySchema.parse(summaryInput);
  const frictionCategories = summary.blocked_item_ids.map((itemId) => {
    return Gate0DryRunFrictionReportCategoryRefSchema.parse({
      item_id: itemId,
      category: getFrictionCategory(itemId)
    });
  });

  return Gate0DryRunFrictionReportSchema.parse({
    scenario_id: summary.scenario_id,
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    bundle_id: summary.bundle_id,
    report_status: summary.blocked_count === 0 ? "clear" : "friction_found",
    item_count: summary.item_count,
    blocked_count: summary.blocked_count,
    friction_category_count: frictionCategories.length,
    blocked_item_ids: summary.blocked_item_ids,
    friction_categories: frictionCategories
  });
}

function getFrictionCategory(
  itemId: z.infer<typeof Gate0DryRunOperatorChecklistItemIdSchema>
): Gate0DryRunFrictionCategory {
  const categoryByItemId: Record<
    z.infer<typeof Gate0DryRunOperatorChecklistItemIdSchema>,
    Gate0DryRunFrictionCategory
  > = {
    gate_scope_check: "gate_scope",
    loop_order_check: "loop_integrity",
    trace_hash_check: "trace_integrity",
    risk_revision_check: "risk_boundary",
    operator_outcome_check: "operator_alignment",
    learning_boundary_check: "learning_boundary"
  };

  return categoryByItemId[itemId];
}
