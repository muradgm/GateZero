import { describe, expect, it } from "vitest";
import { Gate2ReadOnlyIntelligenceBriefSchema } from "../src/index.js";
import { gate2ReadOnlyIntelligenceBriefFixture } from "../../fixtures/src/index.js";

describe("Gate 2 read-only intelligence brief contracts", () => {
  it("accepts the bounded intelligence brief", () => {
    expect(
      Gate2ReadOnlyIntelligenceBriefSchema.parse(gate2ReadOnlyIntelligenceBriefFixture)
    ).toEqual(gate2ReadOnlyIntelligenceBriefFixture);
  });

  it("rejects execution authority", () => {
    expect(
      Gate2ReadOnlyIntelligenceBriefSchema.safeParse({
        ...gate2ReadOnlyIntelligenceBriefFixture,
        execution_path: true
      }).success
    ).toBe(false);
  });

  it("rejects a mismatched research case", () => {
    expect(
      Gate2ReadOnlyIntelligenceBriefSchema.safeParse({
        ...gate2ReadOnlyIntelligenceBriefFixture,
        linked_research_case_id: "different-case"
      }).success
    ).toBe(false);
  });

  it("rejects a brief without all three scenario directions", () => {
    expect(
      Gate2ReadOnlyIntelligenceBriefSchema.safeParse({
        ...gate2ReadOnlyIntelligenceBriefFixture,
        scenario_set: {
          ...gate2ReadOnlyIntelligenceBriefFixture.scenario_set,
          scenarios: gate2ReadOnlyIntelligenceBriefFixture.scenario_set.scenarios.slice(0, 2)
        }
      }).success
    ).toBe(false);
  });

  it("rejects duplicate source records", () => {
    expect(
      Gate2ReadOnlyIntelligenceBriefSchema.safeParse({
        ...gate2ReadOnlyIntelligenceBriefFixture,
        source_inventory: [
          ...gate2ReadOnlyIntelligenceBriefFixture.source_inventory,
          gate2ReadOnlyIntelligenceBriefFixture.source_inventory[0]
        ]
      }).success
    ).toBe(false);
  });
});
