import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import {
  Gate2AdversarialScenarioReviewSchema,
  Gate2ConditionalScenarioSetSchema,
  Gate2EvidenceQualityAssessmentSchema,
  Gate2HistoricalReplayBenchmarkSchema,
  Gate2LocalReplaySourceEnvelopeSchema,
  Gate2MultiTimeframeEvidenceAssemblySchema,
  type Gate2AdversarialScenarioReview,
  type Gate2ConditionalScenario,
  type Gate2ConditionalScenarioSet,
  type Gate2EvidenceQualityAssessment,
  type Gate2EvidenceQualityFinding,
  type Gate2HistoricalReplayBenchmark,
  type Gate2HistoricalReplayCase,
  type Gate2LocalReplaySourceEnvelope,
  type Gate2MultiTimeframeEvidenceAssembly,
  type Gate2TimeframeEvidence
} from "../../contracts/src/index.js";

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

export interface LocalReplaySourceValidationResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
}

export function validateLocalReplaySourceFiles(
  rootDir: string,
  sources: readonly Gate2LocalReplaySourceEnvelope[],
  trackedRepositoryRefs: ReadonlySet<string>
): LocalReplaySourceValidationResult {
  const root = path.resolve(rootDir);
  const realRoot = realpathSync(root);
  const findings: string[] = [];

  for (const unparsedSource of sources) {
    const source = Gate2LocalReplaySourceEnvelopeSchema.parse(unparsedSource);
    const absolutePath = path.resolve(root, ...source.repository_ref.split("/"));
    const relativePath = path.relative(root, absolutePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      findings.push(`${source.source_id}: source resolves outside the repository root`);
      continue;
    }

    if (!existsSync(absolutePath)) {
      findings.push(`${source.source_id}: source file does not exist`);
    } else {
      const realSourcePath = realpathSync(absolutePath);
      const realRelativePath = path.relative(realRoot, realSourcePath);

      if (realRelativePath.startsWith("..") || path.isAbsolute(realRelativePath)) {
        findings.push(`${source.source_id}: source resolves outside the real repository root`);
      } else if (!statSync(realSourcePath).isFile()) {
        findings.push(`${source.source_id}: source path is not a file`);
      } else {
        const actualHash = createHash("sha256").update(readFileSync(realSourcePath)).digest("hex");

        if (actualHash !== source.payload_sha256) {
          findings.push(`${source.source_id}: source payload hash does not match file contents`);
        }
      }
    }

    if (!trackedRepositoryRefs.has(source.repository_ref)) {
      findings.push(`${source.source_id}: source file is not tracked`);
    }
  }

  return {
    ok: findings.length === 0,
    findings
  };
}

export function createMultiTimeframeEvidenceAssembly(input: {
  readonly assemblyId: string;
  readonly linkedResearchCaseId: string;
  readonly timeframeEvidence: readonly Gate2TimeframeEvidence[];
  readonly createdAt: string;
}): Gate2MultiTimeframeEvidenceAssembly {
  const sourceIds = [
    ...new Set(input.timeframeEvidence.flatMap((evidence) => evidence.source_ids))
  ];
  const crossTimeframeConflicts = [
    ...new Set(input.timeframeEvidence.flatMap((evidence) => evidence.conflicts))
  ];

  return Gate2MultiTimeframeEvidenceAssemblySchema.parse({
    ...boundary,
    assembly_id: input.assemblyId,
    linked_research_case_id: input.linkedResearchCaseId,
    source_ids: sourceIds,
    timeframe_evidence: input.timeframeEvidence,
    cross_timeframe_conflicts: crossTimeframeConflicts,
    conflicts_surfaced: true,
    directional_conclusion: false,
    created_at: input.createdAt
  });
}

