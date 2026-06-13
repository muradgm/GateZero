import { describe, expect, it } from "vitest";
import { gate0DryRunScenarioFixture } from "../../fixtures/src/index.js";
import {
  Gate0DryRunIterationRecommendationSchema,
  createGate0DryRunFrictionReport,
  createGate0DryRunIterationRecommendation,
  createGate0DryRunOperatorChecklist,
  summarizeGate0DryRunOperatorChecklist,
  type Gate0DryRunFrictionReport
} from "../src/index.js";

describe("Gate 0 dry-run iteration recommendation", () => {
  it("creates a no-iteration recommendation from a clear friction report", () => {
    const recommendation = createGate0DryRunIterationRecommendation(
      createGate0DryRunFrictionReport(
        summarizeGate0DryRunOperatorChecklist(
          createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
        )
      )
    );

    expect(recommendation).toEqual({
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
    });
  });

  it("maps friction categories to static local review actions", () => {
    const checklist = createGate0DryRunOperatorChecklist({
      ...gate0DryRunScenarioFixture,
      expected_loop_steps: [...gate0DryRunScenarioFixture.expected_loop_steps].reverse()
    });
    const recommendation = createGate0DryRunIterationRecommendation(
      createGate0DryRunFrictionReport(summarizeGate0DryRunOperatorChecklist(checklist))
    );

    expect(recommendation.recommendation_status).toBe("iteration_required");
    expect(recommendation.blocked_count).toBe(1);
    expect(recommendation.blocked_item_ids).toEqual(["loop_order_check"]);
    expect(recommendation.actions).toEqual([
      {
        item_id: "loop_order_check",
        category: "loop_integrity",
        action: "rebuild_expected_loop_order"
      }
    ]);
  });

  it("keeps recommendation output redacted to categories and action labels", () => {
    const recommendationText = JSON.stringify(
      createGate0DryRunIterationRecommendation(
        createGate0DryRunFrictionReport(
          summarizeGate0DryRunOperatorChecklist(
            createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
          )
        )
      )
    );

    expect(recommendationText).not.toContain("hypothesis");
    expect(recommendationText).not.toContain("trade_list");
    expect(recommendationText).not.toContain("metric_report_id");
    expect(recommendationText).not.toContain("risk_review_id");
    expect(recommendationText).not.toContain("trace_event_id");
    expect(recommendationText).not.toContain("evidence");
    expect(recommendationText).not.toContain("advice");
    expect(recommendationText).not.toContain("readiness");
  });

  it("rejects invalid friction reports before recommendation creation", () => {
    const invalidReport = {
      ...createGate0DryRunFrictionReport(
        summarizeGate0DryRunOperatorChecklist(
          createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
        )
      ),
      blocked_count: 99
    };

    expect(() =>
      createGate0DryRunIterationRecommendation(invalidReport as Gate0DryRunFrictionReport)
    ).toThrow("blocked_count must match blocked item IDs");
  });

  it("enforces recommendation count invariants", () => {
    const recommendation = createGate0DryRunIterationRecommendation(
      createGate0DryRunFrictionReport(
        summarizeGate0DryRunOperatorChecklist(
          createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
        )
      )
    );

    expect(() =>
      Gate0DryRunIterationRecommendationSchema.parse({
        ...recommendation,
        action_count: 2
      })
    ).toThrow("action_count must match actions length");
  });
});
