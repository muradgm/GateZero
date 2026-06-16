import { describe, expect, it } from "vitest";
import {
  checkGate0SkillGovernance,
  renderGate0SkillGovernanceResult,
  type Gate0SkillGovernanceInput
} from "../../../scripts/check-gate0-skill-governance.js";

const completeInput: Gate0SkillGovernanceInput = {
  files: [
    {
      relativePath: "skills/gatezero-orchestrator-reviewer/SKILL.md",
      content: [
        "---",
        "name: gatezero-orchestrator-reviewer",
        "description: GateZero-aware orchestration review.",
        "---",
        "# GateZero Orchestrator Reviewer",
        "## GateZero Boundary First",
        "G0_RESEARCH",
        "research_only",
        "At Gate 0",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-orchestrator-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $gatezero-orchestrator-reviewer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/trader-product-reviewer/SKILL.md",
      content: [
        "---",
        "name: trader-product-reviewer",
        "description: GateZero-aware product review.",
        "---",
        "# Trader Product Reviewer",
        "## GateZero Boundary First",
        "G0_RESEARCH",
        "research_only",
        "At Gate 0",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/trader-product-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $trader-product-reviewer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/trading-forex-domain-expert/SKILL.md",
      content: [
        "---",
        "name: trading-forex-domain-expert",
        "description: GateZero-aware domain review.",
        "---",
        "# Trading Forex Domain Expert",
        "## GateZero Boundary First",
        "G0_RESEARCH",
        "research_only",
        "At Gate 0",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/trading-forex-domain-expert/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $trading-forex-domain-expert."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md",
      content: [
        "# Gate 0 Skill Library Intake",
        "## No bulk skill dump",
        "G0_RESEARCH",
        "research_only",
        "allow_implicit_invocation: false",
        "candidate intake backlog",
        "blocked skill types",
        "gatezero-orchestrator-reviewer",
        "gatezero-risk-governance-reviewer"
      ].join("\n")
    }
  ]
};

describe("Gate 0 skill governance check", () => {
  it("accepts phase-aware project skills with explicit invocation metadata", () => {
    const result = checkGate0SkillGovernance(completeInput);

    expect(result).toEqual({
      ok: true,
      findings: [],
      checkedSkillCount: 3,
      checkedPolicyCount: 1
    });
    expect(renderGate0SkillGovernanceResult(result)).toContain(
      "Gate 0 skill governance check passed."
    );
  });

  it("rejects missing Gate 0 boundary text", () => {
    const result = checkGate0SkillGovernance({
      files: completeInput.files.map((file) =>
        file.relativePath === "skills/trader-product-reviewer/SKILL.md"
          ? { ...file, content: file.content.replace("G0_RESEARCH", "later") }
          : file
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing Gate 0 skill boundary snippet: skills/trader-product-reviewer/SKILL.md -> G0_RESEARCH"
    );
  });

  it("rejects implicit invocation metadata", () => {
    const result = checkGate0SkillGovernance({
      files: completeInput.files.map((file) =>
        file.relativePath === "skills/trading-forex-domain-expert/agents/openai.yaml"
          ? { ...file, content: file.content.replace("false", "true") }
          : file
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Project skill must require explicit invocation: skills/trading-forex-domain-expert/agents/openai.yaml"
    );
  });

  it("rejects a missing skill library intake policy", () => {
    const result = checkGate0SkillGovernance({
      files: completeInput.files.filter(
        (file) => file.relativePath !== "docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md"
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing skill library intake policy: docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md"
    );
  });
});
