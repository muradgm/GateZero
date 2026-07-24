import {
  Gate2ConditionalScenarioSchema,
  Gate2HistoricalReplayCaseSchema,
  Gate2LocalReplaySourceEnvelopeSchema,
  Gate2TimeframeEvidenceSchema,
  type Gate2ConditionalScenario,
  type Gate2HistoricalReplayCase,
  type Gate2LocalReplaySourceEnvelope,
  type Gate2TimeframeEvidence
} from "../../contracts/src/index.js";
import {
  assessMarketIntelligenceEvidenceQuality,
  createAdversarialScenarioReview,
  createConditionalScenarioSet,
  createMultiTimeframeEvidenceAssembly,
  runHistoricalReplayBenchmark
} from "../../core/src/index.js";

const fixtureTimestamp = "2026-07-24T00:00:00.000Z";
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

export const gate2MarketIntelligenceLocalReplaySourceFixtures: readonly Gate2LocalReplaySourceEnvelope[] =
  [
    Gate2LocalReplaySourceEnvelopeSchema.parse({
      ...boundary,
      source_id: "market-source-hourly-001",
      source_kind: "market_data",
      repository_ref: "ops/truth/MARKET_INTELLIGENCE_TRUTH.md",
      source_title: "Checked-in hourly market context",
      observed_at: "2026-07-23T23:00:00.000Z",
      as_of: "2026-07-23T23:00:00.000Z",
      ingested_at: fixtureTimestamp,
      payload_sha256: "6755c9c99112dd76c2deabf1b06f80d0286447d1d6c2b47c14c13bb01765b94c",
      freshness_status: "fresh",
      freshness_max_age_hours: 48,
      provenance_status: "verified_local",
      provenance_notes: ["Checked-in truth record used as deterministic replay provenance."],
      limitation_notes: ["Synthetic local context; no external market feed."],
      replay_only: true,
      network_fetch_allowed: false,
      credentials_required: false,
      tracked_file_required: true
    }),
    Gate2LocalReplaySourceEnvelopeSchema.parse({
      ...boundary,
      source_id: "market-source-daily-001",
      source_kind: "internal_research",
      repository_ref: "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_IMPLEMENTATION.md",
      source_title: "Checked-in daily evidence context",
      observed_at: "2026-07-23T22:00:00.000Z",
      as_of: "2026-07-23T22:00:00.000Z",
      ingested_at: fixtureTimestamp,
      payload_sha256: "6d3add0a49f5fb662a4fe6c75a44b5f12724734cc665f9f6fdb6443d33d48c01",
      freshness_status: "fresh",
      freshness_max_age_hours: 72,
      provenance_status: "verified_local",
      provenance_notes: ["Tracked local evidence implementation record."],
      limitation_notes: ["Research fixture only; no directional authority."],
      replay_only: true,
      network_fetch_allowed: false,
      credentials_required: false,
      tracked_file_required: true
    }),
    Gate2LocalReplaySourceEnvelopeSchema.parse({
      ...boundary,
      source_id: "market-source-monthly-001",
      source_kind: "event",
      repository_ref: "ops/truth/RISK_RULES.md",
      source_title: "Checked-in monthly risk context",
      observed_at: "2026-07-23T21:00:00.000Z",
      as_of: "2026-07-23T21:00:00.000Z",
      ingested_at: fixtureTimestamp,
      payload_sha256: "afdfa9a608f536f4ecc0a25d7a977fc6b1ff9cec66693a31f7c5d0e5899864d2",
      freshness_status: "fresh",
      freshness_max_age_hours: 744,
      provenance_status: "verified_local",
      provenance_notes: ["Tracked risk truth used as local replay context."],
      limitation_notes: ["Risk context is not a market prediction."],
      replay_only: true,
      network_fetch_allowed: false,
      credentials_required: false,
      tracked_file_required: true
    })
  ];

