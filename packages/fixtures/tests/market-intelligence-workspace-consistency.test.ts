import { describe, expect, it } from "vitest";
import {
  checkMarketIntelligenceWorkspaceConsistency,
  renderMarketIntelligenceWorkspaceConsistencyResult,
  type MarketIntelligenceWorkspaceConsistencyInput
} from "../../../scripts/check-market-intelligence-workspace.js";

const validInput: MarketIntelligenceWorkspaceConsistencyInput = {
  workspaceRefs: ["input-1", "candidate-1", "red-flag-1", "recommendation-1", "review-1", "link-1"],
  recommendation: {
    id: "recommendation-1",
    candidate: "candidate-1",
    redFlag: "red-flag-1",
    evidenceRefs: ["input-1", "candidate-1", "red-flag-1"],
    sourceRefs: ["ops/truth/MARKET_INTELLIGENCE_TRUTH.md"]
  },
  riskReview: {
    id: "review-1",
    blockerRefs: ["red-flag-1"]
  },
  simulationCandidate: {
    id: "link-1",
    simulationRecord: "simulation-1",
    evidenceDetail: "detail-1"
  }
};

describe("Market intelligence workspace consistency", () => {
  it("accepts a complete local evidence chain", () => {
    const result = checkMarketIntelligenceWorkspaceConsistency(validInput);

    expect(result.ok).toBe(true);
    expect(renderMarketIntelligenceWorkspaceConsistencyResult(result)).toBe(
      "Market intelligence workspace consistency passed."
    );
  });

  it("rejects drift between recommendation records and workspace references", () => {
    const result = checkMarketIntelligenceWorkspaceConsistency({
      ...validInput,
      workspaceRefs: validInput.workspaceRefs.filter((ref) => ref !== "candidate-1")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing signal candidate reference in strategy workspace: candidate-1"
    );
    expect(result.findings).toContain(
      "Missing scenario evidence reference in strategy workspace: candidate-1"
    );
  });

  it("rejects detached blockers, remote sources, duplicate refs, and missing simulation detail", () => {
    const result = checkMarketIntelligenceWorkspaceConsistency({
      ...validInput,
      workspaceRefs: [...validInput.workspaceRefs, "input-1"],
      recommendation: {
        ...validInput.recommendation,
        sourceRefs: ["https://example.invalid/scenario"]
      },
      riskReview: { ...validInput.riskReview, blockerRefs: [] },
      simulationCandidate: { ...validInput.simulationCandidate, evidenceDetail: "" }
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Recommendation red flag is not linked by the risk review.");
    expect(result.findings).toContain(
      "Scenario source is not a checked-in local path: https://example.invalid/scenario"
    );
    expect(result.findings).toContain("Duplicate market workspace reference: input-1");
    expect(result.findings).toContain(
      "Simulation candidate is missing its local simulation evidence links."
    );
  });
});
