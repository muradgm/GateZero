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
export const Gate2ArtifactTypeSchema = z.enum([
  "strategy_idea",
  "data_snapshot",
  "backtest_evidence",
  "metric_report",
  "risk_review",
  "operator_decision_note",
  "outcome_log",
  "learning_event",
  "simulation_evidence"
]);
export const Gate2SourceCategorySchema = z.enum([
  "protected_loop",
  "simulation_detail",
  "risk_control",
  "operator_review",
  "market_intelligence"
]);
export const Gate2OperatorNoteTypeSchema = z.enum([
  "observation",
  "limitation",
  "risk_question",
  "revision_note",
  "learning_note"
]);
export const Gate2WorkspaceCaseStatusSchema = z.enum([
  "inspection_ready",
  "missing_evidence",
  "risk_blocked"
]);
export const Gate2MarketInputTypeSchema = z.enum([
  "market_condition",
  "news_event",
  "red_flag",
  "signal_candidate"
]);
export const Gate2ScenarioActionSchema = z.enum([
  "watch",
  "reject",
  "paper_simulate",
  "prepare_plan"
]);
export const Gate2ConfidenceLevelSchema = z.enum(["low", "medium", "high"]);
export const Gate2RedFlagCategorySchema = z.enum([
  "source_staleness",
  "missing_evidence",
  "risk_conflict",
  "scope_boundary",
  "scenario_uncertainty"
]);
export const Gate2RedFlagBlockerStatusSchema = z.enum([
  "watch_only",
  "risk_review_required",
  "blocked"
]);
export const Gate2ScenarioRecommendationStatusSchema = z.enum([
  "draft_only",
  "risk_review_required",
  "risk_blocked",
  "operator_review_required"
]);
export const Gate2RecommendationReviewStatusSchema = z.enum([
  "risk_review_required",
  "blocked_by_risk",
  "operator_review_only"
]);
export const Gate2RecommendationSimulationLinkStatusSchema = z.enum([
  "candidate_linked_for_local_simulation",
  "blocked_by_risk",
  "missing_operator_review"
]);
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

export const Gate2LocalArtifactInventoryContractSchema = Gate2BoundarySchema.extend({
  artifact_id: IdentifierSchema,
  artifact_type: Gate2ArtifactTypeSchema,
  local_path: NonEmptyStringSchema,
  source_category: Gate2SourceCategorySchema,
  linked_research_case_id: IdentifierSchema,
  linked_evidence_detail_id: IdentifierSchema,
  linked_risk_review_id: IdentifierSchema.optional(),
  freshness_status: Gate2EvidenceFreshnessStatusSchema,
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  redaction_status: Gate2RedactionStatusSchema,
  blocked_scope_flags: z.array(Gate2BoundaryTypeSchema),
  created_at: IsoDateTimeSchema,
  verified_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((artifact, context) => {
    if (!artifact.local_path.startsWith("ops/") && !artifact.local_path.startsWith("docs/")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "artifact inventory paths must be local ops or docs records",
        path: ["local_path"]
      });
    }

    if (artifact.freshness_status === "blocked" && artifact.blocked_scope_flags.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked inventory artifacts require blocked-scope flags",
        path: ["blocked_scope_flags"]
      });
    }
  });

export const Gate2OperatorNoteModelContractSchema = Gate2BoundarySchema.extend({
  operator_note_id: IdentifierSchema,
  note_type: Gate2OperatorNoteTypeSchema,
  linked_research_case_id: IdentifierSchema,
  linked_evidence_detail_id: IdentifierSchema,
  linked_artifact_ids: z.array(IdentifierSchema).min(1),
  source_link_refs: z.array(NonEmptyStringSchema).min(1),
  note_body: NonEmptyStringSchema,
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  redaction_status: Gate2RedactionStatusSchema,
  manual_entry: z.literal(true),
  operator_retains_authority: z.literal(true),
  automated_action: z.literal(false),
  decision_performed: z.literal(false),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((note, context) => {
    for (const sourceRef of note.source_link_refs) {
      if (!sourceRef.startsWith("ops/") && !sourceRef.startsWith("docs/")) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "operator note sources must be local ops or docs records",
          path: ["source_link_refs"]
        });
      }
    }
  });

