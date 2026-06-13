import { describe, expect, it } from "vitest";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  StrategyReviewBundleSchema
} from "../../contracts/src/index.js";
import {
  assertCanonicalStrategyDecisionTraceHashes,
  assertProtectedDecisionLoopOrder,
  createImmutableStrategyReviewBundle
} from "../../core/src/index.js";
import {
  listGate0DryRunScenarioKeys,
  parseGate0DryRunScenarioKey,
  selectGate0DryRunScenarioFixture,
  gate0BlockedFrictionDryRunScenarioFixture,
  gate0DryRunScenarioFixture
} from "../src/index.js";

describe("Gate 0 dry-run scenario fixture", () => {
  it("exposes the protected-loop order exactly", () => {
    expect(gate0DryRunScenarioFixture.expected_loop_steps).toEqual(
      STRATEGY_DECISION_TRACE_EVENT_ORDER
    );

    expect(() =>
      assertProtectedDecisionLoopOrder(gate0DryRunScenarioFixture.expected_loop_steps)
    ).not.toThrow();
  });

  it("validates as a full strategy review bundle", () => {
    const bundle = StrategyReviewBundleSchema.parse(gate0DryRunScenarioFixture.bundle);

    expect(bundle.financial_gate).toBe("G0_RESEARCH");
    expect(bundle.strategy_review_bundle_id).toBe("bundle-gate0-dry-run-001");
    expect(bundle.trace.events.map((event) => event.event_type)).toEqual(
      STRATEGY_DECISION_TRACE_EVENT_ORDER
    );
  });

  it("keeps canonical trace hashes valid", () => {
    expect(() =>
      assertCanonicalStrategyDecisionTraceHashes(gate0DryRunScenarioFixture.bundle.trace)
    ).not.toThrow();
  });

  it("freezes through the immutable bundle path", () => {
    const immutableBundle = createImmutableStrategyReviewBundle(gate0DryRunScenarioFixture.bundle);

    expect(Object.isFrozen(immutableBundle)).toBe(true);
    expect(Object.isFrozen(immutableBundle.trace.events[0])).toBe(true);
  });

  it("keeps the scenario in revision-only research scope", () => {
    const bundle = gate0DryRunScenarioFixture.bundle;

    expect(bundle.backtest_result.verdict).toBe("requires_revision");
    expect(bundle.risk_review.verdict).toBe("requires_revision");
    expect(bundle.risk_review.approved).toBe(false);
    expect(bundle.operator_decision.decision).toBe("revise");
    expect(bundle.outcome_log.outcome).toBe("revision_requested");
    expect(bundle.learning_event.risk_limit_change).toBe("none");
    expect(bundle.learning_event.autonomy_change).toBe("none");
  });

  it("is deterministic across repeated reads", () => {
    expect(JSON.stringify(gate0DryRunScenarioFixture)).toBe(
      JSON.stringify(gate0DryRunScenarioFixture)
    );
  });

  it("exposes a deterministic blocked-friction dry-run scenario", () => {
    expect(gate0BlockedFrictionDryRunScenarioFixture.scenario_id).toBe(
      "scenario-gate0-dry-run-blocked-001"
    );
    expect(gate0BlockedFrictionDryRunScenarioFixture.expected_loop_steps).toEqual(
      [...STRATEGY_DECISION_TRACE_EVENT_ORDER].reverse()
    );
    expect(gate0BlockedFrictionDryRunScenarioFixture.bundle.financial_gate).toBe("G0_RESEARCH");
    expect(gate0BlockedFrictionDryRunScenarioFixture.bundle.risk_review.approved).toBe(false);
    expect(gate0BlockedFrictionDryRunScenarioFixture.bundle.learning_event.risk_limit_change).toBe(
      "none"
    );
    expect(gate0BlockedFrictionDryRunScenarioFixture.bundle.learning_event.autonomy_change).toBe(
      "none"
    );
  });

  it("selects dry-run scenarios by static local key", () => {
    expect(listGate0DryRunScenarioKeys()).toEqual(["clear", "friction"]);
    expect(selectGate0DryRunScenarioFixture().scenario_id).toBe("scenario-gate0-dry-run-001");
    expect(selectGate0DryRunScenarioFixture("clear").scenario_id).toBe(
      "scenario-gate0-dry-run-001"
    );
    expect(selectGate0DryRunScenarioFixture("friction").scenario_id).toBe(
      "scenario-gate0-dry-run-blocked-001"
    );
    expect(parseGate0DryRunScenarioKey("clear")).toBe("clear");
    expect(parseGate0DryRunScenarioKey("friction")).toBe("friction");
    expect(() => parseGate0DryRunScenarioKey("other")).toThrow(
      "Unknown Gate 0 dry-run scenario key"
    );
  });
});
