import { describe, expect, it } from "vitest";
import { Gate2StrategySimulatorHandoffContractSchema } from "../src/index.js";
import { gate2StrategySimulatorHandoffFixture } from "../../fixtures/src/index.js";

describe("Gate 2 strategy-to-simulator handoff", () => {
  it("links one reviewed research case to local simulator evidence", () => {
    const handoff = Gate2StrategySimulatorHandoffContractSchema.parse(
      gate2StrategySimulatorHandoffFixture
    );

    expect(handoff.linked_research_case_id).toBe("gate2-research-case-fixture-001");
    expect(handoff.scenario_keys).toContain("recorded");
    expect(handoff.scenario_keys).toContain("risk_blocked");
    expect(handoff.read_only).toBe(true);
    expect(handoff.operator_required).toBe(true);
  });

  it("rejects authority and route expansion", () => {
    for (const mutation of [
      { local_only: false },
      { read_only: false },
      { operator_required: false },
      { automated_action: true },
      { action_route_created: true },
      { external_access: true },
      { execution_path: true }
    ]) {
      expect(() =>
        Gate2StrategySimulatorHandoffContractSchema.parse({
          ...gate2StrategySimulatorHandoffFixture,
          ...mutation
        })
      ).toThrow();
    }
  });

  it("rejects remote provenance", () => {
    expect(() =>
      Gate2StrategySimulatorHandoffContractSchema.parse({
        ...gate2StrategySimulatorHandoffFixture,
        provenance_refs: ["https://example.invalid/evidence"]
      })
    ).toThrow();
  });

  it("requires clear and risk-blocked comparison evidence", () => {
    expect(() =>
      Gate2StrategySimulatorHandoffContractSchema.parse({
        ...gate2StrategySimulatorHandoffFixture,
        scenario_keys: ["candidate_blocked", "state_mismatch"]
      })
    ).toThrow();
  });

  it("rejects duplicate scenario references", () => {
    expect(() =>
      Gate2StrategySimulatorHandoffContractSchema.parse({
        ...gate2StrategySimulatorHandoffFixture,
        scenario_keys: ["recorded", "risk_blocked", "recorded"]
      })
    ).toThrow();
  });
});
