export type IntelligenceCategory =
  | "market-structure"
  | "macro-event"
  | "news"
  | "sentiment"
  | "flow"
  | "technical"
  | "risk";

export type DirectionalBias = "bullish" | "bearish" | "neutral";

export type IntelligenceSignal = {
  id: string;
  source: string;
  category: IntelligenceCategory;
  bias: DirectionalBias;
  confidence: number;
  freshness: number;
  importance: number;
  contradiction: number;
  riskImpact: number;
  timestamp: number;
};

export type NormalizedSignal = IntelligenceSignal & {
  confidence: number;
  freshness: number;
  importance: number;
  contradiction: number;
  riskImpact: number;
  effectiveWeight: number;
};

export type IntelligenceCluster = {
  id: string;
  category: IntelligenceCategory;
  dominantBias: DirectionalBias;
  members: readonly NormalizedSignal[];
  support: number;
  contradiction: number;
  freshness: number;
  riskImpact: number;
  routeWeight: number;
};

export type IntelligenceState = {
  signals: readonly NormalizedSignal[];
  clusters: readonly IntelligenceCluster[];
  directionalBalance: {
    bullish: number;
    bearish: number;
    neutral: number;
  };
  confidence: number;
  contradiction: number;
  risk: number;
  freshness: number;
};
