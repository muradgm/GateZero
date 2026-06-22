import { describe, expect, it } from "vitest";
import {
  gate2OperatorActionLogFixture,
  gate2RiskReviewEventFixture,
  gate2SimulatedFillAssumptionFixture,
  gate2SimulatedOrderRecordFixture,
  gate2SimulationStateFixture
} from "../../fixtures/src/index.js";
import {
  assembleGate2LocalSimulationInput,
  buildGate2LocalSimulationOutputArtifact,
  checkGate2LocalSimulationReplayDeterminism,
  createGate2LocalSimulationFailureModeFixtures,
  Gate2LocalSimulationEngineResultSchema,
  runGate2LocalSimulationEngine
} from "../src/index.js";

const acceptedRiskReview = {
  ...gate2RiskReviewEventFixture,
  disposition: "accepted_for_local_simulation_evidence" as const,
  blocking_issues: []
};

describe("Gate 2 local simulation engine", () => {
  const acceptedInput = {
    simulatedOrderRecord: gate2SimulatedOrderRecordFixture,
    simulationState: gate2SimulationStateFixture,
    riskReviewEvent: acceptedRiskReview,
    operatorActionLog: gate2OperatorActionLogFixture,
    simulatedFillAssumption: gate2SimulatedFillAssumptionFixture
  };

  it("records a deterministic local simulation result when reviewed inputs align", () => {
    const result = runGate2LocalSimulationEngine(acceptedInput);

    expect(result).toEqual({
      local_simulation_result_id: "gate2-sim-record-fixture-001:local-simulation-result",
      financial_gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      simulated_order_record_id: "gate2-sim-record-fixture-001",
      risk_review_event_id: "gate2-risk-review-fixture-001",
      operator_action_log_id: "gate2-operator-action-fixture-001",
      simulated_fill_assumption_id: "gate2-fill-assumption-fixture-001",
      input_state: "review_required",
      result_state: "simulation_recorded",
      result_status: "recorded_local_simulation",
      deterministic_replay_key:
        "gate2-sim-record-fixture-001|gate2-state-fixture-001|gate2-risk-review-fixture-001|gate2-operator-action-fixture-001|gate2-fill-assumption-fixture-001|review_required|accepted_for_local_simulation_evidence|record_local_simulation|reviewed",
      blocking_reasons: [],
      evidence_only: true,
      simulation_only: true,
      approval_claim: false,
      performance_claim: false,
      external_access: false,
      execution_path: false,
      credentials_required: false,
      live_route: false,
      automated_action: false
    });
    expect(Gate2LocalSimulationEngineResultSchema.parse(result)).toEqual(result);
  });

  it("assembles contract-backed input records before engine execution", () => {
    const assembled = assembleGate2LocalSimulationInput(acceptedInput);

    expect(assembled.assembly).toMatchObject({
      local_simulation_input_assembly_id:
        "gate2-sim-record-fixture-001:local-simulation-input-assembly",
      financial_gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      assembly_status: "assembled",
      blocking_reasons: [],
      evidence_only: true,
      simulation_only: true,
      external_access: false,
      execution_path: false
    });
    expect(runGate2LocalSimulationEngine(assembled.engineInput).result_status).toBe(
      "recorded_local_simulation"
    );
  });

  it("builds a local output artifact from engine output without execution semantics", () => {
    const assembled = assembleGate2LocalSimulationInput(acceptedInput);
    const result = runGate2LocalSimulationEngine(assembled.engineInput);
    const artifact = buildGate2LocalSimulationOutputArtifact({
      assembly: assembled.assembly,
      result
    });

    expect(artifact).toMatchObject({
      local_simulation_output_artifact_id:
        "gate2-sim-record-fixture-001:local-simulation-result:artifact",
      artifact_status: "local_simulation_recorded",
      result_status: "recorded_local_simulation",
      evidence_only: true,
      simulation_only: true,
      approval_claim: false,
      performance_claim: false,
      external_access: false,
      execution_path: false,
      automated_action: false
    });
  });

  it("confirms deterministic replay when the same local input is run twice", () => {
    const first = runGate2LocalSimulationEngine(acceptedInput);
    const second = runGate2LocalSimulationEngine(acceptedInput);

    expect(checkGate2LocalSimulationReplayDeterminism({ first, second })).toMatchObject({
      replay_status: "deterministic_match",
      mismatch_reasons: [],
      evidence_only: true,
      approval_claim: false,
      performance_claim: false,
      external_access: false,
      execution_path: false,
      automated_action: false
    });
  });

  it("blocks local simulation when risk review still requires revision", () => {
    const result = runGate2LocalSimulationEngine({
      simulatedOrderRecord: gate2SimulatedOrderRecordFixture,
      simulationState: gate2SimulationStateFixture,
      riskReviewEvent: gate2RiskReviewEventFixture,
      operatorActionLog: gate2OperatorActionLogFixture,
      simulatedFillAssumption: gate2SimulatedFillAssumptionFixture
    });

    expect(result.result_status).toBe("blocked_local_simulation");
    expect(result.result_state).toBe("risk_blocked");
    expect(result.blocking_reasons).toEqual([
      "risk review has not accepted local simulation evidence",
      "risk review still contains blocking issues"
    ]);
  });

  it("provides failure-mode fixtures for blocked local simulation paths", () => {
    const failureFixtures = createGate2LocalSimulationFailureModeFixtures(acceptedInput);

    expect(failureFixtures.map((fixture) => fixture.failure_mode_id)).toEqual([
      "gate2-local-simulation-failure-risk-review",
      "gate2-local-simulation-failure-operator-decision",
      "gate2-local-simulation-failure-record-link"
    ]);

    for (const fixture of failureFixtures) {
      const result = runGate2LocalSimulationEngine(fixture.input);

      expect(result.result_status).toBe("blocked_local_simulation");
      expect(result.blocking_reasons).toEqual(fixture.expected_blocking_reasons);
      expect(result.external_access).toBe(false);
      expect(result.execution_path).toBe(false);
    }
  });

  it("detects replay mismatch when a later local run changes input decisions", () => {
    const first = runGate2LocalSimulationEngine(acceptedInput);
    const second = runGate2LocalSimulationEngine({
      ...acceptedInput,
      operatorActionLog: {
        ...gate2OperatorActionLogFixture,
        decision: "revise"
      }
    });

    expect(checkGate2LocalSimulationReplayDeterminism({ first, second })).toMatchObject({
      replay_status: "deterministic_mismatch",
      mismatch_reasons: [
        "deterministic replay keys differ",
        "local simulation result payloads differ"
      ]
    });
  });

  it("blocks mismatched records instead of inferring or dispatching an action", () => {
    const result = runGate2LocalSimulationEngine({
      simulatedOrderRecord: gate2SimulatedOrderRecordFixture,
      simulationState: {
        ...gate2SimulationStateFixture,
        simulated_order_record_id: "gate2-other-record"
      },
      riskReviewEvent: acceptedRiskReview,
      operatorActionLog: {
        ...gate2OperatorActionLogFixture,
        decision: "revise"
      },
      simulatedFillAssumption: gate2SimulatedFillAssumptionFixture
    });

    expect(result.result_status).toBe("blocked_local_simulation");
    expect(result.blocking_reasons).toEqual([
      "operator did not choose record_local_simulation",
      "simulation state is linked to a different simulated order record"
    ]);
    expect(result.external_access).toBe(false);
    expect(result.execution_path).toBe(false);
    expect(result.automated_action).toBe(false);
  });

  it("rejects boundary mutations on contract inputs before producing output", () => {
    expect(() =>
      runGate2LocalSimulationEngine({
        simulatedOrderRecord: {
          ...gate2SimulatedOrderRecordFixture,
          external_access: true
        } as never,
        simulationState: gate2SimulationStateFixture,
        riskReviewEvent: acceptedRiskReview,
        operatorActionLog: gate2OperatorActionLogFixture,
        simulatedFillAssumption: gate2SimulatedFillAssumptionFixture
      })
    ).toThrow("Invalid literal value");
  });

  it("keeps result text claim-neutral and free of account or credential handling", () => {
    const resultText = JSON.stringify(runGate2LocalSimulationEngine(acceptedInput));

    expect(resultText).not.toContain("profit");
    expect(resultText).not.toContain("readiness");
    expect(resultText).not.toContain("broker");
    expect(resultText).not.toContain("api_key");
    expect(resultText).not.toContain("account");
  });
});
