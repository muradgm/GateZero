import { z } from "zod";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9][a-z0-9-]*$/);
const NonEmptyStringSchema = z.string().trim().min(1);
const IsoDateTimeSchema = z.string().datetime({ offset: true });
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);

export const Gate2MarketIntelligenceBoundarySchema = z
  .object({
    financial_gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    local_only: z.literal(true),
    read_only: z.literal(true),
    evidence_only: z.literal(true),
    operator_required: z.literal(true),
    risk_review_required: z.literal(true),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    action_route_created: z.literal(false),
    recommendation_final: z.literal(false),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false)
  })
  .strict();

export const Gate2LocalSourceKindSchema = z.enum([
  "market_data",
  "news",
  "event",
  "internal_research"
]);

export const Gate2SourceFreshnessSchema = z.enum(["fresh", "stale", "unknown"]);
export const Gate2SourceProvenanceStatusSchema = z.enum(["verified_local", "unverified"]);
export const Gate2EvidenceTimeframeSchema = z.enum(["hourly", "daily", "monthly"]);
export const Gate2IntelligenceConfidenceLevelSchema = z.enum(["low", "medium", "high"]);
export const Gate2EvidenceQualityStatusSchema = z.enum(["clear", "blocked"]);
export const Gate2SemanticSafetyStatusSchema = z.enum(["safe", "blocked"]);
export const Gate2ScenarioDirectionSchema = z.enum(["bullish", "bearish", "neutral"]);
export const Gate2AdversarialReviewStatusSchema = z.enum(["clear", "needs_revision", "blocked"]);

export const Gate2CanonicalRepositorySourceRefSchema = z
  .string()
  .trim()
  .min(1)
  .superRefine((sourceRef, context) => {
    const lower = sourceRef.toLowerCase();
    const segments = sourceRef.split("/");
    const allowedRoot =
      sourceRef.startsWith("ops/") ||
      sourceRef.startsWith("docs/") ||
      sourceRef.startsWith("packages/fixtures/data/");

    if (!allowedRoot) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "source reference must use an allowed repository-relative root"
      });
    }

    if (
      sourceRef.includes("\\") ||
      sourceRef.startsWith("/") ||
      /^[a-z]:/i.test(sourceRef) ||
      lower.includes("://") ||
      sourceRef.includes("%") ||
      sourceRef.includes("?") ||
      sourceRef.includes("#")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "source reference must be a canonical repository-relative path"
      });
    }

    if (
      segments.some((segment) => segment === "." || segment === ".." || segment.length === 0) ||
      /%(?:2e|2f|5c)/i.test(sourceRef)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "source reference must not contain traversal or encoded traversal"
      });
    }
  });

export const Gate2LocalReplaySourceEnvelopeSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  source_id: IdentifierSchema,
  source_kind: Gate2LocalSourceKindSchema,
  repository_ref: Gate2CanonicalRepositorySourceRefSchema,
  source_title: NonEmptyStringSchema,
  observed_at: IsoDateTimeSchema,
  published_at: IsoDateTimeSchema.optional(),
  as_of: IsoDateTimeSchema,
  ingested_at: IsoDateTimeSchema,
  payload_sha256: Sha256Schema,
  freshness_status: Gate2SourceFreshnessSchema,
  freshness_max_age_hours: z.number().int().positive(),
  provenance_status: Gate2SourceProvenanceStatusSchema,
  provenance_notes: z.array(NonEmptyStringSchema).min(1),
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  replay_only: z.literal(true),
  network_fetch_allowed: z.literal(false),
  credentials_required: z.literal(false),
  tracked_file_required: z.literal(true)
})
  .strict()
  .superRefine((source, context) => {
    if (Date.parse(source.observed_at) > Date.parse(source.ingested_at)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "source observation cannot occur after ingestion",
        path: ["observed_at"]
      });
    }

    if (Date.parse(source.as_of) > Date.parse(source.ingested_at)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "source as-of time cannot occur after ingestion",
        path: ["as_of"]
      });
    }
  });

