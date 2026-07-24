import { describe, expect, it } from "vitest";
import {
  ContractValidationError,
  type Gate2BriefManualRiskReview,
  type Gate2ReadOnlyIntelligenceBrief
} from "../../contracts/src/index.js";
import {
  gate2BriefBacktestEvidenceLinkFixture,
  gate2BriefConflictPanelFixture,
  gate2BriefInvalidationEvaluationFixture,
  gate2BriefManualRiskReviewFixture,
  gate2BriefOperatorDecisionFixture,
  gate2IntelligenceBriefAvailableFixture,
  gate2IntelligenceBriefCaseOptionFixtures,
  gate2IntelligenceBriefCaseSelectionFixture,
  gate2ReadOnlyIntelligenceBriefFixture
} from "../../fixtures/src/index.js";
import {
  createGate2BriefConflictPanel,
  createGate2BriefManualRiskReview,
  createGate2BriefOperatorDecision,
  createGate2IntelligenceBriefAvailability,
  createGate2IntelligenceBriefCaseSelection,
  createGate2IntelligenceBriefWorkflowCheckpoint,
  evaluateGate2BriefInvalidations
} from "../src/index.js";

const timestamp = "2026-07-24T00:00:00.000Z";

describe("Gate 2 intelligence brief workflow", () => {
  it("creates fail-closed blocked and unavailable states", () => {
    const blocked = createGate2IntelligenceBriefAvailability({
      availabilityId: "availability-test-blocked",
      linkedResearchCaseId: "case-test-blocked",
      status: "blocked",
      reasonCodes: ["stale_source"],
      operatorMessage: "Stale source blocks scenario display.",
      evaluatedAt: timestamp
    });
    expect(blocked.evidence_visible).toBe(true);
    expect(blocked.scenarios_visible).toBe(false);

    const unavailable = createGate2IntelligenceBriefAvailability({
      availabilityId: "availability-test-unavailable",
      linkedResearchCaseId: "case-test-unavailable",
      status: "unavailable",
      reasonCodes: ["no_linked_brief"],
      operatorMessage: "No linked brief is available.",
      evaluatedAt: timestamp
    });
    expect(unavailable.evidence_visible).toBe(false);
    expect(unavailable.scenarios_visible).toBe(false);
  });

  it("rejects a selected case outside the local options", () => {
    expect(() =>
      createGate2IntelligenceBriefCaseSelection({
        selectionId: "selection-test",
        options: gate2IntelligenceBriefCaseOptionFixtures,
        selectedCaseId: "missing-case",
        selectedAvailabilityId: "missing-availability",
        selectedAt: timestamp
      })
    ).toThrow(ContractValidationError);
  });

  it("blocks unresolved cross-timeframe conflicts", () => {
    const brief: Gate2ReadOnlyIntelligenceBrief = {
      ...gate2ReadOnlyIntelligenceBriefFixture,
      cross_timeframe_conflicts: ["Hourly and monthly evidence disagree."]
    };
    const panel = createGate2BriefConflictPanel({
      conflictPanelId: "conflict-panel-test",
      brief,
      evaluatedAt: timestamp
    });
    expect(panel.status).toBe("revision_required");
    expect(panel.scenario_consideration_blocked).toBe(true);
  });

  it("marks a stale invalidation source as triggered", () => {
    const sourceInventory = gate2ReadOnlyIntelligenceBriefFixture.source_inventory.map(
      (source) => ({
        ...source,
        freshness_status:
          source.source_id === "market-source-hourly-001"
            ? ("stale" as const)
            : source.freshness_status
      })
    );
    const brief: Gate2ReadOnlyIntelligenceBrief = {
      ...gate2ReadOnlyIntelligenceBriefFixture,
      source_inventory: sourceInventory
    };
    const evaluation = evaluateGate2BriefInvalidations({
      evaluationId: "invalidation-test",
      brief,
      evaluatedAt: timestamp
    });
    expect(evaluation.disposition).toBe("revision_required");
    expect(evaluation.checks.some((check) => check.result === "triggered")).toBe(true);
  });

  it("requires findings for a blocked manual risk review", () => {
    expect(() =>
      createGate2BriefManualRiskReview({
        riskReviewId: "risk-review-test",
        brief: gate2ReadOnlyIntelligenceBriefFixture,
        disposition: "blocked",
        findings: [],
        limitationNotes: ["Manual local review only."],
        reviewedAt: timestamp
      })
    ).toThrow();
  });

  it("rejects an operator decision linked to another brief review", () => {
    const riskReview: Gate2BriefManualRiskReview = {
      ...gate2BriefManualRiskReviewFixture,
      brief_id: "different-brief"
    };
    expect(() =>
      createGate2BriefOperatorDecision({
        operatorDecisionId: "operator-decision-test",
        brief: gate2ReadOnlyIntelligenceBriefFixture,
        riskReview,
        decision: "revise",
        reason: "Evidence requires revision.",
        evidenceRefs: ["read-only-intelligence-brief-001"],
        decidedAt: timestamp
      })
    ).toThrow(ContractValidationError);
  });

  it("rejects a checkpoint with mismatched workflow references", () => {
    expect(() =>
      createGate2IntelligenceBriefWorkflowCheckpoint({
        checkpointId: "checkpoint-test",
        selection: gate2IntelligenceBriefCaseSelectionFixture,
        availability: {
          ...gate2IntelligenceBriefAvailableFixture,
          linked_research_case_id: "different-case"
        },
        brief: gate2ReadOnlyIntelligenceBriefFixture,
        backtestLink: gate2BriefBacktestEvidenceLinkFixture,
        conflictPanel: gate2BriefConflictPanelFixture,
        invalidationEvaluation: gate2BriefInvalidationEvaluationFixture,
        riskReview: gate2BriefManualRiskReviewFixture,
        operatorDecision: gate2BriefOperatorDecisionFixture,
        checkedAt: timestamp
      })
    ).toThrow("workflow references do not align");
  });
});
