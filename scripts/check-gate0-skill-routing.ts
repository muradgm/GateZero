import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0SkillRoutingInput {
  readonly matrix: string;
}

export interface Gate0SkillRoutingResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly checkedSkillCount: number;
  readonly checkedDecisionCount: number;
}

const requiredSkills = [
  "gatezero-docs-control-plane-reviewer",
  "gatezero-orchestrator-reviewer",
  "gatezero-product-strategy-reviewer",
  "gatezero-qa-security-reviewer",
  "gatezero-quant-backtest-reviewer",
  "gatezero-risk-governance-reviewer",
  "gatezero-ui-command-center-reviewer",
  "trader-product-reviewer",
  "trading-forex-domain-expert"
] as const;

const requiredDecisionTypes = [
  "Assignment sequencing and handoff",
  "Risk gate and autonomy boundary review",
  "Validation and blocked-scope review",
  "Documentation and tracker consistency",
  "Product scope and wedge review",
  "Static command-center UI review",
  "Backtest contract and metric review",
  "Trader workflow and trust review",
  "Forex mechanics and domain review"
] as const;

const requiredSnippets = ["G0_RESEARCH", "research_only", "Selection Rules"] as const;

export async function loadGate0SkillRoutingInput(rootDir: string): Promise<Gate0SkillRoutingInput> {
  return {
    matrix: await readFile(
      path.join(rootDir, "docs", "operations", "GATE0_SKILL_ROUTING_MATRIX.md"),
      "utf8"
    )
  };
}

export function checkGate0SkillRouting(input: Gate0SkillRoutingInput): Gate0SkillRoutingResult {
  const findings: string[] = [];

  for (const snippet of requiredSnippets) {
    if (!input.matrix.includes(snippet)) {
      findings.push(`Missing routing matrix snippet: ${snippet}`);
    }
  }

  for (const skill of requiredSkills) {
    if (!input.matrix.includes(skill)) {
      findings.push(`Missing routing matrix skill: ${skill}`);
    }
  }

  for (const decisionType of requiredDecisionTypes) {
    if (!input.matrix.includes(decisionType)) {
      findings.push(`Missing routing matrix decision type: ${decisionType}`);
    }
  }

  return {
    ok: findings.length === 0,
    findings,
    checkedSkillCount: requiredSkills.length,
    checkedDecisionCount: requiredDecisionTypes.length
  };
}

export function renderGate0SkillRoutingResult(result: Gate0SkillRoutingResult): string {
  if (result.ok) {
    return [
      "Gate 0 skill routing check passed.",
      `Checked skills: ${result.checkedSkillCount}`,
      `Checked decision types: ${result.checkedDecisionCount}`
    ].join("\n");
  }

  return ["Gate 0 skill routing check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0SkillRoutingInput(process.cwd());
  const result = checkGate0SkillRouting(input);
  const output = renderGate0SkillRoutingResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