export const Gate2TimeframeEvidenceSchema = z
  .object({
    timeframe_evidence_id: IdentifierSchema,
    timeframe: Gate2EvidenceTimeframeSchema,
    source_ids: z.array(IdentifierSchema).min(1),
    coverage_start: IsoDateTimeSchema,
    coverage_end: IsoDateTimeSchema,
    as_of: IsoDateTimeSchema,
    summary: NonEmptyStringSchema,
    supporting_evidence: z.array(NonEmptyStringSchema).min(1),
    counter_evidence: z.array(NonEmptyStringSchema).min(1),
    conflicts: z.array(NonEmptyStringSchema),
    red_flags: z.array(NonEmptyStringSchema).min(1),
    invalidation_conditions: z.array(NonEmptyStringSchema).min(1),
    limitation_notes: z.array(NonEmptyStringSchema).min(1),
    confidence_level: Gate2IntelligenceConfidenceLevelSchema
  })
  .strict()
  .superRefine((evidence, context) => {
    if (new Set(evidence.source_ids).size !== evidence.source_ids.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "timeframe source ids must be unique",
        path: ["source_ids"]
      });
    }

    if (Date.parse(evidence.coverage_start) > Date.parse(evidence.coverage_end)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "timeframe coverage start must not follow coverage end",
        path: ["coverage_start"]
      });
    }

    if (Date.parse(evidence.coverage_end) > Date.parse(evidence.as_of)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "timeframe coverage cannot extend beyond its as-of time",
        path: ["coverage_end"]
      });
    }
  });

export const Gate2MultiTimeframeEvidenceAssemblySchema =
  Gate2MarketIntelligenceBoundarySchema.extend({
    assembly_id: IdentifierSchema,
    linked_research_case_id: IdentifierSchema,
    source_ids: z.array(IdentifierSchema).min(1),
    timeframe_evidence: z.array(Gate2TimeframeEvidenceSchema).length(3),
    cross_timeframe_conflicts: z.array(NonEmptyStringSchema),
    conflicts_surfaced: z.literal(true),
    directional_conclusion: z.literal(false),
    created_at: IsoDateTimeSchema
  })
    .strict()
    .superRefine((assembly, context) => {
      const timeframes = assembly.timeframe_evidence.map((item) => item.timeframe);
      const timeframeEvidenceIds = assembly.timeframe_evidence.map(
        (item) => item.timeframe_evidence_id
      );

      if (new Set(assembly.source_ids).size !== assembly.source_ids.length) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "assembly source ids must be unique",
          path: ["source_ids"]
        });
      }

      if (new Set(timeframeEvidenceIds).size !== timeframeEvidenceIds.length) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "timeframe evidence ids must be unique",
          path: ["timeframe_evidence"]
        });
      }

      if (
        new Set(timeframes).size !== 3 ||
        !(["hourly", "daily", "monthly"] as const).every((timeframe) =>
          timeframes.includes(timeframe)
        )
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "assembly must contain one hourly, daily, and monthly evidence record",
          path: ["timeframe_evidence"]
        });
      }

      const referencedSourceIds = new Set(
        assembly.timeframe_evidence.flatMap((item) => item.source_ids)
      );

      for (const sourceId of referencedSourceIds) {
        if (!assembly.source_ids.includes(sourceId)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "assembly source ids must include every timeframe source",
            path: ["source_ids"]
          });
        }
      }
    });

export const Gate2EvidenceQualityFindingCodeSchema = z.enum([
  "stale_source",
  "unknown_freshness",
  "missing_source",
  "conflicting_evidence",
  "weak_provenance",
  "freshness_mismatch",
  "unsafe_instruction_language",
  "certainty_language",
  "profitability_language",
  "autonomous_ranking_language",
  "authority_flag_conflict"
]);

export const Gate2EvidenceQualityFindingSchema = z
  .object({
    code: Gate2EvidenceQualityFindingCodeSchema,
    severity: z.enum(["medium", "high", "critical"]),
    detail: NonEmptyStringSchema,
    source_ref: Gate2CanonicalRepositorySourceRefSchema.optional()
  })
  .strict();

export const Gate2EvidenceQualityAssessmentSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  assessment_id: IdentifierSchema,
  assembly_id: IdentifierSchema,
  quality_status: Gate2EvidenceQualityStatusSchema,
  semantic_safety_status: Gate2SemanticSafetyStatusSchema,
  findings: z.array(Gate2EvidenceQualityFindingSchema),
  scenario_consideration_blocked: z.boolean(),
  assessed_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((assessment, context) => {
    const mustBlock =
      assessment.findings.length > 0 || assessment.semantic_safety_status === "blocked";

    if (
      (mustBlock && assessment.quality_status !== "blocked") ||
      (mustBlock && !assessment.scenario_consideration_blocked)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "quality findings must fail closed",
        path: ["quality_status"]
      });
    }

    if (
      !mustBlock &&
      (assessment.quality_status !== "clear" || assessment.scenario_consideration_blocked)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "clear evidence must have a coherent clear disposition",
        path: ["quality_status"]
      });
    }
  });

export const Gate2ScenarioRegimeAssumptionSchema = z
  .object({
    assumption: NonEmptyStringSchema,
    evidence_refs: z.array(IdentifierSchema).min(1),
    limitation: NonEmptyStringSchema
  })
  .strict();

export const Gate2ScenarioInvalidationCriterionSchema = z
  .object({
    condition: NonEmptyStringSchema,
    evidence_ref: IdentifierSchema,
    observable: z.literal(true),
    test_method: NonEmptyStringSchema
  })
  .strict();

export const Gate2ConditionalScenarioSchema = z
  .object({
    scenario_id: IdentifierSchema,
    direction: Gate2ScenarioDirectionSchema,
    title: NonEmptyStringSchema,
    conditions: z.array(NonEmptyStringSchema).min(1),
    supporting_evidence: z.array(NonEmptyStringSchema).min(1),
    evidence_refs: z.array(IdentifierSchema).min(1),
    counter_evidence: z.array(NonEmptyStringSchema).min(1),
    counter_evidence_refs: z.array(IdentifierSchema).min(1),
    red_flags: z.array(NonEmptyStringSchema).min(1),
    invalidation_conditions: z.array(NonEmptyStringSchema).min(1),
    invalidation_criteria: z.array(Gate2ScenarioInvalidationCriterionSchema).min(1),
    regime_assumptions: z.array(Gate2ScenarioRegimeAssumptionSchema).min(1),
    limitation_notes: z.array(NonEmptyStringSchema).min(1),
    confidence_level: Gate2IntelligenceConfidenceLevelSchema,
    trade_instruction: z.literal(false),
    selected_for_action: z.literal(false)
  })
  .strict();

export const Gate2ConditionalScenarioSetSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  scenario_set_id: IdentifierSchema,
  linked_research_case_id: IdentifierSchema,
  assembly_id: IdentifierSchema,
  quality_assessment_id: IdentifierSchema,
  synthesis_status: z.enum(["ready_for_risk_review", "blocked"]),
  scenarios: z.array(Gate2ConditionalScenarioSchema).max(3),
  synthesis_findings: z.array(Gate2EvidenceQualityFindingSchema),
  risk_review_status: z.literal("required"),
  operator_decision_status: z.literal("required"),
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((scenarioSet, context) => {
    if (scenarioSet.synthesis_status === "blocked" && scenarioSet.scenarios.length !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked synthesis must not emit scenarios",
        path: ["scenarios"]
      });
    }

    if (scenarioSet.synthesis_status === "blocked" && scenarioSet.synthesis_findings.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked synthesis requires an explicit finding",
        path: ["synthesis_findings"]
      });
    }

    if (
      scenarioSet.synthesis_status === "ready_for_risk_review" &&
      scenarioSet.synthesis_findings.length > 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ready synthesis cannot retain blocking findings",
        path: ["synthesis_findings"]
      });
    }

    if (scenarioSet.synthesis_status === "ready_for_risk_review") {
      const directions = scenarioSet.scenarios.map((scenario) => scenario.direction);
      const scenarioIds = scenarioSet.scenarios.map((scenario) => scenario.scenario_id);

      if (new Set(scenarioIds).size !== scenarioIds.length) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "scenario ids must be unique",
          path: ["scenarios"]
        });
      }

      if (
        scenarioSet.scenarios.length !== 3 ||
        new Set(directions).size !== 3 ||
        !(["bullish", "bearish", "neutral"] as const).every((direction) =>
          directions.includes(direction)
        )
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ready synthesis requires bullish, bearish, and neutral scenarios",
          path: ["scenarios"]
        });
      }
    }
  });

