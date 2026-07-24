import { describe, expect, it } from "vitest";
import {
  Gate2AdversarialScenarioReviewSchema,
  Gate2ConditionalScenarioSetSchema,
  Gate2EvidenceQualityAssessmentSchema,
  Gate2HistoricalReplayBenchmarkSchema,
  Gate2LocalReplaySourceEnvelopeSchema,
  Gate2MultiTimeframeEvidenceAssemblySchema
} from "../../contracts/src/index.js";
import {
  gate2AdversarialScenarioReviewFixture,
  gate2ConditionalScenarioSetFixture,
  gate2HistoricalReplayBenchmarkFixture,
  gate2MarketIntelligenceLocalReplaySourceFixtures,
  gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
  gate2MarketIntelligenceQualityAssessmentFixture
} from "../src/index.js";

describe("Gate 2 market intelligence foundation fixtures", () => {
  it("keeps local replay sources credential-free and network-disabled", () => {
    for (const source of gate2MarketIntelligenceLocalReplaySourceFixtures) {
      expect(Gate2LocalReplaySourceEnvelopeSchema.parse(source)).toEqual(source);
      expect(source.network_fetch_allowed).toBe(false);
      expect(source.credentials_required).toBe(false);
      expect(source.replay_only).toBe(true);
    }
  });

  it("keeps hourly, daily, and monthly evidence separate", () => {
    const assembly = Gate2MultiTimeframeEvidenceAssemblySchema.parse(
      gate2MarketIntelligenceMultiTimeframeAssemblyFixture
    );

    expect(assembly.timeframe_evidence.map((item) => item.timeframe).sort()).toEqual([
      "daily",
      "hourly",
      "monthly"
    ]);
    expect(assembly.directional_conclusion).toBe(false);
  });

  it("keeps the fixture quality assessment clear but non-authoritative", () => {
    const assessment = Gate2EvidenceQualityAssessmentSchema.parse(
      gate2MarketIntelligenceQualityAssessmentFixture
    );

    expect(assessment.quality_status).toBe("clear");
    expect(assessment.semantic_safety_status).toBe("safe");
    expect(assessment.approval_claim).toBe(false);
  });

  it("keeps scenario synthesis balanced and pending risk review", () => {
    const scenarioSet = Gate2ConditionalScenarioSetSchema.parse(gate2ConditionalScenarioSetFixture);

    expect(scenarioSet.scenarios).toHaveLength(3);
    expect(scenarioSet.risk_review_status).toBe("required");
    expect(scenarioSet.operator_decision_status).toBe("required");
    expect(scenarioSet.recommendation_final).toBe(false);
  });

  it("keeps adversarial review separate from operator authority", () => {
    const review = Gate2AdversarialScenarioReviewSchema.parse(
      gate2AdversarialScenarioReviewFixture
    );

    expect(review.review_status).toBe("clear");
    expect(review.risk_review_required).toBe(true);
    expect(review.action_route_created).toBe(false);
  });

  it("keeps historical replay free of trading-performance semantics", () => {
    const benchmark = Gate2HistoricalReplayBenchmarkSchema.parse(
      gate2HistoricalReplayBenchmarkFixture
    );

    expect(benchmark.return_metric_included).toBe(false);
    expect(benchmark.profitability_metric_included).toBe(false);
    expect(benchmark.trading_readiness_claim).toBe(false);
  });
});
