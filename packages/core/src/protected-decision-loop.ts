import { PhaseBlockedError } from "../../contracts/src/errors.js";

export const PROTECTED_DECISION_LOOP_STEPS = [
  "strategy_idea",
  "data_snapshot",
  "backtest",
  "metric_report",
  "risk_review",
  "operator_decision",
  "outcome_logged",
  "learning_event"
] as const;

export type ProtectedDecisionLoopStep = (typeof PROTECTED_DECISION_LOOP_STEPS)[number];

export function assertProtectedDecisionLoopOrder(steps: readonly string[]): void {
  const expected = PROTECTED_DECISION_LOOP_STEPS;

  if (steps.length !== expected.length) {
    throw new PhaseBlockedError("protected decision loop must include every required step");
  }

  expected.forEach((expectedStep, index) => {
    if (steps[index] !== expectedStep) {
      throw new PhaseBlockedError(
        `protected decision loop step ${index + 1} must be ${expectedStep}`
      );
    }
  });
}

export function getProtectedDecisionLoopSteps(): readonly ProtectedDecisionLoopStep[] {
  return PROTECTED_DECISION_LOOP_STEPS;
}
