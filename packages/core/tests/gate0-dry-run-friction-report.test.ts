import { describe, expect, it } from "vitest";
import { gate0DryRunScenarioFixture } from "../../fixtures/src/index.js";
import {
  Gate0DryRunFrictionReportSchema,
  createGate0DryRunFrictionReport,
  createGate0DryRunOperatorChecklist,
  summarizeGate0DryRunOperatorChecklist,
  type Gate0DryRunChecklistSummary
} from "../src/index.js";

describe("Gate 0 dry-run friction report", () => {
  it("creates a clear report from a complete checklist summary", () => {
    const report = createGate0DryRunFrictionReport(
      summarizeGate0DryRunOperatorChecklist(
        createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
      )
    );

    expect(report).toEqual({
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
    });
  });

  it("maps blocked item IDs to static friction categories", () => {
    const checklist = createGate0DryRunOperatorChecklist({
      ...gate0DryRunScenarioFixture,
      expected_loop_steps: [...gate0DryRunScenarioFixture.expected_loop_steps].reverse()
    });
    const report = createGate0DryRunFrictionReport(
      summarizeGate0DryRunOperatorChecklist(checklist)
    );

    expect(report.report_status).toBe("friction_found");
    expect(report.blocked_count).toBe(1);
    expect(report.blocked_item_ids).toEqual(["loop_order_check"]);
    expect(report.friction_categories).toEqual([
      {
        item_id: "loop_order_check",
        category: "loop_integrity"
      }
    ]);
  });

  it("keeps report output redacted to counts and static categories", () => {
    const reportText = JSON.stringify(
      createGate0DryRunFrictionReport(
        summarizeGate0DryRunOperatorChecklist(
          createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
        )
      )
    );

    expect(reportText).not.toContain("hypothesis");
    expect(reportText).not.toContain("trade_list");
    expect(reportText).not.toContain("metric_report_id");
    expect(reportText).not.toContain("risk_review_id");
    expect(reportText).not.toContain("trace_event_id");
    expect(reportText).not.toContain("evidence");
    expect(reportText).not.toContain("advice");
    expect(reportText).not.toContain("readiness");
  });

  it("rejects invalid summaries before report creation", () => {
    const invalidSummary = {
      ...summarizeGate0DryRunOperatorChecklist(
        createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
      ),
      item_count: 99
    };

    expect(() =>
      createGate0DryRunFrictionReport(invalidSummary as Gate0DryRunChecklistSummary)
    ).toThrow("item_count must match item refs length");
  });

  it("enforces report count invariants", () => {
    const report = createGate0DryRunFrictionReport(
      summarizeGate0DryRunOperatorChecklist(
        createGate0DryRunOperatorChecklist(gate0DryRunScenarioFixture)
      )
    );

    expect(() =>
      Gate0DryRunFrictionReportSchema.parse({
        ...report,
        friction_category_count: 1
      })
    ).toThrow("friction_category_count must match friction categories");
  });
});
