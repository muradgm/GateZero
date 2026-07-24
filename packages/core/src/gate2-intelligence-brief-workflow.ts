import {
  ContractValidationError,
  Gate2BriefBacktestEvidenceLinkSchema,
  Gate2BriefConflictPanelSchema,
  Gate2BriefInvalidationEvaluationSchema,
  Gate2BriefManualRiskReviewSchema,
  Gate2BriefOperatorDecisionSchema,
  Gate2IntelligenceBriefAvailabilitySchema,
  Gate2IntelligenceBriefCaseOptionSchema,
  Gate2IntelligenceBriefCaseSelectionSchema,
  Gate2IntelligenceBriefWorkflowCheckpointSchema,
  Gate2ReadOnlyIntelligenceBriefSchema,
  type Gate1DeterministicBacktestOutput,
  type Gate2BriefBacktestEvidenceLink,
  type Gate2BriefConflictPanel,
  type Gate2BriefInvalidationEvaluation,
  type Gate2BriefManualRiskReview,
  type Gate2BriefOperatorDecision,
  type Gate2IntelligenceBriefAvailability,
  type Gate2IntelligenceBriefCaseOption,
  type Gate2IntelligenceBriefCaseSelection,
  type Gate2IntelligenceBriefWorkflowCheckpoint,
  type Gate2ReadOnlyIntelligenceBrief
} from "../../contracts/src/index.js";

const boundary = {
  financial_gate: "G2_PAPER_TRADING" as const,
  scope: "paper_simulation_planning_only" as const,
  local_only: true as const,
  read_only: true as const,
  evidence_only: true as const,
  operator_required: true as const,
  risk_review_required: true as const,
  external_access: false as const,
  execution_path: false as const,
  action_route_created: false as const,
  recommendation_final: false as const,
  approval_claim: false as const,
  performance_claim: false as const
};

export function createGate2IntelligenceBriefAvailability(input: {
  readonly availabilityId: string;
  readonly linkedResearchCaseId: string;
  readonly briefId?: string;
  readonly status: "available" | "blocked" | "unavailable";
  readonly reasonCodes: Gate2IntelligenceBriefAvailability["reason_codes"];
  readonly operatorMessage: string;
  readonly evaluatedAt: string;
}): Gate2IntelligenceBriefAvailability {
  return Gate2IntelligenceBriefAvailabilitySchema.parse({
    ...boundary,
    availability_id: input.availabilityId,
    linked_research_case_id: input.linkedResearchCaseId,
    brief_id: input.briefId,
    status: input.status,
    reason_codes: input.reasonCodes,
    operator_message: input.operatorMessage,
    evidence_visible: input.status !== "unavailable",
    scenarios_visible: input.status === "available",
    evaluated_at: input.evaluatedAt
  });
}

export function createGate2IntelligenceBriefCaseSelection(input: {
  readonly selectionId: string;
  readonly options: readonly Gate2IntelligenceBriefCaseOption[];
  readonly selectedCaseId: string;
  readonly selectedAvailabilityId: string;
  readonly selectedAt: string;
}): Gate2IntelligenceBriefCaseSelection {
  const options = input.options.map((option) =>
    Gate2IntelligenceBriefCaseOptionSchema.parse(option)
  );
  if (!options.some((option) => option.case_id === input.selectedCaseId)) {
    throw new ContractValidationError(
      "selected intelligence brief case is not in the local catalog"
    );
  }

  return Gate2IntelligenceBriefCaseSelectionSchema.parse({
    ...boundary,
    selection_id: input.selectionId,
    options,
    selected_case_id: input.selectedCaseId,
    selected_availability_id: input.selectedAvailabilityId,
    selection_mode: "manual_local",
    selected_at: input.selectedAt
  });
}

