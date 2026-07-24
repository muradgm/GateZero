import { describe, expect, it } from "vitest";
import {
  Gate2MultiTimeframeEvidenceAssemblySchema,
  type Gate2LocalReplaySourceEnvelope
} from "../../contracts/src/index.js";
import {
  gate2ConditionalScenarioDraftFixtures,
  gate2ConditionalScenarioSetFixture,
  gate2HistoricalReplayCaseFixtures,
  gate2MarketIntelligenceLocalReplaySourceFixtures,
  gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
  gate2MarketIntelligenceQualityAssessmentFixture,
  gate2MarketIntelligenceTimeframeEvidenceFixtures
} from "../../fixtures/src/index.js";
import {
  assessMarketIntelligenceEvidenceQuality,
  createAdversarialScenarioReview,
  createConditionalScenarioSet,
  createMultiTimeframeEvidenceAssembly,
  findUnsafeMarketIntelligenceText,
  runHistoricalReplayBenchmark,
  validateLocalReplaySourceFiles
} from "../src/index.js";

const trackedSourceRefs = new Set(
  gate2MarketIntelligenceLocalReplaySourceFixtures.map((source) => source.repository_ref)
);

const frozenArtifacts = (
  prefix: string,
  qualityAssessmentId: string,
  scenarioSetId: string,
  adversarialReviewId: string,
  hashCharacters: readonly [string, string, string, string]
) => [
  {
    artifact_id: `${prefix}-source-inventory`,
    artifact_type: "source_inventory" as const,
    payload_sha256: hashCharacters[0].repeat(64)
  },
  {
    artifact_id: qualityAssessmentId,
    artifact_type: "quality_assessment" as const,
    payload_sha256: hashCharacters[1].repeat(64)
  },
  {
    artifact_id: scenarioSetId,
    artifact_type: "scenario_set" as const,
    payload_sha256: hashCharacters[2].repeat(64)
  },
  {
    artifact_id: adversarialReviewId,
    artifact_type: "adversarial_review" as const,
    payload_sha256: hashCharacters[3].repeat(64)
  }
];

