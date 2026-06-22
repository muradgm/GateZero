import { describe, expect, it } from "vitest";
import {
  Gate2NegativeBoundaryFixtureContractSchema,
  Gate2OperatorActionLogContractSchema,
  Gate2RiskReviewEventContractSchema,
  Gate2SimulatedFillAssumptionContractSchema,
  Gate2SimulatedOrderRecordContractSchema,
  Gate2SimulationStateContractSchema,
  type Gate2OperatorActionLogContract,
  type Gate2RiskReviewEventContract,
  type Gate2SimulatedFillAssumptionContract,
  type Gate2SimulatedOrderRecordContract,
  type Gate2SimulationStateContract
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
});
