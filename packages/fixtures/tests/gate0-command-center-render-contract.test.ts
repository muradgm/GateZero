import { describe, expect, it } from "vitest";
import {
  checkGate0CommandCenterRenderContract,
  renderGate0CommandCenterRenderContractResult
} from "../../../scripts/check-gate0-command-center-render-contract.js";

const baseInput = {
  data: 'gate: "G0_RESEARCH", scope: "research_only", docGroups: []',
  html: '<a class="skip-link" href="#main">Skip</a><div id="app"></div>',
  main: 'main class="workspace" id="main" data-section updateActiveNavigation data-label="Area" commandCenterData.docGroups',
  styles: "td::before { content: attr(data-label); } .doc-group { display: grid; }"
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
      main: baseInput.main.replace("commandCenterData.docGroups", "")
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

  it("rejects blocked command-center action copy", () => {
    const blockedCopy = ["connect", "bro", "ker"].join(" ");
    const result = checkGate0CommandCenterRenderContract({
      ...baseInput,
      data: `${baseInput.data} ${blockedCopy}`
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(`Blocked command-center copy found: ${blockedCopy}`);
  });
});
