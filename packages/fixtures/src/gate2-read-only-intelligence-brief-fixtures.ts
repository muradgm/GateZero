import { Gate2ReadOnlyIntelligenceBriefSchema } from "../../contracts/src/index.js";
import { assembleGate2ReadOnlyIntelligenceBrief } from "../../core/src/index.js";
import {
  gate2AdversarialScenarioReviewFixture,
  gate2ConditionalScenarioSetFixture,
  gate2MarketIntelligenceLocalReplaySourceFixtures,
  gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
  gate2MarketIntelligenceQualityAssessmentFixture
} from "./gate2-market-intelligence-foundation-fixtures.js";

export const gate2ReadOnlyIntelligenceBriefFixture = Gate2ReadOnlyIntelligenceBriefSchema.parse(
  assembleGate2ReadOnlyIntelligenceBrief({
    briefId: "read-only-intelligence-brief-001",
    linkedResearchCaseId: "gate2-research-case-fixture-001",
    sources: gate2MarketIntelligenceLocalReplaySourceFixtures,
    evidenceAssembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
    qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
    scenarioSet: gate2ConditionalScenarioSetFixture,
    adversarialReview: gate2AdversarialScenarioReviewFixture,
    limitations: [
      "Checked-in synthetic replay evidence only; no external market feed.",
      "Conditional scenarios do not predict direction or authorize a position.",
      "Risk review and an explicit operator decision remain required."
    ],
    blockedScopeReminder: [
      "No external data fetch or background polling.",
      "No account, credential, order, alert, export, or sharing route.",
      "No ranking, timing instruction, final recommendation, or performance claim."
    ],
    generatedAt: "2026-07-24T00:00:00.000Z"
  })
);