export const gate2MarketIntelligenceTimeframeEvidenceFixtures: readonly Gate2TimeframeEvidence[] = [
  Gate2TimeframeEvidenceSchema.parse({
    timeframe_evidence_id: "timeframe-hourly-001",
    timeframe: "hourly",
    source_ids: ["market-source-hourly-001"],
    coverage_start: "2026-07-23T20:00:00.000Z",
    coverage_end: "2026-07-23T23:00:00.000Z",
    as_of: "2026-07-23T23:00:00.000Z",
    summary: "Hourly evidence shows short-horizon uncertainty.",
    supporting_evidence: ["Recent observations remain inside the local replay range."],
    counter_evidence: ["The short sample cannot establish a durable regime."],
    conflicts: [],
    red_flags: ["Short-horizon evidence can reverse quickly."],
    invalidation_conditions: ["The hourly evidence becomes stale."],
    limitation_notes: ["Synthetic replay evidence only."],
    confidence_level: "low"
  }),
  Gate2TimeframeEvidenceSchema.parse({
    timeframe_evidence_id: "timeframe-daily-001",
    timeframe: "daily",
    source_ids: ["market-source-daily-001"],
    coverage_start: "2026-07-17T00:00:00.000Z",
    coverage_end: "2026-07-23T00:00:00.000Z",
    as_of: "2026-07-23T22:00:00.000Z",
    summary: "Daily evidence remains mixed and conditional.",
    supporting_evidence: ["The checked-in daily record preserves evidence lineage."],
    counter_evidence: ["No external market data is present."],
    conflicts: [],
    red_flags: ["Daily context is synthetic."],
    invalidation_conditions: ["Daily provenance no longer matches the recorded source."],
    limitation_notes: ["No directional conclusion is authorized."],
    confidence_level: "low"
  }),
  Gate2TimeframeEvidenceSchema.parse({
    timeframe_evidence_id: "timeframe-monthly-001",
    timeframe: "monthly",
    source_ids: ["market-source-monthly-001"],
    coverage_start: "2026-06-24T00:00:00.000Z",
    coverage_end: "2026-07-23T00:00:00.000Z",
    as_of: "2026-07-23T21:00:00.000Z",
    summary: "Monthly context emphasizes risk controls over direction.",
    supporting_evidence: ["Risk truth remains explicit and tracked."],
    counter_evidence: ["Risk policy does not establish a market regime."],
    conflicts: [],
    red_flags: ["Long-horizon context is policy evidence, not price evidence."],
    invalidation_conditions: ["The governing risk truth changes."],
    limitation_notes: ["Monthly context cannot authorize a position."],
    confidence_level: "low"
  })
];

export const gate2MarketIntelligenceMultiTimeframeAssemblyFixture =
  createMultiTimeframeEvidenceAssembly({
    assemblyId: "multi-timeframe-assembly-001",
    linkedResearchCaseId: "gate2-research-case-fixture-001",
    timeframeEvidence: gate2MarketIntelligenceTimeframeEvidenceFixtures,
    createdAt: fixtureTimestamp
  });

export const gate2MarketIntelligenceQualityAssessmentFixture =
  assessMarketIntelligenceEvidenceQuality({
    assessmentId: "market-quality-assessment-001",
    assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
    sources: gate2MarketIntelligenceLocalReplaySourceFixtures,
    assessedAt: fixtureTimestamp,
    rootDir: process.cwd(),
    trackedRepositoryRefs: new Set(
      gate2MarketIntelligenceLocalReplaySourceFixtures.map((source) => source.repository_ref)
    )
  });