export function createGate2BriefBacktestEvidenceLink(input: {
  readonly linkId: string;
  readonly brief: Gate2ReadOnlyIntelligenceBrief;
  readonly backtest: Gate1DeterministicBacktestOutput;
  readonly linkedAt: string;
}): Gate2BriefBacktestEvidenceLink {
  const brief = Gate2ReadOnlyIntelligenceBriefSchema.parse(input.brief);

  return Gate2BriefBacktestEvidenceLinkSchema.parse({
    ...boundary,
    link_id: input.linkId,
    brief_id: brief.brief_id,
    linked_research_case_id: brief.linked_research_case_id,
    backtest_run_id: input.backtest.backtest_run_id,
    backtest_input_hash: input.backtest.input_hash,
    backtest_output_hash: input.backtest.output_hash,
    relationship: "historical_research_evidence",
    evidence_permission: false,
    strategy_promotion: false,
    linked_at: input.linkedAt
  });
}

export function createGate2BriefConflictPanel(input: {
  readonly conflictPanelId: string;
  readonly brief: Gate2ReadOnlyIntelligenceBrief;
  readonly evaluatedAt: string;
}): Gate2BriefConflictPanel {
  const brief = Gate2ReadOnlyIntelligenceBriefSchema.parse(input.brief);
  const conflicts = brief.cross_timeframe_conflicts;
  const hasConflicts = conflicts.length > 0;

  return Gate2BriefConflictPanelSchema.parse({
    ...boundary,
    conflict_panel_id: input.conflictPanelId,
    brief_id: brief.brief_id,
    status: hasConflicts ? "revision_required" : "none_recorded",
    conflicts,
    scenario_consideration_blocked: hasConflicts,
    operator_message: hasConflicts
      ? "Cross-timeframe conflicts require revision before scenario consideration."
      : "No cross-timeframe conflicts are recorded in this frozen local brief.",
    evaluated_at: input.evaluatedAt
  });
}

export function evaluateGate2BriefInvalidations(input: {
  readonly evaluationId: string;
  readonly brief: Gate2ReadOnlyIntelligenceBrief;
  readonly evaluatedAt: string;
}): Gate2BriefInvalidationEvaluation {
  const brief = Gate2ReadOnlyIntelligenceBriefSchema.parse(input.brief);
  const sourceFreshness = new Map(
    brief.source_inventory.map((source) => [source.source_id, source.freshness_status])
  );

  const checks = brief.scenario_set.scenarios.flatMap((scenario) =>
    scenario.invalidation_criteria.map((criterion, index) => {
      const freshness = sourceFreshness.get(criterion.evidence_ref);
      const result =
        freshness === undefined
          ? "not_evaluable"
          : freshness === "fresh"
            ? "not_triggered"
            : "triggered";

      return {
        check_id: `${scenario.scenario_id}-invalidation-${index + 1}`,
        scenario_id: scenario.scenario_id,
        condition: criterion.condition,
        result,
        evidence_refs: [criterion.evidence_ref],
        observation:
          result === "not_triggered"
            ? "Linked local source remains fresh in the frozen brief."
            : result === "triggered"
              ? "Linked local source is no longer fresh."
              : "Linked local evidence is unavailable for evaluation."
      };
    })
  );

  const disposition = checks.some((check) => check.result === "not_evaluable")
    ? "blocked"
    : checks.some((check) => check.result === "triggered")
      ? "revision_required"
      : "clear";

  return Gate2BriefInvalidationEvaluationSchema.parse({
    ...boundary,
    evaluation_id: input.evaluationId,
    brief_id: brief.brief_id,
    invocation: "explicit_operator_request",
    scheduled_evaluation: false,
    checks,
    disposition,
    evaluated_at: input.evaluatedAt
  });
}

export function createGate2BriefManualRiskReview(input: {
  readonly riskReviewId: string;
  readonly brief: Gate2ReadOnlyIntelligenceBrief;
  readonly disposition: "recorded_for_review" | "needs_revision" | "blocked";
  readonly findings: readonly string[];
  readonly limitationNotes: readonly string[];
  readonly reviewedAt: string;
}): Gate2BriefManualRiskReview {
  const brief = Gate2ReadOnlyIntelligenceBriefSchema.parse(input.brief);

  return Gate2BriefManualRiskReviewSchema.parse({
    ...boundary,
    risk_review_id: input.riskReviewId,
    brief_id: brief.brief_id,
    brief_content_sha256: brief.content_sha256,
    reviewer_role: "operator_risk_reviewer",
    review_mode: "manual_local",
    disposition: input.disposition,
    findings: input.findings,
    limitation_notes: input.limitationNotes,
    approval_granted: false,
    reviewed_at: input.reviewedAt
  });
}