export const Gate2AdversarialChallengeSchema = z
  .object({
    challenge_id: IdentifierSchema,
    category: z.enum([
      "source_quality",
      "timeframe_conflict",
      "counter_evidence",
      "regime_assumption",
      "invalidation_quality",
      "semantic_safety"
    ]),
    severity: z.enum(["medium", "high", "critical"]),
    finding: NonEmptyStringSchema,
    evidence_refs: z.array(NonEmptyStringSchema).min(1),
    required_change: NonEmptyStringSchema
  })
  .strict();

export const Gate2AdversarialScenarioReviewSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  adversarial_review_id: IdentifierSchema,
  scenario_set_id: IdentifierSchema,
  quality_assessment_id: IdentifierSchema,
  review_status: Gate2AdversarialReviewStatusSchema,
  challenges: z.array(Gate2AdversarialChallengeSchema),
  operator_consideration_allowed: z.boolean(),
  reviewed_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((review, context) => {
    const mustBlock = review.challenges.some(
      (challenge) => challenge.severity === "high" || challenge.severity === "critical"
    );

    if (mustBlock && review.review_status === "clear") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "high or critical challenges cannot produce a clear review",
        path: ["review_status"]
      });
    }

    if (review.review_status !== "clear" && review.operator_consideration_allowed) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "unresolved adversarial review must block operator consideration",
        path: ["operator_consideration_allowed"]
      });
    }
  });

export const Gate2HistoricalReplayArtifactSchema = z
  .object({
    artifact_id: IdentifierSchema,
    artifact_type: z.enum([
      "source_inventory",
      "quality_assessment",
      "scenario_set",
      "adversarial_review"
    ]),
    payload_sha256: Sha256Schema
  })
  .strict();

export const Gate2HistoricalReplayCaseSchema = z
  .object({
    replay_case_id: IdentifierSchema,
    evidence_as_of: IsoDateTimeSchema,
    recorded_at: IsoDateTimeSchema,
    source_ids: z.array(IdentifierSchema),
    required_source_count: z.number().int().positive(),
    quality_assessment_id: IdentifierSchema,
    scenario_set_id: IdentifierSchema,
    adversarial_review_id: IdentifierSchema,
    frozen_artifacts: z.array(Gate2HistoricalReplayArtifactSchema).length(4),
    scenario_set_status: z.enum(["complete", "blocked", "incomplete"]),
    scenario_count: z.number().int().min(0).max(3),
    invalidation_evidence_refs: z.array(IdentifierSchema),
    red_flag_evidence_refs: z.array(IdentifierSchema),
    unsafe_finding_codes: z.array(Gate2EvidenceQualityFindingCodeSchema),
    quality_status: Gate2EvidenceQualityStatusSchema
  })
  .strict()
  .superRefine((replayCase, context) => {
    if (Date.parse(replayCase.evidence_as_of) > Date.parse(replayCase.recorded_at)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical replay cannot use evidence from after record time",
        path: ["evidence_as_of"]
      });
    }

    if (new Set(replayCase.source_ids).size !== replayCase.source_ids.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical replay source ids must be unique",
        path: ["source_ids"]
      });
    }

    const artifactIds = replayCase.frozen_artifacts.map((artifact) => artifact.artifact_id);
    const artifactHashes = replayCase.frozen_artifacts.map((artifact) => artifact.payload_sha256);
    const artifactTypes = replayCase.frozen_artifacts.map((artifact) => artifact.artifact_type);

    if (new Set(artifactIds).size !== artifactIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical replay artifact ids must be unique",
        path: ["frozen_artifacts"]
      });
    }

    if (new Set(artifactHashes).size !== artifactHashes.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical replay artifact hashes must be unique",
        path: ["frozen_artifacts"]
      });
    }

    if (
      new Set(artifactTypes).size !== 4 ||
      !(
        ["source_inventory", "quality_assessment", "scenario_set", "adversarial_review"] as const
      ).every((artifactType) => artifactTypes.includes(artifactType))
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical replay must freeze all four required artifact types",
        path: ["frozen_artifacts"]
      });
    }

    const linkedArtifacts = new Map(
      replayCase.frozen_artifacts.map((artifact) => [artifact.artifact_type, artifact.artifact_id])
    );
    if (
      linkedArtifacts.get("quality_assessment") !== replayCase.quality_assessment_id ||
      linkedArtifacts.get("scenario_set") !== replayCase.scenario_set_id ||
      linkedArtifacts.get("adversarial_review") !== replayCase.adversarial_review_id
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical replay artifact ids must match their linked records",
        path: ["frozen_artifacts"]
      });
    }

    const expectedScenarioStatus =
      replayCase.quality_status === "blocked"
        ? "blocked"
        : replayCase.scenario_count === 3
          ? "complete"
          : "incomplete";
    if (replayCase.scenario_set_status !== expectedScenarioStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "historical replay scenario status must be derived from quality and scenario count",
        path: ["scenario_set_status"]
      });
    }

    if (replayCase.unsafe_finding_codes.length > 0 && replayCase.quality_status !== "blocked") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "unsafe historical replay findings must be blocked",
        path: ["quality_status"]
      });
    }
  });

