import { describe, expect, it } from "vitest";
import { gate0DryRunScenarioFixture } from "../../fixtures/src/index.js";
import {
  createGate0DryRunOperatorChecklist,
  type Gate0DryRunOperatorChecklistInput
} from "../src/index.js";

describe("Gate 0 dry-run operator checklist", () => {
  it("creates a complete checklist for the accepted dry-run fixture", () => {
    const checklist = createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture);

    expect(checklist).toMatchObject({
      scenario_id: "scenario-gate0-dry-run-001",
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      bundle_id: "bundle-gate0-dry-run-001",
      checklist_status: "complete",
      item_count: 6,
      complete_count: 6,
      blocked_count: 0
    });
    expect(checklist.items.map((item) => item.item_id)).toEqual([
      "gate_scope_check",
      "loop_order_check",
      "trace_hash_check",
      "risk_revision_check",
      "operator_outcome_check",
      "learning_boundary_check"
    ]);
  });

  it("flags mismatched expected loop order", () => {
    const checklist = createGate0DryRunOperatorChecklist({
      ...gate0DryRunScenarioFixture,
      expected_loop_steps: [...gate0DryRunScenarioFixture.expected_loop_steps].reverse()
    });

    expect(checklist.checklist_status).toBe("blocked");
    expect(checklist.items).toContainEqual({
      item_id: "loop_order_check",
      status: "blocked",
      evidence: "8 trace events"
    });
  });

  it("flags trace hash mismatch without throwing", () => {
    const tamperedEvent = gate0DryRunScenarioFixture.bundle.trace.events[7];

    if (!tamperedEvent) {
      throw new Error("fixture must include a final trace event");
    }

    const checklist = createGate0DryRunOperatorChecklist({
      ...gate0DryRunScenarioFixture,
      bundle: {
        ...gate0DryRunScenarioFixture.bundle,
        trace: {
          ...gate0DryRunScenarioFixture.bundle.trace,
          events: gate0DryRunScenarioFixture.bundle.trace.events.map((event, index) =>
            index === 7
              ? {
                  ...tamperedEvent,
                  event_hash: "0".repeat(64)
                }
              : event
          )
        }
      }
    });

    expect(checklist.checklist_status).toBe("blocked");
    expect(checklist.items).toContainEqual({
      item_id: "trace_hash_check",
      status: "blocked",
      evidence: "8 trace hashes checked"
    });
  });

  it("keeps checklist output redacted to statuses and counts", () => {
    const checklistText = JSON.stringify(
      createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
    );

    expect(checklistText).not.toContain("hypothesis");
    expect(checklistText).not.toContain("trade_list");
    expect(checklistText).not.toContain("metric_report_id");
    expect(checklistText).not.toContain("risk_review_id");
    expect(checklistText).not.toContain("trace_event_id");
  });

  it("rejects invalid bundle input before checklist creation", () => {
    const invalidInput = {
      ...gate0DryRunScenarioFixture,
      bundle: {
        ...gate0DryRunScenarioFixture.bundle,
        financial_gate: "G1"
      }
    };

    expect(() =>
      createGate0DryRunOperatorChecklist(invalidInput as Gate0DryRunOperatorChecklistInput)
    ).toThrow();
  });
});
