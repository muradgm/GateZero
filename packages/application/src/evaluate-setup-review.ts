import {
  MarketContextSchema,
  SetupReviewAssessmentSchema,
  SetupReviewSchema,
  type EvidenceQuality,
  type MarketContext,
  type SetupReview,
  type SetupReviewAssessment
} from "@traderframe/contracts";

export interface EvaluateSetupReviewCommand {
  readonly assessmentId: string;
  readonly review: SetupReview;
  readonly marketContext: MarketContext;
  readonly evidenceQuality: readonly EvidenceQuality[];
  readonly evaluatedAt: string;
}

export function evaluateSetupReview(command: EvaluateSetupReviewCommand): SetupReviewAssessment {
  const review = SetupReviewSchema.parse(command.review);
  const marketContext = MarketContextSchema.parse(command.marketContext);
  const evaluatedAtMs = Date.parse(command.evaluatedAt);
  const downgradeReasons: string[] = [];

  const qualityById = new Map(command.evidenceQuality.map((quality) => [quality.evidenceId, quality]));
  const supportingQuality = review.supportingEvidence.map((evidence) => qualityById.get(evidence.id));
  const contradictingQuality = review.contradictingEvidence.map((evidence) => qualityById.get(evidence.id));

  if (supportingQuality.some((quality) => !quality)) {
    downgradeReasons.push("One or more supporting evidence records lack a quality assessment.");
  }

  if (evaluatedAtMs > Date.parse(marketContext.validUntil)) {
    downgradeReasons.push("Market context is stale.");
  }

  if (marketContext.macroEventRisk === "high" || marketContext.volatilityRegime === "event_risk") {
    downgradeReasons.push("High event risk prevents escalation to paper simulation.");
  }

  if (marketContext.correlationRisk === "high" || review.riskPlan.correlationWarning) {
    downgradeReasons.push("Portfolio correlation risk is high.");
  }

  if (review.status !== "reviewed" || !review.riskReviewId) {
    downgradeReasons.push("A completed risk review is required.");
  }

  for (const quality of command.evidenceQuality) {
    if (quality.freshness === "stale") {
      downgradeReasons.push(`Evidence ${quality.evidenceId} is stale.`);
    }
    if (quality.provenance === "unverified") {
      downgradeReasons.push(`Evidence ${quality.evidenceId} has unverified provenance.`);
    }
    if (quality.sampleSufficiency === "insufficient") {
      downgradeReasons.push(`Evidence ${quality.evidenceId} has insufficient sample support.`);
    }
    if (quality.regimeRelevance === "mismatched") {
      downgradeReasons.push(`Evidence ${quality.evidenceId} is mismatched to the current regime.`);
    }
  }

  const supportingScore = weightedAverage(
    supportingQuality.filter((quality): quality is EvidenceQuality => Boolean(quality))
  );
  const contradictingScore = weightedAverage(
    contradictingQuality.filter((quality): quality is EvidenceQuality => Boolean(quality))
  );
  const riskScore = calculateRiskScore(review, marketContext);
  const compositeScore = clamp(
    Math.round(supportingScore * 0.55 + riskScore * 0.3 + (100 - contradictingScore) * 0.15)
  );

  const recommendation = decideRecommendation({
    compositeScore,
    downgradeReasons,
    supportingCount: review.supportingEvidence.length,
    contradictingScore,
    riskScore
  });
  const confidence = calibrateConfidence(compositeScore, downgradeReasons, recommendation);

  return SetupReviewAssessmentSchema.parse({
    assessmentId: command.assessmentId,
    setupReviewId: review.setupReviewId,
    marketContextId: marketContext.marketContextId,
    evaluatedAt: command.evaluatedAt,
    evidenceQuality: [...command.evidenceQuality],
    supportingScore,
    contradictingScore,
    riskScore,
    compositeScore,
    confidence,
    recommendation,
    downgradeReasons: [...new Set(downgradeReasons)],
    decisionReasons: buildDecisionReasons({
      compositeScore,
      supportingScore,
      contradictingScore,
      riskScore,
      recommendation
    }),
    operatorRequired: true,
    riskReviewRequired: true,
    automatedAction: false,
    executionPath: false
  });
}

function weightedAverage(qualities: readonly EvidenceQuality[]): number {
  if (qualities.length === 0) return 0;
  return clamp(Math.round(qualities.reduce((sum, quality) => sum + quality.qualityScore, 0) / qualities.length));
}

function calculateRiskScore(review: SetupReview, context: MarketContext): number {
  let score = 100;
  const riskUsage = review.riskPlan.maximumRiskAmount / ((review.riskPlan.accountEquity * review.riskPlan.maximumRiskPct) / 100);

  if (riskUsage > 0.9) score -= 15;
  if (review.riskPlan.portfolioExposurePctAfterEntry > 30) score -= 20;
  if (review.riskPlan.correlationWarning || context.correlationRisk === "high") score -= 25;
  if (context.macroEventRisk === "high" || context.volatilityRegime === "event_risk") score -= 25;
  if (context.liquidityCondition === "thin" || context.liquidityCondition === "uncertain") score -= 15;

  return clamp(score);
}

function decideRecommendation(input: {
  readonly compositeScore: number;
  readonly downgradeReasons: readonly string[];
  readonly supportingCount: number;
  readonly contradictingScore: number;
  readonly riskScore: number;
}): SetupReviewAssessment["recommendation"] {
  if (input.supportingCount === 0 || input.compositeScore < 45 || input.riskScore < 45) return "REJECT";
  if (input.downgradeReasons.length > 0 || input.compositeScore < 80 || input.contradictingScore > 45) return "WATCH";
  return "PAPER_SIMULATE";
}

function calibrateConfidence(
  score: number,
  downgradeReasons: readonly string[],
  recommendation: SetupReviewAssessment["recommendation"]
): SetupReviewAssessment["confidence"] {
  if (recommendation === "REJECT") return score < 30 ? "none" : "low";
  if (downgradeReasons.length > 0 || score < 65) return "low";
  if (score < 80) return "moderate";
  return "high";
}

function buildDecisionReasons(input: {
  readonly compositeScore: number;
  readonly supportingScore: number;
  readonly contradictingScore: number;
  readonly riskScore: number;
  readonly recommendation: SetupReviewAssessment["recommendation"];
}): string[] {
  return [
    `Composite evidence score is ${input.compositeScore}/100.`,
    `Supporting evidence quality is ${input.supportingScore}/100; contradicting evidence is ${input.contradictingScore}/100.`,
    `Risk quality is ${input.riskScore}/100.`,
    `The bounded system recommendation is ${input.recommendation}; the operator retains final authority.`
  ];
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
