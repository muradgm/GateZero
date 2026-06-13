import { describe, expect, it } from "vitest";
import {
  gate0BlockedFrictionDryRunScenarioFixture,
  gate0DryRunScenarioFixture
} from "../../fixtures/src/index.js";
import { Gate0DryRunInspectResultSchema, createGate0DryRunInspectResult } from "../src/index.js";

describe("Gate 0 dry-run inspect result", () => {
  it("assembles a redacted local inspect result from the accepted dry-run fixture", () => {
    const result = createGate0DryRunInspectResult(gate0DryRunScenarioFixture);

    expect(result).toEqual({
      inspection_id: "scenario-gate0-dry-run-001:gate0-dry-run-inspect",
      scenario_id: "scenario-gate0-dry-run-001",
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      bundle_id: "bundle-gate0-dry-run-001",
      inspect_status: "clear",
      checklist_summary: {
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
      },
      friction_report: {
        scenario_id: "scenario-gate0-dry-run-001",
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        bundle_id: "bundle-gate0-dry-run-001",
        report_status: "clear",
        item_count: 6,
        blocked_count: 0,
        friction_category_count: 0,
        blocked_item_ids: [],
        friction_categories: []
      },
      iteration_recommendation: {
        scenario_id: "scenario-gate0-dry-run-001",
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        bundle_id: "bundle-gate0-dry-run-001",
        recommendation_status: "no_iteration_required",
        blocked_count: 0,
        action_count: 1,
        blocked_item_ids: [],
        friction_categories: [],
        actions: [
          {
            item_id: "gate_scope_check",
            category: "gate_scope",
            action: "no_local_action"
          }
        ]
      }
    });
  });

  it("keeps the inspect result redacted to summaries, counts, categories, and actions", () => {
    const resultText = JSON.stringify(createGate0DryRunInspectResult(gate0DryRunScenarioFixture));

    expect(resultText).not.toContain("hypothesis");
    expect(resultText).not.toContain("trade_list");
    expect(resultText).not.toContain("metric_report_id");
    expect(resultText).not.toContain("risk_review_id");
    expect(resultText).not.toContain("trace_event_id");
    expect(resultText).not.toContain("evidence");
    expect(resultText).not.toContain("advice");
    expect(resultText).not.toContain("readiness");
  });

  it("reports friction when the expected loop order is locally mismatched", () => {
    const result = createGate0DryRunInspectResult(gate0BlockedFrictionDryRunScenarioFixture);

    expect(result.scenario_id).toBe("scenario-gate0-dry-run-blocked-001");
    expect(result.inspect_status).toBe("friction_found");
    expect(result.checklist_summary.blocked_item_ids).toEqual(["loop_order_check"]);
    expect(result.friction_report.friction_categories).toEqual([
      {
        item_id: "loop_order_check",
        category: "loop_integrity"
      }
    ]);
    expect(result.iteration_recommendation.actions).toEqual([
      {
        item_id: "loop_order_check",
        category: "loop_integrity",
        action: "rebuild_expected_loop_order"
      }
    ]);
  });

  it("enforces inspect result invariants", () => {
    const result = createGate0DryRunInspectResult(gate0DryRunScenarioFixture);

    expect(() =>
      Gate0DryRunInspectResultSchema.parse({
        ...result,
        scope: "later_phase"
      })
    ).toThrow("Invalid literal value");
  });
});