export const Gate2StrategyReviewWorkspaceCaseContractSchema = Gate2BoundarySchema.extend({
  research_case_id: IdentifierSchema,
  workspace_case_status: Gate2WorkspaceCaseStatusSchema,
  strategy_idea_id: IdentifierSchema,
  data_snapshot_id: IdentifierSchema,
  backtest_evidence_id: IdentifierSchema,
  metric_report_id: IdentifierSchema,
  risk_review_id: IdentifierSchema,
  operator_note_id: IdentifierSchema,
  outcome_log_id: IdentifierSchema,
  learning_event_id: IdentifierSchema,
  simulation_evidence_detail_id: IdentifierSchema,
  artifact_inventory_ids: z.array(IdentifierSchema).min(1),
  blocked_scope_reminders: z.array(Gate2BoundaryTypeSchema).min(1),
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  operator_required: z.literal(true),
  read_only_workspace: z.literal(true),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((workspaceCase, context) => {
    if (
      workspaceCase.workspace_case_status === "inspection_ready" &&
      workspaceCase.blocked_scope_reminders.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "workspace cases require visible blocked-scope reminders",
        path: ["blocked_scope_reminders"]
      });
    }
  });

export const Gate2MarketIntelligenceInputContractSchema = Gate2BoundarySchema.extend({
  market_intelligence_input_id: IdentifierSchema,
  input_type: Gate2MarketInputTypeSchema,
  linked_research_case_id: IdentifierSchema,
  source_title: NonEmptyStringSchema,
  source_ref: NonEmptyStringSchema,
  observed_at: IsoDateTimeSchema,
  summary: NonEmptyStringSchema,
  confidence_level: Gate2ConfidenceLevelSchema,
  red_flags: z.array(NonEmptyStringSchema),
  invalidation_conditions: z.array(NonEmptyStringSchema).min(1),
  source_references: z.array(NonEmptyStringSchema).min(1),
  risk_review_required: z.literal(true),
  operator_decision_required: z.literal(true),
  recommendation_final: z.literal(false),
  created_at: IsoDateTimeSchema
}).strict();

export const Gate2NewsEventScannerContractSchema = Gate2BoundarySchema.extend({
  news_event_id: IdentifierSchema,
  market_intelligence_input_id: IdentifierSchema,
  linked_research_case_id: IdentifierSchema,
  event_time: IsoDateTimeSchema,
  event_summary: NonEmptyStringSchema,
  source_refs: z.array(NonEmptyStringSchema).min(1),
  red_flags: z.array(NonEmptyStringSchema),
  stale_reference: z.literal(false),
  action_route_created: z.literal(false),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((event, context) => {
    if (event.source_refs.some((sourceRef) => sourceRef.startsWith("http"))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "news event scanner fixtures must use local source references",
        path: ["source_refs"]
      });
    }
  });

export const Gate2SignalCandidateContractSchema = Gate2BoundarySchema.extend({
  signal_candidate_id: IdentifierSchema,
  linked_research_case_id: IdentifierSchema,
  market_intelligence_input_ids: z.array(IdentifierSchema).min(1),
  evidence_refs: z.array(IdentifierSchema).min(1),
  candidate_summary: NonEmptyStringSchema,
  scenario_action: Gate2ScenarioActionSchema,
  confidence_level: Gate2ConfidenceLevelSchema,
  risk_review_id: IdentifierSchema.optional(),
  red_flags: z.array(NonEmptyStringSchema).min(1),
  invalidation_conditions: z.array(NonEmptyStringSchema).min(1),
  operator_decision_required: z.literal(true),
  action_route_created: z.literal(false),
  recommendation_final: z.literal(false),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((candidate, context) => {
    if (candidate.scenario_action === "paper_simulate" && !candidate.risk_review_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper-simulation candidates require a risk review reference",
        path: ["risk_review_id"]
      });
    }
  });

