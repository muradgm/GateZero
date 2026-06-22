import { z } from "zod";
import {
  Gate2OperatorActionLogContractSchema,
  Gate2RiskReviewEventContractSchema,
  Gate2SimulatedFillAssumptionContractSchema,
  Gate2SimulatedOrderRecordContractSchema,
  Gate2SimulationStateContractSchema,
  type Gate2OperatorActionLogContract,
  type Gate2RiskReviewEventContract,
  type Gate2SimulatedFillAssumptionContract,
  type Gate2SimulatedOrderRecordContract,
  type Gate2SimulationState,
  type Gate2SimulationStateContract
} from "../../contracts/src/index.js";

export const Gate2LocalSimulationStatusSchema = z.enum([
  "recorded_local_simulation",
  "blocked_local_simulation"
]);

export const Gate2LocalSimulationEngineResultSchema = z
  .object({
    local_simulation_result_id: z.string().trim().min(1),
    financial_gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    simulated_order_record_id: z.string().trim().min(1),
    risk_review_event_id: z.string().trim().min(1),
    operator_action_log_id: z.string().trim().min(1),
    simulated_fill_assumption_id: z.string().trim().min(1),
    input_state: z.string().trim().min(1),
    result_state: z.string().trim().min(1),
    result_status: Gate2LocalSimulationStatusSchema,
    deterministic_replay_key: z.string().trim().min(1),
    blocking_reasons: z.array(z.string().trim().min(1)),
    evidence_only: z.literal(true),
    simulation_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    credentials_required: z.literal(false),
    live_route: z.literal(false),
    automated_action: z.literal(false)
  })
  .strict()
  .superRefine((result, context) => {
    if (
      result.result_status === "blocked_local_simulation" &&
      result.blocking_reasons.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked local simulations require blocking reasons",
        path: ["blocking_reasons"]
      });
    }

    if (
      result.result_status === "recorded_local_simulation" &&
      result.blocking_reasons.length > 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "recorded local simulations must not carry blocking reasons",
        path: ["blocking_reasons"]
      });
    }
  });

export type Gate2LocalSimulationStatus = z.infer<typeof Gate2LocalSimulationStatusSchema>;
export type Gate2LocalSimulationEngineResult = z.infer<
  typeof Gate2LocalSimulationEngineResultSchema
>;

export const Gate2LocalSimulationInputAssemblySchema = z
  .object({
    local_simulation_input_assembly_id: z.string().trim().min(1),
    financial_gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    simulated_order_record_id: z.string().trim().min(1),
    simulation_state_record_id: z.string().trim().min(1),
    risk_review_event_id: z.string().trim().min(1),
    operator_action_log_id: z.string().trim().min(1),
    simulated_fill_assumption_id: z.string().trim().min(1),
    assembly_status: z.enum(["assembled", "assembled_with_blockers"]),
    blocking_reasons: z.array(z.string().trim().min(1)),
    evidence_only: z.literal(true),
    simulation_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    credentials_required: z.literal(false),
    live_route: z.literal(false),
    automated_action: z.literal(false)
  })
  .strict();

export const Gate2LocalSimulationOutputArtifactSchema = z
  .object({
    local_simulation_output_artifact_id: z.string().trim().min(1),
    financial_gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    local_simulation_input_assembly_id: z.string().trim().min(1),
    local_simulation_result_id: z.string().trim().min(1),
    result_status: Gate2LocalSimulationStatusSchema,
    result_state: z.string().trim().min(1),
    deterministic_replay_key: z.string().trim().min(1),
    blocking_reasons: z.array(z.string().trim().min(1)),
    artifact_status: z.enum(["local_simulation_recorded", "local_simulation_blocked"]),
    evidence_only: z.literal(true),
    simulation_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    credentials_required: z.literal(false),
    live_route: z.literal(false),
    automated_action: z.literal(false)
  })
  .strict();

