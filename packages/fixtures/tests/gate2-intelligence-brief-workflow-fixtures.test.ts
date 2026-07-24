import { describe, expect, it } from "vitest";
import {
  Gate2BriefBacktestEvidenceLinkSchema,
  Gate2BriefInvalidationEvaluationSchema,
  Gate2BriefManualRiskReviewSchema,
  Gate2BriefOperatorDecisionSchema,
  Gate2IntelligenceBriefWorkflowCheckpointSchema
} from "../../contracts/src/index.js";
import {
  gate2BriefBacktestEvidenceLinkFixture,
  gate2BriefInvalidationEvaluationFixture,
  gate2BriefManualRiskReviewFixture,
  gate2BriefOperatorDecisionFixture,
  gate2IntelligenceBriefBlockedFixture,
  gate2IntelligenceBriefUnavailableFixture,
  gate2IntelligenceBriefWorkflowCheckpointFixture
} from "../src/index.js";

describe("Gate 2 intelligence brief workflow fixtures", () => {
  it("keeps blocked and unavailable scenarios hidden", () => {
    expect(gate2IntelligenceBriefBlockedFixture.scenarios_visible).toBe(false);
    expect(gate2IntelligenceBriefUnavailableFixture.scenarios_visible).toBe(false);
  });

  it("links historical backtest evidence without permission", () => {
    const link = Gate2BriefBacktestEvidenceLinkSchema.parse(gate2BriefBacktestEvidenceLinkFixture);
    expect(link.evidence_permission).toBe(false);
    expect(link.strategy_promotion).toBe(false);
  });

  it("evaluates invalidation only by explicit request", () => {
    const evaluation = Gate2BriefInvalidationEvaluationSchema.parse(
      gate2BriefInvalidationEvaluationFixture
    );
    expect(evaluation.invocation).toBe("explicit_operator_request");
    expect(evaluation.scheduled_evaluation).toBe(false);
    expect(evaluation.disposition).toBe("clear");
  });

  it("keeps manual review and decision non-authoritative", () => {
    const riskReview = Gate2BriefManualRiskReviewSchema.parse(gate2BriefManualRiskReviewFixture);
    const decision = Gate2BriefOperatorDecisionSchema.parse(gate2BriefOperatorDecisionFixture);
    expect(riskReview.approval_granted).toBe(false);
    expect(decision.decision).toBe("keep_research_only");
    expect(decision.simulation_authorized).toBe(false);
  });

  it("closes the workflow at research-only", () => {
    const checkpoint = Gate2IntelligenceBriefWorkflowCheckpointSchema.parse(
      gate2IntelligenceBriefWorkflowCheckpointFixture
    );
    expect(checkpoint.workflow_status).toBe("research_only_recorded");
  });
});