export const Gate2RedFlagEngineContractSchema = Gate2BoundarySchema.extend({
  red_flag_engine_id: IdentifierSchema,
  linked_research_case_id: IdentifierSchema,
  market_intelligence_input_ids: z.array(IdentifierSchema).min(1),
  news_event_ids: z.array(IdentifierSchema).min(1),
  signal_candidate_ids: z.array(IdentifierSchema).min(1),
  red_flag_category: Gate2RedFlagCategorySchema,
  severity: Gate2RiskSeveritySchema,
  blocker_status: Gate2RedFlagBlockerStatusSchema,
  detected_red_flags: z.array(NonEmptyStringSchema).min(1),
  evidence_refs: z.array(IdentifierSchema).min(1),
  invalidation_conditions: z.array(NonEmptyStringSchema).min(1),
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  risk_review_required: z.literal(true),
  operator_decision_required: z.literal(true),
  action_route_created: z.literal(false),
  recommendation_final: z.literal(false),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((redFlag, context) => {
    if (
      redFlag.blocker_status === "blocked" &&
      redFlag.severity !== "high" &&
      redFlag.severity !== "critical"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked red flags require high or critical severity",
        path: ["severity"]
      });
    }

    if (
      redFlag.red_flag_category === "missing_evidence" &&
      !redFlag.detected_red_flags.some((flag) => flag.toLowerCase().includes("missing"))
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "missing-evidence red flags require explicit missing evidence detail",
        path: ["detected_red_flags"]
      });
    }
  });

export const Gate2ScenarioRecommendationModelContractSchema = Gate2BoundarySchema.extend({
  scenario_recommendation_id: IdentifierSchema,
  linked_research_case_id: IdentifierSchema,
  signal_candidate_id: IdentifierSchema,
  red_flag_engine_id: IdentifierSchema,
  scenario_action: Gate2ScenarioActionSchema,
  recommendation_status: Gate2ScenarioRecommendationStatusSchema,
  evidence_refs: z.array(IdentifierSchema).min(1),
  source_refs: z.array(NonEmptyStringSchema).min(1),
  confidence_level: Gate2ConfidenceLevelSchema,
  invalidation_conditions: z.array(NonEmptyStringSchema).min(1),
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  risk_review_required: z.literal(true),
  operator_decision_required: z.literal(true),
  certainty_claim: z.literal(false),
  recommendation_final: z.literal(false),
  action_route_created: z.literal(false),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((recommendation, context) => {
    for (const sourceRef of recommendation.source_refs) {
      if (!sourceRef.startsWith("ops/") && !sourceRef.startsWith("docs/")) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "scenario recommendation sources must be local ops or docs records",
          path: ["source_refs"]
        });
      }
    }

    if (
      recommendation.scenario_action === "paper_simulate" &&
      recommendation.recommendation_status !== "risk_review_required" &&
      recommendation.recommendation_status !== "operator_review_required"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper-simulation scenario drafts must stay risk- or operator-review gated",
        path: ["recommendation_status"]
      });
    }
  });

export const Gate2RiskGatedRecommendationReviewContractSchema = Gate2BoundarySchema.extend({
  recommendation_review_id: IdentifierSchema,
  scenario_recommendation_id: IdentifierSchema,
  linked_research_case_id: IdentifierSchema,
  risk_review_event_id: IdentifierSchema,
  red_flag_engine_id: IdentifierSchema,
  review_status: Gate2RecommendationReviewStatusSchema,
  risk_disposition: Gate2RiskDispositionSchema,
  blocker_refs: z.array(IdentifierSchema),
  review_notes: z.array(NonEmptyStringSchema).min(1),
  operator_view_allowed: z.literal(true),
  operator_decision_required: z.literal(true),
  recommendation_final: z.literal(false),
  action_route_created: z.literal(false),
  reviewed_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((review, context) => {
    if (review.review_status === "blocked_by_risk" && review.blocker_refs.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "risk-blocked recommendation reviews require blocker references",
        path: ["blocker_refs"]
      });
    }

    if (
      review.review_status === "operator_review_only" &&
      review.risk_disposition !== "accepted_for_local_simulation_evidence"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "operator review visibility requires local simulation evidence disposition",
        path: ["risk_disposition"]
      });
    }
  });

