import { z } from "zod";
import {
  Gate0DryRunFrictionCategorySchema,
  Gate0DryRunFrictionReportCategoryRefSchema,
  Gate0DryRunFrictionReportSchema,
  type Gate0DryRunFrictionCategory,
  type Gate0DryRunFrictionReport
} from "./gate0-dry-run-friction-report.js";
import { Gate0DryRunOperatorChecklistItemIdSchema } from "./gate0-dry-run-operator-checklist.js";

export const Gate0DryRunIterationRecommendationStatusSchema = z.enum([
  "no_iteration_required",
  "iteration_required"
]);

export const Gate0DryRunIterationActionSchema = z.enum([
  "no_local_action",
  "recheck_gate_scope",
  "rebuild_expected_loop_order",
  "rebuild_canonical_trace",
  "revisit_risk_revision_boundary",
  "realign_operator_outcome",
  "recheck_learning_boundary"
]);

export const Gate0DryRunIterationRecommendationActionRefSchema = z
  .object({
    item_id: Gate0DryRunOperatorChecklistItemIdSchema,
    category: Gate0DryRunFrictionCategorySchema,
    action: Gate0DryRunIterationActionSchema
  })
  .strict();

export const Gate0DryRunIterationRecommendationSchema = z
  .object({
    scenario_id: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    bundle_id: z.string().trim().min(1),
    recommendation_status: Gate0DryRunIterationRecommendationStatusSchema,
    blocked_count: z.number().int().nonnegative(),
    action_count: z.number().int().nonnegative(),
    blocked_item_ids: z.array(Gate0DryRunOperatorChecklistItemIdSchema),
    friction_categories: z.array(Gate0DryRunFrictionReportCategoryRefSchema),
    actions: z.array(Gate0DryRunIterationRecommendationActionRefSchema)
  })
  .strict()
  .superRefine((recommendation, context) => {
    if (recommendation.blocked_count !== recommendation.blocked_item_ids.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_count must match blocked item IDs",
        path: ["blocked_count"]
      });
    }

    if (recommendation.action_count !== recommendation.actions.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "action_count must match actions length",
        path: ["action_count"]
      });
    }

    const expectedStatus =
      recommendation.blocked_count === 0 ? "no_iteration_required" : "iteration_required";

    if (recommendation.recommendation_status !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "recommendation_status must reflect blocked_count",
        path: ["recommendation_status"]
      });
    }

    if (recommendation.blocked_count === 0 && recommendation.action_count !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "clear recommendations must include the no_local_action ref",
        path: ["actions"]
      });
    }

    if (
      recommendation.blocked_count > 0 &&
      recommendation.action_count !== recommendation.blocked_count
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "friction recommendations must include one action per blocked item",
        path: ["actions"]
      });
    }
  });

export type Gate0DryRunIterationRecommendationStatus = z.infer<
  typeof Gate0DryRunIterationRecommendationStatusSchema
>;
export type Gate0DryRunIterationAction = z.infer<typeof Gate0DryRunIterationActionSchema>;
export type Gate0DryRunIterationRecommendationActionRef = z.infer<
  typeof Gate0DryRunIterationRecommendationActionRefSchema
>;
export type Gate0DryRunIterationRecommendation = z.infer<
  typeof Gate0DryRunIterationRecommendationSchema
>;

export function createGate0DryRunIterationRecommendation(
  reportInput: Gate0DryRunFrictionReport
): Gate0DryRunIterationRecommendation {
  const report = Gate0DryRunFrictionReportSchema.parse(reportInput);
  const actions =
    report.blocked_count === 0
      ? [
          Gate0DryRunIterationRecommendationActionRefSchema.parse({
            item_id: "gate_scope_check",
            category: "gate_scope",
            action: "no_local_action"
          })
        ]
      : report.friction_categories.map((frictionCategory) => {
          return Gate0DryRunIterationRecommendationActionRefSchema.parse({
            ...frictionCategory,
            action: getIterationAction(frictionCategory.category)
          });
        });

  return Gate0DryRunIterationRecommendationSchema.parse({
    scenario_id: report.scenario_id,
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    bundle_id: report.bundle_id,
    recommendation_status:
      report.blocked_count === 0 ? "no_iteration_required" : "iteration_required",
    blocked_count: report.blocked_count,
    action_count: actions.length,
    blocked_item_ids: report.blocked_item_ids,
    friction_categories: report.friction_categories,
    actions
  });
}

function getIterationAction(category: Gate0DryRunFrictionCategory): Gate0DryRunIterationAction {
  const actionByCategory: Record<Gate0DryRunFrictionCategory, Gate0DryRunIterationAction> = {
    gate_scope: "recheck_gate_scope",
    loop_integrity: "rebuild_expected_loop_order",
    trace_integrity: "rebuild_canonical_trace",
    risk_boundary: "revisit_risk_revision_boundary",
    operator_alignment: "realign_operator_outcome",
    learning_boundary: "recheck_learning_boundary"
  };

  return actionByCategory[category];
}
