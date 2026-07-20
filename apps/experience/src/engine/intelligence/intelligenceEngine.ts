import type {
  DirectionalBias,
  IntelligenceCategory,
  IntelligenceCluster,
  IntelligenceSignal,
  IntelligenceState,
  NormalizedSignal
} from "./types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function normalizeSignal(signal: IntelligenceSignal, now: number): NormalizedSignal {
  const ageHours = Math.max(0, now - signal.timestamp) / 3_600_000;
  const timeDecay = Math.exp(-ageHours / 18);
  const freshness = clamp01(signal.freshness * timeDecay);
  const confidence = clamp01(signal.confidence);
  const importance = clamp01(signal.importance);
  const contradiction = clamp01(signal.contradiction);
  const riskImpact = clamp01(signal.riskImpact);

  const effectiveWeight = clamp01(
    confidence * 0.36 +
      freshness * 0.24 +
      importance * 0.28 -
      contradiction * 0.18 -
      riskImpact * 0.12
  );

  return {
    ...signal,
    confidence,
    freshness,
    importance,
    contradiction,
    riskImpact,
    effectiveWeight
  };
}

function dominantBias(signals: readonly NormalizedSignal[]): DirectionalBias {
  const totals = signals.reduce(
    (result, signal) => {
      result[signal.bias] += signal.effectiveWeight;
      return result;
    },
    { bullish: 0, bearish: 0, neutral: 0 }
  );

  return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "neutral") as DirectionalBias;
}

function average(signals: readonly NormalizedSignal[], key: keyof NormalizedSignal): number {
  if (signals.length === 0) return 0;
  return signals.reduce((sum, signal) => sum + Number(signal[key]), 0) / signals.length;
}

function createCluster(
  category: IntelligenceCategory,
  signals: readonly NormalizedSignal[]
): IntelligenceCluster {
  const support = clamp01(average(signals, "effectiveWeight"));
  const contradiction = clamp01(average(signals, "contradiction"));
  const freshness = clamp01(average(signals, "freshness"));
  const riskImpact = clamp01(average(signals, "riskImpact"));

  return {
    id: `cluster:${category}`,
    category,
    dominantBias: dominantBias(signals),
    members: signals,
    support,
    contradiction,
    freshness,
    riskImpact,
    routeWeight: clamp01(support * 0.62 + freshness * 0.22 - contradiction * 0.1 - riskImpact * 0.16)
  };
}

export function evaluateIntelligence(
  input: readonly IntelligenceSignal[],
  now = Date.now()
): IntelligenceState {
  const signals = input.map((signal) => normalizeSignal(signal, now));
  const categories = [...new Set(signals.map((signal) => signal.category))];
  const clusters = categories.map((category) =>
    createCluster(
      category,
      signals.filter((signal) => signal.category === category)
    )
  );

  const directionalBalance = signals.reduce(
    (result, signal) => {
      result[signal.bias] += signal.effectiveWeight;
      return result;
    },
    { bullish: 0, bearish: 0, neutral: 0 }
  );

  const totalDirection =
    directionalBalance.bullish + directionalBalance.bearish + directionalBalance.neutral || 1;

  directionalBalance.bullish /= totalDirection;
  directionalBalance.bearish /= totalDirection;
  directionalBalance.neutral /= totalDirection;

  return {
    signals,
    clusters,
    directionalBalance,
    confidence: clamp01(average(signals, "effectiveWeight")),
    contradiction: clamp01(average(signals, "contradiction")),
    risk: clamp01(average(signals, "riskImpact")),
    freshness: clamp01(average(signals, "freshness"))
  };
}
