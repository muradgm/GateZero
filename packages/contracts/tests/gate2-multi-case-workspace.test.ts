import { describe, expect, it } from "vitest";
import {
  Gate2MultiCaseWorkspaceContractSchema,
  Gate2ResearchCaseInventoryItemContractSchema
} from "../src/index.js";
import {
  gate2MultiCaseWorkspaceFixture,
  gate2ResearchCaseInventoryFixtures
} from "../../fixtures/src/index.js";

describe("Gate 2 multi-case workspace", () => {
  it("validates one complete and one blocked local case", () => {
    const cases = gate2ResearchCaseInventoryFixtures.map((item) =>
      Gate2ResearchCaseInventoryItemContractSchema.parse(item)
    );

    expect(cases).toHaveLength(2);
    expect(cases[0]).toMatchObject({
      completeness_status: "complete",
      freshness_status: "fresh",
      operator_review_status: "review_recorded"
    });
    expect(cases[1]).toMatchObject({
      completeness_status: "blocked",
      freshness_status: "stale",
      operator_review_status: "blocked"
    });
  });

  it("requires missing evidence on blocked cases", () => {
    expect(() =>
      Gate2ResearchCaseInventoryItemContractSchema.parse({
        ...gate2ResearchCaseInventoryFixtures[1],
        missing_evidence: []
      })
    ).toThrow();
  });

  it("rejects missing evidence on complete cases", () => {
    expect(() =>
      Gate2ResearchCaseInventoryItemContractSchema.parse({
        ...gate2ResearchCaseInventoryFixtures[0],
        missing_evidence: ["metric_report"]
      })
    ).toThrow();
  });

  it("keeps stale cases blocked from review recording", () => {
    expect(() =>
      Gate2ResearchCaseInventoryItemContractSchema.parse({
        ...gate2ResearchCaseInventoryFixtures[1],
        operator_review_status: "review_recorded"
      })
    ).toThrow();
  });

  it("rejects remote provenance and action authority", () => {
    for (const mutation of [
      { provenance_refs: ["https://example.invalid/case"] },
      { read_only: false },
      { operator_required: false },
      { external_access: true },
      { execution_path: true }
    ]) {
      expect(() =>
        Gate2ResearchCaseInventoryItemContractSchema.parse({
          ...gate2ResearchCaseInventoryFixtures[0],
          ...mutation
        })
      ).toThrow();
    }
  });

  it("requires a unique inventory and a valid default case", () => {
    expect(Gate2MultiCaseWorkspaceContractSchema.parse(gate2MultiCaseWorkspaceFixture)).toEqual(
      gate2MultiCaseWorkspaceFixture
    );

    for (const mutation of [
      {
        case_inventory_item_ids: [
          "gate2-case-inventory-fixture-001",
          "gate2-case-inventory-fixture-001"
        ]
      },
      { default_case_inventory_item_id: "gate2-case-inventory-fixture-999" },
      { local_only: false },
      { read_only: false },
      { action_route_created: true }
    ]) {
      expect(() =>
        Gate2MultiCaseWorkspaceContractSchema.parse({
          ...gate2MultiCaseWorkspaceFixture,
          ...mutation
        })
      ).toThrow();
    }
  });
});
