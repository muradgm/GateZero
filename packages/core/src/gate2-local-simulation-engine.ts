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

export interface Gate2LocalSimulationEngineInput {
  readonly simulatedOrderRecord: Gate2SimulatedOrderRecordContract;
  readonly simulationState: Gate2SimulationStateContract;
  readonly riskReviewEvent: Gate2RiskReviewEventContract;
  readonly operatorActionLog: Gate2OperatorActionLogContract;
  readonly simulatedFillAssumption: Gate2SimulatedFillAssumptionContract;
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
