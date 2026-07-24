export const intelligenceBriefEvidence = {
  briefId: "read-only-intelligence-brief-001",
  researchCaseId: "gate2-research-case-fixture-001",
  status: "evidence_available",
  generatedAt: "2026-07-24T00:00:00.000Z",
  contentHash: "2fedd964fb47b08d455a88afa208f7513a5b24c3d6fa1fd7abc2f9d2ef8b3d6b",
  sources: [
    {
      id: "market-source-hourly-001",
      title: "Checked-in hourly market context",
      repositoryRef: "ops/truth/MARKET_INTELLIGENCE_TRUTH.md",
      freshness: "fresh",
      asOf: "2026-07-23T23:00:00.000Z",
      limitation: "Synthetic local context; no external market feed."
    },
    {
      id: "market-source-daily-001",
      title: "Checked-in daily evidence context",
      repositoryRef: "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_IMPLEMENTATION.md",
      freshness: "fresh",
      asOf: "2026-07-23T22:00:00.000Z",
      limitation: "Research fixture only; no directional authority."
    },
    {
      id: "market-source-monthly-001",
      title: "Checked-in monthly risk context",
      repositoryRef: "ops/truth/RISK_RULES.md",
      freshness: "fresh",
      asOf: "2026-07-23T21:00:00.000Z",
      limitation: "Risk context is not a market prediction."
    }
  ],
  timeframes: [
    {
      timeframe: "hourly",
      summary: "Hourly evidence shows short-horizon uncertainty.",
      confidence: "low",
      supportingEvidence: ["Recent observations remain inside the local replay range."],
      counterEvidence: ["The short sample cannot establish a durable regime."],
      redFlags: ["Short-horizon evidence can reverse quickly."],
      invalidationConditions: ["The hourly evidence becomes stale."],
      limitations: ["Synthetic replay evidence only."]
    },
    {
      timeframe: "daily",
      summary: "Daily evidence remains mixed and conditional.",
      confidence: "low",
      supportingEvidence: ["The checked-in daily record preserves evidence lineage."],
      counterEvidence: ["No external market data is present."],
      redFlags: ["Daily context is synthetic."],
      invalidationConditions: ["Daily provenance no longer matches the recorded source."],
      limitations: ["No directional conclusion is authorized."]
    },
    {
      timeframe: "monthly",
      summary: "Monthly context emphasizes risk controls over direction.",
      confidence: "low",
      supportingEvidence: ["Risk truth remains explicit and tracked."],
      counterEvidence: ["Risk policy does not establish a market regime."],
      redFlags: ["Long-horizon context is policy evidence, not price evidence."],
      invalidationConditions: ["The governing risk truth changes."],
      limitations: ["Monthly context cannot authorize a position."]
    }
  ],
  scenarios: [
    {
      direction: "bullish",
      title: "Conditional upside scenario",
      conditions: ["Supporting hourly and daily evidence strengthens without new red flags."],
      supportingEvidence: ["Hourly local replay evidence remains current."],
      counterEvidence: ["Monthly context provides no directional confirmation."],
      redFlags: ["Evidence is synthetic and local only."],
      invalidationConditions: ["Hourly evidence becomes stale or contradicts daily context."],
      limitations: ["This is not a trade instruction or final recommendation."],
      confidence: "low"
    },
    {
      direction: "bearish",
      title: "Conditional downside scenario",
      conditions: ["Counter-evidence expands and risk conditions deteriorate."],
      supportingEvidence: ["Short-horizon uncertainty remains material."],
      counterEvidence: ["No tracked source establishes downside continuation."],
      redFlags: ["Directional evidence is incomplete."],
      invalidationConditions: ["Daily evidence resolves the uncertainty."],
      limitations: ["This scenario cannot authorize a position."],
      confidence: "low"
    },
    {
      direction: "neutral",
      title: "Conditional range scenario",
      conditions: ["Timeframes remain mixed without a quality blocker."],
      supportingEvidence: ["Every timeframe includes explicit uncertainty."],
      counterEvidence: ["New source evidence could invalidate the range framing."],
      redFlags: ["Local replay has no external price authority."],
      invalidationConditions: ["A timeframe develops a source-linked regime change."],
      limitations: ["Neutral does not mean safe, approved, or ready."],
      confidence: "low"
    }
  ],
  qualityStatus: "clear",
  semanticSafetyStatus: "safe",
  adversarialStatus: "clear",
  crossTimeframeConflicts: [],
  limitations: [
    "Checked-in synthetic replay evidence only; no external market feed.",
    "Conditional scenarios do not predict direction or authorize a position.",
    "Risk review and an explicit operator decision remain required."
  ],
  riskReviewStatus: "required",
  operatorDecisionStatus: "required",
  blockedScopeReminder: [
    "No external data fetch or background polling.",
    "No account, credential, order, alert, export, or sharing route.",
    "No ranking, timing instruction, final recommendation, or performance claim."
  ]
};
