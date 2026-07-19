import { describe, expect, it } from "vitest";
import {
  Gate2NegativeBoundaryFixtureContractSchema,
  Gate2LocalArtifactInventoryContractSchema,
  Gate2MarketIntelligenceInputContractSchema,
  Gate2NewsEventScannerContractSchema,
  Gate2OperatorActionLogContractSchema,
  Gate2OperatorNoteModelContractSchema,
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
  type Gate2OperatorActionLogContract,
  type Gate2OperatorNoteModelContract,
  type Gate2RiskReviewEventContract,
  type Gate2SignalCandidateContract,
  type Gate2SimulationEvidenceDetailContract,
  type Gate2SimulatedFillAssumptionContract,
  type Gate2SimulatedOrderRecordContract,
  type Gate2SimulationStateContract,
  type Gate2StrategyReviewWorkspaceCaseContract
} from "../src/index.js";

const createdAt = "2026-01-01T00:00:00.000Z";

function createSimulatedOrderRecord(
  overrides: Partial<Gate2SimulatedOrderRecordContract> = {}
): Gate2SimulatedOrderRecordContract {
  return {
    simulated_order_record_id: "gate2-sim-record-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    strategy_version_id: "gate1-strategy-version-001",
    evidence_bundle_summary_id: "gate1-evidence-bundle-summary-001",
    operator_action_log_id: "gate2-operator-action-001",
    risk_review_event_id: "gate2-risk-review-001",
    simulated_fill_assumption_id: "gate2-fill-assumption-001",
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
    created_at: createdAt,
    ...overrides
  };
}

function createSimulationState(
  overrides: Partial<Gate2SimulationStateContract> = {}
): Gate2SimulationStateContract {
  return {
    simulation_state_record_id: "gate2-state-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    simulated_order_record_id: "gate2-sim-record-001",
    current_state: "review_required",
    allowed_next_states: ["risk_blocked", "operator_rejected", "simulation_recorded", "voided"],
    disallowed_transition_reasons: ["External account and automated transitions are blocked."],
    rollback_gate: "G1_BACKTESTING",
    operator_required: true,
    automated_transition: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    created_at: createdAt,
    ...overrides
  };
}

function createRiskReviewEvent(
  overrides: Partial<Gate2RiskReviewEventContract> = {}
): Gate2RiskReviewEventContract {
  return {
    risk_review_event_id: "gate2-risk-review-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    simulated_order_record_id: "gate2-sim-record-001",
    reviewer_role: "risk reviewer",
    severity: "medium",
    disposition: "needs_revision",
    blocking_issues: ["Synthetic fixture remains under review."],
    operator_acknowledgement_required: true,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    reviewed_at: createdAt,
    ...overrides
  };
}

function createOperatorActionLog(
  overrides: Partial<Gate2OperatorActionLogContract> = {}
): Gate2OperatorActionLogContract {
  return {
    operator_action_log_id: "gate2-operator-action-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    simulated_order_record_id: "gate2-sim-record-001",
    decision: "record_local_simulation",
    decision_rationale: "Operator records local simulation evidence for traceability.",
    redaction_status: "no_sensitive_payload",
    operator_retains_authority: true,
    automated_action: false,
    sensitive_payload_stored: false,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    decided_at: createdAt,
    ...overrides
  };
}

function createFillAssumption(
  overrides: Partial<Gate2SimulatedFillAssumptionContract> = {}
): Gate2SimulatedFillAssumptionContract {
  return {
    simulated_fill_assumption_id: "gate2-fill-assumption-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    price_source: "local synthetic bid ask fixture",
    spread_policy: "Use declared synthetic spread.",
    slippage_policy: "Use declared synthetic slippage.",
    cost_policy: "Use declared local costs.",
    latency_limitation: "No live latency model is available.",
    same_candle_policy: "Same-candle ambiguity remains blocked unless reviewed.",
    limitation_notes: ["Synthetic assumption; not market evidence or strategy approval."],
    assumption_status: "reviewed",
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    reviewed_at: createdAt,
    ...overrides
  };
}

