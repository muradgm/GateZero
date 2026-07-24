import { z } from "zod";
import { Gate2MarketIntelligenceBoundarySchema } from "./gate2-market-intelligence-foundation-contracts.js";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9][a-z0-9-]*$/);
const NonEmptyStringSchema = z.string().trim().min(1);
const IsoDateTimeSchema = z.string().datetime({ offset: true });
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);

export const Gate2IntelligenceBriefAvailabilityReasonSchema = z.enum([
  "available",
  "missing_source",
  "stale_source",
  "unverified_source",
  "unsafe_semantics",
  "unresolved_adversarial_review",
  "unresolved_timeframe_conflict",
  "no_linked_brief"
]);

export const Gate2IntelligenceBriefAvailabilitySchema =
  Gate2MarketIntelligenceBoundarySchema.extend({
    availability_id: IdentifierSchema,
    linked_research_case_id: IdentifierSchema,
    brief_id: IdentifierSchema.optional(),
    status: z.enum(["available", "blocked", "unavailable"]),
    reason_codes: z.array(Gate2IntelligenceBriefAvailabilityReasonSchema).min(1),
    operator_message: NonEmptyStringSchema,
    evidence_visible: z.boolean(),
    scenarios_visible: z.boolean(),
    evaluated_at: IsoDateTimeSchema
  })
    .strict()
    .superRefine((record, context) => {
      if (
        record.status === "available" &&
        (record.reason_codes.length !== 1 ||
          record.reason_codes[0] !== "available" ||
          !record.evidence_visible ||
          !record.scenarios_visible ||
          !record.brief_id)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "available brief state must expose one linked evidence brief"
        });
      }

      if (
        record.status !== "available" &&
        (record.reason_codes.includes("available") ||
          record.scenarios_visible ||
          record.action_route_created)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "blocked and unavailable brief states must fail closed"
        });
      }
    });

export const Gate2IntelligenceBriefCaseOptionSchema = z
  .object({
    case_id: IdentifierSchema,
    title: NonEmptyStringSchema,
    availability_status: z.enum(["available", "blocked", "unavailable"]),
    availability_reason: Gate2IntelligenceBriefAvailabilityReasonSchema,
    brief_id: IdentifierSchema.optional()
  })
  .strict();

export const Gate2IntelligenceBriefCaseSelectionSchema =
  Gate2MarketIntelligenceBoundarySchema.extend({
    selection_id: IdentifierSchema,
    options: z.array(Gate2IntelligenceBriefCaseOptionSchema).min(1),
    selected_case_id: IdentifierSchema,
    selected_availability_id: IdentifierSchema,
    selection_mode: z.literal("manual_local"),
    selected_at: IsoDateTimeSchema
  }).strict();

export const Gate2BriefBacktestEvidenceLinkSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  link_id: IdentifierSchema,
  brief_id: IdentifierSchema,
  linked_research_case_id: IdentifierSchema,
  backtest_run_id: IdentifierSchema,
  backtest_input_hash: Sha256Schema,
  backtest_output_hash: Sha256Schema,
  relationship: z.literal("historical_research_evidence"),
  evidence_permission: z.literal(false),
  strategy_promotion: z.literal(false),
  linked_at: IsoDateTimeSchema
}).strict();

export const Gate2BriefConflictPanelSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  conflict_panel_id: IdentifierSchema,
  brief_id: IdentifierSchema,
  status: z.enum(["none_recorded", "revision_required"]),
  conflicts: z.array(NonEmptyStringSchema),
  scenario_consideration_blocked: z.boolean(),
  operator_message: NonEmptyStringSchema,
  evaluated_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((panel, context) => {
    const hasConflicts = panel.conflicts.length > 0;
    if (
      (hasConflicts &&
        (panel.status !== "revision_required" || !panel.scenario_consideration_blocked)) ||
      (!hasConflicts && (panel.status !== "none_recorded" || panel.scenario_consideration_blocked))
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "conflict panel must block unresolved cross-timeframe conflicts"
      });
    }
  });

