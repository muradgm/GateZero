import { describe, expect, it } from "vitest";
import {
  checkGate0CommandCenterRenderContract,
  renderGate0CommandCenterRenderContractResult
} from "../../../scripts/check-gate0-command-center-render-contract.js";

const baseInput = {
  data: 'gate: "G2_PAPER_TRADING", scope: "paper_simulation_planning_only", docGroups: [], limitationItems: [], riskItems: [], workflowItems: []',
  html: '<a class="skip-link" href="#main">Skip</a><div id="app"></div>',
  main: 'main class="workspace" id="main" data-section updateActiveNavigation focusHashTarget renderEmptyState preservedMarketWorkspace market-source-groups aria-current data-label="Area" data.docGroups group.items.length id="limitations" id="risk" id="workflow"',
  styles:
    "td::before { content: attr(data-label); } [id]:focus-visible {} .market-source-groups {} .doc-group { display: grid; } .doc-group-heading {} .insight-list {} .workflow-list {}"
};

describe("Gate 0 command center render contract", () => {
  it("accepts the required static render affordances", () => {
    const result = checkGate0CommandCenterRenderContract(baseInput);

    expect(result.ok).toBe(true);
    expect(renderGate0CommandCenterRenderContractResult(result)).toBe(
      "Gate 0 command center render contract passed."
    );
  });

  it("rejects missing mobile evidence labels", () => {
    const result = checkGate0CommandCenterRenderContract({
      ...baseInput,
      main: baseInput.main.replace('data-label="Area"', "")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Missing mobile table labels.");
  });

  it("rejects missing grouped source-link rendering", () => {
    const result = checkGate0CommandCenterRenderContract({
      ...baseInput,
      main: baseInput.main.replace("data.docGroups", "")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Missing grouped source links.");
  });

  it("rejects missing hash-aware navigation state", () => {
    const result = checkGate0CommandCenterRenderContract({
      ...baseInput,
      main: baseInput.main.replace("data-section updateActiveNavigation", "")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Missing hash-aware navigation markers.");
    expect(result.findings).toContain("Missing active navigation updater.");
  });

  it("rejects missing workspace empty states and runtime preservation", () => {
    const result = checkGate0CommandCenterRenderContract({
      ...baseInput,
      main: baseInput.main.replace("renderEmptyState preservedMarketWorkspace", "")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Missing neutral workspace empty states.");
    expect(result.findings).toContain("Missing market workspace runtime preservation.");
  });

  it("rejects blocked command-center action copy", () => {
    const blockedCopy = ["connect", "bro", "ker"].join(" ");
    const result = checkGate0CommandCenterRenderContract({
      ...baseInput,
      data: `${baseInput.data} ${blockedCopy}`
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(`Blocked command-center copy found: ${blockedCopy}`);
  });

  it("rejects blocked command-center action copy outside app data", () => {
    const result = checkGate0CommandCenterRenderContract({
      ...baseInput,
      main: `${baseInput.main} generate buy`
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Blocked command-center copy found: generate buy");
  });

  it("rejects credential, execution, readiness, and claim copy", () => {
    for (const blockedCopy of [
      "enter api key",
      "auto execute",
      "approved strategy",
      "approved for trading",
      "safe to trade",
      "strategy is safe",
      ["bro", "ker-ready"].join(""),
      "live-ready",
      "profit claim",
      "performance guarantee",
      "optimized returns",
      "trade now",
      "recommended buy",
      "recommended sell",
      "high confidence trade",
      "guaranteed outcome",
      "one-click order",
      "automatic trading"
    ]) {
      const result = checkGate0CommandCenterRenderContract({
        ...baseInput,
        data: `${baseInput.data} ${blockedCopy}`
      });

      expect(result.ok).toBe(false);
      expect(result.findings).toContain(`Blocked command-center copy found: ${blockedCopy}`);
    }
  });
});
