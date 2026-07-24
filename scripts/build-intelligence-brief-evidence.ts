import {
  gate2BriefBacktestEvidenceLinkFixture,
  gate2BriefConflictPanelFixture,
  gate2BriefInvalidationEvaluationFixture,
  gate2BriefManualRiskReviewFixture,
  gate2BriefOperatorDecisionFixture,
  gate2IntelligenceBriefAvailableFixture,
  gate2IntelligenceBriefBlockedFixture,
  gate2IntelligenceBriefCaseSelectionFixture,
  gate2IntelligenceBriefUnavailableFixture,
  gate2IntelligenceBriefWorkflowCheckpointFixture,
  gate2ReadOnlyIntelligenceBriefFixture
} from "../packages/fixtures/src/index.js";

export interface IntelligenceBriefEvidenceView {
  readonly briefId: string;
  readonly researchCaseId: string;
  readonly status: string;
  readonly generatedAt: string;
  readonly contentHash: string;
  readonly sources: readonly {
    readonly id: string;
    readonly title: string;
    readonly repositoryRef: string;
    readonly freshness: string;
    readonly asOf: string;
    readonly limitation: string;
  }[];
  readonly timeframes: readonly {
    readonly timeframe: string;
    readonly summary: string;
    readonly confidence: string;
    readonly supportingEvidence: readonly string[];
    readonly counterEvidence: readonly string[];
    readonly redFlags: readonly string[];
    readonly invalidationConditions: readonly string[];
    readonly limitations: readonly string[];
  }[];
  readonly scenarios: readonly {
    readonly direction: string;
    readonly title: string;
    readonly conditions: readonly string[];
    readonly supportingEvidence: readonly string[];
    readonly counterEvidence: readonly string[];
    readonly redFlags: readonly string[];
    readonly invalidationConditions: readonly string[];
    readonly limitations: readonly string[];
    readonly confidence: string;
  }[];
  readonly qualityStatus: string;
  readonly semanticSafetyStatus: string;
  readonly adversarialStatus: string;
  readonly crossTimeframeConflicts: readonly string[];
  readonly limitations: readonly string[];
  readonly riskReviewStatus: string;
  readonly operatorDecisionStatus: string;
  readonly blockedScopeReminder: readonly string[];
  readonly caseSelection: {
    readonly selectedCaseId: string;
    readonly options: readonly {
      readonly caseId: string;
      readonly title: string;
      readonly status: string;
      readonly reason: string;
      readonly message: string;
    }[];
  };
  readonly backtestLink: {
    readonly id: string;
    readonly runId: string;
    readonly relationship: string;
    readonly inputHash: string;
    readonly outputHash: string;
    readonly evidencePermission: boolean;
  };
  readonly provenance: readonly {
    readonly sourceId: string;
    readonly payloadHash: string;
    readonly status: string;
    readonly notes: readonly string[];
  }[];
  readonly conflictPanel: {
    readonly status: string;
    readonly conflicts: readonly string[];
    readonly operatorMessage: string;
  };
  readonly invalidationEvaluation: {
    readonly id: string;
    readonly invocation: string;
    readonly disposition: string;
    readonly checks: readonly {
      readonly scenarioId: string;
      readonly condition: string;
      readonly result: string;
      readonly observation: string;
    }[];
  };
  readonly manualRiskReview: {
    readonly id: string;
    readonly disposition: string;
    readonly findings: readonly string[];
    readonly limitations: readonly string[];
    readonly approvalGranted: boolean;
  };
  readonly operatorDecision: {
    readonly id: string;
    readonly decision: string;
    readonly reason: string;
    readonly simulationAuthorized: boolean;
  };
  readonly workflowCheckpoint: {
    readonly id: string;
    readonly status: string;
    readonly nextGap: string;
  };
}

