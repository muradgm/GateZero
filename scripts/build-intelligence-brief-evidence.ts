import { gate2ReadOnlyIntelligenceBriefFixture } from "../packages/fixtures/src/index.js";

export interface IntelligenceBriefEvidenceView {
  readonly briefId: string;
  readonly researchCaseId: string;
  readonly status: string;
  readonly generatedAt: string;
  readonly contentHash: string;
  readonly sources: readonly {
    readonly id: string;
    readonly title: string;
    readonly repositoryRef: string;
    readonly freshness: string;
    readonly asOf: string;
    readonly limitation: string;
  }[];
  readonly timeframes: readonly {
    readonly timeframe: string;
    readonly summary: string;
    readonly confidence: string;
    readonly supportingEvidence: readonly string[];
    readonly counterEvidence: readonly string[];
    readonly redFlags: readonly string[];
    readonly invalidationConditions: readonly string[];
    readonly limitations: readonly string[];
  }[];
  readonly scenarios: readonly {
    readonly direction: string;
    readonly title: string;
    readonly conditions: readonly string[];
    readonly supportingEvidence: readonly string[];
    readonly counterEvidence: readonly string[];
    readonly redFlags: readonly string[];
    readonly invalidationConditions: readonly string[];
    readonly limitations: readonly string[];
    readonly confidence: string;
  }[];
  readonly qualityStatus: string;
  readonly semanticSafetyStatus: string;
  readonly adversarialStatus: string;
  readonly crossTimeframeConflicts: readonly string[];
  readonly limitations: readonly string[];
  readonly riskReviewStatus: string;
  readonly operatorDecisionStatus: string;
  readonly blockedScopeReminder: readonly string[];
}

export function buildIntelligenceBriefEvidence(): IntelligenceBriefEvidenceView {
  const brief = gate2ReadOnlyIntelligenceBriefFixture;

  return {
    briefId: brief.brief_id,
    researchCaseId: brief.linked_research_case_id,
    status: brief.brief_status,
    generatedAt: brief.generated_at,
    contentHash: brief.content_sha256,
    sources: brief.source_inventory.map((source) => ({
      id: source.source_id,
      title: source.source_title,
      repositoryRef: source.repository_ref,
      freshness: source.freshness_status,
      asOf: source.as_of,
      limitation: source.limitation_notes.join(" ")
    })),
    timeframes: brief.evidence_assembly.timeframe_evidence.map((evidence) => ({
      timeframe: evidence.timeframe,
      summary: evidence.summary,
      confidence: evidence.confidence_level,
      supportingEvidence: evidence.supporting_evidence,
      counterEvidence: evidence.counter_evidence,
      redFlags: evidence.red_flags,
      invalidationConditions: evidence.invalidation_conditions,
      limitations: evidence.limitation_notes
    })),
    scenarios: brief.scenario_set.scenarios.map((scenario) => ({
      direction: scenario.direction,
      title: scenario.title,
      conditions: scenario.conditions,
      supportingEvidence: scenario.supporting_evidence,
      counterEvidence: scenario.counter_evidence,
      redFlags: scenario.red_flags,
      invalidationConditions: scenario.invalidation_conditions,
      limitations: scenario.limitation_notes,
      confidence: scenario.confidence_level
    })),
    qualityStatus: brief.quality_assessment.quality_status,
    semanticSafetyStatus: brief.quality_assessment.semantic_safety_status,
    adversarialStatus: brief.adversarial_review.review_status,
    crossTimeframeConflicts: brief.cross_timeframe_conflicts,
    limitations: brief.limitations,
    riskReviewStatus: brief.risk_review_status,
    operatorDecisionStatus: brief.operator_decision_status,
    blockedScopeReminder: brief.blocked_scope_reminder
  };
}
