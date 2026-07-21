import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildCheckedInLocalCaseCatalog } from "../../../scripts/build-local-case-catalog.js";
import { runInspectLocalCasesCli } from "../../../scripts/inspect-local-cases-output.js";
import { renderLocalCaseCatalog } from "../../../scripts/generate-local-case-catalog.js";

describe("Gate 2 checked-in local case catalog", () => {
  it("builds the checked-in fixture deterministically", () => {
    expect(buildCheckedInLocalCaseCatalog()).toMatchObject({
      local_only: true,
      read_only: true,
      operator_review_required: true,
      action_route_created: false,
      items: [
        { case_id: "gate2-research-case-fixture-003", status: "review_required" },
        { case_id: "gate2-research-case-fixture-004", status: "blocked" }
      ]
    });
  });

  it("keeps generated catalog data fresh", async () => {
    const actual = readFileSync(
      path.join(process.cwd(), "apps/web/src/research-case-catalog.json"),
      "utf8"
    );
    expect(actual).toBe(await renderLocalCaseCatalog());
  });

  it("lists local cases without mutation controls", () => {
    const result = runInspectLocalCasesCli([]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("gate2-research-case-fixture-003");
    expect(result.stdout).not.toMatch(/execute|broker|credential/i);
  });

  it("shows one local case detail", () => {
    const result = runInspectLocalCasesCli(["--case", "gate2-research-case-fixture-003"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("ops/runtime/reviews/TRD-676_RISK_REVIEW.md");
  });

  it("handles invalid input without a stack trace", () => {
    const result = runInspectLocalCasesCli(["--case", "missing"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("case_not_found");
    expect(result.stderr).not.toContain("at ");
  });

  it("renders catalog and source drilldown in the workspace", () => {
    const main = readFileSync(
      path.join(process.cwd(), "apps/web/src/simulator-workspace.js"),
      "utf8"
    );
    expect(main).toContain("Local case catalog");
    expect(main).toContain("Checked-in sources");
    expect(main).not.toMatch(/<form|<input|<textarea|upload/i);
  });
});
