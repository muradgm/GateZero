import { describe, expect, it } from "vitest";
import {
  checkGate0SkillGovernance,
  renderGate0SkillGovernanceResult,
  type Gate0SkillGovernanceInput
} from "../../../scripts/check-gate0-skill-governance.js";

const completeInput: Gate0SkillGovernanceInput = {
  files: [
    {
      relativePath: "skills/gatezero-docs-control-plane-reviewer/SKILL.md",
      content: [
        "---",
        "name: gatezero-docs-control-plane-reviewer",
        "description: GateZero-aware docs control-plane review.",
        "---",
        "# GateZero Docs Control Plane Reviewer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-docs-control-plane-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $gatezero-docs-control-plane-reviewer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-orchestrator-reviewer/SKILL.md",
      content: [
        "---",
        "name: gatezero-orchestrator-reviewer",
        "description: GateZero-aware orchestration review.",
        "---",
        "# GateZero Orchestrator Reviewer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
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
      relativePath: "skills/gatezero-product-strategy-reviewer/SKILL.md",
      content: [
        "---",
        "name: gatezero-product-strategy-reviewer",
        "description: GateZero-aware product strategy review.",
        "---",
        "# GateZero Product Strategy Reviewer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-product-strategy-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $gatezero-product-strategy-reviewer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-qa-security-reviewer/SKILL.md",
      content: [
        "---",
        "name: gatezero-qa-security-reviewer",
        "description: GateZero-aware QA security review.",
        "---",
        "# GateZero QA Security Reviewer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-qa-security-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $gatezero-qa-security-reviewer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-quant-backtest-reviewer/SKILL.md",
      content: [
        "---",
        "name: gatezero-quant-backtest-reviewer",
        "description: GateZero-aware quant backtest review.",
        "---",
        "# GateZero Quant Backtest Reviewer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-quant-backtest-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $gatezero-quant-backtest-reviewer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-risk-governance-reviewer/SKILL.md",
      content: [
        "---",
        "name: gatezero-risk-governance-reviewer",
        "description: GateZero-aware risk governance review.",
        "---",
        "# GateZero Risk Governance Reviewer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-risk-governance-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $gatezero-risk-governance-reviewer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-ui-command-center-reviewer/SKILL.md",
      content: [
        "---",
        "name: gatezero-ui-command-center-reviewer",
        "description: GateZero-aware UI command center review.",
        "---",
        "# GateZero UI Command Center Reviewer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/gatezero-ui-command-center-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $gatezero-ui-command-center-reviewer."',
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
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
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
      relativePath: "skills/traderframe-copy-reviewer/SKILL.md",
      content: [
        "---",
        "name: traderframe-copy-reviewer",
        "description: GateZero-aware frontend copy review.",
        "---",
        "# TraderFrame Copy Reviewer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/traderframe-copy-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $traderframe-copy-reviewer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/traderframe-frontend-engineer/SKILL.md",
      content: [
        "---",
        "name: traderframe-frontend-engineer",
        "description: GateZero-aware frontend engineering review.",
        "---",
        "# TraderFrame Frontend Engineer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/traderframe-frontend-engineer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $traderframe-frontend-engineer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/traderframe-marketing-strategy-reviewer/SKILL.md",
      content: [
        "---",
        "name: traderframe-marketing-strategy-reviewer",
        "description: GateZero-aware marketing strategy review.",
        "---",
        "# TraderFrame Marketing Strategy Reviewer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/traderframe-marketing-strategy-reviewer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $traderframe-marketing-strategy-reviewer."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "skills/traderframe-visual-product-designer/SKILL.md",
      content: [
        "---",
        "name: traderframe-visual-product-designer",
        "description: GateZero-aware visual product design review.",
        "---",
        "# TraderFrame Visual Product Designer",
        "## GateZero Boundary First",
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
        "future-phase",
        "blockers"
      ].join("\n")
    },
    {
      relativePath: "skills/traderframe-visual-product-designer/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $traderframe-visual-product-designer."',
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
        "G1_BACKTESTING",
        "historical_backtesting_only",
        "At Gate 1",
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
      relativePath: "skills/trader-product-reviewer/evals/evals.json",
      content: JSON.stringify({
        cases: [
          {
            input: "Review a TraderFrame Gate 1 decision.",
            expected: "Use G1_BACKTESTING and historical_backtesting_only boundaries."
          }
        ]
      })
    },
    {
      relativePath: "skills/senior-market-intelligence-scenario-analyst/SKILL.md",
      content: [
        "---",
        "name: senior-market-intelligence-scenario-analyst",
        "description: Gate 2 market intelligence scenario analysis.",
        "---",
        "# Senior Market Intelligence Scenario Analyst",
        "G2_PAPER_TRADING",
        "paper_simulation_planning_only",
        "repository-local source references",
        "bullish, bearish, and neutral",
        "Risk review",
        "operator decision",
        "## Refusal Rules"
      ].join("\n")
    },
    {
      relativePath: "skills/senior-market-intelligence-scenario-analyst/agents/openai.yaml",
      content: [
        "interface:",
        '  default_prompt: "Use $senior-market-intelligence-scenario-analyst."',
        "policy:",
        "  allow_implicit_invocation: false"
      ].join("\n")
    },
    {
      relativePath: "docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md",
      content: [
        "# Gate 1 Skill Library Intake",
        "## No bulk skill dump",
        "G1_BACKTESTING",
        "historical_backtesting_only",
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
      checkedSkillCount: 14,
      checkedPolicyCount: 1
    });
    expect(renderGate0SkillGovernanceResult(result)).toContain(
      "Gate 0 skill governance check passed."
    );
  });

  it("rejects missing Gate 1 boundary text", () => {
    const result = checkGate0SkillGovernance({
      files: completeInput.files.map((file) =>
        file.relativePath === "skills/trader-product-reviewer/SKILL.md"
          ? { ...file, content: file.content.replace("G1_BACKTESTING", "later") }
          : file
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing Gate 1 skill boundary snippet: skills/trader-product-reviewer/SKILL.md -> G1_BACKTESTING"
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

  it("rejects stale Gate 0 phase language in skill eval fixtures", () => {
    const result = checkGate0SkillGovernance({
      files: completeInput.files.map((file) =>
        file.relativePath === "skills/trader-product-reviewer/evals/evals.json"
          ? { ...file, content: file.content.replace("G1_BACKTESTING", "G0_RESEARCH") }
          : file
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Stale Gate 0 eval phase snippet: skills/trader-product-reviewer/evals/evals.json -> G0_RESEARCH"
    );
  });

  it("rejects stale Gate 0 phase language in skill metadata", () => {
    const result = checkGate0SkillGovernance({
      files: completeInput.files.map((file) =>
        file.relativePath === "skills/trading-forex-domain-expert/agents/openai.yaml"
          ? { ...file, content: `${file.content}\nnotes: G0_RESEARCH` }
          : file
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Stale Gate 0 skill metadata snippet: skills/trading-forex-domain-expert/agents/openai.yaml -> G0_RESEARCH"
    );
  });
});