export const Gate2PaperSimulationFromRecommendationCandidateContractSchema =
  Gate2BoundarySchema.extend({
    recommendation_simulation_link_id: IdentifierSchema,
    scenario_recommendation_id: IdentifierSchema,
    signal_candidate_id: IdentifierSchema,
    recommendation_review_id: IdentifierSchema,
    simulated_order_record_id: IdentifierSchema,
    simulation_evidence_detail_id: IdentifierSchema,
    risk_review_event_id: IdentifierSchema,
    link_status: Gate2RecommendationSimulationLinkStatusSchema,
    local_simulation_only: z.literal(true),
    no_external_dispatch: z.literal(true),
    no_external_account: z.literal(true),
    credentials_required: z.literal(false),
    live_route: z.literal(false),
    automated_action: z.literal(false),
    operator_required: z.literal(true),
    recommendation_final: z.literal(false),
    action_route_created: z.literal(false),
    limitation_notes: z.array(NonEmptyStringSchema).min(1),
    created_at: IsoDateTimeSchema
  })
    .strict()
    .superRefine((link, context) => {
      if (
        link.link_status === "candidate_linked_for_local_simulation" &&
        link.limitation_notes.every((note) => !note.toLowerCase().includes("local"))
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "local simulation candidate links require an explicit local limitation note",
          path: ["limitation_notes"]
        });
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
export type Gate2ArtifactType = z.infer<typeof Gate2ArtifactTypeSchema>;
export type Gate2SourceCategory = z.infer<typeof Gate2SourceCategorySchema>;
export type Gate2OperatorNoteType = z.infer<typeof Gate2OperatorNoteTypeSchema>;
export type Gate2WorkspaceCaseStatus = z.infer<typeof Gate2WorkspaceCaseStatusSchema>;
export type Gate2MarketInputType = z.infer<typeof Gate2MarketInputTypeSchema>;
export type Gate2ScenarioAction = z.infer<typeof Gate2ScenarioActionSchema>;
export type Gate2ConfidenceLevel = z.infer<typeof Gate2ConfidenceLevelSchema>;
export type Gate2RedFlagCategory = z.infer<typeof Gate2RedFlagCategorySchema>;
export type Gate2RedFlagBlockerStatus = z.infer<typeof Gate2RedFlagBlockerStatusSchema>;
export type Gate2ScenarioRecommendationStatus = z.infer<
  typeof Gate2ScenarioRecommendationStatusSchema
>;
export type Gate2RecommendationReviewStatus = z.infer<typeof Gate2RecommendationReviewStatusSchema>;
export type Gate2RecommendationSimulationLinkStatus = z.infer<
  typeof Gate2RecommendationSimulationLinkStatusSchema
>;
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
export type Gate2LocalArtifactInventoryContract = z.infer<
  typeof Gate2LocalArtifactInventoryContractSchema
>;
export type Gate2OperatorNoteModelContract = z.infer<typeof Gate2OperatorNoteModelContractSchema>;
export type Gate2StrategyReviewWorkspaceCaseContract = z.infer<
  typeof Gate2StrategyReviewWorkspaceCaseContractSchema
>;
export type Gate2MarketIntelligenceInputContract = z.infer<
  typeof Gate2MarketIntelligenceInputContractSchema
>;
export type Gate2NewsEventScannerContract = z.infer<typeof Gate2NewsEventScannerContractSchema>;
export type Gate2SignalCandidateContract = z.infer<typeof Gate2SignalCandidateContractSchema>;
export type Gate2RedFlagEngineContract = z.infer<typeof Gate2RedFlagEngineContractSchema>;
export type Gate2ScenarioRecommendationModelContract = z.infer<
  typeof Gate2ScenarioRecommendationModelContractSchema
>;
export type Gate2RiskGatedRecommendationReviewContract = z.infer<
  typeof Gate2RiskGatedRecommendationReviewContractSchema
>;
export type Gate2PaperSimulationFromRecommendationCandidateContract = z.infer<
  typeof Gate2PaperSimulationFromRecommendationCandidateContractSchema
>;