export const gate2ConditionalScenarioDraftFixtures: readonly Gate2ConditionalScenario[] = [
  Gate2ConditionalScenarioSchema.parse({
    scenario_id: "conditional-scenario-bullish-001",
    direction: "bullish",
    title: "Conditional upside scenario",
    conditions: ["Supporting hourly and daily evidence strengthens without new red flags."],
    supporting_evidence: ["Hourly local replay evidence remains current."],
    evidence_refs: ["market-source-hourly-001", "market-source-daily-001"],
    counter_evidence: ["Monthly context provides no directional confirmation."],
    counter_evidence_refs: ["market-source-monthly-001"],
    red_flags: ["Evidence is synthetic and local only."],
    invalidation_conditions: ["Hourly evidence becomes stale or contradicts daily context."],
    invalidation_criteria: [
      {
        condition: "Hourly evidence exceeds its declared freshness window.",
        evidence_ref: "market-source-hourly-001",
        observable: true,
        test_method: "Compare the source as-of timestamp with the assessment timestamp."
      }
    ],
    regime_assumptions: [
      {
        assumption: "Hourly and daily evidence remain comparable within the local replay window.",
        evidence_refs: ["market-source-hourly-001", "market-source-daily-001"],
        limitation: "The checked-in sources do not establish a live market regime."
      }
    ],
    limitation_notes: ["This is not a trade instruction or final recommendation."],
    confidence_level: "low",
    trade_instruction: false,
    selected_for_action: false
  }),
  Gate2ConditionalScenarioSchema.parse({
    scenario_id: "conditional-scenario-bearish-001",
    direction: "bearish",
    title: "Conditional downside scenario",
    conditions: ["Counter-evidence expands and risk conditions deteriorate."],
    supporting_evidence: ["Short-horizon uncertainty remains material."],
    evidence_refs: ["market-source-hourly-001"],
    counter_evidence: ["No tracked source establishes downside continuation."],
    counter_evidence_refs: ["market-source-daily-001"],
    red_flags: ["Directional evidence is incomplete."],
    invalidation_conditions: ["Daily evidence resolves the uncertainty."],
    invalidation_criteria: [
      {
        condition: "Daily evidence resolves the recorded short-horizon uncertainty.",
        evidence_ref: "market-source-daily-001",
        observable: true,
        test_method: "Reassess the daily source against the recorded uncertainty statement."
      }
    ],
    regime_assumptions: [
      {
        assumption: "Short-horizon uncertainty remains material in the replay evidence.",
        evidence_refs: ["market-source-hourly-001"],
        limitation: "Uncertainty alone does not establish downside continuation."
      }
    ],
    limitation_notes: ["This scenario cannot authorize a position."],
    confidence_level: "low",
    trade_instruction: false,
    selected_for_action: false
  }),
  Gate2ConditionalScenarioSchema.parse({
    scenario_id: "conditional-scenario-neutral-001",
    direction: "neutral",
    title: "Conditional range scenario",
    conditions: ["Timeframes remain mixed without a quality blocker."],
    supporting_evidence: ["Every timeframe includes explicit uncertainty."],
    evidence_refs: ["market-source-hourly-001", "market-source-daily-001"],
    counter_evidence: ["New source evidence could invalidate the range framing."],
    counter_evidence_refs: ["market-source-monthly-001"],
    red_flags: ["Local replay has no external price authority."],
    invalidation_conditions: ["A timeframe develops a source-linked regime change."],
    invalidation_criteria: [
      {
        condition: "A linked timeframe records a material regime change.",
        evidence_ref: "market-source-monthly-001",
        observable: true,
        test_method: "Compare the monthly source with the prior frozen replay state."
      }
    ],
    regime_assumptions: [
      {
        assumption: "The three local replay timeframes remain mixed.",
        evidence_refs: [
          "market-source-hourly-001",
          "market-source-daily-001",
          "market-source-monthly-001"
        ],
        limitation: "Mixed evidence does not establish that a range will persist."
      }
    ],
    limitation_notes: ["Neutral does not mean safe, approved, or ready."],
    confidence_level: "low",
    trade_instruction: false,
    selected_for_action: false
  })
];

export const gate2ConditionalScenarioSetFixture = createConditionalScenarioSet({
  scenarioSetId: "conditional-scenario-set-001",
  linkedResearchCaseId: "gate2-research-case-fixture-001",
  assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
  qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
  scenarioDrafts: gate2ConditionalScenarioDraftFixtures,
  createdAt: fixtureTimestamp
});

export const gate2AdversarialScenarioReviewFixture = createAdversarialScenarioReview({
  adversarialReviewId: "adversarial-scenario-review-001",
  scenarioSet: gate2ConditionalScenarioSetFixture,
  qualityAssessment: gate2MarketIntelligenceQualityAssessmentFixture,
  assembly: gate2MarketIntelligenceMultiTimeframeAssemblyFixture,
  reviewedAt: fixtureTimestamp
});

