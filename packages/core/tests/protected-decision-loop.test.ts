import { describe, expect, it } from "vitest";
import {
  assertProtectedDecisionLoopOrder,
  getProtectedDecisionLoopSteps,
  PROTECTED_DECISION_LOOP_STEPS
} from "../src/index.js";

describe("protected decision loop", () => {
  it("preserves the required Gate 0 review order", () => {
    expect(getProtectedDecisionLoopSteps()).toEqual(PROTECTED_DECISION_LOOP_STEPS);
    expect(() => assertProtectedDecisionLoopOrder(PROTECTED_DECISION_LOOP_STEPS)).not.toThrow();
  });

  it("blocks reordered review steps", () => {
    expect(() =>
      assertProtectedDecisionLoopOrder([
        "strategy_idea",
        "backtest",
        "data_snapshot",
        "metric_report",
        "risk_review",
        "operator_decision",
        "outcome_logged",
        "learning_event"
      ])
    ).toThrow();
  });
});
