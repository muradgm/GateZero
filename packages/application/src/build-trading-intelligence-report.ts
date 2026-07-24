import {
  TradingIntelligenceReportSchema,
  type EvidenceContribution,
  type TradingIntelligenceReport
} from "@traderframe/contracts";

export interface BuildTradingIntelligenceReportCommand {
  readonly reportId: string;
  readonly setupReviewId: string;
  readonly instrument: string;
  readonly generatedAt: string;
  readonly contributions: readonly EvidenceContribution[];
  readonly bullCase: TradingIntelligenceReport["bullCase"];
  readonly bearCase: TradingIntelligenceReport["bearCase"];
  readonly neutralCase: TradingIntelligenceReport["neutralCase"];
  readonly timeline: TradingIntelligenceReport["timeline"];
  readonly invalidationSummary: string;
  readonly downgradeReasons: readonly string[];
}

export function buildTradingIntelligenceReport(
  command: BuildTradingIntelligenceReportCommand
): TradingIntelligenceReport {
  const evidenceScore = boundScore(
    50 + command.contributions.reduce((sum, contribution) => sum + contribution.points, 0)
  );
  const confidence = deriveConfidence(evidenceScore, command.downgradeReasons.length);
  const recommendation = deriveRecommendation(
    evidenceScore,
    confidence,
    command.downgradeReasons.length
  );

  return TradingIntelligenceReportSchema.parse({
    schemaVersion: 1,
    reportId: command.reportId,
    setupReviewId: command.setupReviewId,
    instrument: command.instrument,
    generatedAt: command.generatedAt,
    contributions: command.contributions,
    evidenceScore,
    confidence,
    recommendation,
    bullCase: command.bullCase,
    bearCase: command.bearCase,
    neutralCase: command.neutralCase,
    timeline: command.timeline,
    invalidationSummary: command.invalidationSummary,
    downgradeReasons: command.downgradeReasons,
    operatorRequired: true,
    riskReviewRequired: true,
    automatedAction: false,
    executionPath: false,
    performanceClaim: false
  });
}

export function rankTradingIntelligenceReports(
  reports: readonly TradingIntelligenceReport[]
): readonly TradingIntelligenceReport[] {
  const recommendationWeight: Record<TradingIntelligenceReport["recommendation"], number> = {
    PAPER_SIMULATE: 3,
    WATCH: 2,
    REJECT: 1
  };

  return [...reports].sort((left, right) => {
    const recommendationDelta =
      recommendationWeight[right.recommendation] - recommendationWeight[left.recommendation];
    if (recommendationDelta !== 0) return recommendationDelta;
    if (right.evidenceScore !== left.evidenceScore) return right.evidenceScore - left.evidenceScore;
    return left.instrument.localeCompare(right.instrument);
  });
}

function deriveConfidence(
  evidenceScore: number,
  downgradeReasonCount: number
): TradingIntelligenceReport["confidence"] {
  if (downgradeReasonCount > 0) return evidenceScore >= 60 ? "moderate" : "low";
  if (evidenceScore >= 80) return "high";
  if (evidenceScore >= 60) return "moderate";
  if (evidenceScore >= 40) return "low";
  return "none";
}

function deriveRecommendation(
  evidenceScore: number,
  confidence: TradingIntelligenceReport["confidence"],
  downgradeReasonCount: number
): TradingIntelligenceReport["recommendation"] {
  if (downgradeReasonCount === 0 && evidenceScore >= 80 && confidence === "high") {
    return "PAPER_SIMULATE";
  }
  if (evidenceScore >= 45) return "WATCH";
  return "REJECT";
}

function boundScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
