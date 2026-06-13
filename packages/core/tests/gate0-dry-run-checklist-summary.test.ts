import { describe, expect, it } from "vitest";
import { gate0DryRunScenarioFixture } from "../../fixtures/src/index.js";
import {
  Gate0DryRunChecklistSummarySchema,
  createGate0DryRunOperatorChecklist,
  summarizeGate0DryRunOperatorChecklist,
  type Gate0DryRunOperatorChecklist
} from "../src/index.js";

describe("Gate 0 dry-run checklist summary", () => {
  it("summarizes a complete dry-run checklist", () => {
    const checklist = createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture);
    const summary = summarizeGate0DryRunOperatorChecklist(checklist);

    expect(summary).toEqual({
      scenario_id: "scenario-gate0-dry-run-001",
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      bundle_id: "bundle-gate0-dry-run-001",
      checklist_status: "complete",
      item_count: 6,
      complete_count: 6,
      blocked_count: 0,
      blocked_item_ids: [],
      item_refs: [
        { item_id: "gate_scope_check", status: "complete" },
        { item_id: "loop_order_check", status: "complete" },
        { item_id: "trace_hash_check", status: "complete" },
        { item_id: "risk_revision_check", status: "complete" },
        { item_id: "operator_outcome_check", status: "complete" },
        { item_id: "learning_boundary_check", status: "complete" }
      ]
    });
  });

  it("summarizes blocked checklist item IDs", () => {
    const checklist = createGate0DryRunOperatorChecklist({
      ...gate0DryRunScenarioFixture,
      expected_loop_steps: [...gate0DryRunScenarioFixture.expected_loop_steps].reverse()
    });
    const summary = summarizeGate0DryRunOperatorChecklist(checklist);

    expect(summary.checklist_status).toBe("blocked");
    expect(summary.blocked_count).toBe(1);
    expect(summary.blocked_item_ids).toEqual(["loop_order_check"]);
    expect(summary.item_refs).toContainEqual({
      item_id: "loop_order_check",
      status: "blocked"
    });
  });

  it("keeps summary output redacted to status refs and counts", () => {
    const summaryText = JSON.stringify(
      summarizeGate0DryRunOperatorChecklist(
        createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
      )
    );

    expect(summaryText).not.toContain("hypothesis");
    expect(summaryText).not.toContain("trade_list");
    expect(summaryText).not.toContain("metric_report_id");
    expect(summaryText).not.toContain("risk_review_id");
    expect(summaryText).not.toContain("trace_event_id");
    expect(summaryText).not.toContain("evidence");
  });

  it("rejects invalid checklists before summary creation", () => {
    const invalidChecklist = {
      ...createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture),
      item_count: 99
    };

    expect(() =>
      summarizeGate0DryRunOperatorChecklist(invalidChecklist as Gate0DryRunOperatorChecklist)
    ).toThrow("item_count must match items length");
  });

  it("enforces summary count invariants", () => {
    const checklist = createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture);
    const summary = {
      ...summarizeGate0DryRunOperatorChecklist(checklist),
      blocked_item_ids: ["loop_order_check"]
    };

    expect(() => Gate0DryRunChecklistSummarySchema.parse(summary)).toThrow(
      "blocked_item_ids length must match blocked_count"
    );
  });
});