export function buildIntelligenceBriefEvidence(): IntelligenceBriefEvidenceView {
  const brief = gate2ReadOnlyIntelligenceBriefFixture;
  const availabilityByCase = new Map([
    [
      gate2IntelligenceBriefAvailableFixture.linked_research_case_id,
      gate2IntelligenceBriefAvailableFixture
    ],
    [
      gate2IntelligenceBriefBlockedFixture.linked_research_case_id,
      gate2IntelligenceBriefBlockedFixture
    ],
    [
      gate2IntelligenceBriefUnavailableFixture.linked_research_case_id,
      gate2IntelligenceBriefUnavailableFixture
    ]
  ]);

  return {
    briefId: brief.brief_id,
    researchCaseId: brief.linked_research_case_id,
    status: brief.brief_status,
    generatedAt: brief.generated_at,
    contentHash: brief.content_sha256,
    sources: brief.source_inventory.map((source) => ({
      id: source.source_id,
      title: source.source_title,
      repositoryRef: source.repository_ref,
      freshness: source.freshness_status,
      asOf: source.as_of,
      limitation: source.limitation_notes.join(" ")
    })),
    timeframes: brief.evidence_assembly.timeframe_evidence.map((evidence) => ({
      timeframe: evidence.timeframe,
      summary: evidence.summary,
      confidence: evidence.confidence_level,
      supportingEvidence: evidence.supporting_evidence,
      counterEvidence: evidence.counter_evidence,
      redFlags: evidence.red_flags,
      invalidationConditions: evidence.invalidation_conditions,
      limitations: evidence.limitation_notes
    })),
    scenarios: brief.scenario_set.scenarios.map((scenario) => ({
      direction: scenario.direction,
      title: scenario.title,
      conditions: scenario.conditions,
      supportingEvidence: scenario.supporting_evidence,
      counterEvidence: scenario.counter_evidence,
      redFlags: scenario.red_flags,
      invalidationConditions: scenario.invalidation_conditions,
      limitations: scenario.limitation_notes,
      confidence: scenario.confidence_level
    })),
    qualityStatus: brief.quality_assessment.quality_status,
    semanticSafetyStatus: brief.quality_assessment.semantic_safety_status,
    adversarialStatus: brief.adversarial_review.review_status,
    crossTimeframeConflicts: brief.cross_timeframe_conflicts,
    limitations: brief.limitations,
    riskReviewStatus: brief.risk_review_status,
    operatorDecisionStatus: brief.operator_decision_status,
    blockedScopeReminder: brief.blocked_scope_reminder,
    caseSelection: {
      selectedCaseId: gate2IntelligenceBriefCaseSelectionFixture.selected_case_id,
      options: gate2IntelligenceBriefCaseSelectionFixture.options.map((option) => {
        const availability = availabilityByCase.get(option.case_id);
        if (!availability) {
          throw new Error(`missing availability fixture for case: ${option.case_id}`);
        }
        return {
          caseId: option.case_id,
          title: option.title,
          status: availability.status,
          reason: availability.reason_codes.join(", "),
          message: availability.operator_message
        };
      })
    },
    backtestLink: {
      id: gate2BriefBacktestEvidenceLinkFixture.link_id,
      runId: gate2BriefBacktestEvidenceLinkFixture.backtest_run_id,
      relationship: gate2BriefBacktestEvidenceLinkFixture.relationship,
      inputHash: gate2BriefBacktestEvidenceLinkFixture.backtest_input_hash,
      outputHash: gate2BriefBacktestEvidenceLinkFixture.backtest_output_hash,
      evidencePermission: gate2BriefBacktestEvidenceLinkFixture.evidence_permission
    },
    provenance: brief.source_inventory.map((source) => ({
      sourceId: source.source_id,
      payloadHash: source.payload_sha256,
      status: source.provenance_status,
      notes: source.provenance_notes
    })),
    conflictPanel: {
      status: gate2BriefConflictPanelFixture.status,
      conflicts: gate2BriefConflictPanelFixture.conflicts,
      operatorMessage: gate2BriefConflictPanelFixture.operator_message
    },
    invalidationEvaluation: {
      id: gate2BriefInvalidationEvaluationFixture.evaluation_id,
      invocation: gate2BriefInvalidationEvaluationFixture.invocation,
      disposition: gate2BriefInvalidationEvaluationFixture.disposition,
      checks: gate2BriefInvalidationEvaluationFixture.checks.map((check) => ({
        scenarioId: check.scenario_id,
        condition: check.condition,
        result: check.result,
        observation: check.observation
      }))
    },
    manualRiskReview: {
      id: gate2BriefManualRiskReviewFixture.risk_review_id,
      disposition: gate2BriefManualRiskReviewFixture.disposition,
      findings: gate2BriefManualRiskReviewFixture.findings,
      limitations: gate2BriefManualRiskReviewFixture.limitation_notes,
      approvalGranted: gate2BriefManualRiskReviewFixture.approval_granted
    },
    operatorDecision: {
      id: gate2BriefOperatorDecisionFixture.operator_decision_id,
      decision: gate2BriefOperatorDecisionFixture.decision,
      reason: gate2BriefOperatorDecisionFixture.reason,
      simulationAuthorized: gate2BriefOperatorDecisionFixture.simulation_authorized
    },
    workflowCheckpoint: {
      id: gate2IntelligenceBriefWorkflowCheckpointFixture.checkpoint_id,
      status: gate2IntelligenceBriefWorkflowCheckpointFixture.workflow_status,
      nextGap: gate2IntelligenceBriefWorkflowCheckpointFixture.next_gap
    }
  };
}