export function createGate2BriefOperatorDecision(input: {
  readonly operatorDecisionId: string;
  readonly brief: Gate2ReadOnlyIntelligenceBrief;
  readonly riskReview: Gate2BriefManualRiskReview;
  readonly decision: "reject" | "revise" | "keep_research_only";
  readonly reason: string;
  readonly evidenceRefs: readonly string[];
  readonly decidedAt: string;
}): Gate2BriefOperatorDecision {
  const brief = Gate2ReadOnlyIntelligenceBriefSchema.parse(input.brief);
  const riskReview = Gate2BriefManualRiskReviewSchema.parse(input.riskReview);
  if (riskReview.brief_id !== brief.brief_id) {
    throw new ContractValidationError(
      "operator decision risk review must reference the same brief"
    );
  }

  return Gate2BriefOperatorDecisionSchema.parse({
    ...boundary,
    operator_decision_id: input.operatorDecisionId,
    brief_id: brief.brief_id,
    risk_review_id: riskReview.risk_review_id,
    decision: input.decision,
    reason: input.reason,
    evidence_refs: input.evidenceRefs,
    decision_mode: "manual_local",
    simulation_authorized: false,
    decided_at: input.decidedAt
  });
}

export function createGate2IntelligenceBriefWorkflowCheckpoint(input: {
  readonly checkpointId: string;
  readonly selection: Gate2IntelligenceBriefCaseSelection;
  readonly availability: Gate2IntelligenceBriefAvailability;
  readonly brief: Gate2ReadOnlyIntelligenceBrief;
  readonly backtestLink: Gate2BriefBacktestEvidenceLink;
  readonly conflictPanel: Gate2BriefConflictPanel;
  readonly invalidationEvaluation: Gate2BriefInvalidationEvaluation;
  readonly riskReview: Gate2BriefManualRiskReview;
  readonly operatorDecision: Gate2BriefOperatorDecision;
  readonly checkedAt: string;
}): Gate2IntelligenceBriefWorkflowCheckpoint {
  const ids = {
    selectionCase: input.selection.selected_case_id,
    availabilityCase: input.availability.linked_research_case_id,
    briefCase: input.brief.linked_research_case_id,
    availabilityBrief: input.availability.brief_id,
    backtestBrief: input.backtestLink.brief_id,
    conflictBrief: input.conflictPanel.brief_id,
    invalidationBrief: input.invalidationEvaluation.brief_id,
    riskBrief: input.riskReview.brief_id,
    decisionBrief: input.operatorDecision.brief_id,
    decisionRisk: input.operatorDecision.risk_review_id
  };

  if (
    new Set([ids.selectionCase, ids.availabilityCase, ids.briefCase]).size !== 1 ||
    [
      ids.availabilityBrief,
      ids.backtestBrief,
      ids.conflictBrief,
      ids.invalidationBrief,
      ids.riskBrief,
      ids.decisionBrief
    ].some((briefId) => briefId !== input.brief.brief_id) ||
    ids.decisionRisk !== input.riskReview.risk_review_id
  ) {
    throw new ContractValidationError("intelligence brief workflow references do not align");
  }

  return Gate2IntelligenceBriefWorkflowCheckpointSchema.parse({
    ...boundary,
    checkpoint_id: input.checkpointId,
    selection_id: input.selection.selection_id,
    availability_id: input.availability.availability_id,
    brief_id: input.brief.brief_id,
    backtest_link_id: input.backtestLink.link_id,
    conflict_panel_id: input.conflictPanel.conflict_panel_id,
    invalidation_evaluation_id: input.invalidationEvaluation.evaluation_id,
    risk_review_id: input.riskReview.risk_review_id,
    operator_decision_id: input.operatorDecision.operator_decision_id,
    workflow_status: "research_only_recorded",
    next_gap: "manual_local_review_authoring",
    checked_at: input.checkedAt
  });
}
