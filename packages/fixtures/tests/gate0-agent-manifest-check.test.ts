import { describe, expect, it } from "vitest";
import {
  checkGate0AgentManifest,
  renderGate0AgentManifestCheckResult,
  type Gate0AgentManifestCheckInput
} from "../../../scripts/check-gate0-agent-manifest.js";

const completeInput: Gate0AgentManifestCheckInput = {
  manifest: JSON.stringify({
    agents: ["ORCHESTRATOR"],
    required_per_agent: ["SKILL.md", "evals/evals.json", "references/README.md"]
  }),
  agentDirectoryNames: ["ORCHESTRATOR"],
  files: [
    {
      relativePath: "ops/agents/ORCHESTRATOR/SKILL.md",
      content: "GateZero orchestrator skill"
    },
    {
      relativePath: "ops/agents/ORCHESTRATOR/evals/evals.json",
      content: "{}"
    },
    {
      relativePath: "ops/agents/ORCHESTRATOR/references/README.md",
      content: "- URL/path: `../../truth/PROJECT_TRUTH.md`"
    },
    {
      relativePath: "ops/truth/PROJECT_TRUTH.md",
      content: "GateZero truth"
    }
  ]
};
const previousProjectName = ["Trade", "Frame"].join("");

describe("Gate 0 agent manifest check", () => {
  it("passes when manifest agents, folders, required files, and references align", () => {
    const result = checkGate0AgentManifest(completeInput);

    expect(result).toEqual({
      ok: true,
      findings: [],
      manifestAgentCount: 1,
      agentFolderCount: 1
    });
    expect(renderGate0AgentManifestCheckResult(result)).toContain(
      "Gate 0 agent manifest check passed."
    );
  });

  it("fails when agent manifest coverage drifts", () => {
    const result = checkGate0AgentManifest({
      ...completeInput,
      agentDirectoryNames: ["ORCHESTRATOR", "RISK"],
      files: completeInput.files.filter(
        (file) => file.relativePath !== "ops/agents/ORCHESTRATOR/evals/evals.json"
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("agent folder missing from manifest: RISK");
    expect(result.findings).toContain(
      "Missing required agent file: ops/agents/ORCHESTRATOR/evals/evals.json"
    );
  });

  it("fails on old project naming in agent files", () => {
    const result = checkGate0AgentManifest({
      ...completeInput,
      files: completeInput.files.map((file) =>
        file.relativePath === "ops/agents/ORCHESTRATOR/SKILL.md"
          ? { ...file, content: `${previousProjectName} old name` }
          : file
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Previous project name found in agent file: ops/agents/ORCHESTRATOR/SKILL.md"
    );
  });
});
