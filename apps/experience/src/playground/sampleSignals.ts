import type { IntelligenceSignal } from "../engine/intelligence";

const hour = 3_600_000;

export const baseTimestamp = Date.now();

export const sampleSignals: readonly IntelligenceSignal[] = [
  {
    id: "structure-higher-low",
    source: "Market structure",
    category: "market-structure",
    bias: "bullish",
    confidence: 0.84,
    freshness: 0.96,
    importance: 0.9,
    contradiction: 0.08,
    riskImpact: 0.16,
    timestamp: baseTimestamp - 1.5 * hour
  },
  {
    id: "macro-yields",
    source: "Rates repricing",
    category: "macro-event",
    bias: "bearish",
    confidence: 0.7,
    freshness: 0.88,
    importance: 0.86,
    contradiction: 0.38,
    riskImpact: 0.56,
    timestamp: baseTimestamp - 3 * hour
  },
  {
    id: "news-guidance",
    source: "Forward guidance",
    category: "news",
    bias: "bullish",
    confidence: 0.74,
    freshness: 0.92,
    importance: 0.78,
    contradiction: 0.18,
    riskImpact: 0.22,
    timestamp: baseTimestamp - 2 * hour
  },
  {
    id: "sentiment-positioning",
    source: "Positioning extreme",
    category: "sentiment",
    bias: "neutral",
    confidence: 0.61,
    freshness: 0.72,
    importance: 0.58,
    contradiction: 0.46,
    riskImpact: 0.42,
    timestamp: baseTimestamp - 8 * hour
  },
  {
    id: "flow-institutional",
    source: "Institutional flow",
    category: "flow",
    bias: "bullish",
    confidence: 0.8,
    freshness: 0.83,
    importance: 0.84,
    contradiction: 0.12,
    riskImpact: 0.18,
    timestamp: baseTimestamp - 4 * hour
  },
  {
    id: "technical-breakout",
    source: "Range breakout",
    category: "technical",
    bias: "bullish",
    confidence: 0.76,
    freshness: 0.9,
    importance: 0.72,
    contradiction: 0.14,
    riskImpact: 0.2,
    timestamp: baseTimestamp - 2.5 * hour
  },
  {
    id: "risk-volatility",
    source: "Volatility expansion",
    category: "risk",
    bias: "bearish",
    confidence: 0.82,
    freshness: 0.94,
    importance: 0.92,
    contradiction: 0.24,
    riskImpact: 0.88,
    timestamp: baseTimestamp - 1 * hour
  }
];