function frozenReplayArtifacts(suffix: string, hashes: readonly [string, string, string, string]) {
  return [
    {
      artifact_id: `replay-source-inventory-${suffix}`,
      artifact_type: "source_inventory" as const,
      payload_sha256: hashes[0]
    },
    {
      artifact_id: `replay-quality-${suffix}`,
      artifact_type: "quality_assessment" as const,
      payload_sha256: hashes[1]
    },
    {
      artifact_id: `replay-scenario-set-${suffix}`,
      artifact_type: "scenario_set" as const,
      payload_sha256: hashes[2]
    },
    {
      artifact_id: `replay-adversarial-review-${suffix}`,
      artifact_type: "adversarial_review" as const,
      payload_sha256: hashes[3]
    }
  ];
}

export const gate2HistoricalReplayCaseFixtures: readonly Gate2HistoricalReplayCase[] = [
  Gate2HistoricalReplayCaseSchema.parse({
    replay_case_id: "historical-replay-case-001",
    evidence_as_of: "2026-01-01T00:00:00.000Z",
    recorded_at: "2026-01-02T00:00:00.000Z",
    source_ids: ["replay-source-001", "replay-source-002", "replay-source-003"],
    required_source_count: 3,
    quality_assessment_id: "replay-quality-001",
    scenario_set_id: "replay-scenario-set-001",
    adversarial_review_id: "replay-adversarial-review-001",
    frozen_artifacts: frozenReplayArtifacts("001", [
      "1".repeat(64),
      "2".repeat(64),
      "3".repeat(64),
      "4".repeat(64)
    ]),
    scenario_set_status: "complete",
    scenario_count: 3,
    invalidation_evidence_refs: ["replay-invalidation-001"],
    red_flag_evidence_refs: ["replay-red-flag-001"],
    unsafe_finding_codes: [],
    quality_status: "clear"
  }),
  Gate2HistoricalReplayCaseSchema.parse({
    replay_case_id: "historical-replay-case-002",
    evidence_as_of: "2026-02-01T00:00:00.000Z",
    recorded_at: "2026-02-02T00:00:00.000Z",
    source_ids: ["replay-source-004", "replay-source-005"],
    required_source_count: 3,
    quality_assessment_id: "replay-quality-002",
    scenario_set_id: "replay-scenario-set-002",
    adversarial_review_id: "replay-adversarial-review-002",
    frozen_artifacts: frozenReplayArtifacts("002", [
      "5".repeat(64),
      "6".repeat(64),
      "7".repeat(64),
      "8".repeat(64)
    ]),
    scenario_set_status: "blocked",
    scenario_count: 0,
    invalidation_evidence_refs: ["replay-invalidation-002"],
    red_flag_evidence_refs: ["replay-red-flag-002"],
    unsafe_finding_codes: ["unsafe_instruction_language"],
    quality_status: "blocked"
  }),
  Gate2HistoricalReplayCaseSchema.parse({
    replay_case_id: "historical-replay-case-003",
    evidence_as_of: "2026-03-01T00:00:00.000Z",
    recorded_at: "2026-03-02T00:00:00.000Z",
    source_ids: ["replay-source-006", "replay-source-007", "replay-source-008"],
    required_source_count: 3,
    quality_assessment_id: "replay-quality-003",
    scenario_set_id: "replay-scenario-set-003",
    adversarial_review_id: "replay-adversarial-review-003",
    frozen_artifacts: frozenReplayArtifacts("003", [
      "9".repeat(64),
      "a".repeat(64),
      "b".repeat(64),
      "c".repeat(64)
    ]),
    scenario_set_status: "complete",
    scenario_count: 3,
    invalidation_evidence_refs: [],
    red_flag_evidence_refs: [],
    unsafe_finding_codes: [],
    quality_status: "clear"
  })
];

export const gate2HistoricalReplayBenchmarkFixture = runHistoricalReplayBenchmark({
  benchmarkId: "historical-replay-benchmark-001",
  replayCases: gate2HistoricalReplayCaseFixtures,
  createdAt: fixtureTimestamp
});
