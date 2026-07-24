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
  ],
  caseSelection: {
    selectedCaseId: "gate2-research-case-fixture-001",
    options: [
      {
        caseId: "gate2-research-case-fixture-001",
        title: "Market intelligence replay case",
        status: "available",
        reason: "available",
        message: "Validated local evidence is available for read-only operator inspection."
      },
      {
        caseId: "gate2-research-case-fixture-004",
        title: "Stale local evidence case",
        status: "blocked",
        reason: "stale_source",
        message: "The linked local evidence is stale. Scenarios are suppressed pending revision."
      },
      {
        caseId: "operator-workflow-case-001",
        title: "Operator workflow evidence case",
        status: "unavailable",
        reason: "no_linked_brief",
        message: "No validated intelligence brief is linked to this local research case."
      }
    ]
  },
  backtestLink: {
    id: "brief-backtest-link-001",
    runId: "gate1-runtime-run-415f026d86c6cde7",
    relationship: "historical_research_evidence",
    inputHash: "415f026d86c6cde75461eb7aa403e032d5e10cb058637dcf2026622787120e8a",
    outputHash: "575f8d8c83be87b90ac075982bd30fd4bd1186710db4f023b48977d4b9746c3f",
    evidencePermission: false
  },
  provenance: [
    {
      sourceId: "market-source-hourly-001",
      payloadHash: "6755c9c99112dd76c2deabf1b06f80d0286447d1d6c2b47c14c13bb01765b94c",
      status: "verified_local",
      notes: ["Checked-in truth record used as deterministic replay provenance."]
    },
    {
      sourceId: "market-source-daily-001",
      payloadHash: "6d3add0a49f5fb662a4fe6c75a44b5f12724734cc665f9f6fdb6443d33d48c01",
      status: "verified_local",
      notes: ["Tracked local evidence implementation record."]
    },
    {
      sourceId: "market-source-monthly-001",
      payloadHash: "afdfa9a608f536f4ecc0a25d7a977fc6b1ff9cec66693a31f7c5d0e5899864d2",
      status: "verified_local",
      notes: ["Tracked risk truth used as local replay context."]
    }
  ],
  conflictPanel: {
    status: "none_recorded",
    conflicts: [],
    operatorMessage: "No cross-timeframe conflicts are recorded in this frozen local brief."
  },
  invalidationEvaluation: {
    id: "brief-invalidation-evaluation-001",
    invocation: "explicit_operator_request",
    disposition: "clear",
    checks: [
      {
        scenarioId: "conditional-scenario-bullish-001",
        condition: "Hourly evidence exceeds its declared freshness window.",
        result: "not_triggered",
        observation: "Linked local source remains fresh in the frozen brief."
      },
      {
        scenarioId: "conditional-scenario-bearish-001",
        condition: "Daily evidence resolves the recorded short-horizon uncertainty.",
        result: "not_triggered",
        observation: "Linked local source remains fresh in the frozen brief."
      },
      {
        scenarioId: "conditional-scenario-neutral-001",
        condition: "A linked timeframe records a material regime change.",
        result: "not_triggered",
        observation: "Linked local source remains fresh in the frozen brief."
      }
    ]
  },
  manualRiskReview: {
    id: "brief-manual-risk-review-001",
    disposition: "recorded_for_review",
    findings: [],
    limitations: [
      "Manual local review record only; no approval, simulation, or execution authority is granted."
    ],
    approvalGranted: false
  },
  operatorDecision: {
    id: "brief-operator-decision-001",
    decision: "keep_research_only",
    reason: "Evidence remains synthetic and conditional; retain the case for research inspection.",
    simulationAuthorized: false
  },
  workflowCheckpoint: {
    id: "brief-workflow-checkpoint-001",
    status: "research_only_recorded",
    nextGap: "manual_local_review_authoring"
  }
};