function createSimulationEvidenceDetail(
  overrides: Partial<Gate2SimulationEvidenceDetailContract> = {}
): Gate2SimulationEvidenceDetailContract {
  return {
    simulation_evidence_detail_id: "gate2-simulation-evidence-detail-001",
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    contract_authority: "contract_only",
    simulated_order_record_id: "gate2-sim-record-001",
    simulation_state_record_id: "gate2-state-001",
    operator_action_log_id: "gate2-operator-action-001",
    risk_review_event_id: "gate2-risk-review-001",
    simulated_fill_assumption_id: "gate2-fill-assumption-001",
    local_source_artifact_paths: [
      "docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_IMPLEMENTATION.md",
      "ops/assignments/TRD-532_SIMULATION_EVIDENCE_SCHEMA_SOURCE_UPDATE.md"
    ],
    workflow_evidence_card_ids: ["gate2-workflow-evidence-card-001"],
    risk_review_panel_ids: ["gate2-risk-review-panel-001"],
    artifact_summary_refs: ["gate2-local-artifact-summary-001"],
    failure_mode_evidence_refs: ["gate2-failure-mode-evidence-001"],
    source_link_map_refs: ["docs/operations/GATE2_EVIDENCE_SOURCE_LINK_MAP_IMPLEMENTATION.md"],
    reproducibility_notes: ["Synthetic local evidence detail fixture."],
    limitation_notes: ["Planning-only detail; no account, route, or execution authority."],
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
    created_at: createdAt,
    ...overrides
  };
}

function createLocalArtifactInventory(
  overrides: Partial<Gate2LocalArtifactInventoryContract> = {}
): Gate2LocalArtifactInventoryContract {
  return {
    artifact_id: "gate2-artifact-001",
    artifact_type: "strategy_idea",
    local_path: "ops/assignments/TRD-585_GATE2_ARTIFACT_INVENTORY_SCHEMA_PLAN.md",
    source_category: "protected_loop",
    linked_research_case_id: "gate2-research-case-001",
    linked_evidence_detail_id: "gate2-simulation-evidence-detail-001",
    linked_risk_review_id: "gate2-risk-review-001",
    freshness_status: "fresh",
    limitation_notes: ["Local evidence only."],
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
    created_at: createdAt,
    verified_at: createdAt,
    ...overrides
  };
}

function createOperatorNoteModel(
  overrides: Partial<Gate2OperatorNoteModelContract> = {}
): Gate2OperatorNoteModelContract {
  return {
    operator_note_id: "gate2-operator-note-001",
    note_type: "observation",
    linked_research_case_id: "gate2-research-case-001",
    linked_evidence_detail_id: "gate2-simulation-evidence-detail-001",
    linked_artifact_ids: ["gate2-artifact-001"],
    source_link_refs: ["ops/runtime/reviews/TRD-585_ORCHESTRATOR_ACCEPTANCE.md"],
    note_body: "Operator note records an observation for local review.",
    limitation_notes: ["Manual local note; no decision performed."],
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
    created_at: createdAt,
    ...overrides
  };
}

function createWorkspaceCase(
  overrides: Partial<Gate2StrategyReviewWorkspaceCaseContract> = {}
): Gate2StrategyReviewWorkspaceCaseContract {
  return {
    research_case_id: "gate2-research-case-001",
    workspace_case_status: "inspection_ready",
    strategy_idea_id: "gate0-strategy-idea-001",
    data_snapshot_id: "gate1-data-snapshot-001",
    backtest_evidence_id: "gate1-backtest-evidence-001",
    metric_report_id: "gate1-metric-report-001",
    risk_review_id: "gate2-risk-review-001",
    operator_note_id: "gate2-operator-note-001",
    outcome_log_id: "gate0-outcome-log-001",
    learning_event_id: "gate0-learning-event-001",
    simulation_evidence_detail_id: "gate2-simulation-evidence-detail-001",
    artifact_inventory_ids: ["gate2-artifact-001"],
    blocked_scope_reminders: ["external_account_route"],
    limitation_notes: ["Read-only local workspace case."],
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
    created_at: createdAt,
    ...overrides
  };
}

function createMarketInput(
  overrides: Partial<Gate2MarketIntelligenceInputContract> = {}
): Gate2MarketIntelligenceInputContract {
  return {
    market_intelligence_input_id: "gate2-market-input-001",
    input_type: "market_condition",
    linked_research_case_id: "gate2-research-case-001",
    source_title: "Synthetic local market context",
    source_ref: "ops/truth/MARKET_INTELLIGENCE_TRUTH.md",
    observed_at: createdAt,
    summary: "Evidence-only local context for operator inspection.",
    confidence_level: "medium",
    red_flags: ["Synthetic source."],
    invalidation_conditions: ["Source becomes stale."],
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
    created_at: createdAt,
    ...overrides
  };
}

