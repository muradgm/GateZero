import { describe, expect, it } from "vitest";
import {
  ContractValidationError,
  type Gate2AdversarialScenarioReview,
  type Gate2EvidenceQualityAssessment,
  type Gate2LocalReplaySourceEnvelope
} from "../../contracts/src/index.js";
import {
  gate2AdversarialScenarioReviewFixture,
  gate2ConditionalScenarioSetFixture,
  gate2MarketIntelligenceLocalReplaySourceFixtures,
  gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
  gate2MarketIntelligenceQualityAssessmentFixture,
  gate2ReadOnlyIntelligenceBriefFixture
} from "../../fixtures/src/index.js";
import {
  assembleGate2ReadOnlyIntelligenceBrief,
  assertGate2IntelligenceBriefIntegrity
} from "../src/index.js";

const input = () => ({
  briefId: "read-only-intelligence-brief-001",
  linkedResearchCaseId: "gate2-research-case-fixture-001",
  sources: gate2MarketIntelligenceLocalReplaySourceFixtures,
  evidenceAssembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
  qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
  scenarioSet: gate2ConditionalScenarioSetFixture,
  adversarialReview: gate2AdversarialScenarioReviewFixture,
  limitations: gate2ReadOnlyIntelligenceBriefFixture.limitations,
  blockedScopeReminder: gate2ReadOnlyIntelligenceBriefFixture.blocked_scope_reminder,
  generatedAt: "2026-07-24T00:00:00.000Z"
});

describe("Gate 2 read-only intelligence brief", () => {
  it("assembles deterministic local evidence", () => {
    expect(assembleGate2ReadOnlyIntelligenceBrief(input())).toEqual(
      gate2ReadOnlyIntelligenceBriefFixture
    );
    expect(assembleGate2ReadOnlyIntelligenceBrief(input())).toEqual(
      assembleGate2ReadOnlyIntelligenceBrief(input())
    );
  });

  it("verifies the brief content hash", () => {
    expect(() =>
      assertGate2IntelligenceBriefIntegrity(gate2ReadOnlyIntelligenceBriefFixture)
    ).not.toThrow();
  });

  it("rejects payload tampering", () => {
    expect(() =>
      assertGate2IntelligenceBriefIntegrity({
        ...gate2ReadOnlyIntelligenceBriefFixture,
        limitations: ["Altered after assembly."]
      })
    ).toThrow(ContractValidationError);
  });

  it("fails closed on stale source evidence", () => {
    const sources: Gate2LocalReplaySourceEnvelope[] =
      gate2MarketIntelligenceLocalReplaySourceFixtures.map((source) => ({ ...source }));
    sources[0]!.freshness_status = "stale";
    expect(() => assembleGate2ReadOnlyIntelligenceBrief({ ...input(), sources })).toThrow(
      "fresh, verified local source evidence"
    );
  });

  it("fails closed on missing source evidence", () => {
    expect(() =>
      assembleGate2ReadOnlyIntelligenceBrief({
        ...input(),
        sources: gate2MarketIntelligenceLocalReplaySourceFixtures.slice(1)
      })
    ).toThrow("source is missing");
  });

  it("fails closed on unsafe quality disposition", () => {
    const qualityAssessment: Gate2EvidenceQualityAssessment = {
      ...gate2MarketIntelligenceQualityAssessmentFixture,
      quality_status: "blocked",
      semantic_safety_status: "blocked",
      scenario_consideration_blocked: true,
      findings: [
        {
          code: "unsafe_instruction_language",
          severity: "critical",
          detail: "Unsafe instruction language detected."
        }
      ]
    };
    expect(() => assembleGate2ReadOnlyIntelligenceBrief({ ...input(), qualityAssessment })).toThrow(
      "quality assessment must be clear"
    );
  });

  it("fails closed on unresolved adversarial review", () => {
    const adversarialReview: Gate2AdversarialScenarioReview = {
      ...gate2AdversarialScenarioReviewFixture,
      review_status: "needs_revision",
      operator_consideration_allowed: false,
      challenges: [
        {
          challenge_id: "adversarial-scenario-review-001-test",
          category: "counter_evidence",
          severity: "high",
          finding: "Counter-evidence needs revision.",
          evidence_refs: ["conditional-scenario-bullish-001"],
          required_change: "Add source-linked counter-evidence."
        }
      ]
    };
    expect(() => assembleGate2ReadOnlyIntelligenceBrief({ ...input(), adversarialReview })).toThrow(
      "adversarial review must be clear"
    );
  });
});
