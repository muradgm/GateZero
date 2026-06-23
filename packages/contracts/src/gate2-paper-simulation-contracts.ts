import { z } from "zod";
import { IdentifierSchema, IsoDateTimeSchema, NonEmptyStringSchema } from "./schemas.js";

export const Gate2ContractAuthoritySchema = z.literal("contract_only");
export const Gate2ContractScopeSchema = z.literal("paper_simulation_planning_only");
export const Gate2FinancialGateSchema = z.literal("G2_PAPER_TRADING");

export const Gate2SimulationStateSchema = z.enum([
  "planned",
  "review_required",
  "risk_blocked",
  "operator_rejected",
  "simulation_recorded",
  "voided"
]);

export const Gate2SimulationSideSchema = z.enum(["long", "short"]);
export const Gate2RiskDispositionSchema = z.enum([
  "blocked",
  "needs_revision",
  "accepted_for_local_simulation_evidence"
]);
export const Gate2RiskSeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export const Gate2OperatorDecisionSchema = z.enum(["reject", "revise", "record_local_simulation"]);
export const Gate2RedactionStatusSchema = z.enum(["redacted", "no_sensitive_payload"]);
export const Gate2AssumptionStatusSchema = z.enum(["draft", "reviewed", "blocked"]);
export const Gate2EvidenceFreshnessStatusSchema = z.enum(["fresh", "stale", "blocked"]);
export const Gate2BoundaryTypeSchema = z.enum([
  "external_account_route",
  "credential_payload",
  "autonomy_attempt",
  "live_action_claim",
  "performance_claim",
  "missing_risk_review",
  "missing_operator_action"
]);

const Gate2BoundarySchema = z
  .object({
    financial_gate: Gate2FinancialGateSchema,
    scope: Gate2ContractScopeSchema,
    contract_authority: Gate2ContractAuthoritySchema,
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false)
  })
  .strict();

export const Gate2SimulatedOrderRecordContractSchema = Gate2BoundarySchema.extend({
  simulated_order_record_id: IdentifierSchema,
  strategy_version_id: IdentifierSchema,
  evidence_bundle_summary_id: IdentifierSchema,
  operator_action_log_id: IdentifierSchema,
  risk_review_event_id: IdentifierSchema,
  simulated_fill_assumption_id: IdentifierSchema,
  instrument: NonEmptyStringSchema,
  side: Gate2SimulationSideSchema,
  quantity: z.number().positive(),
  quantity_unit: NonEmptyStringSchema,
  planned_price: z.number().positive(),
  state: Gate2SimulationStateSchema,
  simulation_only: z.literal(true),
  no_external_account: z.literal(true),
  credentials_required: z.literal(false),
  live_route: z.literal(false),
  automated_action: z.literal(false),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((record, context) => {
    if (record.state === "simulation_recorded" && !record.risk_review_event_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "simulation records require risk review evidence",
        path: ["risk_review_event_id"]
      });
    }
  });

export const Gate2SimulationStateContractSchema = Gate2BoundarySchema.extend({
  simulation_state_record_id: IdentifierSchema,
  simulated_order_record_id: IdentifierSchema,
  current_state: Gate2SimulationStateSchema,
  allowed_next_states: z.array(Gate2SimulationStateSchema).min(1),
  disallowed_transition_reasons: z.array(NonEmptyStringSchema).min(1),
  rollback_gate: z.literal("G1_BACKTESTING"),
  operator_required: z.literal(true),
  automated_transition: z.literal(false),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((state, context) => {
    if (
      state.current_state === "voided" &&
      state.allowed_next_states.includes("simulation_recorded")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "voided simulation states cannot move back to recorded simulation evidence",
        path: ["allowed_next_states"]
      });
    }
  });

export const Gate2RiskReviewEventContractSchema = Gate2BoundarySchema.extend({
  risk_review_event_id: IdentifierSchema,
  simulated_order_record_id: IdentifierSchema,
  reviewer_role: NonEmptyStringSchema,
  severity: Gate2RiskSeveritySchema,
  disposition: Gate2RiskDispositionSchema,
  blocking_issues: z.array(NonEmptyStringSchema),
  operator_acknowledgement_required: z.literal(true),
  reviewed_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((event, context) => {
    if (event.disposition === "blocked" && event.blocking_issues.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked risk reviews require blocking issues",
        path: ["blocking_issues"]
      });
    }
  });

export const Gate2OperatorActionLogContractSchema = Gate2BoundarySchema.extend({
  operator_action_log_id: IdentifierSchema,
  simulated_order_record_id: IdentifierSchema,
  decision: Gate2OperatorDecisionSchema,
  decision_rationale: NonEmptyStringSchema,
  redaction_status: Gate2RedactionStatusSchema,
  operator_retains_authority: z.literal(true),
  automated_action: z.literal(false),
  sensitive_payload_stored: z.literal(false),
  decided_at: IsoDateTimeSchema
}).strict();

