import { describe, expect, it } from "vitest";
import {
  Gate2AdversarialScenarioReviewSchema,
  Gate2CanonicalRepositorySourceRefSchema,
  Gate2ConditionalScenarioSetSchema,
  Gate2EvidenceQualityAssessmentSchema,
  Gate2HistoricalReplayBenchmarkSchema,
  Gate2HistoricalReplayCaseSchema,
  Gate2LocalReplaySourceEnvelopeSchema,
  Gate2MultiTimeframeEvidenceAssemblySchema,
  Gate2TimeframeEvidenceSchema
} from "../src/index.js";

const boundary = {
  financial_gate: "G2_PAPER_TRADING" as const,
  scope: "paper_simulation_planning_only" as const,
  local_only: true as const,
  read_only: true as const,
  evidence_only: true as const,
  operator_required: true as const,
  risk_review_required: true as const,
  external_access: false as const,
  execution_path: false as const,
  action_route_created: false as const,
  recommendation_final: false as const,
  approval_claim: false as const,
  performance_claim: false as const
};

const timeframe = (value: "hourly" | "daily" | "monthly") =>
  Gate2TimeframeEvidenceSchema.parse({
    timeframe_evidence_id: `timeframe-${value}-test`,
    timeframe: value,
    source_ids: [`source-${value}-test`],
    coverage_start: "2026-07-01T00:00:00.000Z",
    coverage_end: "2026-07-02T00:00:00.000Z",
    as_of: "2026-07-03T00:00:00.000Z",
    summary: `${value} conditional context`,
    supporting_evidence: ["Supporting evidence."],
    counter_evidence: ["Counter-evidence."],
    conflicts: [],
    red_flags: ["Synthetic evidence."],
    invalidation_conditions: ["Evidence changes."],
    limitation_notes: ["Local replay only."],
    confidence_level: "low"
  });