describe("Gate 2 market intelligence foundation", () => {
  it("validates existing tracked local replay source files", () => {
    const tracked = new Set(
      gate2MarketIntelligenceLocalReplaySourceFixtures.map((source) => source.repository_ref)
    );
    const result = validateLocalReplaySourceFiles(
      process.cwd(),
      gate2MarketIntelligenceLocalReplaySourceFixtures,
      tracked
    );

    expect(result).toEqual({ ok: true, findings: [] });
  });

  it("rejects source files that are not tracked", () => {
    const result = validateLocalReplaySourceFiles(
      process.cwd(),
      gate2MarketIntelligenceLocalReplaySourceFixtures,
      new Set()
    );

    expect(result.ok).toBe(false);
    expect(result.findings).toHaveLength(3);
    expect(result.findings[0]).toContain("is not tracked");
  });

  it("rejects a replay source whose frozen hash does not match the local file", () => {
    const tamperedSources = gate2MarketIntelligenceLocalReplaySourceFixtures.map((source, index) =>
      index === 0 ? { ...source, payload_sha256: "0".repeat(64) } : source
    );
    const result = validateLocalReplaySourceFiles(
      process.cwd(),
      tamperedSources,
      trackedSourceRefs
    );

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "market-source-hourly-001: source payload hash does not match file contents"
    );
  });

  it("assembles separate hourly, daily, and monthly evidence", () => {
    const assembly = createMultiTimeframeEvidenceAssembly({
      assemblyId: "assembly-core-test-001",
      linkedResearchCaseId: "research-case-core-test-001",
      timeframeEvidence: gate2MarketIntelligenceTimeframeEvidenceFixtures,
      createdAt: "2026-07-24T00:00:00.000Z"
    });

    expect(assembly.timeframe_evidence.map((item) => item.timeframe).sort()).toEqual([
      "daily",
      "hourly",
      "monthly"
    ]);
    expect(assembly.directional_conclusion).toBe(false);
  });

  it("surfaces timeframe conflicts without flattening them", () => {
    const conflictedEvidence = gate2MarketIntelligenceTimeframeEvidenceFixtures.map(
      (evidence, index) =>
        index === 0
          ? { ...evidence, conflicts: ["Hourly context conflicts with monthly."] }
          : evidence
    );
    const assembly = createMultiTimeframeEvidenceAssembly({
      assemblyId: "assembly-core-test-002",
      linkedResearchCaseId: "research-case-core-test-001",
      timeframeEvidence: conflictedEvidence,
      createdAt: "2026-07-24T00:00:00.000Z"
    });

    expect(assembly.cross_timeframe_conflicts).toEqual(["Hourly context conflicts with monthly."]);
    expect(assembly.conflicts_surfaced).toBe(true);
  });

  it.each([
    ["Buy now and sell today.", "unsafe_instruction_language"],
    ["This outcome is guaranteed.", "certainty_language"],
    ["Guaranteed profit from this setup.", "certainty_language"],
    ["This is the best trade available.", "autonomous_ranking_language"],
    ["Approved to execute.", "authority_flag_conflict"],
    ["Accumulate now and lighten the position after a rally.", "unsafe_instruction_language"],
    ["You should buy EUR/USD.", "unsafe_instruction_language"],
    ["Open a long position.", "unsafe_instruction_language"],
    ["Sell EUR/USD at 1.20.", "unsafe_instruction_language"],
    ["Hold this position.", "unsafe_instruction_language"],
    ["Purchase today because this is risk-free.", "unsafe_instruction_language"],
    ["This setup is certain to make money.", "certainty_language"],
    ["Choose the strongest opportunity.", "autonomous_ranking_language"],
    ["The operator should enter at the open.", "unsafe_instruction_language"]
  ])("classifies unsafe text %s", (text, expectedCode) => {
    const findings = findUnsafeMarketIntelligenceText([text]);

    expect(findings.map((finding) => finding.code)).toContain(expectedCode);
  });

  it("keeps bounded conditional text semantically safe", () => {
    expect(
      findUnsafeMarketIntelligenceText([
        "A bullish scenario may remain possible if evidence stays current.",
        "Operator review remains required."
      ])
    ).toEqual([]);
  });

  it("fails closed on stale evidence", () => {
    const staleSources = gate2MarketIntelligenceLocalReplaySourceFixtures.map((source, index) =>
      index === 0
        ? ({
            ...source,
            as_of: "2026-07-20T00:00:00.000Z",
            freshness_status: "stale"
          } as Gate2LocalReplaySourceEnvelope)
        : source
    );
    const assessment = assessMarketIntelligenceEvidenceQuality({
      assessmentId: "quality-core-test-001",
      assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      sources: staleSources,
      assessedAt: "2026-07-24T00:00:00.000Z",
      rootDir: process.cwd(),
      trackedRepositoryRefs: trackedSourceRefs
    });

    expect(assessment.quality_status).toBe("blocked");
    expect(assessment.scenario_consideration_blocked).toBe(true);
    expect(assessment.findings.map((finding) => finding.code)).toContain("stale_source");
  });

  it("derives freshness and rejects a false fresh declaration", () => {
    const falselyFreshSources = gate2MarketIntelligenceLocalReplaySourceFixtures.map(
      (source, index) =>
        index === 0
          ? ({
              ...source,
              as_of: "2026-07-20T00:00:00.000Z",
              freshness_status: "fresh"
            } as Gate2LocalReplaySourceEnvelope)
          : source
    );
    const assessment = assessMarketIntelligenceEvidenceQuality({
      assessmentId: "quality-core-freshness-mismatch",
      assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      sources: falselyFreshSources,
      assessedAt: "2026-07-24T00:00:00.000Z",
      rootDir: process.cwd(),
      trackedRepositoryRefs: trackedSourceRefs
    });

    expect(assessment.quality_status).toBe("blocked");
    expect(assessment.findings.map((finding) => finding.code)).toEqual(
      expect.arrayContaining(["freshness_mismatch", "stale_source"])
    );
  });

  it("blocks tampered local evidence during quality assessment", () => {
    const tamperedSources = gate2MarketIntelligenceLocalReplaySourceFixtures.map((source, index) =>
      index === 0 ? { ...source, payload_sha256: "0".repeat(64) } : source
    );
    const assessment = assessMarketIntelligenceEvidenceQuality({
      assessmentId: "quality-core-tampered-source",
      assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      sources: tamperedSources,
      assessedAt: "2026-07-24T00:00:00.000Z",
      rootDir: process.cwd(),
      trackedRepositoryRefs: trackedSourceRefs
    });

    expect(assessment.quality_status).toBe("blocked");
    expect(assessment.findings.map((finding) => finding.code)).toContain("weak_provenance");
  });

  it("fails closed on unsafe semantic content", () => {
    const assessment = assessMarketIntelligenceEvidenceQuality({
      assessmentId: "quality-core-test-002",
      assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      sources: gate2MarketIntelligenceLocalReplaySourceFixtures,
      extraTexts: ["Guaranteed profit: buy immediately; this cannot lose."],
      assessedAt: "2026-07-24T00:00:00.000Z",
      rootDir: process.cwd(),
      trackedRepositoryRefs: trackedSourceRefs
    });

    expect(assessment.semantic_safety_status).toBe("blocked");
    expect(assessment.scenario_consideration_blocked).toBe(true);
    expect(assessment.findings.length).toBeGreaterThanOrEqual(3);
  });

  it("automatically scans text embedded in timeframe evidence", () => {
    const unsafeEvidence = gate2MarketIntelligenceTimeframeEvidenceFixtures.map(
      (evidence, index) =>
        index === 0 ? { ...evidence, summary: "Choose the strongest opportunity." } : evidence
    );
    const unsafeAssembly = createMultiTimeframeEvidenceAssembly({
      assemblyId: "assembly-core-unsafe-text",
      linkedResearchCaseId: "research-case-core-unsafe-text",
      timeframeEvidence: unsafeEvidence,
      createdAt: "2026-07-24T00:00:00.000Z"
    });
    const assessment = assessMarketIntelligenceEvidenceQuality({
      assessmentId: "quality-core-embedded-text",
      assembly: unsafeAssembly,
      sources: gate2MarketIntelligenceLocalReplaySourceFixtures,
      assessedAt: "2026-07-24T00:00:00.000Z",
      rootDir: process.cwd(),
      trackedRepositoryRefs: trackedSourceRefs
    });

    expect(assessment.semantic_safety_status).toBe("blocked");
    expect(assessment.findings.map((finding) => finding.code)).toContain(
      "autonomous_ranking_language"
    );
  });

  it("emits all three conditional scenarios only when quality is clear", () => {
    const scenarioSet = createConditionalScenarioSet({
      scenarioSetId: "scenario-set-core-test-001",
      linkedResearchCaseId: "gate2-research-case-fixture-001",
      assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
      scenarioDrafts: gate2ConditionalScenarioDraftFixtures,
      createdAt: "2026-07-24T00:00:00.000Z"
    });

    expect(scenarioSet.synthesis_status).toBe("ready_for_risk_review");
    expect(scenarioSet.scenarios.map((scenario) => scenario.direction).sort()).toEqual([
      "bearish",
      "bullish",
      "neutral"
    ]);
    expect(scenarioSet.scenarios.every((scenario) => !scenario.trade_instruction)).toBe(true);
  });

  it("emits no scenarios when quality is blocked", () => {
    const blockedAssessment = {
      ...gate2MarketIntelligenceQualityAssessmentFixture,
      quality_status: "blocked" as const,
      semantic_safety_status: "blocked" as const,
      findings: [
        {
          code: "unsafe_instruction_language" as const,
          severity: "critical" as const,
          detail: "Unsafe instruction."
        }
      ],
      scenario_consideration_blocked: true
    };
    const scenarioSet = createConditionalScenarioSet({
      scenarioSetId: "scenario-set-core-test-002",
      linkedResearchCaseId: "gate2-research-case-fixture-001",
      assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      qualityAssessment: blockedAssessment,
      scenarioDrafts: gate2ConditionalScenarioDraftFixtures,
      createdAt: "2026-07-24T00:00:00.000Z"
    });

    expect(scenarioSet.synthesis_status).toBe("blocked");
    expect(scenarioSet.scenarios).toEqual([]);
    expect(scenarioSet.synthesis_findings).toHaveLength(1);
  });

  it("blocks unsafe language introduced in a scenario draft", () => {
    const unsafeDrafts = gate2ConditionalScenarioDraftFixtures.map((scenario, index) =>
      index === 0 ? { ...scenario, title: "Choose the strongest opportunity." } : scenario
    );
    const scenarioSet = createConditionalScenarioSet({
      scenarioSetId: "scenario-set-core-unsafe-draft",
      linkedResearchCaseId: "gate2-research-case-fixture-001",
      assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
      scenarioDrafts: unsafeDrafts,
      createdAt: "2026-07-24T00:00:00.000Z"
    });

    expect(scenarioSet.synthesis_status).toBe("blocked");
    expect(scenarioSet.scenarios).toEqual([]);
    expect(scenarioSet.synthesis_findings[0]?.code).toBe("autonomous_ranking_language");
  });

  it("rejects a scenario set linked to a different research case", () => {
    expect(() =>
      createConditionalScenarioSet({
        scenarioSetId: "scenario-set-core-mismatch",
        linkedResearchCaseId: "different-research-case",
        assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
        qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
        scenarioDrafts: gate2ConditionalScenarioDraftFixtures,
        createdAt: "2026-07-24T00:00:00.000Z"
      })
    ).toThrow("research case");
  });

  it("clears adversarial review only when no unresolved challenge exists", () => {
    const review = createAdversarialScenarioReview({
      adversarialReviewId: "adversarial-core-test-001",
      scenarioSet: gate2ConditionalScenarioSetFixture,
      qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
      assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      reviewedAt: "2026-07-24T00:00:00.000Z"
    });

    expect(review.review_status).toBe("clear");
    expect(review.operator_consideration_allowed).toBe(true);
  });

  it("challenges unresolved timeframe conflicts", () => {
    const conflictedAssembly = Gate2MultiTimeframeEvidenceAssemblySchema.parse({
      ...gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      cross_timeframe_conflicts: ["Hourly and monthly context conflict."]
    });
    const review = createAdversarialScenarioReview({
      adversarialReviewId: "adversarial-core-test-002",
      scenarioSet: gate2ConditionalScenarioSetFixture,
      qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
      assembly: conflictedAssembly,
      reviewedAt: "2026-07-24T00:00:00.000Z"
    });

    expect(review.review_status).toBe("needs_revision");
    expect(review.operator_consideration_allowed).toBe(false);
    expect(review.challenges[0]?.category).toBe("timeframe_conflict");
  });

  it("challenges placeholder and unlinked scenario evidence", () => {
    const invalidScenarioSet = {
      ...gate2ConditionalScenarioSetFixture,
      scenarios: gate2ConditionalScenarioSetFixture.scenarios.map((scenario, index) =>
        index === 0
          ? {
              ...scenario,
              counter_evidence: ["Trust me"],
              counter_evidence_refs: ["unlinked-source"],
              regime_assumptions: [
                {
                  assumption: "N/A",
                  evidence_refs: ["unlinked-source"],
                  limitation: "Unknown"
                }
              ],
              invalidation_criteria: [
                {
                  condition: "TBD",
                  evidence_ref: "unlinked-source",
                  observable: true as const,
                  test_method: "Obvious"
                }
              ]
            }
          : scenario
      )
    };
    const review = createAdversarialScenarioReview({
      adversarialReviewId: "adversarial-core-placeholder",
      scenarioSet: invalidScenarioSet,
      qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
      assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
      reviewedAt: "2026-07-24T00:00:00.000Z"
    });

    expect(review.review_status).toBe("needs_revision");
    expect(review.challenges.map((challenge) => challenge.category)).toEqual(
      expect.arrayContaining(["counter_evidence", "regime_assumption", "invalidation_quality"])
    );
  });

  it("rejects adversarial review records from different evidence chains", () => {
    expect(() =>
      createAdversarialScenarioReview({
        adversarialReviewId: "adversarial-core-mismatch",
        scenarioSet: {
          ...gate2ConditionalScenarioSetFixture,
          assembly_id: "other-assembly"
        },
        qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
        assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
        reviewedAt: "2026-07-24T00:00:00.000Z"
      })
    ).toThrow("same research evidence chain");
  });

  it("benchmarks evidence controls without return or profitability metrics", () => {
    const benchmark = runHistoricalReplayBenchmark({
      benchmarkId: "benchmark-core-test-001",
      replayCases: gate2HistoricalReplayCaseFixtures,
      createdAt: "2026-07-24T00:00:00.000Z"
    });

    expect(benchmark.source_coverage_rate).toBe(0.6667);
    expect(benchmark.scenario_set_completion_rate).toBe(0.6667);
    expect(benchmark.unsafe_input_block_rate).toBe(1);
    expect(benchmark.return_metric_included).toBe(false);
    expect(benchmark.profitability_metric_included).toBe(false);
    expect(benchmark.trading_readiness_claim).toBe(false);
  });

  it("calculates unsafe-input blocking against unsafe cases only", () => {
    const benchmark = runHistoricalReplayBenchmark({
      benchmarkId: "benchmark-core-test-denominator",
      replayCases: [
        {
          replay_case_id: "replay-safe-case",
          evidence_as_of: "2026-01-01T00:00:00.000Z",
          recorded_at: "2026-01-02T00:00:00.000Z",
          source_ids: ["safe-source-1", "safe-source-2", "safe-source-3"],
          required_source_count: 3,
          quality_assessment_id: "safe-quality",
          scenario_set_id: "safe-scenario",
          adversarial_review_id: "safe-adversarial",
          frozen_artifacts: frozenArtifacts(
            "safe",
            "safe-quality",
            "safe-scenario",
            "safe-adversarial",
            ["1", "2", "3", "4"]
          ),
          scenario_set_status: "complete",
          scenario_count: 3,
          invalidation_evidence_refs: ["safe-invalidation"],
          red_flag_evidence_refs: ["safe-red-flag"],
          unsafe_finding_codes: [],
          quality_status: "clear"
        },
        {
          replay_case_id: "replay-unsafe-case",
          evidence_as_of: "2026-01-01T00:00:00.000Z",
          recorded_at: "2026-01-02T00:00:00.000Z",
          source_ids: ["unsafe-source-1", "unsafe-source-2", "unsafe-source-3"],
          required_source_count: 3,
          quality_assessment_id: "unsafe-quality",
          scenario_set_id: "unsafe-scenario",
          adversarial_review_id: "unsafe-adversarial",
          frozen_artifacts: frozenArtifacts(
            "unsafe",
            "unsafe-quality",
            "unsafe-scenario",
            "unsafe-adversarial",
            ["5", "6", "7", "8"]
          ),
          scenario_set_status: "blocked",
          scenario_count: 0,
          invalidation_evidence_refs: ["unsafe-invalidation"],
          red_flag_evidence_refs: ["unsafe-red-flag"],
          unsafe_finding_codes: ["unsafe_instruction_language"],
          quality_status: "blocked"
        }
      ],
      createdAt: "2026-07-24T00:00:00.000Z"
    });

    expect(benchmark.unsafe_input_block_rate).toBe(1);
  });

  it("rejects an empty historical replay benchmark", () => {
    expect(() =>
      runHistoricalReplayBenchmark({
        benchmarkId: "benchmark-core-test-002",
        replayCases: [],
        createdAt: "2026-07-24T00:00:00.000Z"
      })
    ).toThrow("historical replay benchmark requires at least one case");
  });
});
