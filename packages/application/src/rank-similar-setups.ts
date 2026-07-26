export interface SetupSimilarityProfile {
  readonly instrument: string;
  readonly market: string;
  readonly trend: string;
  readonly structure: string;
  readonly momentum: string;
  readonly volatility: string;
  readonly evidenceDimensions: readonly string[];
}

export interface HistoricalSetupCase extends SetupSimilarityProfile {
  readonly caseId: string;
  readonly observedAt: string;
  readonly outcome: string;
  readonly resultR: number | null;
  readonly lesson: string;
}

export interface SimilarSetupMatch {
  readonly caseId: string;
  readonly observedAt: string;
  readonly outcome: string;
  readonly resultR: number | null;
  readonly similarityScore: number;
  readonly matchedFeatures: readonly string[];
  readonly differingFeatures: readonly string[];
  readonly lesson: string;
}

const FEATURE_WEIGHTS = {
  market: 18,
  trend: 18,
  structure: 18,
  momentum: 12,
  volatility: 12,
  evidenceDimensions: 22
} as const;

export function rankSimilarSetups(
  current: SetupSimilarityProfile,
  historicalCases: readonly HistoricalSetupCase[],
  limit = 3
): SimilarSetupMatch[] {
  return historicalCases
    .map((historical) => compareSetupProfiles(current, historical))
    .sort(
      (a, b) => b.similarityScore - a.similarityScore || b.observedAt.localeCompare(a.observedAt)
    )
    .slice(0, Math.max(0, limit));
}

function compareSetupProfiles(
  current: SetupSimilarityProfile,
  historical: HistoricalSetupCase
): SimilarSetupMatch {
  let score = 0;
  const matchedFeatures: string[] = [];
  const differingFeatures: string[] = [];

  score += compareScalar(
    "Market",
    current.market,
    historical.market,
    FEATURE_WEIGHTS.market,
    matchedFeatures,
    differingFeatures
  );
  score += compareScalar(
    "Trend",
    current.trend,
    historical.trend,
    FEATURE_WEIGHTS.trend,
    matchedFeatures,
    differingFeatures
  );
  score += compareScalar(
    "Structure",
    current.structure,
    historical.structure,
    FEATURE_WEIGHTS.structure,
    matchedFeatures,
    differingFeatures
  );
  score += compareScalar(
    "Momentum",
    current.momentum,
    historical.momentum,
    FEATURE_WEIGHTS.momentum,
    matchedFeatures,
    differingFeatures
  );
  score += compareScalar(
    "Volatility",
    current.volatility,
    historical.volatility,
    FEATURE_WEIGHTS.volatility,
    matchedFeatures,
    differingFeatures
  );

  const currentDimensions = new Set(current.evidenceDimensions);
  const historicalDimensions = new Set(historical.evidenceDimensions);
  const intersection = [...currentDimensions].filter((dimension) =>
    historicalDimensions.has(dimension)
  );
  const union = new Set([...currentDimensions, ...historicalDimensions]);
  const overlap = union.size === 0 ? 1 : intersection.length / union.size;
  score += overlap * FEATURE_WEIGHTS.evidenceDimensions;

  if (intersection.length > 0) {
    matchedFeatures.push(`Evidence: ${intersection.join(", ")}`);
  }
  const missingDimensions = [...union].filter(
    (dimension) => !currentDimensions.has(dimension) || !historicalDimensions.has(dimension)
  );
  if (missingDimensions.length > 0) {
    differingFeatures.push(`Evidence differs: ${missingDimensions.join(", ")}`);
  }

  return {
    caseId: historical.caseId,
    observedAt: historical.observedAt,
    outcome: historical.outcome,
    resultR: historical.resultR,
    similarityScore: Math.round(score),
    matchedFeatures,
    differingFeatures,
    lesson: historical.lesson
  };
}

function compareScalar(
  label: string,
  current: string,
  historical: string,
  weight: number,
  matched: string[],
  differing: string[]
): number {
  if (current.toLowerCase() === historical.toLowerCase()) {
    matched.push(`${label}: ${current}`);
    return weight;
  }

  differing.push(`${label}: ${current} vs ${historical}`);
  return 0;
}