const semanticRules: readonly {
  readonly code:
    | "unsafe_instruction_language"
    | "certainty_language"
    | "profitability_language"
    | "autonomous_ranking_language"
    | "authority_flag_conflict";
  readonly pattern: RegExp;
  readonly detail: string;
}[] = [
  {
    code: "unsafe_instruction_language",
    pattern:
      /\b(?:buy|sell|purchase|hold)\s+(?:now|immediately|today|this|the|[A-Z]{3}\/[A-Z]{3})\b|\b(?:open|enter|go)\s+(?:a\s+)?(?:long|short|position)\b|\boperator\s+should\s+enter\b|\bexecute\s+(?:this|the)\s+trade\b|\b(?:accumulate|lighten|trim)\b|\b(?:load\s+up|add\s+to\s+(?:the\s+)?position|increase\s+allocation|reduce\s+(?:the\s+)?position)\b/i,
    detail: "Text contains a direct or disguised trade instruction."
  },
  {
    code: "certainty_language",
    pattern:
      /\bguaranteed\b|\bcannot\s+lose\b|\bcan't\s+lose\b|\brisk[- ]free\b|\bsure\s+thing\b|\binevitable\b|\bcertain\s+to\s+make\s+money\b|\bwill\s+(?:definitely|certainly)\b/i,
    detail: "Text presents an uncertain market outcome as certain."
  },
  {
    code: "profitability_language",
    pattern:
      /\bguaranteed\s+(?:profit|return)\b|\bmost\s+likely\s+profitable\b|\bprofit\s+assured\b|\bassured\s+profit\b|\bmake\s+money\b/i,
    detail: "Text makes a profitability claim."
  },
  {
    code: "autonomous_ranking_language",
    pattern:
      /\b(?:best|top|number\s+one|strongest)\s+(?:trade|opportunity|setup)\b|\brank(?:ed)?\s+first\b|\b(?:choose|select)\s+(?:the\s+)?(?:best|top|preferred|strongest)\b/i,
    detail: "Text ranks a trading action without operator authority."
  },
  {
    code: "authority_flag_conflict",
    pattern: /\b(?:approved|ready|cleared)\s+(?:to|for)\s+(?:trade|execute|buy|sell)\b/i,
    detail: "Text contradicts the record's non-final and non-execution authority."
  }
];

export function findUnsafeMarketIntelligenceText(
  texts: readonly string[]
): readonly Gate2EvidenceQualityFinding[] {
  const findings: Gate2EvidenceQualityFinding[] = [];

  for (const text of texts) {
    for (const rule of semanticRules) {
      if (rule.pattern.test(text) && !findings.some((finding) => finding.code === rule.code)) {
        findings.push({
          code: rule.code,
          severity: rule.code === "unsafe_instruction_language" ? "critical" : "high",
          detail: rule.detail
        });
      }
    }
  }

  return findings;
}

