import type { HistoricalSetupCase } from "../packages/application/src/rank-similar-setups.js";

export const workspaceHistoricalCases: readonly HistoricalSetupCase[] = [
  {
    caseId: "eurusd-2026-03-10",
    observedAt: "2026-03-10T10:00:00.000Z",
    instrument: "EUR/USD",
    market: "FX",
    trend: "Bullish",
    structure: "Pullback",
    momentum: "Stable",
    volatility: "Normal",
    evidenceDimensions: ["trend", "market_structure", "liquidity", "risk"],
    outcome: "Target reached",
    resultR: 2.1,
    lesson: "Waiting for the one-hour trigger preserved the planned asymmetry."
  },
  {
    caseId: "eurusd-2026-01-22",
    observedAt: "2026-01-22T14:00:00.000Z",
    instrument: "EUR/USD",
    market: "FX",
    trend: "Bullish",
    structure: "Pullback",
    momentum: "Weakening",
    volatility: "Normal",
    evidenceDimensions: ["trend", "market_structure", "macro", "risk"],
    outcome: "Stopped",
    resultR: -1,
    lesson: "Stable structure was not enough when momentum continued to deteriorate."
  },
  {
    caseId: "btcusd-2026-04-18",
    observedAt: "2026-04-18T08:00:00.000Z",
    instrument: "BTC/USD",
    market: "Crypto",
    trend: "Bullish",
    structure: "Expansion",
    momentum: "Weakening",
    volatility: "Elevated",
    evidenceDimensions: ["trend", "market_structure", "momentum", "risk"],
    outcome: "Watch only",
    resultR: null,
    lesson: "Extended location reduced reward-to-risk despite intact higher-timeframe trend."
  },
  {
    caseId: "btcusd-2026-02-09",
    observedAt: "2026-02-09T12:00:00.000Z",
    instrument: "BTC/USD",
    market: "Crypto",
    trend: "Bullish",
    structure: "Expansion",
    momentum: "Stable",
    volatility: "Elevated",
    evidenceDimensions: ["trend", "market_structure", "liquidity", "risk"],
    outcome: "Target reached",
    resultR: 1.8,
    lesson: "Retracement before simulation materially improved entry quality."
  },
  {
    caseId: "xauusd-2026-05-03",
    observedAt: "2026-05-03T13:00:00.000Z",
    instrument: "XAU/USD",
    market: "Metals",
    trend: "Mixed",
    structure: "Range",
    momentum: "Conflicted",
    volatility: "Event risk",
    evidenceDimensions: ["macro", "event_risk", "market_structure", "risk"],
    outcome: "Rejected",
    resultR: null,
    lesson: "No defensible stop existed while event risk dominated the range."
  },
  {
    caseId: "xauusd-2026-02-14",
    observedAt: "2026-02-14T15:00:00.000Z",
    instrument: "XAU/USD",
    market: "Metals",
    trend: "Bullish",
    structure: "Pullback",
    momentum: "Stable",
    volatility: "Normal",
    evidenceDimensions: ["trend", "market_structure", "macro", "risk"],
    outcome: "Target reached",
    resultR: 2.4,
    lesson: "The setup became valid only after the event window closed and structure resolved."
  }
];