function createNewsEvent(
  overrides: Partial<Gate2NewsEventScannerContract> = {}
): Gate2NewsEventScannerContract {
  return {
    news_event_id: "gate2-news-event-001",
    market_intelligence_input_id: "gate2-market-input-001",
    linked_research_case_id: "gate2-research-case-001",
    event_time: createdAt,
    event_summary: "Synthetic event context for local inspection.",
    source_refs: ["ops/truth/MARKET_INTELLIGENCE_TRUTH.md"],
    red_flags: ["Requires risk review."],
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
    created_at: createdAt,
    ...overrides
  };
}

function createSignalCandidate(
  overrides: Partial<Gate2SignalCandidateContract> = {}
): Gate2SignalCandidateContract {
  return {
    signal_candidate_id: "gate2-signal-candidate-001",
    linked_research_case_id: "gate2-research-case-001",
    market_intelligence_input_ids: ["gate2-market-input-001"],
    evidence_refs: ["gate2-news-event-001"],
    candidate_summary: "Scenario candidate for operator review.",
    scenario_action: "watch",
    confidence_level: "low",
    risk_review_id: "gate2-risk-review-001",
    red_flags: ["Not final."],
    invalidation_conditions: ["Risk review blocks the case."],
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
    created_at: createdAt,
    ...overrides
  };
}