export function assessMarketIntelligenceEvidenceQuality(input: {
  readonly assessmentId: string;
  readonly assembly: Gate2MultiTimeframeEvidenceAssembly;
  readonly sources: readonly Gate2LocalReplaySourceEnvelope[];
  readonly extraTexts?: readonly string[];
  readonly assessedAt: string;
  readonly rootDir: string;
  readonly trackedRepositoryRefs: ReadonlySet<string>;
}): Gate2EvidenceQualityAssessment {
  const parsedAssembly = Gate2MultiTimeframeEvidenceAssemblySchema.parse(input.assembly);
  const parsedSources = input.sources.map((source) =>
    Gate2LocalReplaySourceEnvelopeSchema.parse(source)
  );
  const findings: Gate2EvidenceQualityFinding[] = [];
  const sourceIds = new Set(parsedSources.map((source) => source.source_id));
  const sourceValidation = validateLocalReplaySourceFiles(
    input.rootDir,
    parsedSources,
    input.trackedRepositoryRefs
  );

  for (const finding of sourceValidation.findings) {
    findings.push({
      code:
        finding.includes("not tracked") || finding.includes("hash")
          ? "weak_provenance"
          : "missing_source",
      severity: "critical",
      detail: finding
    });
  }

  for (const source of parsedSources) {
    const ageHours = (Date.parse(input.assessedAt) - Date.parse(source.as_of)) / (60 * 60 * 1000);
    const expectedFreshness =
      ageHours >= 0 && ageHours <= source.freshness_max_age_hours ? "fresh" : "stale";

    if (source.freshness_status !== expectedFreshness) {
      findings.push({
        code: "freshness_mismatch",
        severity: "high",
        detail: `Source ${source.source_id} declares ${source.freshness_status} but is ${expectedFreshness} at assessment time.`,
        source_ref: source.repository_ref
      });
    }

    if (expectedFreshness === "stale") {
      findings.push({
        code: "stale_source",
        severity: "high",
        detail: `Source ${source.source_id} is stale.`,
        source_ref: source.repository_ref
      });
    } else if (source.freshness_status === "unknown") {
      findings.push({
        code: "unknown_freshness",
        severity: "high",
        detail: `Source ${source.source_id} has unknown freshness.`,
        source_ref: source.repository_ref
      });
    }

    if (source.provenance_status !== "verified_local") {
      findings.push({
        code: "weak_provenance",
        severity: "high",
        detail: `Source ${source.source_id} has unverified provenance.`,
        source_ref: source.repository_ref
      });
    }
  }

  for (const sourceId of parsedAssembly.source_ids) {
    if (!sourceIds.has(sourceId)) {
      findings.push({
        code: "missing_source",
        severity: "critical",
        detail: `Assembly source ${sourceId} is missing from the source inventory.`
      });
    }
  }

  if (parsedAssembly.cross_timeframe_conflicts.length > 0) {
    findings.push({
      code: "conflicting_evidence",
      severity: "high",
      detail: "Cross-timeframe evidence conflicts require resolution before scenario consideration."
    });
  }

  const evidenceTexts = parsedAssembly.timeframe_evidence.flatMap((evidence) => [
    evidence.summary,
    ...evidence.supporting_evidence,
    ...evidence.counter_evidence,
    ...evidence.conflicts,
    ...evidence.red_flags,
    ...evidence.invalidation_conditions,
    ...evidence.limitation_notes
  ]);
  const semanticFindings = findUnsafeMarketIntelligenceText([
    ...evidenceTexts,
    ...(input.extraTexts ?? [])
  ]);
  findings.push(...semanticFindings);
  const blocked = findings.length > 0;

  return Gate2EvidenceQualityAssessmentSchema.parse({
    ...boundary,
    assessment_id: input.assessmentId,
    assembly_id: parsedAssembly.assembly_id,
    quality_status: blocked ? "blocked" : "clear",
    semantic_safety_status: semanticFindings.length > 0 ? "blocked" : "safe",
    findings,
    scenario_consideration_blocked: blocked,
    assessed_at: input.assessedAt
  });
}