export const Gate2LocalSimulationReplayCheckSchema = z
  .object({
    replay_check_id: z.string().trim().min(1),
    financial_gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    replay_status: z.enum(["deterministic_match", "deterministic_mismatch"]),
    first_result_id: z.string().trim().min(1),
    second_result_id: z.string().trim().min(1),
    first_replay_key: z.string().trim().min(1),
    second_replay_key: z.string().trim().min(1),
    mismatch_reasons: z.array(z.string().trim().min(1)),
    evidence_only: z.literal(true),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    automated_action: z.literal(false)
  })
  .strict()
  .superRefine((check, context) => {
    if (check.replay_status === "deterministic_mismatch" && check.mismatch_reasons.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "deterministic mismatches require mismatch reasons",
        path: ["mismatch_reasons"]
      });
    }
  });

export type Gate2LocalSimulationInputAssembly = z.infer<
  typeof Gate2LocalSimulationInputAssemblySchema
>;
export type Gate2LocalSimulationOutputArtifact = z.infer<
  typeof Gate2LocalSimulationOutputArtifactSchema
>;
export type Gate2LocalSimulationReplayCheck = z.infer<typeof Gate2LocalSimulationReplayCheckSchema>;

export interface Gate2LocalSimulationEngineInput {
  readonly simulatedOrderRecord: Gate2SimulatedOrderRecordContract;
  readonly simulationState: Gate2SimulationStateContract;
  readonly riskReviewEvent: Gate2RiskReviewEventContract;
  readonly operatorActionLog: Gate2OperatorActionLogContract;
  readonly simulatedFillAssumption: Gate2SimulatedFillAssumptionContract;
}

export interface Gate2LocalSimulationInputAssemblyResult {
  readonly assembly: Gate2LocalSimulationInputAssembly;
  readonly engineInput: Gate2LocalSimulationEngineInput;
}

export interface Gate2LocalSimulationOutputArtifactInput {
  readonly assembly: Gate2LocalSimulationInputAssembly;
  readonly result: Gate2LocalSimulationEngineResult;
}

export interface Gate2LocalSimulationReplayCheckInput {
  readonly first: Gate2LocalSimulationEngineResult;
  readonly second: Gate2LocalSimulationEngineResult;
}

export interface Gate2LocalSimulationFailureModeFixture {
  readonly failure_mode_id: string;
  readonly description: string;
  readonly input: Gate2LocalSimulationEngineInput;
  readonly expected_blocking_reasons: readonly string[];
}

export function assembleGate2LocalSimulationInput(
  input: Gate2LocalSimulationEngineInput
): Gate2LocalSimulationInputAssemblyResult {
  const simulatedOrderRecord = Gate2SimulatedOrderRecordContractSchema.parse(
    input.simulatedOrderRecord
  );
  const simulationState = Gate2SimulationStateContractSchema.parse(input.simulationState);
  const riskReviewEvent = Gate2RiskReviewEventContractSchema.parse(input.riskReviewEvent);
  const operatorActionLog = Gate2OperatorActionLogContractSchema.parse(input.operatorActionLog);
  const simulatedFillAssumption = Gate2SimulatedFillAssumptionContractSchema.parse(
    input.simulatedFillAssumption
  );
  const engineInput = {
    simulatedOrderRecord,
    simulationState,
    riskReviewEvent,
    operatorActionLog,
    simulatedFillAssumption
  };
  const blockingReasons = collectGate2LocalSimulationBlockingReasons(engineInput);

  return {
    assembly: Gate2LocalSimulationInputAssemblySchema.parse({
      local_simulation_input_assembly_id: `${simulatedOrderRecord.simulated_order_record_id}:local-simulation-input-assembly`,
      financial_gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      simulated_order_record_id: simulatedOrderRecord.simulated_order_record_id,
      simulation_state_record_id: simulationState.simulation_state_record_id,
      risk_review_event_id: riskReviewEvent.risk_review_event_id,
      operator_action_log_id: operatorActionLog.operator_action_log_id,
      simulated_fill_assumption_id: simulatedFillAssumption.simulated_fill_assumption_id,
      assembly_status: blockingReasons.length === 0 ? "assembled" : "assembled_with_blockers",
      blocking_reasons: blockingReasons,
      evidence_only: true,
      simulation_only: true,
      approval_claim: false,
      performance_claim: false,
      external_access: false,
      execution_path: false,
      credentials_required: false,
      live_route: false,
      automated_action: false
    }),
    engineInput
  };
}

