import { describe, expect, it } from "vitest";
import {
  Gate2BriefBacktestEvidenceLinkSchema,
  Gate2BriefConflictPanelSchema,
  Gate2BriefInvalidationEvaluationSchema,
  Gate2BriefManualRiskReviewSchema,
  Gate2BriefOperatorDecisionSchema,
  Gate2IntelligenceBriefAvailabilitySchema,
  Gate2IntelligenceBriefCaseSelectionSchema,
  Gate2IntelligenceBriefWorkflowCheckpointSchema
} from "../src/index.js";
import {
  gate2BriefBacktestEvidenceLinkFixture,
  gate2BriefConflictPanelFixture,
  gate2BriefInvalidationEvaluationFixture,
  gate2BriefManualRiskReviewFixture,
  gate2BriefOperatorDecisionFixture,
  gate2IntelligenceBriefAvailableFixture,
  gate2IntelligenceBriefBlockedFixture,
  gate2IntelligenceBriefCaseSelectionFixture,
  gate2IntelligenceBriefWorkflowCheckpointFixture
} from "../../fixtures/src/index.js";

describe("Gate 2 intelligence brief workflow contracts", () => {
  it("accepts every bounded workflow record", () => {
    expect(
      Gate2IntelligenceBriefAvailabilitySchema.parse(gate2IntelligenceBriefAvailableFixture)
    ).toEqual(gate2IntelligenceBriefAvailableFixture);
    expect(
      Gate2IntelligenceBriefCaseSelectionSchema.parse(gate2IntelligenceBriefCaseSelectionFixture)
    ).toEqual(gate2IntelligenceBriefCaseSelectionFixture);
    expect(
      Gate2BriefBacktestEvidenceLinkSchema.parse(gate2BriefBacktestEvidenceLinkFixture)
    ).toEqual(gate2BriefBacktestEvidenceLinkFixture);
    expect(Gate2BriefConflictPanelSchema.parse(gate2BriefConflictPanelFixture)).toEqual(
      gate2BriefConflictPanelFixture
    );
    expect(
      Gate2BriefInvalidationEvaluationSchema.parse(gate2BriefInvalidationEvaluationFixture)
    ).toEqual(gate2BriefInvalidationEvaluationFixture);
    expect(Gate2BriefManualRiskReviewSchema.parse(gate2BriefManualRiskReviewFixture)).toEqual(
      gate2BriefManualRiskReviewFixture
    );
    expect(Gate2BriefOperatorDecisionSchema.parse(gate2BriefOperatorDecisionFixture)).toEqual(
      gate2BriefOperatorDecisionFixture
    );
    expect(
      Gate2IntelligenceBriefWorkflowCheckpointSchema.parse(
        gate2IntelligenceBriefWorkflowCheckpointFixture
      )
    ).toEqual(gate2IntelligenceBriefWorkflowCheckpointFixture);
  });

  it("rejects scenario visibility in a blocked state", () => {
    expect(
      Gate2IntelligenceBriefAvailabilitySchema.safeParse({
        ...gate2IntelligenceBriefBlockedFixture,
        scenarios_visible: true
      }).success
    ).toBe(false);
  });

  it("rejects approval from a manual risk review", () => {
    expect(
      Gate2BriefManualRiskReviewSchema.safeParse({
        ...gate2BriefManualRiskReviewFixture,
        approval_granted: true
      }).success
    ).toBe(false);
  });

  it("rejects simulation authority from an operator decision", () => {
    expect(
      Gate2BriefOperatorDecisionSchema.safeParse({
        ...gate2BriefOperatorDecisionFixture,
        simulation_authorized: true
      }).success
    ).toBe(false);
  });

  it("rejects a backtest link that claims permission", () => {
    expect(
      Gate2BriefBacktestEvidenceLinkSchema.safeParse({
        ...gate2BriefBacktestEvidenceLinkFixture,
        evidence_permission: true
      }).success
    ).toBe(false);
  });

  it("rejects scheduled invalidation evaluation", () => {
    expect(
      Gate2BriefInvalidationEvaluationSchema.safeParse({
        ...gate2BriefInvalidationEvaluationFixture,
        scheduled_evaluation: true
      }).success
    ).toBe(false);
  });
});