export function createConditionalScenarioSet(input: {
  readonly scenarioSetId: string;
  readonly linkedResearchCaseId: string;
  readonly assembly: Gate2MultiTimeframeEvidenceAssembly;
  readonly qualityAssessment: Gate2EvidenceQualityAssessment;
  readonly scenarioDrafts: readonly Gate2ConditionalScenario[];
  readonly createdAt: string;
}): Gate2ConditionalScenarioSet {
  const assembly = Gate2MultiTimeframeEvidenceAssemblySchema.parse(input.assembly);
  const assessment = Gate2EvidenceQualityAssessmentSchema.parse(input.qualityAssessment);
  if (input.linkedResearchCaseId !== assembly.linked_research_case_id) {
    throw new Error("scenario set research case must match the evidence assembly");
  }
  if (assessment.assembly_id !== assembly.assembly_id) {
    throw new Error("scenario set quality assessment must match the evidence assembly");
  }

  const scenarioTexts = input.scenarioDrafts.flatMap((scenario) => [
    scenario.title,
    ...scenario.conditions,
    ...scenario.supporting_evidence,
    ...scenario.counter_evidence,
    ...scenario.red_flags,
    ...scenario.invalidation_conditions,
    ...scenario.limitation_notes,
    ...scenario.regime_assumptions.flatMap((assumption) => [
      assumption.assumption,
      assumption.limitation
    ]),
    ...scenario.invalidation_criteria.flatMap((criterion) => [
      criterion.condition,
      criterion.test_method
    ])
  ]);
  const scenarioFindings = findUnsafeMarketIntelligenceText(scenarioTexts);
  const synthesisFindings = [...assessment.findings, ...scenarioFindings];
  const blocked =
    assessment.quality_status === "blocked" ||
    assessment.scenario_consideration_blocked ||
    scenarioFindings.length > 0;

  return Gate2ConditionalScenarioSetSchema.parse({
    ...boundary,
    scenario_set_id: input.scenarioSetId,
    linked_research_case_id: input.linkedResearchCaseId,
    assembly_id: assembly.assembly_id,
    quality_assessment_id: assessment.assessment_id,
    synthesis_status: blocked ? "blocked" : "ready_for_risk_review",
    scenarios: blocked ? [] : input.scenarioDrafts,
    synthesis_findings: blocked ? synthesisFindings : [],
    risk_review_status: "required",
    operator_decision_status: "required",
    created_at: input.createdAt
  });
}

export function createAdversarialScenarioReview(input: {
  readonly adversarialReviewId: string;
  readonly scenarioSet: Gate2ConditionalScenarioSet;
  readonly qualityAssessment: Gate2EvidenceQualityAssessment;
  readonly assembly: Gate2MultiTimeframeEvidenceAssembly;
  readonly reviewedAt: string;
}): Gate2AdversarialScenarioReview {
  const scenarioSet = Gate2ConditionalScenarioSetSchema.parse(input.scenarioSet);
  const assessment = Gate2EvidenceQualityAssessmentSchema.parse(input.qualityAssessment);
  const assembly = Gate2MultiTimeframeEvidenceAssemblySchema.parse(input.assembly);
  const challenges: Gate2AdversarialScenarioReview["challenges"][number][] = [];
  const sourceIds = new Set(assembly.source_ids);
  const placeholderPattern = /^(?:n\/?a|none|unknown|tbd|trust me|obvious)$/i;

  if (
    scenarioSet.assembly_id !== assembly.assembly_id ||
    assessment.assembly_id !== assembly.assembly_id ||
    scenarioSet.quality_assessment_id !== assessment.assessment_id ||
    scenarioSet.linked_research_case_id !== assembly.linked_research_case_id
  ) {
    throw new Error("adversarial review inputs must describe the same research evidence chain");
  }

  if (assessment.quality_status === "blocked") {
    challenges.push({
      challenge_id: `${input.adversarialReviewId}-quality`,
      category:
        assessment.semantic_safety_status === "blocked" ? "semantic_safety" : "source_quality",
      severity: "critical",
      finding: "Evidence quality is blocked before operator consideration.",
      evidence_refs: [assessment.assessment_id],
      required_change: "Resolve every quality finding and rerun the assessment."
    });
  }

  if (assembly.cross_timeframe_conflicts.length > 0) {
    challenges.push({
      challenge_id: `${input.adversarialReviewId}-timeframe`,
      category: "timeframe_conflict",
      severity: "high",
      finding: "Timeframe evidence conflicts remain unresolved.",
      evidence_refs: [assembly.assembly_id],
      required_change: "Explain or resolve timeframe disagreement before consideration."
    });
  }

  for (const scenario of scenarioSet.scenarios) {
    const invalidCounterEvidence =
      scenario.counter_evidence.some((item) => placeholderPattern.test(item)) ||
      scenario.counter_evidence_refs.some((sourceId) => !sourceIds.has(sourceId));
    if (invalidCounterEvidence) {
      challenges.push({
        challenge_id: `${input.adversarialReviewId}-${scenario.direction}-counter`,
        category: "counter_evidence",
        severity: "high",
        finding: `${scenario.direction} scenario lacks counter-evidence.`,
        evidence_refs: [scenario.scenario_id],
        required_change: "Add source-linked counter-evidence."
      });
    }

    const invalidRegimeAssumption = scenario.regime_assumptions.some(
      (assumption) =>
        placeholderPattern.test(assumption.assumption) ||
        placeholderPattern.test(assumption.limitation) ||
        assumption.evidence_refs.some((sourceId) => !sourceIds.has(sourceId))
    );
    if (invalidRegimeAssumption) {
      challenges.push({
        challenge_id: `${input.adversarialReviewId}-${scenario.direction}-regime`,
        category: "regime_assumption",
        severity: "high",
        finding: `${scenario.direction} scenario has an untestable or unlinked regime assumption.`,
        evidence_refs: [scenario.scenario_id],
        required_change:
          "Replace placeholders and link every regime assumption to assembly evidence."
      });
    }

    const invalidInvalidation = scenario.invalidation_criteria.some(
      (criterion) =>
        placeholderPattern.test(criterion.condition) ||
        placeholderPattern.test(criterion.test_method) ||
        !sourceIds.has(criterion.evidence_ref)
    );
    if (invalidInvalidation) {
      challenges.push({
        challenge_id: `${input.adversarialReviewId}-${scenario.direction}-invalidation`,
        category: "invalidation_quality",
        severity: "high",
        finding: `${scenario.direction} scenario has an untestable or unlinked invalidation criterion.`,
        evidence_refs: [scenario.scenario_id],
        required_change: "Define observable invalidation criteria linked to assembly evidence."
      });
    }
  }

  const reviewStatus = challenges.some((challenge) => challenge.severity === "critical")
    ? "blocked"
    : challenges.length > 0
      ? "needs_revision"
      : "clear";

  return Gate2AdversarialScenarioReviewSchema.parse({
    ...boundary,
    adversarial_review_id: input.adversarialReviewId,
    scenario_set_id: scenarioSet.scenario_set_id,
    quality_assessment_id: assessment.assessment_id,
    review_status: reviewStatus,
    challenges,
    operator_consideration_allowed: reviewStatus === "clear",
    reviewed_at: input.reviewedAt
  });
}