export function runGate2LocalSimulationEngine(
  input: Gate2LocalSimulationEngineInput
): Gate2LocalSimulationEngineResult {
  const simulatedOrderRecord = Gate2SimulatedOrderRecordContractSchema.parse(
    input.simulatedOrderRecord
  );
  const simulationState = Gate2SimulationStateContractSchema.parse(input.simulationState);
  const riskReviewEvent = Gate2RiskReviewEventContractSchema.parse(input.riskReviewEvent);
  const operatorActionLog = Gate2OperatorActionLogContractSchema.parse(input.operatorActionLog);
  const simulatedFillAssumption = Gate2SimulatedFillAssumptionContractSchema.parse(
    input.simulatedFillAssumption
  );

  const blockingReasons = collectGate2LocalSimulationBlockingReasons({
    simulatedOrderRecord,
    simulationState,
    riskReviewEvent,
    operatorActionLog,
    simulatedFillAssumption
  });
  const resultStatus: Gate2LocalSimulationStatus =
    blockingReasons.length === 0 ? "recorded_local_simulation" : "blocked_local_simulation";
  const resultState: Gate2SimulationState =
    resultStatus === "recorded_local_simulation" ? "simulation_recorded" : "risk_blocked";

  return Gate2LocalSimulationEngineResultSchema.parse({
    local_simulation_result_id: `${simulatedOrderRecord.simulated_order_record_id}:local-simulation-result`,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    simulated_order_record_id: simulatedOrderRecord.simulated_order_record_id,
    risk_review_event_id: riskReviewEvent.risk_review_event_id,
    operator_action_log_id: operatorActionLog.operator_action_log_id,
    simulated_fill_assumption_id: simulatedFillAssumption.simulated_fill_assumption_id,
    input_state: simulationState.current_state,
    result_state: resultState,
    result_status: resultStatus,
    deterministic_replay_key: createGate2LocalSimulationReplayKey({
      simulatedOrderRecord,
      simulationState,
      riskReviewEvent,
      operatorActionLog,
      simulatedFillAssumption
    }),
    blocking_reasons: blockingReasons,
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
}

export function buildGate2LocalSimulationOutputArtifact(
  input: Gate2LocalSimulationOutputArtifactInput
): Gate2LocalSimulationOutputArtifact {
  return Gate2LocalSimulationOutputArtifactSchema.parse({
    local_simulation_output_artifact_id: `${input.result.local_simulation_result_id}:artifact`,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    local_simulation_input_assembly_id: input.assembly.local_simulation_input_assembly_id,
    local_simulation_result_id: input.result.local_simulation_result_id,
    result_status: input.result.result_status,
    result_state: input.result.result_state,
    deterministic_replay_key: input.result.deterministic_replay_key,
    blocking_reasons: input.result.blocking_reasons,
    artifact_status:
      input.result.result_status === "recorded_local_simulation"
        ? "local_simulation_recorded"
        : "local_simulation_blocked",
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
}

export function checkGate2LocalSimulationReplayDeterminism(
  input: Gate2LocalSimulationReplayCheckInput
): Gate2LocalSimulationReplayCheck {
  const mismatchReasons: string[] = [];

  if (input.first.deterministic_replay_key !== input.second.deterministic_replay_key) {
    mismatchReasons.push("deterministic replay keys differ");
  }

  if (JSON.stringify(input.first) !== JSON.stringify(input.second)) {
    mismatchReasons.push("local simulation result payloads differ");
  }

  return Gate2LocalSimulationReplayCheckSchema.parse({
    replay_check_id: `${input.first.local_simulation_result_id}:replay-check`,
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    replay_status: mismatchReasons.length === 0 ? "deterministic_match" : "deterministic_mismatch",
    first_result_id: input.first.local_simulation_result_id,
    second_result_id: input.second.local_simulation_result_id,
    first_replay_key: input.first.deterministic_replay_key,
    second_replay_key: input.second.deterministic_replay_key,
    mismatch_reasons: mismatchReasons,
    evidence_only: true,
    approval_claim: false,
    performance_claim: false,
    external_access: false,
    execution_path: false,
    automated_action: false
  });
}

export function createGate2LocalSimulationFailureModeFixtures(
  baseInput: Gate2LocalSimulationEngineInput
): readonly Gate2LocalSimulationFailureModeFixture[] {
  return [
    {
      failure_mode_id: "gate2-local-simulation-failure-risk-review",
      description: "Risk review still blocks local simulation evidence.",
      input: {
        ...baseInput,
        riskReviewEvent: {
          ...baseInput.riskReviewEvent,
          disposition: "blocked",
          blocking_issues: ["Synthetic risk blocker."]
        }
      },
      expected_blocking_reasons: [
        "risk review has not accepted local simulation evidence",
        "risk review still contains blocking issues"
      ]
    },
    {
      failure_mode_id: "gate2-local-simulation-failure-operator-decision",
      description: "Operator chose revision instead of recording local simulation.",
      input: {
        ...baseInput,
        operatorActionLog: {
          ...baseInput.operatorActionLog,
          decision: "revise"
        }
      },
      expected_blocking_reasons: ["operator did not choose record_local_simulation"]
    },
    {
      failure_mode_id: "gate2-local-simulation-failure-record-link",
      description: "State record points to a different simulated order.",
      input: {
        ...baseInput,
        simulationState: {
          ...baseInput.simulationState,
          simulated_order_record_id: "gate2-mismatched-sim-record"
        }
      },
      expected_blocking_reasons: [
        "simulation state is linked to a different simulated order record"
      ]
    }
  ];
}

function collectGate2LocalSimulationBlockingReasons(
  input: Gate2LocalSimulationEngineInput
): string[] {
  const reasons: string[] = [];

  if (input.simulatedOrderRecord.state !== "review_required") {
    reasons.push("simulated order must start from review_required state");
  }

  if (!input.simulationState.allowed_next_states.includes("simulation_recorded")) {
    reasons.push("simulation state does not allow local simulation recording");
  }

  if (input.riskReviewEvent.disposition !== "accepted_for_local_simulation_evidence") {
    reasons.push("risk review has not accepted local simulation evidence");
  }

  if (input.riskReviewEvent.blocking_issues.length > 0) {
    reasons.push("risk review still contains blocking issues");
  }

  if (input.operatorActionLog.decision !== "record_local_simulation") {
    reasons.push("operator did not choose record_local_simulation");
  }

  if (input.simulatedFillAssumption.assumption_status !== "reviewed") {
    reasons.push("simulated fill assumption is not reviewed");
  }

  if (
    input.simulatedOrderRecord.simulated_order_record_id !==
    input.simulationState.simulated_order_record_id
  ) {
    reasons.push("simulation state is linked to a different simulated order record");
  }

  if (
    input.simulatedOrderRecord.simulated_order_record_id !==
    input.riskReviewEvent.simulated_order_record_id
  ) {
    reasons.push("risk review is linked to a different simulated order record");
  }

  if (
    input.simulatedOrderRecord.simulated_order_record_id !==
    input.operatorActionLog.simulated_order_record_id
  ) {
    reasons.push("operator action is linked to a different simulated order record");
  }

  return reasons;
}

function createGate2LocalSimulationReplayKey(input: Gate2LocalSimulationEngineInput): string {
  return [
    input.simulatedOrderRecord.simulated_order_record_id,
    input.simulationState.simulation_state_record_id,
    input.riskReviewEvent.risk_review_event_id,
    input.operatorActionLog.operator_action_log_id,
    input.simulatedFillAssumption.simulated_fill_assumption_id,
    input.simulatedOrderRecord.state,
    input.riskReviewEvent.disposition,
    input.operatorActionLog.decision,
    input.simulatedFillAssumption.assumption_status
  ].join("|");
}