describe("Gate 2 paper simulation contracts", () => {
  it("validates local simulated-order records without external or execution paths", () => {
    const record = Gate2SimulatedOrderRecordContractSchema.parse(createSimulatedOrderRecord());

    expect(record.financial_gate).toBe("G2_PAPER_TRADING");
    expect(record.scope).toBe("paper_simulation_planning_only");
    expect(record.no_external_account).toBe(true);
    expect(record.execution_path).toBe(false);
  });

  it("rejects simulated-order records that leave Gate 2 planning boundaries", () => {
    expect(() =>
      Gate2SimulatedOrderRecordContractSchema.parse({
        ...createSimulatedOrderRecord(),
        financial_gate: "G1_BACKTESTING"
      })
    ).toThrow();

    expect(() =>
      Gate2SimulatedOrderRecordContractSchema.parse({
        ...createSimulatedOrderRecord(),
        scope: "historical_backtesting_only"
      })
    ).toThrow();
  });

  it("rejects simulated-order records with external, credential, live, automated, or claim paths", () => {
    for (const mutation of [
      { external_access: true },
      { execution_path: true },
      { credentials_required: true },
      { live_route: true },
      { automated_action: true },
      { approval_claim: true },
      { performance_claim: true }
    ]) {
      expect(() =>
        Gate2SimulatedOrderRecordContractSchema.parse({
          ...createSimulatedOrderRecord(),
          ...mutation
        })
      ).toThrow();
    }
  });

  it("validates simulation state boundaries and rollback rules", () => {
    const state = Gate2SimulationStateContractSchema.parse(createSimulationState());

    expect(state.operator_required).toBe(true);
    expect(state.rollback_gate).toBe("G1_BACKTESTING");
    expect(state.automated_transition).toBe(false);
  });

  it("rejects automated or incoherent state transitions", () => {
    expect(() =>
      Gate2SimulationStateContractSchema.parse({
        ...createSimulationState(),
        automated_transition: true
      })
    ).toThrow();

    expect(() =>
      Gate2SimulationStateContractSchema.parse({
        ...createSimulationState(),
        current_state: "voided",
        allowed_next_states: ["simulation_recorded"]
      })
    ).toThrow();
  });

  it("validates risk review events with operator acknowledgement", () => {
    const event = Gate2RiskReviewEventContractSchema.parse(createRiskReviewEvent());

    expect(event.operator_acknowledgement_required).toBe(true);
    expect(event.disposition).toBe("needs_revision");
  });

  it("rejects blocked risk review events without blocking issues or with claims", () => {
    expect(() =>
      Gate2RiskReviewEventContractSchema.parse({
        ...createRiskReviewEvent(),
        disposition: "blocked",
        blocking_issues: []
      })
    ).toThrow();

    expect(() =>
      Gate2RiskReviewEventContractSchema.parse({
        ...createRiskReviewEvent(),
        approval_claim: true
      })
    ).toThrow();
  });

  it("validates operator action logs as human decisions only", () => {
    const log = Gate2OperatorActionLogContractSchema.parse(createOperatorActionLog());

    expect(log.operator_retains_authority).toBe(true);
    expect(log.automated_action).toBe(false);
    expect(log.sensitive_payload_stored).toBe(false);
  });

  it("rejects operator action logs with automation or sensitive payload storage", () => {
    expect(() =>
      Gate2OperatorActionLogContractSchema.parse({
        ...createOperatorActionLog(),
        automated_action: true
      })
    ).toThrow();

    expect(() =>
      Gate2OperatorActionLogContractSchema.parse({
        ...createOperatorActionLog(),
        sensitive_payload_stored: true
      })
    ).toThrow();
  });

  it("validates simulated fill assumptions as limitations", () => {
    const assumption = Gate2SimulatedFillAssumptionContractSchema.parse(createFillAssumption());

    expect(assumption.assumption_status).toBe("reviewed");
    expect(assumption.limitation_notes.length).toBeGreaterThan(0);
  });

  it("rejects fill assumptions without limitations or with performance claims", () => {
    expect(() =>
      Gate2SimulatedFillAssumptionContractSchema.parse({
        ...createFillAssumption(),
        limitation_notes: []
      })
    ).toThrow();

    expect(() =>
      Gate2SimulatedFillAssumptionContractSchema.parse({
        ...createFillAssumption(),
        performance_claim: true
      })
    ).toThrow();
  });

  it("validates negative boundary fixtures as synthetic blocked cases", () => {
    const fixture = Gate2NegativeBoundaryFixtureContractSchema.parse({
      negative_boundary_fixture_id: "gate2-negative-001",
      financial_gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      contract_authority: "contract_only",
      boundary_type: "credential_payload",
      expected_result: "blocked",
      synthetic_only: true,
      contains_real_account_data: false,
      contains_secret: false,
      evidence_only: true,
      approval_claim: false,
      performance_claim: false,
      external_access: false,
      execution_path: false,
      created_at: createdAt
    });

    expect(fixture.expected_result).toBe("blocked");
    expect(fixture.contains_secret).toBe(false);
  });

  it("rejects negative fixtures with real account data, secrets, or non-blocked outcomes", () => {
    const baseFixture = {
      negative_boundary_fixture_id: "gate2-negative-001",
      financial_gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      contract_authority: "contract_only",
      boundary_type: "credential_payload",
      expected_result: "blocked",
      synthetic_only: true,
      contains_real_account_data: false,
      contains_secret: false,
      evidence_only: true,
      approval_claim: false,
      performance_claim: false,
      external_access: false,
      execution_path: false,
      created_at: createdAt
    };

    for (const mutation of [
      { contains_real_account_data: true },
      { contains_secret: true },
      { expected_result: "allowed" }
    ]) {
      expect(() =>
        Gate2NegativeBoundaryFixtureContractSchema.parse({
          ...baseFixture,
          ...mutation
        })
      ).toThrow();
    }
  });

  it("validates simulation evidence details as local read-only records", () => {
    const detail = Gate2SimulationEvidenceDetailContractSchema.parse(
      createSimulationEvidenceDetail()
    );

    expect(detail.financial_gate).toBe("G2_PAPER_TRADING");
    expect(detail.scope).toBe("paper_simulation_planning_only");
    expect(detail.operator_required).toBe(true);
    expect(detail.no_external_account).toBe(true);
  });

  it("rejects simulation evidence details with missing source artifacts or local references", () => {
    expect(() =>
      Gate2SimulationEvidenceDetailContractSchema.parse({
        ...createSimulationEvidenceDetail(),
        local_source_artifact_paths: []
      })
    ).toThrow();

    expect(() =>
      Gate2SimulationEvidenceDetailContractSchema.parse({
        ...createSimulationEvidenceDetail(),
        local_source_artifact_paths: ["https://example.invalid/not-local"]
      })
    ).toThrow();

    expect(() =>
      Gate2SimulationEvidenceDetailContractSchema.parse({
        ...createSimulationEvidenceDetail(),
        source_link_map_refs: []
      })
    ).toThrow();
  });

  it("rejects simulation evidence details with action, account, credential, claim, or automation paths", () => {
    for (const mutation of [
      { external_access: true },
      { execution_path: true },
      { no_external_account: false },
      { credentials_required: true },
      { live_route: true },
      { automated_action: true },
      { operator_required: false },
      { approval_claim: true },
      { performance_claim: true }
    ]) {
      expect(() =>
        Gate2SimulationEvidenceDetailContractSchema.parse({
          ...createSimulationEvidenceDetail(),
          ...mutation
        })
      ).toThrow();
    }
  });

  it("rejects fresh simulation evidence details that depend on blocked failure-mode references", () => {
    expect(() =>
      Gate2SimulationEvidenceDetailContractSchema.parse({
        ...createSimulationEvidenceDetail(),
        failure_mode_evidence_refs: ["gate2-blocked-failure-mode-evidence-001"]
      })
    ).toThrow();
  });

  it("validates local artifact inventory records for workspace evidence files", () => {
    const artifact = Gate2LocalArtifactInventoryContractSchema.parse(
      createLocalArtifactInventory()
    );

    expect(artifact.linked_research_case_id).toBe("gate2-research-case-001");
    expect(artifact.local_path.startsWith("ops/")).toBe(true);
  });

  it("rejects artifact inventory records with nonlocal paths, missing limits, or blocked stale state", () => {
    for (const mutation of [
      { local_path: "https://example.invalid/evidence" },
      { limitation_notes: [] },
      { freshness_status: "blocked" as const, blocked_scope_flags: [] }
    ]) {
      expect(() =>
        Gate2LocalArtifactInventoryContractSchema.parse({
          ...createLocalArtifactInventory(),
          ...mutation
        })
      ).toThrow();
    }
  });

  it("validates operator note models as manual source-linked records", () => {
    const note = Gate2OperatorNoteModelContractSchema.parse(createOperatorNoteModel());

    expect(note.manual_entry).toBe(true);
    expect(note.decision_performed).toBe(false);
    expect(note.source_link_refs).toHaveLength(1);
  });

  it("rejects operator note models with automation, decisioning, or nonlocal sources", () => {
    for (const mutation of [
      { automated_action: true },
      { decision_performed: true },
      { source_link_refs: ["https://example.invalid/source"] }
    ]) {
      expect(() =>
        Gate2OperatorNoteModelContractSchema.parse({
          ...createOperatorNoteModel(),
          ...mutation
        })
      ).toThrow();
    }
  });

  it("validates strategy review workspace cases as read-only evidence chains", () => {
    const workspaceCase =
      Gate2StrategyReviewWorkspaceCaseContractSchema.parse(createWorkspaceCase());

    expect(workspaceCase.read_only_workspace).toBe(true);
    expect(workspaceCase.artifact_inventory_ids).toContain("gate2-artifact-001");
  });

  it("rejects workspace cases that hide blockers or imply action authority", () => {
    for (const mutation of [
      { blocked_scope_reminders: [] },
      { read_only_workspace: false },
      { operator_required: false },
      { execution_path: true }
    ]) {
      expect(() =>
        Gate2StrategyReviewWorkspaceCaseContractSchema.parse({
          ...createWorkspaceCase(),
          ...mutation
        })
      ).toThrow();
    }
  });

  it("validates market intelligence inputs as sourced scenario context", () => {
    const input = Gate2MarketIntelligenceInputContractSchema.parse(createMarketInput());

    expect(input.risk_review_required).toBe(true);
    expect(input.operator_decision_required).toBe(true);
    expect(input.recommendation_final).toBe(false);
  });

  it("rejects market intelligence inputs that skip risk review or finalise recommendations", () => {
    for (const mutation of [
      { risk_review_required: false },
      { operator_decision_required: false },
      { recommendation_final: true },
      { source_references: [] }
    ]) {
      expect(() =>
        Gate2MarketIntelligenceInputContractSchema.parse({
          ...createMarketInput(),
          ...mutation
        })
      ).toThrow();
    }
  });

  it("validates news event scanner records without action routes", () => {
    const event = Gate2NewsEventScannerContractSchema.parse(createNewsEvent());

    expect(event.stale_reference).toBe(false);
    expect(event.action_route_created).toBe(false);
  });

  it("rejects news event scanner records with stale refs, remote refs, or action routes", () => {
    for (const mutation of [
      { stale_reference: true },
      { action_route_created: true },
      { source_refs: ["https://example.invalid/news"] }
    ]) {
      expect(() =>
        Gate2NewsEventScannerContractSchema.parse({
          ...createNewsEvent(),
          ...mutation
        })
      ).toThrow();
    }
  });

  it("validates signal candidates as evidence-only scenario candidates", () => {
    const candidate = Gate2SignalCandidateContractSchema.parse(createSignalCandidate());

    expect(candidate.scenario_action).toBe("watch");
    expect(candidate.recommendation_final).toBe(false);
    expect(candidate.action_route_created).toBe(false);
  });

  it("rejects signal candidates with action routes, final recommendations, or missing risk review", () => {
    for (const mutation of [
      { action_route_created: true },
      { recommendation_final: true },
      { scenario_action: "paper_simulate" as const, risk_review_id: undefined }
    ]) {
      expect(() =>
        Gate2SignalCandidateContractSchema.parse({
          ...createSignalCandidate(),
          ...mutation
        })
      ).toThrow();
    }
  });
});
