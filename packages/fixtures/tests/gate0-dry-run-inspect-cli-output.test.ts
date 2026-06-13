import { describe, expect, it } from "vitest";
import { runInspectGate0DryRunCli } from "../../../scripts/inspect-gate0-dry-run-output.js";

describe("Gate 0 dry-run inspect CLI output", () => {
  it("keeps help output stable and boundary-focused", () => {
    const result = runInspectGate0DryRunCli(["--help"]);

    expect(result).toEqual({
      exitCode: 0,
      stdout: [
        "Gate 0 dry-run inspect",
        "",
        "Usage:",
        "  pnpm inspect:gate0-dry-run",
        "  pnpm inspect:gate0-dry-run -- --scenario <clear|friction>",
        "",
        "Scenario keys:",
        "  - clear",
        "  - friction",
        "",
        "Output:",
        "  Redacted JSON with checklist summary, friction report, and iteration recommendation.",
        "",
        "Boundary:",
        "  financial_gate: G0_RESEARCH",
        "  scope: research_only",
        "  local_only: true"
      ].join("\n"),
      stderr: ""
    });
  });

  it("keeps default clear output stable at the top level", () => {
    const result = runInspectGate0DryRunCli([]);
    const output = JSON.parse(result.stdout) as Record<string, unknown>;

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(Object.keys(output)).toEqual([
      "inspection_id",
      "scenario_id",
      "financial_gate",
      "scope",
      "bundle_id",
      "inspect_status",
      "checklist_summary",
      "friction_report",
      "iteration_recommendation"
    ]);
    expect(output).toMatchObject({
      inspection_id: "scenario-gate0-dry-run-001:gate0-dry-run-inspect",
      scenario_id: "scenario-gate0-dry-run-001",
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      bundle_id: "bundle-gate0-dry-run-001",
      inspect_status: "clear"
    });
  });

  it("keeps friction output stable at the local action boundary", () => {
    const result = runInspectGate0DryRunCli(["--scenario", "friction"]);
    const output = JSON.parse(result.stdout) as {
      readonly inspect_status: string;
      readonly checklist_summary: { readonly blocked_item_ids: readonly string[] };
      readonly friction_report: {
        readonly blocked_count: number;
        readonly friction_categories: readonly unknown[];
      };
      readonly iteration_recommendation: { readonly actions: readonly unknown[] };
    };

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(output.inspect_status).toBe("friction_found");
    expect(output.checklist_summary.blocked_item_ids).toEqual(["loop_order_check"]);
    expect(output.friction_report.blocked_count).toBe(1);
    expect(output.friction_report.friction_categories).toEqual([
      {
        item_id: "loop_order_check",
        category: "loop_integrity"
      }
    ]);
    expect(output.iteration_recommendation.actions).toEqual([
      {
        item_id: "loop_order_check",
        category: "loop_integrity",
        action: "rebuild_expected_loop_order"
      }
    ]);
  });

  it("keeps invalid scenario output bounded", () => {
    const result = runInspectGate0DryRunCli(["--scenario", "other"]);

    expect(result).toEqual({
      exitCode: 1,
      stdout: "",
      stderr: [
        "Gate 0 dry-run inspect error: Unknown Gate 0 dry-run scenario key: other",
        "Usage: pnpm inspect:gate0-dry-run -- --scenario <clear|friction>"
      ].join("\n")
    });
    expect(result.stderr).not.toContain("at ");
  });

  it("keeps inspect output redacted", () => {
    const combinedOutput = [
      runInspectGate0DryRunCli([]).stdout,
      runInspectGate0DryRunCli(["--scenario", "friction"]).stdout
    ].join("\n");

    expect(combinedOutput).not.toContain("hypothesis");
    expect(combinedOutput).not.toContain("trade_list");
    expect(combinedOutput).not.toContain("metric_report_id");
    expect(combinedOutput).not.toContain("risk_review_id");
    expect(combinedOutput).not.toContain("trace_event_id");
    expect(combinedOutput).not.toContain("evidence");
    expect(combinedOutput).not.toContain("advice");
    expect(combinedOutput).not.toContain("readiness");
  });
});