export function runHistoricalReplayBenchmark(input: {
  readonly benchmarkId: string;
  readonly replayCases: readonly Gate2HistoricalReplayCase[];
  readonly createdAt: string;
}): Gate2HistoricalReplayBenchmark {
  const replayCases = input.replayCases;
  const count = replayCases.length;
  const unsafeCases = replayCases.filter((item) => item.unsafe_finding_codes.length > 0);

  if (count === 0) {
    throw new Error("historical replay benchmark requires at least one case");
  }

  return Gate2HistoricalReplayBenchmarkSchema.parse({
    ...boundary,
    benchmark_id: input.benchmarkId,
    replay_cases: replayCases,
    source_coverage_rate: rate(
      replayCases.filter((item) => item.source_ids.length >= item.required_source_count).length,
      count
    ),
    scenario_set_completion_rate: rate(
      replayCases.filter((item) => item.scenario_set_status === "complete").length,
      count
    ),
    invalidation_documentation_rate: rate(
      replayCases.filter((item) => item.invalidation_evidence_refs.length > 0).length,
      count
    ),
    red_flag_detection_rate: rate(
      replayCases.filter((item) => item.red_flag_evidence_refs.length > 0).length,
      count
    ),
    unsafe_input_block_rate: rate(
      unsafeCases.filter((item) => item.quality_status === "blocked").length,
      unsafeCases.length || 1
    ),
    return_metric_included: false,
    profitability_metric_included: false,
    trading_readiness_claim: false,
    benchmark_conclusion:
      "Historical replay measures evidence coverage, uncertainty controls, and unsafe-input blocking only.",
    created_at: input.createdAt
  });
}

function rate(numerator: number, denominator: number): number {
  return Number((numerator / denominator).toFixed(4));
}
