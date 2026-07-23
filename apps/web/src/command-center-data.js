export const commandCenterData = {
  project: "TraderFrame",
  title: "TraderFrame Command Center",
  subtitle: "Research operating health, evidence freshness, and control-plane integrity.",
  gate: "G2_PAPER_TRADING",
  scope: "paper_simulation_planning_only",
  latestPacket: "TRD-736",
  localVerification: "89 files / 644 tests",
  ciRun: "27787807220",
  ciState: "success",
  lastVerifiedCommit: "6e6f513",
  navItems: ["Overview", "Evidence", "Workspace", "Limitations", "Risk", "Workflow", "Docs"],
  healthCards: [
    {
      label: "Gate Status",
      value: "G2_PAPER_TRADING",
      detail: "Control plane is bounded to local paper-simulation evidence only.",
      tone: "steady"
    },
    {
      label: "Local Verification",
      value: "Green",
      detail: "Latest suite: 89 files, 644 tests.",
      tone: "good"
    },
    {
      label: "Remote Evidence",
      value: "Fresh",
      detail: "Latest recorded run is linked to local history.",
      tone: "good"
    },
    {
      label: "Review Coverage",
      value: "736 / 736",
      detail: "Assignments, QA, risk, and acceptance align.",
      tone: "good"
    }
  ],
  loopSteps: [
    "Strategy Idea",
    "Data Snapshot",
    "Backtest",
    "Metric Report",
    "Risk Review",
    "Operator Decision",
    "Outcome Logged",
    "Learning Event"
  ],
  boundaryItems: [
    "External account connectors",
    "Real-money routes",
    "Unsupervised action paths",
    "Directional prediction prompts",
    "Readiness or promotion labels",
    "Performance claim language"
  ],
  limitationItems: [
    {
      label: "Local-only data",
      detail: "The shell reads checked-in and local runtime records only."
    },
    {
      label: "Paper-simulation planning",
      detail: "Gate 2 records describe planning and local evidence, not market access."
    },
    {
      label: "Evidence before action",
      detail: "Risk and limitation notes stay visible beside evidence surfaces."
    },
    {
      label: "Operator-owned decisions",
      detail: "The interface records manual review state without performing decisions."
    }
  ],
  riskItems: [
    {
      label: "No external account surface",
      detail: "The frontend must not collect or route account, token, or credential data."
    },
    {
      label: "No execution surface",
      detail: "The frontend must not place, route, schedule, or dispatch market activity."
    },
    {
      label: "No prediction surface",
      detail: "The frontend must not generate directional trading prompts."
    },
    {
      label: "No claim surface",
      detail: "The frontend treats validation as repo health, not trading permission."
    }
  ],
  workflowItems: [
    {
      step: "Idea",
      state: "Record",
      detail: "Capture the research question."
    },
    {
      step: "Evidence",
      state: "Inspect",
      detail: "Review local data and source links."
    },
    {
      step: "Risk",
      state: "Review",
      detail: "Check limitations and blocker state."
    },
    {
      step: "Decision",
      state: "Manual",
      detail: "Operator records the outcome outside any action control."
    },
    {
      step: "Learning",
      state: "Log",
      detail: "Capture the lesson for future review."
    }
  ],
  evidenceRows: [
    {
      area: "Local verification",
      signal: "pnpm verify:gate0",
      state: "Passing",
      reference: "89 files / 644 tests"
    },
    {
      area: "Verified commit",
      signal: "6e6f513",
      state: "Recorded",
      reference: "Run 27787807220"
    },
    {
      area: "Remote CI",
      signal: "Run 27787807220",
      state: "Passing",
      reference: "Recorded passing run"
    },
    {
      area: "CI evidence",
      signal: "Freshness guard",
      state: "Passing",
      reference: "18 evidence records"
    },
    {
      area: "Agent registry",
      signal: "Manifest guard",
      state: "Passing",
      reference: "12 agents aligned"
    },
    {
      area: "Review coverage",
      signal: "Coverage guard",
      state: "Passing",
      reference: "736 accepted records"
    },
    {
      area: "Dependency audit",
      signal: "Vite 8.1.0 / esbuild 0.28.1",
      state: "Passing",
      reference: "pnpm audit --audit-level low"
    },
    {
      area: "Market intelligence truth",
      signal: "Scenario analysis boundary",
      state: "Recorded",
      reference: "ops/truth/MARKET_INTELLIGENCE_TRUTH.md"
    },
    {
      area: "Market intelligence roadmap",
      signal: "TRD-593 through TRD-600",
      state: "Queued",
      reference: "After Strategy Review Workspace MVP"
    },
    {
      area: "Artifact inventory schema",
      signal: "Strategy Review Workspace support",
      state: "Planned",
      reference: "TRD-585 local schema"
    },
    {
      area: "Strategy Review Workspace",
      signal: "One local research case",
      state: "Ready",
      reference: "TRD-592 MVP fixture"
    },
    {
      area: "Market intelligence contracts",
      signal: "Input, event, and candidate models",
      state: "Contracted",
      reference: "TRD-593 through TRD-595"
    },
    {
      area: "Red flag engine",
      signal: "Sourced blocker evidence",
      state: "Contracted",
      reference: "TRD-596 red flag fixture"
    },
    {
      area: "Scenario recommendation",
      signal: "Draft-only scenario action",
      state: "Contracted",
      reference: "TRD-597 scenario recommendation fixture"
    },
    {
      area: "Risk-gated recommendation",
      signal: "Review required before operator view",
      state: "Contracted",
      reference: "TRD-598 recommendation review fixture"
    },
    {
      area: "Market intelligence workspace",
      signal: "Read-only sourced scenario panel",
      state: "Visible",
      reference: "TRD-599 workspace display"
    },
    {
      area: "Recommendation simulation link",
      signal: "Local candidate only",
      state: "Contracted",
      reference: "TRD-600 no external dispatch"
    },
    {
      area: "Workspace visual QA",
      signal: "Risk adjacency and overflow",
      state: "Checked",
      reference: "TRD-637 through TRD-646"
    },
    {
      area: "Integrated evidence workflow",
      signal: "Research case to simulator handoff",
      state: "Visible",
      reference: "TRD-657 through TRD-736"
    }
  ],
  simulationEvidenceDetail: {
    title: "Simulation Evidence Detail",
    summary:
      "Local evidence detail for the Gate 2 paper-simulation planning lane. This is a display record only.",
    status: "Fresh",
    recordId: "gate2-simulation-evidence-detail-fixture-001",
    simulationRecordId: "gate2-sim-record-fixture-001",
    stateRecordId: "gate2-state-fixture-001",
    operatorRecordId: "gate2-operator-action-fixture-001",
    riskRecordId: "gate2-risk-review-fixture-001",
    assumptionRecordId: "gate2-fill-assumption-fixture-001",
    workflowRefs: ["gate2-workflow-evidence-card-fixture-001"],
    riskRefs: ["gate2-risk-review-panel-fixture-001"],
    artifactRefs: ["gate2-local-artifact-summary-fixture-001"],
    failureModeRefs: ["gate2-failure-mode-evidence-fixture-001"],
    sourceLinkRefs: ["docs/operations/GATE2_EVIDENCE_SOURCE_LINK_MAP_IMPLEMENTATION.md"],
    sourceArtifacts: [
      "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_IMPLEMENTATION.md",
      "ops/assignments/TRD-532_SIMULATION_EVIDENCE_SCHEMA_SOURCE_UPDATE.md"
    ],
    runtimeSnapshotRefs: [
      "scripts/build-command-center-runtime-data.ts",
      "packages/fixtures/tests/gate0-command-center-runtime-data.test.ts"
    ],
    fixtureDriftChecks: [
      "record_id_present",
      "source_artifacts_present",
      "boundary_checks_present",
      "local_paths_only"
    ],
    reviewAgingPolicy: [
      "Review records are local operating evidence.",
      "Aging review records are inspected without creating approval or readiness language."
    ],
    operatorScanChecklist: [
      "Confirm the detail panel is display-only.",
      "Confirm limitations remain adjacent to source records.",
      "Confirm no external account, credential, or action surface is present."
    ],
    artifactRetentionNotes: [
      "Simulation artifact summaries remain local.",
      "Retention records do not authorize external report distribution."
    ],
    failureTaxonomy: [
      "missing_local_reference",
      "stale_fixture_reference",
      "ambiguous_failure_label",
      "blocked_scope_copy"
    ],
    displayPolicies: [
      "No print or export control is rendered.",
      "Command Center records are local inspection surfaces, not output-channel surfaces."
    ],
    performanceSmokeChecks: [
      "Source lists use scroll-bounded groups.",
      "Long paths wrap without horizontal page overflow."
    ],
    visualDensityChecks: [
      "Control cards stay compact.",
      "Dense evidence is grouped before it becomes visually noisy."
    ],
    accessibilityRecheck: [
      "Evidence-control cards retain labelled sections.",
      "Reading order follows evidence, limitations, controls, then source links."
    ],
    copyMinimizationRules: [
      "Prefer short inspection labels over explanatory paragraphs.",
      "Keep risk context visible without repeating blocked-scope lists."
    ],
    sourceFreshnessPlan: [
      "Source freshness remains a local planning record.",
      "No automatic remote polling or external freshness worker is introduced."
    ],
    artifactInventoryPlan: [
      "Inventory view may list local simulation artifacts only.",
      "Inventory records must not expose account, credential, or execution data."
    ],
    operatorNoteModelPlan: [
      "Operator notes are manual local review records.",
      "Notes may describe observations but must not perform decisions."
    ],
    limitationProminenceChecks: [
      "Limitations stay adjacent to evidence detail.",
      "Risk and limitation panels remain visible as independent sections."
    ],
    sourceCompactionPlan: [
      "Long source lists should group by operating purpose.",
      "Compaction must preserve local path visibility and avoid hidden external links."
    ],
    sourceOverflowReview: [
      "Workspace-critical sources must stay visible before archive-depth source groups.",
      "Long source groups remain scroll-bounded and grouped by operator purpose.",
      "TRD-592 should reuse source groups only when they clarify the research case."
    ],
    outputChannelBoundary: [
      "No report, export, publish, share, or print channel is added.",
      "The Command Center remains a local inspection surface."
    ],
    controlLaneCheckpoint: [
      "TRD-736 closes the checked-in operator workflow.",
      "TRD-737 must confirm the read-only revision timeline gap before workspace expansion."
    ],
    reproducibilityNotes: ["Synthetic local detail fixture; reproducible by contract tests only."],
    limitationNotes: [
      "Planning-only evidence detail.",
      "No account surface, credential path, live route, automated action, approval claim, or performance claim."
    ],
    boundaryChecks: [
      "operator_required",
      "simulation_only",
      "no_external_account",
      "credentials_required_false",
      "live_route_false",
      "automated_action_false",
      "approval_claim_false",
      "performance_claim_false"
    ]
  },
  nextActions: [
    "TRD-736 closes the checked-in operator workflow.",
    "TRD-737 is a revision timeline gap intake.",
    "Gate 2 remains paper-simulation planning only."
  ],
  artifactInventorySchemaPlan: {
    purpose: "Show which local evidence files support one Strategy Review Workspace research case.",
    workspaceFitRule:
      "Keep only fields needed to show the operator which local evidence files support this research case.",
    requiredFields: [
      "artifact_id",
      "artifact_type",
      "local_path",
      "source_category",
      "linked_research_case_id",
      "linked_evidence_detail_id",
      "linked_risk_review_id_optional",
      "freshness_status",
      "limitation_notes",
      "redaction_status",
      "blocked_scope_flags",
      "created_at",
      "verified_at"
    ],
    sourceCategories: [
      "strategy_idea",
      "data_snapshot",
      "backtest_evidence",
      "metric_report",
      "risk_review",
      "operator_decision_note",
      "outcome_log",
      "learning_event"
    ],
    blockedFieldFamilies: [
      "output_channel",
      "external_storage",
      "cloud_sync",
      "external_account",
      "market_account_data",
      "credential_reference",
      "execution_record",
      "ai_recommendation_record"
    ]
  },
  marketIntelligenceRoadmap: [
    "TRD-592 Strategy Review Workspace MVP",
    "TRD-593 Market Intelligence Input Model",
    "TRD-594 News/Event Scanner Contract",
    "TRD-595 Signal Candidate Contract",
    "TRD-596 Red Flag Engine",
    "TRD-597 Scenario Recommendation Model",
    "TRD-598 Risk-Gated Recommendation Review",
    "TRD-599 Market Intelligence Workspace",
    "TRD-600 Paper Simulation From Recommendation Candidate",
    "TRD-601 Strategy workspace visual QA",
    "TRD-602 Workspace source-link drilldown",
    "TRD-603 Artifact inventory UI integration",
    "TRD-604 Operator note UI integration",
    "TRD-605 Market intelligence blocker checkpoint",
    "TRD-606 Red flag visual QA",
    "TRD-607 Market intelligence workspace gap intake",
    "TRD-608 Scenario review empty-state handling",
    "TRD-609 Recommendation evidence consistency guard",
    "TRD-610 Workspace runtime preservation recheck",
    "TRD-611 Market workspace mobile QA",
    "TRD-612 Market workspace keyboard QA",
    "TRD-613 Scenario copy minimization pass",
    "TRD-614 Blocked-scope regression expansion",
    "TRD-615 Market intelligence source grouping polish",
    "TRD-616 Market workspace checkpoint",
    "TRD-617 Local paper-simulator authorization",
    "TRD-618 Deterministic paper-account contract",
    "TRD-619 Simulated order lifecycle contract",
    "TRD-620 Paper risk-limit enforcement",
    "TRD-621 Local fill, fee, and slippage model",
    "TRD-622 Duplicate and stale candidate guards",
    "TRD-623 Immutable simulation event journal",
    "TRD-624 Simulation-state reconciliation",
    "TRD-625 Local simulator negative boundaries",
    "TRD-626 Local paper-simulator checkpoint",
    "TRD-627 Paper-account state reducer packet",
    "TRD-628 Position accounting reducer",
    "TRD-629 Cash and equity accounting reducer",
    "TRD-630 Order lifecycle reducer",
    "TRD-631 Risk guard integration",
    "TRD-632 Fill model integration",
    "TRD-633 Journal integration",
    "TRD-634 Reconciliation freeze integration",
    "TRD-635 End-to-end local simulation scenario",
    "TRD-636 Local simulator product checkpoint",
    "TRD-637 Simulator workspace authorization",
    "TRD-638 Simulator workspace data adapter",
    "TRD-639 Paper-account summary panel",
    "TRD-640 Position and equity evidence panel",
    "TRD-641 Lifecycle evidence timeline",
    "TRD-642 Risk and candidate guard panel",
    "TRD-643 Fill-cost evidence panel",
    "TRD-644 Journal and reconciliation panel",
    "TRD-645 Workspace boundary and access QA",
    "TRD-646 Simulator workspace checkpoint",
    "TRD-647 Command Center simulator navigation",
    "TRD-648 Simulator snapshot workflow integration",
    "TRD-649 Risk-blocked scenario workspace",
    "TRD-650 Stale and duplicate scenario workspace",
    "TRD-651 Reconciliation mismatch workspace",
    "TRD-652 Journal chain evidence drilldown",
    "TRD-653 Local scenario view selector",
    "TRD-654 Simulator workspace mobile recheck",
    "TRD-655 Simulator accessibility and copy audit",
    "TRD-656 Simulator workspace product checkpoint",
    "TRD-657 Strategy-to-simulator handoff contract",
    "TRD-658 Research-case simulation evidence link",
    "TRD-659 Scenario provenance panel",
    "TRD-660 Risk-block comparison view",
    "TRD-661 Operator review checklist display",
    "TRD-662 Manual operator note linkage",
    "TRD-663 Outcome-log evidence linkage",
    "TRD-664 Learning-event evidence linkage",
    "TRD-665 Integrated operator workflow QA",
    "TRD-736 Operator workflow checkpoint"
  ],
  marketIntelligenceWorkspace: {
    title: "Market Intelligence Workspace",
    status: "Read-only scenario inspection",
    summary: "Local, sourced scenario evidence for review; no action authority.",
    recommendation: {
      id: "gate2-scenario-recommendation-fixture-001",
      action: "paper_simulate",
      status: "risk_review_required",
      confidence: "low",
      candidate: "gate2-signal-candidate-fixture-001",
      redFlag: "gate2-red-flag-engine-fixture-001",
      evidenceRefs: [
        "gate2-market-intelligence-input-fixture-001",
        "gate2-news-event-fixture-001",
        "gate2-signal-candidate-fixture-001",
        "gate2-red-flag-engine-fixture-001"
      ],
      sourceRefs: [
        "ops/truth/MARKET_INTELLIGENCE_TRUTH.md",
        "ops/runtime/reviews/TRD-596_ORCHESTRATOR_ACCEPTANCE.md"
      ],
      limitationNotes: [
        "Draft scenario; not a final recommendation.",
        "Confidence and evidence do not imply future results."
      ]
    },
    riskReview: {
      id: "gate2-recommendation-review-fixture-001",
      status: "risk_review_required",
      disposition: "needs_revision",
      riskReview: "gate2-risk-review-fixture-001",
      blockerRefs: ["gate2-red-flag-engine-fixture-001"],
      notes: [
        "Risk review is required before operator consideration.",
        "Local review checkpoint only."
      ]
    },
    simulationCandidate: {
      id: "gate2-recommendation-simulation-link-fixture-001",
      status: "candidate_linked_for_local_simulation",
      simulationRecord: "gate2-sim-record-fixture-001",
      evidenceDetail: "gate2-simulation-evidence-detail-fixture-001",
      boundaryChecks: [
        "local_simulation_only",
        "no_external_dispatch",
        "no_external_account",
        "credentials_required_false",
        "live_route_false",
        "automated_action_false",
        "operator_required"
      ],
      limitationNotes: [
        "Local simulation link only; no external route.",
        "Operator review is required before simulation evidence is recorded."
      ]
    },
    artifactInventory: [
      {
        id: "gate2-artifact-inventory-fixture-001",
        type: "strategy_idea",
        path: "ops/assignments/TRD-001_INITIALIZE_GATE0_RESEARCH_ONLY_MONOREPO.md",
        freshness: "fresh",
        limitation: "Local source file proves traceability only."
      },
      {
        id: "gate2-artifact-inventory-fixture-002",
        type: "risk_review",
        path: "ops/runtime/reviews/TRD-585_RISK_REVIEW.md",
        freshness: "fresh",
        limitation: "Risk source is local operating evidence, not permission."
      }
    ],
    operatorNote: {
      id: "gate2-operator-note-fixture-001",
      type: "observation",
      body: "Operator observes that local evidence and limitations are visible together.",
      sources: [
        "ops/runtime/reviews/TRD-585_ORCHESTRATOR_ACCEPTANCE.md",
        "ops/assignments/TRD-585_GATE2_ARTIFACT_INVENTORY_SCHEMA_PLAN.md"
      ],
      limitationNotes: ["Manual note fixture; no decision is performed."]
    },
    blockerCheckpoint: [
      "No final recommendation.",
      "No external route or credentials.",
      "No live or automated action.",
      "No certainty or performance claim."
    ],
    sourceGroups: [
      {
        label: "Scenario Inputs",
        purpose: "Evidence used to frame the local scenario.",
        refs: [
          "gate2-market-intelligence-input-fixture-001",
          "gate2-news-event-fixture-001",
          "gate2-signal-candidate-fixture-001"
        ]
      },
      {
        label: "Risk Controls",
        purpose: "Blockers and review records that constrain interpretation.",
        refs: [
          "gate2-red-flag-engine-fixture-001",
          "gate2-risk-review-fixture-001",
          "gate2-recommendation-review-fixture-001"
        ]
      },
      {
        label: "Local Provenance",
        purpose: "Checked-in truth and acceptance records for traceability.",
        refs: [
          "ops/truth/MARKET_INTELLIGENCE_TRUTH.md",
          "ops/runtime/reviews/TRD-596_ORCHESTRATOR_ACCEPTANCE.md"
        ]
      }
    ]
  },
  strategyReviewWorkspace: {
    title: "Strategy Review Workspace",
    status: "Read-only MVP",
    researchCaseId: "gate2-research-case-fixture-001",
    coreQuestion: "Can the operator inspect the full evidence chain for one research case?",
    evidenceChain: [
      {
        label: "Strategy Idea",
        ref: "gate0-strategy-idea-fixture-001",
        limitation: "Idea context only; no recommendation."
      },
      {
        label: "Data Snapshot",
        ref: "gate1-historical-data-snapshot-fixture-001",
        limitation: "Local fixture evidence only."
      },
      {
        label: "Backtest Evidence",
        ref: "gate1-backtest-run-assembly-fixture-001",
        limitation: "Historical evidence is not permission."
      },
      {
        label: "Metric Report",
        ref: "gate1-metric-report-evidence-fixture-001",
        limitation: "Metrics do not imply future performance."
      },
      {
        label: "Risk Review",
        ref: "gate2-risk-review-fixture-001",
        limitation: "Risk review remains required beside evidence."
      },
      {
        label: "Operator Note",
        ref: "gate2-operator-note-fixture-001",
        limitation: "Manual local note; no decision performed."
      },
      {
        label: "Outcome Log",
        ref: "gate0-outcome-log-fixture-001",
        limitation: "Outcome is local learning evidence."
      },
      {
        label: "Learning Event",
        ref: "gate0-learning-event-fixture-001",
        limitation: "Learning record does not promote strategy state."
      }
    ],
    artifactInventory: [
      "gate2-artifact-inventory-fixture-001",
      "gate2-artifact-inventory-fixture-002"
    ],
    marketIntelligence: [
      "gate2-market-intelligence-input-fixture-001",
      "gate2-news-event-fixture-001",
      "gate2-signal-candidate-fixture-001",
      "gate2-red-flag-engine-fixture-001",
      "gate2-scenario-recommendation-fixture-001",
      "gate2-recommendation-review-fixture-001",
      "gate2-recommendation-simulation-link-fixture-001"
    ],
    redFlagEngine: {
      id: "gate2-red-flag-engine-fixture-001",
      category: "scenario_uncertainty",
      severity: "medium",
      blockerStatus: "risk_review_required",
      limitation: "Blocker evidence only; no route or final recommendation."
    },
    blockedScopeReminder: [
      "No external account route.",
      "No automated action.",
      "No live route.",
      "No final recommendation.",
      "No performance claim."
    ]
  },
  sourceOverflowReview: [
    {
      label: "Workspace Sources First",
      detail: "TRD-592 should expose only the sources needed to inspect one local research case."
    },
    {
      label: "Archive Depth Bounded",
      detail: "Historical operating links remain grouped and scroll-bounded rather than promoted."
    },
    {
      label: "Local Paths Visible",
      detail: "Compaction must keep checked-in paths visible and avoid external output channels."
    }
  ],
  docGroups: [
    {
      label: "Tracker",
      items: ["ops/runtime/tracklist.md", "ops/runtime/progress/GATE0_PROGRESS_SNAPSHOT.md"]
    },
    {
      label: "Command Center",
      items: [
        "docs/operations/GATE0_COMMAND_CENTER_VISUAL_QA_PASS.md",
        "docs/operations/GATE0_COMMAND_CENTER_MOBILE_EVIDENCE_TABLE_UX.md",
        "docs/operations/GATE0_COMMAND_CENTER_SOURCE_LINK_GROUPING.md",
        "docs/operations/GATE0_COMMAND_CENTER_OPERATOR_HANDOFF_NOTE.md",
        "docs/operations/GATE0_COMMAND_CENTER_HASH_NAVIGATION_STATE.md",
        "docs/operations/GATE0_COMMAND_CENTER_LAST_VERIFIED_COMMIT.md",
        "docs/operations/GATE0_COMMAND_CENTER_VISUAL_RECHECK_AFTER_TRD231.md",
        "docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SNAPSHOT.md",
        "docs/operations/GATE0_COMMAND_CENTER_LOCAL_AUTO_REFRESH.md",
        "docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SECURITY_BOUNDARY.md",
        "docs/operations/GATE0_CI_EVIDENCE_REFRESH_HELPER.md",
        "docs/operations/GATE0_CI_EVIDENCE_REFRESH_LOOP_PAUSE.md",
        "docs/operations/GATE0_TRADERFRAME_BRAND_ALIGNMENT.md",
        "docs/operations/GATE1_DEPENDENCY_UPGRADE_EXECUTION.md",
        "docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT.md",
        "docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT_TESTS.md",
        "docs/operations/GATE1_DIRECTIONAL_PNL_FIXTURES.md",
        "docs/operations/GATE1_BACKTEST_EVIDENCE_INTEGRITY_REVIEW.md",
        "docs/operations/GATE1_BACKTEST_ASSUMPTION_RISK_REGISTER.md",
        "docs/operations/GATE1_BACKTEST_ASSUMPTION_RISK_REGISTER_NEGATIVE_CASES.md",
        "docs/operations/GATE1_RISK_REGISTER_GUARD_INDEXING_HARDENING.md",
        "docs/operations/GATE1_BAD_ASSUMPTION_FIXTURE_CASES.md",
        "docs/operations/GATE1_BACKTEST_RUN_ASSEMBLY_CONTRACT.md",
        "docs/operations/GATE1_METRIC_REPORT_EVIDENCE_ONLY_CONTRACT.md",
        "docs/operations/GATE1_REPRODUCIBILITY_COMPARISON_HARDENING.md",
        "docs/operations/GATE1_OPERATOR_DECISION_EVENT_CONTRACT.md",
        "docs/operations/GATE1_COMPLETION_CRITERIA_DRAFT.md",
        "docs/operations/GATE2_BLOCKER_AUDIT.md",
        "docs/operations/GATE1_SOURCE_LINK_AND_GUARD_COVERAGE_RECHECK.md",
        "docs/operations/GATE1_BACKTEST_RUN_ASSEMBLY_NEGATIVE_CASES.md",
        "docs/operations/GATE1_METRIC_REPORT_EVIDENCE_NEGATIVE_CASES.md",
        "docs/operations/GATE1_OPERATOR_DECISION_EVENT_NEGATIVE_CASES.md",
        "docs/operations/GATE1_COMPLETION_CRITERIA_SOURCE_LINK_HARDENING.md",
        "docs/operations/GATE2_BLOCKER_GUARD_COVERAGE.md",
        "docs/operations/GATE1_MISSING_CANDLE_BAD_DATA_FIXTURE_PLAN.md",
        "docs/operations/GATE1_STALE_DATA_BLOCKER_CONTRACT_PLAN.md",
        "docs/operations/GATE1_DUPLICATE_SIGNAL_BLOCKER_PLANNING_RECORD.md",
        "docs/operations/GATE1_STRATEGY_PARAMETER_IMMUTABILITY_GUARD_PLAN.md",
        "docs/operations/GATE1_EVIDENCE_BUNDLE_ASSEMBLY_REVIEW.md",
        "docs/operations/GATE1_BACKTEST_ASSEMBLY_GUARD_INDEX_RECHECK.md",
        "docs/operations/GATE1_METRIC_REPORT_GUARD_INDEX_RECHECK.md",
        "docs/operations/GATE1_OPERATOR_DECISION_GUARD_INDEX_RECHECK.md",
        "docs/operations/GATE1_MISSING_CANDLE_FIXTURE_CONTRACT.md",
        "docs/operations/GATE1_STALE_DATA_BLOCKER_CONTRACT.md",
        "docs/operations/GATE1_DUPLICATE_SIGNAL_BLOCKER_CONTRACT.md",
        "docs/operations/GATE1_PARAMETER_IMMUTABILITY_GUARD_CONTRACT.md",
        "docs/operations/GATE1_EVIDENCE_BUNDLE_SUMMARY_CONTRACT.md",
        "docs/operations/GATE1_COMPLETION_BLOCKER_RECHECK.md",
        "docs/operations/GATE1_CONTROL_PLANE_CHECKPOINT.md",
        "docs/operations/GATE1_SKILL_DEFAULT_GATE_ALIGNMENT.md",
        "docs/operations/GATE1_COMMAND_NAMING_MIGRATION_PLAN.md",
        "docs/operations/GATE1_BLOCKED_EVIDENCE_DOCS_COVERAGE_RECHECK.md",
        "docs/operations/GATE1_EVIDENCE_BLOCKER_AGGREGATE_GUARD.md",
        "docs/operations/GATE1_FIXTURE_MUTATION_NEGATIVE_CASES.md",
        "docs/operations/GATE1_SNAPSHOT_COLUMN_COMPLETENESS_GUARD.md",
        "docs/operations/GATE1_STALE_DATA_THRESHOLD_POLICY.md",
        "docs/operations/GATE1_PARAMETER_HASH_PROVENANCE_RECORD.md",
        "docs/operations/GATE1_DUPLICATE_SIGNAL_FINGERPRINT_CONTRACT.md",
        "docs/operations/GATE1_REAL_HISTORICAL_DATA_ADAPTER_BLOCKERS.md",
        "docs/operations/GATE1_SKILL_EVAL_PHASE_ALIGNMENT_RECHECK.md",
        "docs/operations/GATE1_COMMAND_ALIAS_COMPATIBILITY_PLAN.md",
        "docs/operations/GATE1_SKILL_GUARD_NAMING_RECHECK.md",
        "docs/operations/GATE1_BLOCKER_AGGREGATE_NEGATIVE_FIXTURE_SET.md",
        "docs/operations/GATE1_OHLC_MID_PRICE_LIMITATION_RECORD.md",
        "docs/operations/GATE1_HISTORICAL_DATA_ADAPTER_BOUNDARY.md",
        "docs/operations/GATE1_DATA_PROVIDER_PROVENANCE_FIELDS.md",
        "docs/operations/GATE1_STALE_DATA_POLICY_SOURCE_LINK_RECHECK.md",
        "docs/operations/GATE1_PARAMETER_HASH_CANONICALIZATION_PLAN.md",
        "docs/operations/GATE1_DUPLICATE_SIGNAL_FINGERPRINT_NEGATIVE_CASES.md",
        "docs/operations/GATE1_BLOCKER_EXPANSION_CHECKPOINT.md",
        "docs/operations/GATE1_ADAPTER_AUTHORIZATION_BLOCKER_INVENTORY.md",
        "docs/operations/GATE1_ADAPTER_FIXTURE_IMPORT_CONTRACT_PLAN.md",
        "docs/operations/GATE1_DUPLICATE_SIGNAL_SOURCE_LINK_RECHECK.md",
        "docs/operations/GATE1_PARAMETER_HASH_NEGATIVE_CASES_PLAN.md",
        "docs/operations/GATE1_PROVIDER_LICENSE_REVIEW_CHECKLIST.md",
        "docs/operations/GATE1_COMMAND_ALIAS_DOCS_COVERAGE_RECHECK.md",
        "docs/operations/GATE1_SKILL_METADATA_GUARD_INDEX_RECORD.md",
        "docs/operations/GATE1_IMPORTED_SNAPSHOT_QUARANTINE_POLICY.md",
        "docs/operations/GATE1_BLOCKER_CHECKPOINT_COVERAGE_RECHECK.md",
        "docs/operations/GATE1_ADAPTER_READINESS_BLOCKER_CHECKPOINT.md",
        "docs/operations/GATE1_ADAPTER_BLOCKER_SOURCE_LINK_RECHECK.md",
        "docs/operations/GATE1_IMPORTED_SNAPSHOT_SCHEMA_AUTHORITY.md",
        "docs/operations/GATE1_PROVIDER_CREDENTIAL_EXCLUSION_POLICY.md",
        "docs/operations/GATE1_QUARANTINE_POLICY_COVERAGE_RECHECK.md",
        "docs/operations/GATE1_ADAPTER_FIXTURE_NEGATIVE_CASES_PLAN.md",
        "docs/operations/GATE1_DATA_RETENTION_LIMITATION_RECORD.md",
        "docs/operations/GATE1_PROVIDER_LICENSE_CHECKLIST_COVERAGE_RECHECK.md",
        "docs/operations/GATE1_ADAPTER_AUDIT_LOG_BOUNDARY.md",
        "docs/operations/GATE1_ADAPTER_BLOCKER_CHECKPOINT_RECHECK.md",
        "docs/operations/GATE1_ADAPTER_PLANNING_FREEZE_CHECKPOINT.md",
        "docs/operations/GATE1_POST_ADAPTER_FREEZE_LANE_SELECTION.md",
        "docs/operations/GATE1_GUARD_COMMAND_DOC_ALIGNMENT_RECHECK.md",
        "docs/operations/GATE1_CONTRACT_GUARD_SCHEMA_VALIDATION_HARDENING_RECHECK.md",
        "docs/operations/GATE1_READINESS_BLOCKER_LANGUAGE_RECHECK.md",
        "docs/operations/GATE1_COMMAND_CENTER_WORDING_AUDIT.md",
        "docs/operations/GATE1_REVIEW_ARTIFACT_AGING_POLICY_DRAFT.md",
        "docs/operations/GATE1_SOURCE_LINK_MAP_CONSISTENCY_RECHECK.md",
        "docs/operations/GATE1_BLOCKED_SCOPE_SCANNER_REVIEW.md",
        "docs/operations/GATE1_OPERATOR_HANDOFF_FRESHNESS_REVIEW.md",
        "docs/operations/GATE1_MAINTENANCE_CHECKPOINT.md",
        "docs/operations/GATE1_MAINTENANCE_GAP_INTAKE.md",
        "docs/operations/GATE1_TRACKLIST_QUEUE_DISCIPLINE_RECHECK.md",
        "docs/operations/GATE1_COMMAND_CENTER_NEXT_ACTION_PAUSE_WORDING.md",
        "docs/operations/GATE1_REVIEW_AGING_POLICY_SOURCE_LINK_RECHECK.md",
        "docs/operations/GATE1_SCANNER_BLOCKED_TERM_SAMPLE_AUDIT.md",
        "docs/operations/GATE1_DOCS_STALE_REFERENCE_SWEEP.md",
        "docs/operations/GATE1_MAINTENANCE_STOP_CONDITION_CHECKPOINT.md",
        "docs/operations/GATE1_EVIDENCE_FRESHNESS_CHURN_GUARD_REVIEW.md",
        "docs/operations/GATE1_BRAND_HANDOFF_ISOLATION_REVIEW.md",
        "docs/operations/GATE1_MAINTENANCE_CLOSEOUT_CHECKPOINT.md",
        "docs/operations/GATE1_CLOSEOUT_EVIDENCE_REVIEW.md",
        "docs/operations/GATE1_ACCEPTANCE_CRITERIA_AUDIT.md",
        "docs/operations/GATE2_READINESS_ASSESSMENT_PACKET.md",
        "docs/operations/GATE2_BLOCKER_INVENTORY.md",
        "docs/operations/GATE2_AUTONOMY_GATE_DELTA_REVIEW.md",
        "docs/operations/GATE2_FINANCIAL_RISK_GATE_DELTA_REVIEW.md",
        "docs/operations/GATE2_CREDENTIAL_BOUNDARY_ASSESSMENT.md",
        "docs/operations/GATE2_EXECUTION_SCOPE_PROHIBITION_REVIEW.md",
        "docs/operations/GATE2_ASSESSMENT_QA_SECURITY_REVIEW.md",
        "docs/operations/GATE1_CLOSEOUT_RECOMMENDATION.md",
        "docs/operations/GATE1_CLOSEOUT_SIGNOFF_PACKET.md",
        "docs/operations/GATE2_AUTHORIZATION_CRITERIA_DRAFT.md",
        "docs/operations/GATE2_RISK_OWNER_AUTHORIZATION_CHECKLIST.md",
        "docs/operations/GATE2_AUTONOMY_OWNER_AUTHORIZATION_CHECKLIST.md",
        "docs/operations/GATE2_QA_SECURITY_AUTHORIZATION_CHECKLIST.md",
        "docs/operations/GATE2_IMPLEMENTATION_PROHIBITION_NOTE.md",
        "docs/operations/GATE2_OPERATOR_DECISION_AUTHORITY_REVIEW.md",
        "docs/operations/GATE1_FINAL_VERIFICATION_RECORD.md",
        "docs/operations/GATE_MOVEMENT_DECISION_PACKET_DRAFT.md",
        "docs/operations/GATE1_SIGNOFF_RECOMMENDATION.md",
        "docs/operations/GATE2_OPERATOR_GATE_DECISION_INTAKE.md",
        "docs/operations/GATE1_PAUSE_EXIT_PACKET.md",
        "docs/operations/GATE1_MATERIAL_GAP_INTAKE_RESULT.md",
        "docs/operations/GATE2_BRAND_HANDOFF_WORKSTREAM_DECISION.md",
        "docs/operations/GATE2_MOVEMENT_REQUEST_INTAKE.md",
        "docs/operations/GATE2_MOVEMENT_APPROVAL_ROUTING.md",
        "docs/operations/GATE2_MOVEMENT_DRY_RUN_CHECKLIST.md",
        "docs/operations/GATE2_PLANNING_HOLD_NOTE.md",
        "docs/operations/GATE2_COMMAND_CENTER_PLANNING_SYNC.md",
        "docs/operations/GATE2_OPERATOR_NEXT_DECISION_CHECKPOINT.md",
        "docs/operations/GATE2_SIMULATED_ORDER_RECORD_PLAN.md",
        "docs/operations/GATE2_SIMULATION_STATE_BOUNDARY_PLAN.md",
        "docs/operations/GATE2_NO_EXTERNAL_ACCOUNT_GUARD_PLAN.md",
        "docs/operations/GATE2_CREDENTIAL_EXCLUSION_GUARD_PLAN.md",
        "docs/operations/GATE2_SIMULATED_FILL_ASSUMPTION_PLAN.md",
        "docs/operations/GATE2_RISK_REVIEW_EVENT_PLAN.md",
        "docs/operations/GATE2_OPERATOR_ACTION_LOG_PLAN.md",
        "docs/operations/GATE2_NEGATIVE_FIXTURE_PLAN.md",
        "docs/operations/GATE2_COMMAND_CENTER_PLANNING_EXTENSION.md",
        "docs/operations/GATE2_IMPLEMENTATION_READINESS_REVIEW.md",
        "docs/operations/GATE2_CONTRACT_IMPLEMENTATION_PACKET.md",
        "docs/operations/GATE2_SIMULATED_ORDER_RECORD_CONTRACT.md",
        "docs/operations/GATE2_SIMULATION_STATE_CONTRACT.md",
        "docs/operations/GATE2_RISK_REVIEW_EVENT_CONTRACT.md",
        "docs/operations/GATE2_OPERATOR_ACTION_LOG_CONTRACT.md",
        "docs/operations/GATE2_SIMULATED_FILL_ASSUMPTION_CONTRACT.md",
        "docs/operations/GATE2_SYNTHETIC_FIXTURE_SET.md",
        "docs/operations/GATE2_NEGATIVE_CONTRACT_TESTS.md",
        "docs/operations/GATE2_CONTRACT_GUARD_INDEXING_UPDATE.md",
        "docs/operations/GATE2_CONTRACT_CHECKPOINT.md",
        "docs/operations/GATE2_MECHANICS_PLANNING_PACKET.md",
        "docs/operations/GATE2_LOCAL_SIMULATION_ENGINE_BOUNDARY_PLAN.md",
        "docs/operations/GATE2_SIMULATION_INPUT_ASSEMBLY_PLAN.md",
        "docs/operations/GATE2_SIMULATION_OUTPUT_ARTIFACT_PLAN.md",
        "docs/operations/GATE2_SIMULATION_REPLAY_DETERMINISM_PLAN.md",
        "docs/operations/GATE2_SIMULATION_FAILURE_MODE_PLAN.md",
        "docs/operations/GATE2_COMMAND_CENTER_MECHANICS_PLANNING_COPY.md",
        "docs/operations/GATE2_MECHANICS_IMPLEMENTATION_BLOCKER_REVIEW.md",
        "docs/operations/GATE2_CONTRACT_SOURCE_LINK_RECHECK.md",
        "docs/operations/GATE2_MECHANICS_PLANNING_CHECKPOINT.md",
        "docs/operations/GATE2_MECHANICS_IMPLEMENTATION_PACKET.md",
        "docs/operations/GATE2_LOCAL_SIMULATION_ENGINE_PURE_FUNCTION.md",
        "docs/operations/GATE2_SIMULATION_INPUT_ASSEMBLER.md",
        "docs/operations/GATE2_SIMULATION_OUTPUT_ARTIFACT_BUILDER.md",
        "docs/operations/GATE2_REPLAY_DETERMINISM_GUARD.md",
        "docs/operations/GATE2_FAILURE_MODE_FIXTURES_AND_TESTS.md",
        "docs/operations/GATE2_COMMAND_CENTER_MECHANICS_EVIDENCE_VIEW.md",
        "docs/operations/GATE2_MECHANICS_SCANNER_BOUNDARY_UPDATE.md",
        "docs/operations/GATE2_MECHANICS_SOURCE_LINK_GUARD_RECHECK.md",
        "docs/operations/GATE2_MECHANICS_IMPLEMENTATION_CHECKPOINT.md",
        "docs/operations/GATE2_POST_MECHANICS_BLOCKER_REVIEW.md",
        "docs/operations/GATE2_MECHANICS_OPERATOR_HANDOFF_NOTE.md",
        "docs/operations/GATE2_MECHANICS_CLOSURE_AUDIT.md",
        "docs/operations/GATE2_NEXT_GAP_INTAKE.md",
        "docs/operations/GATE2_COMMAND_CENTER_POST_MECHANICS_WORDING_AUDIT.md",
        "docs/operations/GATE2_MECHANICS_DOCS_STALE_REFERENCE_SWEEP.md",
        "docs/operations/GATE2_MECHANICS_GUARD_AGING_REVIEW.md",
        "docs/operations/GATE2_PAPER_SIMULATION_LIMITATION_REGISTER.md",
        "docs/operations/GATE2_OPERATOR_WORKFLOW_DRY_RUN_PLAN.md",
        "docs/operations/GATE2_NO_EXPANSION_RECHECK.md",
        "docs/operations/GATE2_BRAND_HANDOFF_ISOLATION_RECHECK.md",
        "docs/operations/GATE2_MAINTENANCE_CHECKPOINT.md",
        "docs/operations/GATE2_PAUSE_OR_PROCEED_RECOMMENDATION.md",
        "docs/operations/GATE2_READ_ONLY_FRONTEND_APP_SHELL_SCOPE_ASSESSMENT.md",
        "docs/operations/GATE2_FRONTEND_EVIDENCE_PANEL_REQUIREMENTS_DRAFT.md",
        "docs/operations/GATE2_FRONTEND_INFORMATION_ARCHITECTURE_PLAN.md",
        "docs/operations/GATE2_FRONTEND_ROUTE_BOUNDARY_MAP.md",
        "docs/operations/GATE2_EVIDENCE_PANEL_DATA_CONTRACT_PLAN.md",
        "docs/operations/GATE2_LIMITATION_PANEL_COPY_CONTRACT.md",
        "docs/operations/GATE2_RISK_PANEL_COPY_CONTRACT.md",
        "docs/operations/GATE2_OPERATOR_WORKFLOW_PANEL_CONTRACT.md",
        "docs/operations/GATE2_FRONTEND_NO_ACTION_CONTROL_GUARD_PLAN.md",
        "docs/operations/GATE2_FRONTEND_ACCESSIBILITY_BASELINE_PLAN.md",
        "docs/operations/GATE2_FRONTEND_VISUAL_HIERARCHY_DIRECTION.md",
        "docs/operations/GATE2_FRONTEND_IMPLEMENTATION_READINESS_BLOCKER_AUDIT.md",
        "docs/operations/GATE2_FRONTEND_SKILL_LENS_INTAKE.md",
        "docs/operations/GATE2_READ_ONLY_FRONTEND_IMPLEMENTATION_PACKET_DRAFT.md",
        "docs/operations/GATE2_FRONTEND_NO_ACTION_CONTROL_TEST_PLAN.md",
        "docs/operations/GATE2_FRONTEND_LOCAL_DATA_ADAPTER_PLAN.md",
        "docs/operations/GATE2_FRONTEND_PANEL_COMPONENT_INVENTORY.md",
        "docs/operations/GATE2_FRONTEND_NAVIGATION_SHELL_IMPLEMENTATION_PACKET.md",
        "docs/operations/GATE2_FRONTEND_EVIDENCE_PANEL_IMPLEMENTATION_PACKET.md",
        "docs/operations/GATE2_FRONTEND_RISK_LIMITATION_PANEL_PACKET.md",
        "docs/operations/GATE2_FRONTEND_WORKFLOW_PANEL_IMPLEMENTATION_PACKET.md",
        "docs/operations/GATE2_FRONTEND_ACCESSIBILITY_VERIFICATION_PACKET.md",
        "docs/operations/GATE2_FRONTEND_IMPLEMENTATION_GO_NO_GO_CHECKPOINT.md",
        "docs/operations/GATE2_FRONTEND_SHELL_BUILD_PACKET.md",
        "docs/operations/GATE2_FRONTEND_NO_ACTION_CONTROL_GUARD_IMPLEMENTATION.md",
        "docs/operations/GATE2_READ_ONLY_FRONTEND_SHELL_IMPLEMENTATION.md",
        "docs/operations/GATE2_FRONTEND_RENDERED_SHELL_VISUAL_QA.md",
        "docs/operations/GATE2_FRONTEND_EVIDENCE_PANEL_IMPLEMENTATION.md",
        "docs/operations/GATE2_FRONTEND_RISK_LIMITATION_PANEL_IMPLEMENTATION.md",
        "docs/operations/GATE2_FRONTEND_WORKFLOW_PANEL_IMPLEMENTATION.md",
        "docs/operations/GATE2_FRONTEND_DOCS_SOURCE_LINK_PANEL_IMPLEMENTATION.md",
        "docs/operations/GATE2_FRONTEND_RESPONSIVE_POLISH_PASS.md",
        "docs/operations/GATE2_FRONTEND_ACCESSIBILITY_VERIFICATION_RUN.md",
        "docs/operations/GATE2_FRONTEND_GUARD_EVIDENCE_RECHECK.md",
        "docs/operations/GATE2_FRONTEND_IMPLEMENTATION_CHECKPOINT.md",
        "docs/operations/GATE2_FRONTEND_OPERATOR_REVIEW_PASS.md",
        "docs/operations/GATE2_FRONTEND_EVIDENCE_DETAIL_EXPANSION_PLAN.md",
        "docs/operations/GATE2_FRONTEND_LIMITATION_COPY_AUDIT.md",
        "docs/operations/GATE2_FRONTEND_SOURCE_LINK_GROUPING_POLISH.md",
        "docs/operations/GATE2_FRONTEND_RUNTIME_REFRESH_UX_REVIEW.md",
        "docs/operations/GATE2_FRONTEND_MOBILE_VISUAL_QA_RECHECK.md",
        "docs/operations/GATE2_FRONTEND_KEYBOARD_NAVIGATION_QA_RECHECK.md",
        "docs/operations/GATE2_FRONTEND_BLOCKED_COPY_REGRESSION_PACK.md",
        "docs/operations/GATE2_FRONTEND_HANDOFF_NOTE.md",
        "docs/operations/GATE2_FRONTEND_LANE_CLOSEOUT_CHECKPOINT.md",
        "docs/operations/GATE2_PAPER_SIMULATION_UI_GAP_INTAKE.md",
        "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_CONTRACT_PLAN.md",
        "docs/operations/GATE2_OPERATOR_WORKFLOW_EVIDENCE_CARD_PLAN.md",
        "docs/operations/GATE2_RISK_REVIEW_PANEL_DATA_CONTRACT_PLAN.md",
        "docs/operations/GATE2_LOCAL_SIMULATION_ARTIFACT_SUMMARY_PLAN.md",
        "docs/operations/GATE2_FAILURE_MODE_EVIDENCE_PANEL_PLAN.md",
        "docs/operations/GATE2_SOURCE_LINK_DENSITY_FOLLOW_UP_REVIEW.md",
        "docs/operations/GATE2_FRONTEND_NO_ACCOUNT_CONNECTOR_RECHECK.md",
        "docs/operations/GATE2_FRONTEND_TO_SIMULATION_HANDOFF_PACKET.md",
        "docs/operations/GATE2_NEXT_IMPLEMENTATION_CHECKPOINT.md",
        "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_DRAFT.md",
        "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_NEGATIVE_CASES.md",
        "docs/operations/GATE2_OPERATOR_WORKFLOW_EVIDENCE_FIXTURE_PLAN.md",
        "docs/operations/GATE2_RISK_REVIEW_PANEL_FIXTURE_PLAN.md",
        "docs/operations/GATE2_LOCAL_ARTIFACT_SUMMARY_FIXTURE_PLAN.md",
        "docs/operations/GATE2_FAILURE_MODE_EVIDENCE_FIXTURE_PLAN.md",
        "docs/operations/GATE2_SIMULATION_EVIDENCE_SOURCE_LINK_MAP_PLAN.md",
        "docs/operations/GATE2_FRONTEND_EVIDENCE_DETAIL_DISPLAY_PACKET.md",
        "docs/operations/GATE2_EVIDENCE_CONTRACT_GUARD_UPDATE_PLAN.md",
        "docs/operations/GATE2_SIMULATION_EVIDENCE_CHECKPOINT.md",
        "docs/operations/GATE2_SIMULATION_EVIDENCE_SCHEMA_IMPLEMENTATION_PACKET.md",
        "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_IMPLEMENTATION.md",
        "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_TESTS.md",
        "docs/operations/GATE2_OPERATOR_WORKFLOW_EVIDENCE_FIXTURE_IMPLEMENTATION.md",
        "docs/operations/GATE2_RISK_REVIEW_FIXTURE_IMPLEMENTATION.md",
        "docs/operations/GATE2_LOCAL_ARTIFACT_SUMMARY_FIXTURE_IMPLEMENTATION.md",
        "docs/operations/GATE2_FAILURE_MODE_FIXTURE_IMPLEMENTATION.md",
        "docs/operations/GATE2_EVIDENCE_SOURCE_LINK_MAP_IMPLEMENTATION.md",
        "docs/operations/GATE2_EVIDENCE_CONTRACT_GUARD_IMPLEMENTATION.md",
        "docs/operations/GATE2_EVIDENCE_IMPLEMENTATION_CHECKPOINT.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_DISPLAY_IMPLEMENTATION_PACKET.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_LOCAL_DATA_ADAPTER_UPDATE.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_PANEL_COMPONENT.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_RISK_ADJACENCY_PASS.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_NO_ACTION_CONTROL_TESTS.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_SOURCE_LINK_RENDERING.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_MOBILE_VISUAL_QA.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_KEYBOARD_ACCESSIBILITY_QA.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_COMMAND_CENTER_SYNC.md",
        "docs/operations/GATE2_EVIDENCE_DETAIL_DISPLAY_CHECKPOINT.md"
      ]
    },
    {
      label: "Evidence",
      items: [
        "docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_POST_GUARD_REFRESH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_INTAKE.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_INTAKE.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_ROUTING.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_ROUTING.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_LIBRARY_CLOSEOUT.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_LIBRARY_CLOSEOUT.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH_AFTER_TRD230_PUSH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD240_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD241.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD242_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD243.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD246_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD247.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD248_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD249.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD250_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD251.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD252_PUSH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD257_PUSH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD258_PUSH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD259_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD253.md",
        "docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX_LATEST_PUSH_CONFIRMATION.md",
        "docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_COUNT_EXPECTATIONS.md",
        "docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md",
        "docs/operations/GATE0_CI_FAILURE_TRIAGE_GUARDRAIL.md",
        "docs/operations/GATE0_GITHUB_ACTIONS_NODE24_ACTION_UPGRADE.md"
      ]
    },
    {
      label: "Guards",
      items: [
        "scripts/check-gate0-command-center-freshness.ts",
        "scripts/check-gate0-command-center-render-contract.ts",
        "scripts/check-gate0-skill-governance.ts",
        "scripts/check-gate0-skill-routing.ts",
        "scripts/check-gate0-github-actions-runtime.ts",
        "scripts/check-gate0-source-link-duplicates.ts",
        "scripts/check-gate0-tracklist-section-length.ts",
        "scripts/build-command-center-runtime-data.ts",
        "scripts/refresh-gate0-ci-evidence.ts",
        "packages/fixtures/tests/gate0-skill-routing.test.ts",
        "packages/fixtures/tests/gate0-github-actions-runtime.test.ts",
        "packages/fixtures/tests/gate0-source-link-duplicates.test.ts",
        "packages/fixtures/tests/gate0-tracklist-section-length.test.ts",
        "packages/fixtures/tests/gate0-command-center-runtime-data.test.ts",
        "packages/fixtures/tests/gate0-command-center-render-contract.test.ts",
        "packages/fixtures/tests/gate0-ci-evidence-refresh.test.ts"
      ]
    },
    {
      label: "Skills",
      items: [
        "skills/gatezero-docs-control-plane-reviewer/SKILL.md",
        "skills/gatezero-orchestrator-reviewer/SKILL.md",
        "skills/gatezero-product-strategy-reviewer/SKILL.md",
        "skills/gatezero-qa-security-reviewer/SKILL.md",
        "skills/gatezero-quant-backtest-reviewer/SKILL.md",
        "skills/gatezero-risk-governance-reviewer/SKILL.md",
        "skills/gatezero-ui-command-center-reviewer/SKILL.md",
        "skills/trader-product-reviewer/SKILL.md",
        "skills/traderframe-copy-reviewer/SKILL.md",
        "skills/traderframe-frontend-engineer/SKILL.md",
        "skills/traderframe-marketing-strategy-reviewer/SKILL.md",
        "skills/traderframe-visual-product-designer/SKILL.md",
        "skills/trading-forex-domain-expert/SKILL.md",
        "docs/operations/GATE0_SKILL_ROUTING_MATRIX.md",
        "docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md",
        "docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md",
        "docs/operations/GATE0_SKILL_LIBRARY_CLOSEOUT_REVIEW.md",
        "docs/operations/GATE0_SKILL_USAGE_HANDOFF_NOTE.md",
        "docs/operations/GATE0_NEXT_SCOPE_RECOMMENDATION_AFTER_SKILL_LIBRARY.md",
        "docs/operations/GATE0_DOCS_CONTROL_PLANE_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_ORCHESTRATOR_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_PRODUCT_STRATEGY_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_QA_SECURITY_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_QUANT_BACKTEST_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_RISK_GOVERNANCE_REVIEWER_SKILL_INTAKE.md"
      ]
    },
    {
      label: "Preview",
      items: ["scripts/preview-web.ts", "apps/web/README.md"]
    }
  ]
};
