import { describe, expect, it } from "vitest";
import {
  checkGate0GithubActionsRuntime,
  renderGate0GithubActionsRuntimeResult
} from "../../../scripts/check-gate0-github-actions-runtime.js";

const baseWorkflow = [
  "name: Gate 0 Verification",
  "permissions:",
  "  contents: read",
  "steps:",
  "  - name: Checkout",
  "    uses: actions/checkout@v6",
  "  - name: Setup Node",
  "    uses: actions/setup-node@v6",
  "    with:",
  '      node-version: "22"',
  "      cache: pnpm",
  "  - name: Verify Gate 0",
  "    run: pnpm verify:gate0"
].join("\n");

describe("Gate 0 GitHub Actions runtime check", () => {
  it("passes when the workflow uses Node 24-compatible action majors", () => {
    const result = checkGate0GithubActionsRuntime({ workflow: baseWorkflow });

    expect(result.ok).toBe(true);
    expect(renderGate0GithubActionsRuntimeResult(result)).toBe(
      "Gate 0 GitHub Actions runtime check passed."
    );
  });

  it("fails when checkout remains on v4", () => {
    const result = checkGate0GithubActionsRuntime({
      workflow: baseWorkflow.replace("actions/checkout@v6", "actions/checkout@v4")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Checkout action is not on v6.");
    expect(result.findings).toContain("Deprecated checkout action v4 is still present.");
  });

  it("fails when setup-node remains on v4", () => {
    const result = checkGate0GithubActionsRuntime({
      workflow: baseWorkflow.replace("actions/setup-node@v6", "actions/setup-node@v4")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Setup Node action is not on v6.");
    expect(result.findings).toContain("Deprecated setup-node action v4 is still present.");
  });

  it("fails when the legacy runtime override remains", () => {
    const result = checkGate0GithubActionsRuntime({
      workflow: `env:\n  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"\n${baseWorkflow}`
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Legacy Node.js action-runtime override is still present.");
  });
});