const RateSchema = z.number().min(0).max(1);

export const Gate2HistoricalReplayBenchmarkSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  benchmark_id: IdentifierSchema,
  replay_cases: z.array(Gate2HistoricalReplayCaseSchema).min(1),
  source_coverage_rate: RateSchema,
  scenario_set_completion_rate: RateSchema,
  invalidation_documentation_rate: RateSchema,
  red_flag_detection_rate: RateSchema,
  unsafe_input_block_rate: RateSchema,
  return_metric_included: z.literal(false),
  profitability_metric_included: z.literal(false),
  trading_readiness_claim: z.literal(false),
  benchmark_conclusion: NonEmptyStringSchema,
  created_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((benchmark, context) => {
    const replayCaseIds = benchmark.replay_cases.map((item) => item.replay_case_id);
    const count = benchmark.replay_cases.length;
    const unsafeCases = benchmark.replay_cases.filter(
      (item) => item.unsafe_finding_codes.length > 0
    );
    const expectedRates = {
      source_coverage_rate: benchmarkRate(
        benchmark.replay_cases.filter(
          (item) => item.source_ids.length >= item.required_source_count
        ).length,
        count
      ),
      scenario_set_completion_rate: benchmarkRate(
        benchmark.replay_cases.filter((item) => item.scenario_set_status === "complete").length,
        count
      ),
      invalidation_documentation_rate: benchmarkRate(
        benchmark.replay_cases.filter((item) => item.invalidation_evidence_refs.length > 0).length,
        count
      ),
      red_flag_detection_rate: benchmarkRate(
        benchmark.replay_cases.filter((item) => item.red_flag_evidence_refs.length > 0).length,
        count
      ),
      unsafe_input_block_rate: benchmarkRate(
        unsafeCases.filter((item) => item.quality_status === "blocked").length,
        unsafeCases.length || 1
      )
    };

    if (new Set(replayCaseIds).size !== replayCaseIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical replay case ids must be unique",
        path: ["replay_cases"]
      });
    }

    for (const [field, expected] of Object.entries(expectedRates)) {
      if (benchmark[field as keyof typeof expectedRates] !== expected) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field} must be derived from replay cases`,
          path: [field]
        });
      }
    }
  });

function benchmarkRate(numerator: number, denominator: number): number {
  return Number((numerator / denominator).toFixed(4));
}

export type Gate2LocalReplaySourceEnvelope = z.infer<typeof Gate2LocalReplaySourceEnvelopeSchema>;
export type Gate2TimeframeEvidence = z.infer<typeof Gate2TimeframeEvidenceSchema>;
export type Gate2MultiTimeframeEvidenceAssembly = z.infer<
  typeof Gate2MultiTimeframeEvidenceAssemblySchema
>;
export type Gate2EvidenceQualityFinding = z.infer<typeof Gate2EvidenceQualityFindingSchema>;
export type Gate2EvidenceQualityAssessment = z.infer<typeof Gate2EvidenceQualityAssessmentSchema>;
export type Gate2ConditionalScenario = z.infer<typeof Gate2ConditionalScenarioSchema>;
export type Gate2ConditionalScenarioSet = z.infer<typeof Gate2ConditionalScenarioSetSchema>;
export type Gate2AdversarialScenarioReview = z.infer<typeof Gate2AdversarialScenarioReviewSchema>;
export type Gate2HistoricalReplayCase = z.infer<typeof Gate2HistoricalReplayCaseSchema>;
export type Gate2HistoricalReplayBenchmark = z.infer<typeof Gate2HistoricalReplayBenchmarkSchema>;