export const Gate2SimulatedFillAssumptionContractSchema = Gate2BoundarySchema.extend({
  simulated_fill_assumption_id: IdentifierSchema,
  price_source: NonEmptyStringSchema,
  spread_policy: NonEmptyStringSchema,
  slippage_policy: NonEmptyStringSchema,
  cost_policy: NonEmptyStringSchema,
  latency_limitation: NonEmptyStringSchema,
  same_candle_policy: NonEmptyStringSchema,
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  assumption_status: Gate2AssumptionStatusSchema,
  reviewed_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((assumption, context) => {
    if (assumption.assumption_status === "reviewed" && assumption.limitation_notes.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "reviewed fill assumptions still require limitation notes",
        path: ["limitation_notes"]
      });
    }
  });

export const Gate2NegativeBoundaryFixtureContractSchema = Gate2BoundarySchema.extend({
  negative_boundary_fixture_id: IdentifierSchema,
  boundary_type: Gate2BoundaryTypeSchema,
  expected_result: z.literal("blocked"),
  synthetic_only: z.literal(true),
  contains_real_account_data: z.literal(false),
  contains_secret: z.literal(false),
  created_at: IsoDateTimeSchema
}).strict();

export const Gate2SimulationEvidenceDetailContractSchema = Gate2BoundarySchema.extend({
  simulation_evidence_detail_id: IdentifierSchema,
  simulated_order_record_id: IdentifierSchema,
  simulation_state_record_id: IdentifierSchema,
  operator_action_log_id: IdentifierSchema,
  risk_review_event_id: IdentifierSchema,
  simulated_fill_assumption_id: IdentifierSchema,
  local_source_artifact_paths: z.array(NonEmptyStringSchema).min(1),
  workflow_evidence_card_ids: z.array(IdentifierSchema).min(1),
  risk_review_panel_ids: z.array(IdentifierSchema).min(1),
  artifact_summary_refs: z.array(IdentifierSchema).min(1),
  failure_mode_evidence_refs: z.array(IdentifierSchema).min(1),
  source_link_map_refs: z.array(NonEmptyStringSchema).min(1),
  reproducibility_notes: z.array(NonEmptyStringSchema).min(1),
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  evidence_freshness_status: Gate2EvidenceFreshnessStatusSchema,
  operator_required: z.literal(true),
  simulation_only: z.literal(true),
  no_external_account: z.literal(true),
  credentials_required: z.literal(false),
  live_route: z.literal(false),
  automated_action: z.literal(false),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((detail, context) => {
    if (
      detail.evidence_freshness_status === "fresh" &&
      detail.failure_mode_evidence_refs.some((reference) => reference.includes("blocked"))
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "fresh evidence details cannot depend on blocked failure-mode references",
        path: ["failure_mode_evidence_refs"]
      });
    }

    for (const sourcePath of detail.local_source_artifact_paths) {
      if (!sourcePath.startsWith("ops/") && !sourcePath.startsWith("docs/")) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "source artifacts must be local ops or docs records",
          path: ["local_source_artifact_paths"]
        });
      }
    }
  });

export type Gate2ContractAuthority = z.infer<typeof Gate2ContractAuthoritySchema>;
export type Gate2ContractScope = z.infer<typeof Gate2ContractScopeSchema>;
export type Gate2FinancialGate = z.infer<typeof Gate2FinancialGateSchema>;
export type Gate2SimulationState = z.infer<typeof Gate2SimulationStateSchema>;
export type Gate2SimulationSide = z.infer<typeof Gate2SimulationSideSchema>;
export type Gate2RiskDisposition = z.infer<typeof Gate2RiskDispositionSchema>;
export type Gate2RiskSeverity = z.infer<typeof Gate2RiskSeveritySchema>;
export type Gate2OperatorDecision = z.infer<typeof Gate2OperatorDecisionSchema>;
export type Gate2RedactionStatus = z.infer<typeof Gate2RedactionStatusSchema>;
export type Gate2AssumptionStatus = z.infer<typeof Gate2AssumptionStatusSchema>;
export type Gate2EvidenceFreshnessStatus = z.infer<typeof Gate2EvidenceFreshnessStatusSchema>;
export type Gate2BoundaryType = z.infer<typeof Gate2BoundaryTypeSchema>;
export type Gate2SimulatedOrderRecordContract = z.infer<
  typeof Gate2SimulatedOrderRecordContractSchema
>;
export type Gate2SimulationStateContract = z.infer<typeof Gate2SimulationStateContractSchema>;
export type Gate2RiskReviewEventContract = z.infer<typeof Gate2RiskReviewEventContractSchema>;
export type Gate2OperatorActionLogContract = z.infer<typeof Gate2OperatorActionLogContractSchema>;
export type Gate2SimulatedFillAssumptionContract = z.infer<
  typeof Gate2SimulatedFillAssumptionContractSchema
>;
export type Gate2NegativeBoundaryFixtureContract = z.infer<
  typeof Gate2NegativeBoundaryFixtureContractSchema
>;
export type Gate2SimulationEvidenceDetailContract = z.infer<
  typeof Gate2SimulationEvidenceDetailContractSchema
>;
