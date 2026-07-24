import {
  type Gate2IntelligenceBriefCaseOption,
  Gate2IntelligenceBriefWorkflowCheckpointSchema
} from "../../contracts/src/index.js";
import {
  createGate2BriefBacktestEvidenceLink,
  createGate2BriefConflictPanel,
  createGate2BriefManualRiskReview,
  createGate2BriefOperatorDecision,
  createGate2IntelligenceBriefAvailability,
  createGate2IntelligenceBriefCaseSelection,
  createGate2IntelligenceBriefWorkflowCheckpoint,
  evaluateGate2BriefInvalidations
} from "../../core/src/index.js";
import { gate1DeterministicBacktestOutputFixture } from "./gate1-deterministic-backtest-runner-fixtures.js";
import { gate2ReadOnlyIntelligenceBriefFixture } from "./gate2-read-only-intelligence-brief-fixtures.js";

const timestamp = "2026-07-24T00:00:00.000Z";

export const gate2IntelligenceBriefAvailableFixture = createGate2IntelligenceBriefAvailability({
  availabilityId: "brief-availability-available-001",
  linkedResearchCaseId: gate2ReadOnlyIntelligenceBriefFixture.linked_research_case_id,
  briefId: gate2ReadOnlyIntelligenceBriefFixture.brief_id,
  status: "available",
  reasonCodes: ["available"],
  operatorMessage: "Validated local evidence is available for read-only operator inspection.",
  evaluatedAt: timestamp
});

export const gate2IntelligenceBriefBlockedFixture = createGate2IntelligenceBriefAvailability({
  availabilityId: "brief-availability-blocked-001",
  linkedResearchCaseId: "gate2-research-case-fixture-004",
  status: "blocked",
  reasonCodes: ["stale_source"],
  operatorMessage: "The linked local evidence is stale. Scenarios are suppressed pending revision.",
  evaluatedAt: timestamp
});

export const gate2IntelligenceBriefUnavailableFixture = createGate2IntelligenceBriefAvailability({
  availabilityId: "brief-availability-unavailable-001",
  linkedResearchCaseId: "operator-workflow-case-001",
  status: "unavailable",
  reasonCodes: ["no_linked_brief"],
  operatorMessage: "No validated intelligence brief is linked to this local research case.",
  evaluatedAt: timestamp
});

export const gate2IntelligenceBriefCaseOptionFixtures: readonly Gate2IntelligenceBriefCaseOption[] =
  [
    {
      case_id: gate2ReadOnlyIntelligenceBriefFixture.linked_research_case_id,
      title: "Market intelligence replay case",
      availability_status: "available",
      availability_reason: "available",
      brief_id: gate2ReadOnlyIntelligenceBriefFixture.brief_id
    },
    {
      case_id: "gate2-research-case-fixture-004",
      title: "Stale local evidence case",
      availability_status: "blocked",
      availability_reason: "stale_source"
    },
    {
      case_id: "operator-workflow-case-001",
      title: "Operator workflow evidence case",
      availability_status: "unavailable",
      availability_reason: "no_linked_brief"
    }
  ];

export const gate2IntelligenceBriefCaseSelectionFixture = createGate2IntelligenceBriefCaseSelection(
  {
    selectionId: "brief-case-selection-001",
    options: gate2IntelligenceBriefCaseOptionFixtures,
    selectedCaseId: gate2ReadOnlyIntelligenceBriefFixture.linked_research_case_id,
    selectedAvailabilityId: gate2IntelligenceBriefAvailableFixture.availability_id,
    selectedAt: timestamp
  }
);

export const gate2BriefBacktestEvidenceLinkFixture = createGate2BriefBacktestEvidenceLink({
  linkId: "brief-backtest-link-001",
  brief: gate2ReadOnlyIntelligenceBriefFixture,
  backtest: gate1DeterministicBacktestOutputFixture,
  linkedAt: timestamp
});

export const gate2BriefConflictPanelFixture = createGate2BriefConflictPanel({
  conflictPanelId: "brief-conflict-panel-001",
  brief: gate2ReadOnlyIntelligenceBriefFixture,
  evaluatedAt: timestamp
});

export const gate2BriefInvalidationEvaluationFixture = evaluateGate2BriefInvalidations({
  evaluationId: "brief-invalidation-evaluation-001",
  brief: gate2ReadOnlyIntelligenceBriefFixture,
  evaluatedAt: timestamp
});

export const gate2BriefManualRiskReviewFixture = createGate2BriefManualRiskReview({
  riskReviewId: "brief-manual-risk-review-001",
  brief: gate2ReadOnlyIntelligenceBriefFixture,
  disposition: "recorded_for_review",
  findings: [],
  limitationNotes: [
    "Manual local review record only; no approval, simulation, or execution authority is granted."
  ],
  reviewedAt: timestamp
});

export const gate2BriefOperatorDecisionFixture = createGate2BriefOperatorDecision({
  operatorDecisionId: "brief-operator-decision-001",
  brief: gate2ReadOnlyIntelligenceBriefFixture,
  riskReview: gate2BriefManualRiskReviewFixture,
  decision: "keep_research_only",
  reason: "Evidence remains synthetic and conditional; retain the case for research inspection.",
  evidenceRefs: [
    gate2ReadOnlyIntelligenceBriefFixture.brief_id,
    gate2BriefManualRiskReviewFixture.risk_review_id
  ],
  decidedAt: timestamp
});

export const gate2IntelligenceBriefWorkflowCheckpointFixture =
  Gate2IntelligenceBriefWorkflowCheckpointSchema.parse(
    createGate2IntelligenceBriefWorkflowCheckpoint({
      checkpointId: "brief-workflow-checkpoint-001",
      selection: gate2IntelligenceBriefCaseSelectionFixture,
      availability: gate2IntelligenceBriefAvailableFixture,
      brief: gate2ReadOnlyIntelligenceBriefFixture,
      backtestLink: gate2BriefBacktestEvidenceLinkFixture,
      conflictPanel: gate2BriefConflictPanelFixture,
      invalidationEvaluation: gate2BriefInvalidationEvaluationFixture,
      riskReview: gate2BriefManualRiskReviewFixture,
      operatorDecision: gate2BriefOperatorDecisionFixture,
      checkedAt: timestamp
    })
  );
