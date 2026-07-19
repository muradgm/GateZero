import {
  Gate2NegativeBoundaryFixtureContractSchema,
  Gate2LocalArtifactInventoryContractSchema,
  Gate2MarketIntelligenceInputContractSchema,
  Gate2NewsEventScannerContractSchema,
  Gate2OperatorActionLogContractSchema,
  Gate2OperatorNoteModelContractSchema,
  Gate2RedFlagEngineContractSchema,
  Gate2RiskReviewEventContractSchema,
  Gate2SignalCandidateContractSchema,
  Gate2SimulationEvidenceDetailContractSchema,
  Gate2SimulatedFillAssumptionContractSchema,
  Gate2SimulatedOrderRecordContractSchema,
  Gate2SimulationStateContractSchema,
  Gate2StrategyReviewWorkspaceCaseContractSchema,
  type Gate2LocalArtifactInventoryContract,
  type Gate2MarketIntelligenceInputContract,
  type Gate2NewsEventScannerContract,
  type Gate2NegativeBoundaryFixtureContract,
  type Gate2OperatorActionLogContract,
  type Gate2OperatorNoteModelContract,
  type Gate2RedFlagEngineContract,
  type Gate2RiskReviewEventContract,
  type Gate2SignalCandidateContract,
  type Gate2SimulationEvidenceDetailContract,
  type Gate2SimulatedFillAssumptionContract,
  type Gate2SimulatedOrderRecordContract,
  type Gate2SimulationStateContract,
  type Gate2StrategyReviewWorkspaceCaseContract
} from "../../contracts/src/index.js";

const fixtureTimestamp = "2026-01-01T00:00:00.000Z";

export const gate2SimulatedFillAssumptionFixture: Gate2SimulatedFillAssumptionContract =
  Gate2SimulatedFillAssumptionContractSchema.parse({
    simulated_fill_assumption_id: "gate2-fill-assumption-fixture-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    price_source: "local synthetic bid ask fixture",
    spread_policy: "Use declared synthetic spread from evidence bundle.",
    slippage_policy: "Use declared synthetic slippage assumption.",
    cost_policy: "Use declared local cost assumption.",
    latency_limitation: "No live latency model exists in this local fixture.",
    same_candle_policy: "Same-candle ambiguity remains blocked unless reviewed.",
    limitation_notes: ["Synthetic planning fixture; not market evidence or strategy approval."],
    assumption_status: "reviewed",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    reviewed_at: fixtureTimestamp
  });

export const gate2RiskReviewEventFixture: Gate2RiskReviewEventContract =
  Gate2RiskReviewEventContractSchema.parse({
    risk_review_event_id: "gate2-risk-review-fixture-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    simulated_order_record_id: "gate2-sim-record-fixture-001",
    reviewer_role: "risk reviewer fixture",
    severity: "medium",
    disposition: "needs_revision",
    blocking_issues: ["Synthetic fixture keeps simulation evidence under review."],
    operator_acknowledgement_required: true,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    reviewed_at: fixtureTimestamp
  });

export const gate2OperatorActionLogFixture: Gate2OperatorActionLogContract =
  Gate2OperatorActionLogContractSchema.parse({
    operator_action_log_id: "gate2-operator-action-fixture-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    simulated_order_record_id: "gate2-sim-record-fixture-001",
    decision: "record_local_simulation",
    decision_rationale: "Synthetic local decision trace for contract validation only.",
    redaction_status: "no_sensitive_payload",
    operator_retains_authority: true,
    automated_action: false,
    sensitive_payload_stored: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    decided_at: fixtureTimestamp
  });

