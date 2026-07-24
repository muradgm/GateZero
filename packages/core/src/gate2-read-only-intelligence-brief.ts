import {
  ContractValidationError,
  Gate2AdversarialScenarioReviewSchema,
  Gate2ConditionalScenarioSetSchema,
  Gate2EvidenceQualityAssessmentSchema,
  Gate2LocalReplaySourceEnvelopeSchema,
  Gate2MultiTimeframeEvidenceAssemblySchema,
  Gate2ReadOnlyIntelligenceBriefSchema,
  type Gate2AdversarialScenarioReview,
  type Gate2ConditionalScenarioSet,
  type Gate2EvidenceQualityAssessment,
  type Gate2LocalReplaySourceEnvelope,
  type Gate2MultiTimeframeEvidenceAssembly,
  type Gate2ReadOnlyIntelligenceBrief
} from "../../contracts/src/index.js";
import { hashCanonicalValue } from "./trace-hashing.js";

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

export interface AssembleGate2ReadOnlyIntelligenceBriefInput {
  readonly briefId: string;
  readonly linkedResearchCaseId: string;
  readonly sources: readonly Gate2LocalReplaySourceEnvelope[];
  readonly evidenceAssembly: Gate2MultiTimeframeEvidenceAssembly;
  readonly qualityAssessment: Gate2EvidenceQualityAssessment;
  readonly scenarioSet: Gate2ConditionalScenarioSet;
  readonly adversarialReview: Gate2AdversarialScenarioReview;
  readonly limitations: readonly string[];
  readonly blockedScopeReminder: readonly string[];
  readonly generatedAt: string;
}

export function calculateGate2IntelligenceBriefHash(brief: Gate2ReadOnlyIntelligenceBrief): string {
  const payload = Object.fromEntries(
    Object.entries(Gate2ReadOnlyIntelligenceBriefSchema.parse(brief)).filter(
      ([key]) => key !== "content_sha256"
    )
  );
  return hashCanonicalValue(payload);
}

export function assertGate2IntelligenceBriefIntegrity(brief: Gate2ReadOnlyIntelligenceBrief): void {
  const parsed = Gate2ReadOnlyIntelligenceBriefSchema.parse(brief);
  if (calculateGate2IntelligenceBriefHash(parsed) !== parsed.content_sha256) {
    throw new ContractValidationError("intelligence brief hash does not match its evidence");
  }
}

export function assembleGate2ReadOnlyIntelligenceBrief(
  input: AssembleGate2ReadOnlyIntelligenceBriefInput
): Gate2ReadOnlyIntelligenceBrief {
  const sources = input.sources.map((source) => Gate2LocalReplaySourceEnvelopeSchema.parse(source));
  const evidenceAssembly = Gate2MultiTimeframeEvidenceAssemblySchema.parse(input.evidenceAssembly);
  const qualityAssessment = Gate2EvidenceQualityAssessmentSchema.parse(input.qualityAssessment);
  const scenarioSet = Gate2ConditionalScenarioSetSchema.parse(input.scenarioSet);
  const adversarialReview = Gate2AdversarialScenarioReviewSchema.parse(input.adversarialReview);

  const availableSourceIds = new Set(sources.map((source) => source.source_id));
  for (const sourceId of evidenceAssembly.source_ids) {
    if (!availableSourceIds.has(sourceId)) {
      throw new ContractValidationError(`intelligence brief source is missing: ${sourceId}`);
    }
  }

  if (
    sources.some(
      (source) =>
        source.freshness_status !== "fresh" || source.provenance_status !== "verified_local"
    )
  ) {
    throw new ContractValidationError(
      "intelligence brief requires fresh, verified local source evidence"
    );
  }

  if (
    qualityAssessment.quality_status !== "clear" ||
    qualityAssessment.semantic_safety_status !== "safe" ||
    qualityAssessment.scenario_consideration_blocked
  ) {
    throw new ContractValidationError("intelligence brief quality assessment must be clear");
  }

  if (
    scenarioSet.synthesis_status !== "ready_for_risk_review" ||
    scenarioSet.risk_review_status !== "required" ||
    scenarioSet.operator_decision_status !== "required"
  ) {
    throw new ContractValidationError(
      "intelligence brief scenarios must remain pending risk and operator review"
    );
  }

  if (
    adversarialReview.review_status !== "clear" ||
    !adversarialReview.operator_consideration_allowed
  ) {
    throw new ContractValidationError("intelligence brief adversarial review must be clear");
  }

  const briefWithoutHash = {
    ...boundary,
    brief_id: input.briefId,
    linked_research_case_id: input.linkedResearchCaseId,
    brief_status: "evidence_available" as const,
    source_inventory: sources,
    evidence_assembly: evidenceAssembly,
    quality_assessment: qualityAssessment,
    scenario_set: scenarioSet,
    adversarial_review: adversarialReview,
    cross_timeframe_conflicts: evidenceAssembly.cross_timeframe_conflicts,
    limitations: input.limitations,
    risk_review_status: "required" as const,
    operator_decision_status: "required" as const,
    blocked_scope_reminder: input.blockedScopeReminder,
    generated_at: input.generatedAt
  };

  return Gate2ReadOnlyIntelligenceBriefSchema.parse({
    ...briefWithoutHash,
    content_sha256: hashCanonicalValue(briefWithoutHash)
  });
}