const frozenArtifacts = (
  qualityAssessmentId: string,
  scenarioSetId: string,
  adversarialReviewId: string,
  hashCharacters = ["1", "2", "3", "4"] as const
) => [
  {
    artifact_id: "source-inventory-test",
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

describe("Gate 2 market intelligence foundation contracts", () => {
  it("accepts canonical repository-relative source references", () => {
    expect(
      Gate2CanonicalRepositorySourceRefSchema.parse("ops/truth/MARKET_INTELLIGENCE_TRUTH.md")
    ).toBe("ops/truth/MARKET_INTELLIGENCE_TRUTH.md");
  });

  it.each([
    "https://example.com/source.json",
    "C:/secrets/source.json",
    "/absolute/source.json",
    "ops/../.env",
    "ops/%2e%2e/.env",
    "ops/%252e%252e/.env",
    "other/source.json",
    "ops\\truth\\RISK_RULES.md"
  ])("rejects unsafe source reference %s", (sourceRef) => {
    expect(() => Gate2CanonicalRepositorySourceRefSchema.parse(sourceRef)).toThrow();
  });

  it("accepts a replay-only source envelope", () => {
    const source = Gate2LocalReplaySourceEnvelopeSchema.parse({
      ...boundary,
      source_id: "source-test-001",
      source_kind: "market_data",
      repository_ref: "ops/truth/MARKET_INTELLIGENCE_TRUTH.md",
      source_title: "Local source",
      observed_at: "2026-07-01T00:00:00.000Z",
      as_of: "2026-07-01T00:00:00.000Z",
      ingested_at: "2026-07-02T00:00:00.000Z",
      payload_sha256: "a".repeat(64),
      freshness_status: "fresh",
      freshness_max_age_hours: 24,
      provenance_status: "verified_local",
      provenance_notes: ["Tracked local source."],
      limitation_notes: ["No external feed."],
      replay_only: true,
      network_fetch_allowed: false,
      credentials_required: false,
      tracked_file_required: true
    });

    expect(source.network_fetch_allowed).toBe(false);
    expect(source.credentials_required).toBe(false);
  });

  it("rejects source observation after ingestion", () => {
    expect(() =>
      Gate2LocalReplaySourceEnvelopeSchema.parse({
        ...boundary,
        source_id: "source-test-002",
        source_kind: "news",
        repository_ref: "ops/truth/RISK_RULES.md",
        source_title: "Invalid source",
        observed_at: "2026-07-03T00:00:00.000Z",
        as_of: "2026-07-01T00:00:00.000Z",
        ingested_at: "2026-07-02T00:00:00.000Z",
        payload_sha256: "b".repeat(64),
        freshness_status: "fresh",
        freshness_max_age_hours: 24,
        provenance_status: "verified_local",
        provenance_notes: ["Tracked."],
        limitation_notes: ["Local."],
        replay_only: true,
        network_fetch_allowed: false,
        credentials_required: false,
        tracked_file_required: true
      })
    ).toThrow();
  });

  it("requires one hourly, daily, and monthly evidence record", () => {
    const evidence = [timeframe("hourly"), timeframe("daily"), timeframe("daily")];

    expect(() =>
      Gate2MultiTimeframeEvidenceAssemblySchema.parse({
        ...boundary,
        assembly_id: "assembly-test-001",
        linked_research_case_id: "research-case-test-001",
        source_ids: evidence.flatMap((item) => item.source_ids),
        timeframe_evidence: evidence,
        cross_timeframe_conflicts: [],
        conflicts_surfaced: true,
        directional_conclusion: false,
        created_at: "2026-07-03T00:00:00.000Z"
      })
    ).toThrow();
  });

  it("rejects duplicate assembly source ids", () => {
    const evidence = [timeframe("hourly"), timeframe("daily"), timeframe("monthly")];

    expect(() =>
      Gate2MultiTimeframeEvidenceAssemblySchema.parse({
        ...boundary,
        assembly_id: "assembly-test-duplicate",
        linked_research_case_id: "research-case-test-001",
        source_ids: ["source-hourly-test", "source-hourly-test", "source-daily-test"],
        timeframe_evidence: evidence,
        cross_timeframe_conflicts: [],
        conflicts_surfaced: true,
        directional_conclusion: false,
        created_at: "2026-07-03T00:00:00.000Z"
      })
    ).toThrow();
  });

  it("rejects timeframe coverage extending beyond as-of time", () => {
    expect(() =>
      Gate2TimeframeEvidenceSchema.parse({
        ...timeframe("hourly"),
        coverage_end: "2026-07-04T00:00:00.000Z",
        as_of: "2026-07-03T00:00:00.000Z"
      })
    ).toThrow();
  });

  it("requires quality findings to fail closed", () => {
    expect(() =>
      Gate2EvidenceQualityAssessmentSchema.parse({
        ...boundary,
        assessment_id: "quality-test-001",
        assembly_id: "assembly-test-001",
        quality_status: "clear",
        semantic_safety_status: "blocked",
        findings: [
          {
            code: "unsafe_instruction_language",
            severity: "critical",
            detail: "Unsafe instruction."
          }
        ],
        scenario_consideration_blocked: false,
        assessed_at: "2026-07-03T00:00:00.000Z"
      })
    ).toThrow();
  });

  it("requires all three conditional scenarios when synthesis is ready", () => {
    expect(() =>
      Gate2ConditionalScenarioSetSchema.parse({
        ...boundary,
        scenario_set_id: "scenario-set-test-001",
        linked_research_case_id: "research-case-test-001",
        assembly_id: "assembly-test-001",
        quality_assessment_id: "quality-test-001",
        synthesis_status: "ready_for_risk_review",
        scenarios: [],
        synthesis_findings: [],
        risk_review_status: "required",
        operator_decision_status: "required",
        created_at: "2026-07-03T00:00:00.000Z"
      })
    ).toThrow();
  });

  it("prevents blocked synthesis from emitting scenarios", () => {
    expect(() =>
      Gate2ConditionalScenarioSetSchema.parse({
        ...boundary,
        scenario_set_id: "scenario-set-test-002",
        linked_research_case_id: "research-case-test-001",
        assembly_id: "assembly-test-001",
        quality_assessment_id: "quality-test-001",
        synthesis_status: "blocked",
        scenarios: [
          {
            scenario_id: "scenario-test-001",
            direction: "neutral",
            title: "Blocked scenario",
            conditions: ["Condition."],
            supporting_evidence: ["Evidence."],
            evidence_refs: ["source-hourly-test"],
            counter_evidence: ["Counter."],
            counter_evidence_refs: ["source-daily-test"],
            red_flags: ["Flag."],
            invalidation_conditions: ["Invalidation."],
            invalidation_criteria: [
              {
                condition: "Evidence changes.",
                evidence_ref: "source-hourly-test",
                observable: true,
                test_method: "Compare frozen evidence."
              }
            ],
            regime_assumptions: [
              {
                assumption: "The replay regime remains comparable.",
                evidence_refs: ["source-hourly-test"],
                limitation: "Replay evidence is not live evidence."
              }
            ],
            limitation_notes: ["Limitation."],
            confidence_level: "low",
            trade_instruction: false,
            selected_for_action: false
          }
        ],
        synthesis_findings: [
          {
            code: "conflicting_evidence",
            severity: "high",
            detail: "Evidence is blocked."
          }
        ],
        risk_review_status: "required",
        operator_decision_status: "required",
        created_at: "2026-07-03T00:00:00.000Z"
      })
    ).toThrow();
  });

  it("blocks operator consideration when adversarial review is unresolved", () => {
    expect(() =>
      Gate2AdversarialScenarioReviewSchema.parse({
        ...boundary,
        adversarial_review_id: "adversarial-test-001",
        scenario_set_id: "scenario-set-test-001",
        quality_assessment_id: "quality-test-001",
        review_status: "needs_revision",
        challenges: [
          {
            challenge_id: "challenge-test-001",
            category: "timeframe_conflict",
            severity: "high",
            finding: "Timeframes conflict.",
            evidence_refs: ["assembly-test-001"],
            required_change: "Resolve conflict."
          }
        ],
        operator_consideration_allowed: true,
        reviewed_at: "2026-07-03T00:00:00.000Z"
      })
    ).toThrow();
  });

  it("rejects historical replay evidence from after the recorded time", () => {
    expect(() =>
      Gate2HistoricalReplayCaseSchema.parse({
        replay_case_id: "replay-test-001",
        evidence_as_of: "2026-07-04T00:00:00.000Z",
        recorded_at: "2026-07-03T00:00:00.000Z",
        source_ids: ["source-1", "source-2", "source-3"],
        required_source_count: 3,
        quality_assessment_id: "quality-replay-001",
        scenario_set_id: "scenario-replay-001",
        adversarial_review_id: "adversarial-replay-001",
        frozen_artifacts: frozenArtifacts(
          "quality-replay-001",
          "scenario-replay-001",
          "adversarial-replay-001"
        ),
        scenario_set_status: "complete",
        scenario_count: 3,
        invalidation_evidence_refs: ["invalidation-1"],
        red_flag_evidence_refs: ["red-flag-1"],
        unsafe_finding_codes: [],
        quality_status: "clear"
      })
    ).toThrow();
  });

  it("rejects duplicate historical replay case ids", () => {
    const replayCase = {
      replay_case_id: "replay-test-duplicate",
      evidence_as_of: "2026-07-02T00:00:00.000Z",
      recorded_at: "2026-07-03T00:00:00.000Z",
      source_ids: ["source-1", "source-2", "source-3"],
      required_source_count: 3,
      quality_assessment_id: "quality-replay-duplicate",
      scenario_set_id: "scenario-replay-duplicate",
      adversarial_review_id: "adversarial-replay-duplicate",
      frozen_artifacts: frozenArtifacts(
        "quality-replay-duplicate",
        "scenario-replay-duplicate",
        "adversarial-replay-duplicate"
      ),
      scenario_set_status: "complete" as const,
      scenario_count: 3,
      invalidation_evidence_refs: ["invalidation-1"],
      red_flag_evidence_refs: ["red-flag-1"],
      unsafe_finding_codes: [],
      quality_status: "clear" as const
    };

    expect(() =>
      Gate2HistoricalReplayBenchmarkSchema.parse({
        ...boundary,
        benchmark_id: "benchmark-test-duplicate",
        replay_cases: [replayCase, replayCase],
        source_coverage_rate: 1,
        scenario_set_completion_rate: 1,
        invalidation_documentation_rate: 1,
        red_flag_detection_rate: 1,
        unsafe_input_block_rate: 1,
        return_metric_included: false,
        profitability_metric_included: false,
        trading_readiness_claim: false,
        benchmark_conclusion: "Evidence controls only.",
        created_at: "2026-07-03T00:00:00.000Z"
      })
    ).toThrow();
  });

  it("rejects benchmark rates that do not match the frozen replay cases", () => {
    const replayCase = Gate2HistoricalReplayCaseSchema.parse({
      replay_case_id: "replay-test-rate",
      evidence_as_of: "2026-07-02T00:00:00.000Z",
      recorded_at: "2026-07-03T00:00:00.000Z",
      source_ids: ["source-1"],
      required_source_count: 2,
      quality_assessment_id: "quality-replay-rate",
      scenario_set_id: "scenario-replay-rate",
      adversarial_review_id: "adversarial-replay-rate",
      frozen_artifacts: frozenArtifacts(
        "quality-replay-rate",
        "scenario-replay-rate",
        "adversarial-replay-rate"
      ),
      scenario_set_status: "incomplete",
      scenario_count: 0,
      invalidation_evidence_refs: [],
      red_flag_evidence_refs: [],
      unsafe_finding_codes: [],
      quality_status: "clear"
    });

    expect(() =>
      Gate2HistoricalReplayBenchmarkSchema.parse({
        ...boundary,
        benchmark_id: "benchmark-test-rate",
        replay_cases: [replayCase],
        source_coverage_rate: 1,
        scenario_set_completion_rate: 0,
        invalidation_documentation_rate: 0,
        red_flag_detection_rate: 0,
        unsafe_input_block_rate: 0,
        return_metric_included: false,
        profitability_metric_included: false,
        trading_readiness_claim: false,
        benchmark_conclusion: "Evidence controls only.",
        created_at: "2026-07-03T00:00:00.000Z"
      })
    ).toThrow("source_coverage_rate must be derived");
  });
});