export const gate2SimulatedOrderRecordFixture: Gate2SimulatedOrderRecordContract =
  Gate2SimulatedOrderRecordContractSchema.parse({
    simulated_order_record_id: "gate2-sim-record-fixture-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    strategy_version_id: "gate1-strategy-version-fixture-001",
    evidence_bundle_summary_id: "gate1-evidence-bundle-summary-fixture-001",
    operator_action_log_id: gate2OperatorActionLogFixture.operator_action_log_id,
    risk_review_event_id: gate2RiskReviewEventFixture.risk_review_event_id,
    simulated_fill_assumption_id: gate2SimulatedFillAssumptionFixture.simulated_fill_assumption_id,
    instrument: "EURUSD",
    side: "long",
    quantity: 1,
    quantity_unit: "standard_lot",
    planned_price: 1.1,
    state: "review_required",
    simulation_only: true,
    no_external_account: true,
    credentials_required: false,
    live_route: false,
    automated_action: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate2SimulationStateFixture: Gate2SimulationStateContract =
  Gate2SimulationStateContractSchema.parse({
    simulation_state_record_id: "gate2-state-fixture-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    simulated_order_record_id: gate2SimulatedOrderRecordFixture.simulated_order_record_id,
    current_state: "review_required",
    allowed_next_states: ["risk_blocked", "operator_rejected", "simulation_recorded", "voided"],
    disallowed_transition_reasons: [
      "External account routes are blocked.",
      "Automated transitions are blocked."
    ],
    rollback_gate: "G1_BACKTESTING",
    operator_required: true,
    automated_transition: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate2NegativeBoundaryFixtures: readonly Gate2NegativeBoundaryFixtureContract[] = [
  "external_account_route",
  "credential_payload",
  "autonomy_attempt",
  "live_action_claim",
  "performance_claim",
  "missing_risk_review",
  "missing_operator_action"
].map((boundaryType, index) =>
  Gate2NegativeBoundaryFixtureContractSchema.parse({
    negative_boundary_fixture_id: `gate2-negative-boundary-fixture-00${index + 1}`,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    boundary_type: boundaryType,
    expected_result: "blocked",
    synthetic_only: true,
    contains_real_account_data: false,
    contains_secret: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  })
);

export const gate2SimulationEvidenceDetailFixture: Gate2SimulationEvidenceDetailContract =
  Gate2SimulationEvidenceDetailContractSchema.parse({
    simulation_evidence_detail_id: "gate2-simulation-evidence-detail-fixture-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    simulated_order_record_id: gate2SimulatedOrderRecordFixture.simulated_order_record_id,
    simulation_state_record_id: gate2SimulationStateFixture.simulation_state_record_id,
    operator_action_log_id: gate2OperatorActionLogFixture.operator_action_log_id,
    risk_review_event_id: gate2RiskReviewEventFixture.risk_review_event_id,
    simulated_fill_assumption_id: gate2SimulatedFillAssumptionFixture.simulated_fill_assumption_id,
    local_source_artifact_paths: [
      "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_IMPLEMENTATION.md",
      "ops/assignments/TRD-532_SIMULATION_EVIDENCE_SCHEMA_SOURCE_UPDATE.md"
    ],
    workflow_evidence_card_ids: ["gate2-workflow-evidence-card-fixture-001"],
    risk_review_panel_ids: ["gate2-risk-review-panel-fixture-001"],
    artifact_summary_refs: ["gate2-local-artifact-summary-fixture-001"],
    failure_mode_evidence_refs: ["gate2-failure-mode-evidence-fixture-001"],
    source_link_map_refs: ["docs/operations/GATE2_EVIDENCE_SOURCE_LINK_MAP_IMPLEMENTATION.md"],
    reproducibility_notes: ["Synthetic local detail fixture; reproducible by contract tests only."],
    limitation_notes: ["Planning-only evidence detail; no account, route, or execution authority."],
    evidence_freshness_status: "fresh",
    operator_required: true,
    simulation_only: true,
    no_external_account: true,
    credentials_required: false,
    live_route: false,
    automated_action: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: fixtureTimestamp
  });

export const gate2LocalArtifactInventoryFixtures: readonly Gate2LocalArtifactInventoryContract[] = [
  {
    artifact_id: "gate2-artifact-inventory-fixture-001",
    artifact_type: "strategy_idea",
    local_path: "ops/assignments/TRD-001_INITIALIZE_GATE0_RESEARCH_ONLY_MONOREPO.md",
    source_category: "protected_loop",
    linked_research_case_id: "gate2-research-case-fixture-001",
    linked_evidence_detail_id: gate2SimulationEvidenceDetailFixture.simulation_evidence_detail_id,
    linked_risk_review_id: gate2RiskReviewEventFixture.risk_review_event_id,
    freshness_status: "fresh",
    limitation_notes: ["Local source file proves traceability only."],
    redaction_status: "no_sensitive_payload",
    blocked_scope_flags: [],
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    created_at: fixtureTimestamp,
    verified_at: fixtureTimestamp
  },
  {
    artifact_id: "gate2-artifact-inventory-fixture-002",
    artifact_type: "risk_review",
    local_path: "ops/runtime/reviews/TRD-585_RISK_REVIEW.md",
    source_category: "risk_control",
    linked_research_case_id: "gate2-research-case-fixture-001",
    linked_evidence_detail_id: gate2SimulationEvidenceDetailFixture.simulation_evidence_detail_id,
    linked_risk_review_id: gate2RiskReviewEventFixture.risk_review_event_id,
    freshness_status: "fresh",
    limitation_notes: ["Risk source is local operating evidence, not permission."],
    redaction_status: "no_sensitive_payload",
    blocked_scope_flags: [],
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    created_at: fixtureTimestamp,
    verified_at: fixtureTimestamp
  }
].map((fixture) => Gate2LocalArtifactInventoryContractSchema.parse(fixture));

export const gate2OperatorNoteModelFixture: Gate2OperatorNoteModelContract =
  Gate2OperatorNoteModelContractSchema.parse({
    operator_note_id: "gate2-operator-note-fixture-001",
    note_type: "observation",
    linked_research_case_id: "gate2-research-case-fixture-001",
    linked_evidence_detail_id: gate2SimulationEvidenceDetailFixture.simulation_evidence_detail_id,
    linked_artifact_ids: gate2LocalArtifactInventoryFixtures.map(
      (artifact) => artifact.artifact_id
    ),
    source_link_refs: [
      "ops/runtime/reviews/TRD-585_ORCHESTRATOR_ACCEPTANCE.md",
      "ops/assignments/TRD-585_GATE2_ARTIFACT_INVENTORY_SCHEMA_PLAN.md"
    ],
    note_body: "Operator observes that local evidence and limitations are visible together.",
    limitation_notes: ["Manual note fixture; no decision is performed."],
    redaction_status: "no_sensitive_payload",
    manual_entry: true,
    operator_retains_authority: true,
    automated_action: false,
    decision_performed: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    created_at: fixtureTimestamp
  });

export const gate2StrategyReviewWorkspaceCaseFixture: Gate2StrategyReviewWorkspaceCaseContract =
  Gate2StrategyReviewWorkspaceCaseContractSchema.parse({
    research_case_id: "gate2-research-case-fixture-001",
    workspace_case_status: "inspection_ready",
    strategy_idea_id: "gate0-strategy-idea-fixture-001",
    data_snapshot_id: "gate1-historical-data-snapshot-fixture-001",
    backtest_evidence_id: "gate1-backtest-run-assembly-fixture-001",
    metric_report_id: "gate1-metric-report-evidence-fixture-001",
    risk_review_id: gate2RiskReviewEventFixture.risk_review_event_id,
    operator_note_id: gate2OperatorNoteModelFixture.operator_note_id,
    outcome_log_id: "gate0-outcome-log-fixture-001",
    learning_event_id: "gate0-learning-event-fixture-001",
    simulation_evidence_detail_id:
      gate2SimulationEvidenceDetailFixture.simulation_evidence_detail_id,
    artifact_inventory_ids: gate2LocalArtifactInventoryFixtures.map(
      (artifact) => artifact.artifact_id
    ),
    blocked_scope_reminders: ["external_account_route", "autonomy_attempt", "live_action_claim"],
    limitation_notes: ["Workspace fixture is read-only and local."],
    operator_required: true,
    read_only_workspace: true,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    created_at: fixtureTimestamp
  });

export const gate2MarketIntelligenceInputFixture: Gate2MarketIntelligenceInputContract =
  Gate2MarketIntelligenceInputContractSchema.parse({
    market_intelligence_input_id: "gate2-market-intelligence-input-fixture-001",
    input_type: "market_condition",
    linked_research_case_id: gate2StrategyReviewWorkspaceCaseFixture.research_case_id,
    source_title: "Synthetic local market condition note",
    source_ref: "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_IMPLEMENTATION.md",
    observed_at: fixtureTimestamp,
    summary: "Local scenario context recorded for later risk review.",
    confidence_level: "medium",
    red_flags: ["Synthetic source requires operator review."],
    invalidation_conditions: ["Source becomes stale or risk review blocks the case."],
    source_references: ["ops/truth/MARKET_INTELLIGENCE_TRUTH.md"],
    risk_review_required: true,
    operator_decision_required: true,
    recommendation_final: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    created_at: fixtureTimestamp
  });

export const gate2NewsEventScannerFixture: Gate2NewsEventScannerContract =
  Gate2NewsEventScannerContractSchema.parse({
    news_event_id: "gate2-news-event-fixture-001",
    market_intelligence_input_id: gate2MarketIntelligenceInputFixture.market_intelligence_input_id,
    linked_research_case_id: gate2StrategyReviewWorkspaceCaseFixture.research_case_id,
    event_time: fixtureTimestamp,
    event_summary: "Synthetic local event context for inspection only.",
    source_refs: ["ops/truth/MARKET_INTELLIGENCE_TRUTH.md"],
    red_flags: ["Event source is synthetic and must stay risk-reviewed."],
    stale_reference: false,
    action_route_created: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    created_at: fixtureTimestamp
  });

export const gate2SignalCandidateFixture: Gate2SignalCandidateContract =
  Gate2SignalCandidateContractSchema.parse({
    signal_candidate_id: "gate2-signal-candidate-fixture-001",
    linked_research_case_id: gate2StrategyReviewWorkspaceCaseFixture.research_case_id,
    market_intelligence_input_ids: [
      gate2MarketIntelligenceInputFixture.market_intelligence_input_id
    ],
    evidence_refs: [gate2NewsEventScannerFixture.news_event_id],
    candidate_summary: "Scenario candidate remains evidence-only and operator-reviewed.",
    scenario_action: "watch",
    confidence_level: "low",
    risk_review_id: gate2RiskReviewEventFixture.risk_review_event_id,
    red_flags: ["Candidate is not a final recommendation."],
    invalidation_conditions: ["Evidence goes stale or risk review blocks continuation."],
    operator_decision_required: true,
    action_route_created: false,
    recommendation_final: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    created_at: fixtureTimestamp
  });

export const gate2RedFlagEngineFixture: Gate2RedFlagEngineContract =
  Gate2RedFlagEngineContractSchema.parse({
    red_flag_engine_id: "gate2-red-flag-engine-fixture-001",
    linked_research_case_id: gate2StrategyReviewWorkspaceCaseFixture.research_case_id,
    market_intelligence_input_ids: [
      gate2MarketIntelligenceInputFixture.market_intelligence_input_id
    ],
    news_event_ids: [gate2NewsEventScannerFixture.news_event_id],
    signal_candidate_ids: [gate2SignalCandidateFixture.signal_candidate_id],
    red_flag_category: "scenario_uncertainty",
    severity: "medium",
    blocker_status: "risk_review_required",
    detected_red_flags: [
      "Synthetic scenario candidate depends on local context and requires risk review."
    ],
    evidence_refs: [
      gate2MarketIntelligenceInputFixture.market_intelligence_input_id,
      gate2NewsEventScannerFixture.news_event_id,
      gate2SignalCandidateFixture.signal_candidate_id
    ],
    invalidation_conditions: ["Source evidence becomes stale or risk review blocks the case."],
    limitation_notes: ["Red flag fixture is blocker evidence only, not a final recommendation."],
    risk_review_required: true,
    operator_decision_required: true,
    action_route_created: false,
    recommendation_final: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    created_at: fixtureTimestamp
  });
