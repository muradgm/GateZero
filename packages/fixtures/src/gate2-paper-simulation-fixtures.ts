import {
  Gate2NegativeBoundaryFixtureContractSchema,
  Gate2OperatorActionLogContractSchema,
  Gate2RiskReviewEventContractSchema,
  Gate2SimulatedFillAssumptionContractSchema,
  Gate2SimulatedOrderRecordContractSchema,
  Gate2SimulationStateContractSchema,
  type Gate2NegativeBoundaryFixtureContract,
  type Gate2OperatorActionLogContract,
  type Gate2RiskReviewEventContract,
  type Gate2SimulatedFillAssumptionContract,
  type Gate2SimulatedOrderRecordContract,
  type Gate2SimulationStateContract
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