export const Gate2BriefInvalidationCheckSchema = z
  .object({
    check_id: IdentifierSchema,
    scenario_id: IdentifierSchema,
    condition: NonEmptyStringSchema,
    result: z.enum(["not_triggered", "triggered", "not_evaluable"]),
    evidence_refs: z.array(IdentifierSchema).min(1),
    observation: NonEmptyStringSchema
  })
  .strict();

export const Gate2BriefInvalidationEvaluationSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  evaluation_id: IdentifierSchema,
  brief_id: IdentifierSchema,
  invocation: z.literal("explicit_operator_request"),
  scheduled_evaluation: z.literal(false),
  checks: z.array(Gate2BriefInvalidationCheckSchema).min(1),
  disposition: z.enum(["clear", "revision_required", "blocked"]),
  evaluated_at: IsoDateTimeSchema
}).strict();

export const Gate2BriefManualRiskReviewSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  risk_review_id: IdentifierSchema,
  brief_id: IdentifierSchema,
  brief_content_sha256: Sha256Schema,
  reviewer_role: z.literal("operator_risk_reviewer"),
  review_mode: z.literal("manual_local"),
  disposition: z.enum(["recorded_for_review", "needs_revision", "blocked"]),
  findings: z.array(NonEmptyStringSchema),
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  approval_granted: z.literal(false),
  reviewed_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((review, context) => {
    if (review.disposition !== "recorded_for_review" && review.findings.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "non-clear risk disposition requires findings",
        path: ["findings"]
      });
    }
  });

export const Gate2BriefOperatorDecisionSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  operator_decision_id: IdentifierSchema,
  brief_id: IdentifierSchema,
  risk_review_id: IdentifierSchema,
  decision: z.enum(["reject", "revise", "keep_research_only"]),
  reason: NonEmptyStringSchema,
  evidence_refs: z.array(IdentifierSchema).min(1),
  decision_mode: z.literal("manual_local"),
  simulation_authorized: z.literal(false),
  decided_at: IsoDateTimeSchema
}).strict();

export const Gate2IntelligenceBriefWorkflowCheckpointSchema =
  Gate2MarketIntelligenceBoundarySchema.extend({
    checkpoint_id: IdentifierSchema,
    selection_id: IdentifierSchema,
    availability_id: IdentifierSchema,
    brief_id: IdentifierSchema,
    backtest_link_id: IdentifierSchema,
    conflict_panel_id: IdentifierSchema,
    invalidation_evaluation_id: IdentifierSchema,
    risk_review_id: IdentifierSchema,
    operator_decision_id: IdentifierSchema,
    workflow_status: z.literal("research_only_recorded"),
    next_gap: z.literal("manual_local_review_authoring"),
    checked_at: IsoDateTimeSchema
  }).strict();

export type Gate2IntelligenceBriefAvailability = z.infer<
  typeof Gate2IntelligenceBriefAvailabilitySchema
>;
export type Gate2IntelligenceBriefCaseOption = z.infer<
  typeof Gate2IntelligenceBriefCaseOptionSchema
>;
export type Gate2IntelligenceBriefCaseSelection = z.infer<
  typeof Gate2IntelligenceBriefCaseSelectionSchema
>;
export type Gate2BriefBacktestEvidenceLink = z.infer<typeof Gate2BriefBacktestEvidenceLinkSchema>;
export type Gate2BriefConflictPanel = z.infer<typeof Gate2BriefConflictPanelSchema>;
export type Gate2BriefInvalidationEvaluation = z.infer<
  typeof Gate2BriefInvalidationEvaluationSchema
>;
export type Gate2BriefManualRiskReview = z.infer<typeof Gate2BriefManualRiskReviewSchema>;
export type Gate2BriefOperatorDecision = z.infer<typeof Gate2BriefOperatorDecisionSchema>;
export type Gate2IntelligenceBriefWorkflowCheckpoint = z.infer<
  typeof Gate2IntelligenceBriefWorkflowCheckpointSchema
>;
