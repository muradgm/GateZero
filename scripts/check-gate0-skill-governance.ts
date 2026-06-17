import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0SkillGovernanceFile {
  readonly relativePath: string;
  readonly content: string;
}

export interface Gate0SkillGovernanceInput {
  readonly files: readonly Gate0SkillGovernanceFile[];
}

export interface Gate0SkillGovernanceResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly checkedSkillCount: number;
  readonly checkedPolicyCount: number;
}

const expectedSkills = [
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
const requiredSkillSnippets = [
  "G0_RESEARCH",
  "research_only",
  "GateZero Boundary First",
  "At Gate 0",
  "future-phase",
  "blockers"
] as const;
const requiredPolicyPath = "docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md";
const requiredPolicySnippets = [
  "No bulk skill dump",
  "G0_RESEARCH",
  "research_only",
  "allow_implicit_invocation: false",
  "candidate intake backlog",
  "blocked skill types",
  "gatezero-orchestrator-reviewer",
  "gatezero-risk-governance-reviewer"
] as const;

export async function loadGate0SkillGovernanceInput(
  rootDir: string
): Promise<Gate0SkillGovernanceInput> {
  const skillRoot = path.join(rootDir, "skills");
  const skillFiles = await listSkillFiles(rootDir, skillRoot);
  const policyPath = path.join(rootDir, ...requiredPolicyPath.split("/"));
  const policyFile = await readOptionalGate0SkillGovernanceFile(rootDir, policyPath);

  return {
    files: [
      ...(await Promise.all(
        skillFiles.map(async (filePath) => ({
          relativePath: normalizeRelativePath(path.relative(rootDir, filePath)),
          content: await readFile(filePath, "utf8")
        }))
      )),
      ...(policyFile ? [policyFile] : [])
    ]
  };
}

async function readOptionalGate0SkillGovernanceFile(
  rootDir: string,
  filePath: string
): Promise<Gate0SkillGovernanceFile | null> {
  try {
    return {
      relativePath: normalizeRelativePath(path.relative(rootDir, filePath)),
      content: await readFile(filePath, "utf8")
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export function checkGate0SkillGovernance(
  input: Gate0SkillGovernanceInput
): Gate0SkillGovernanceResult {
  const findings: string[] = [];

  for (const skillName of expectedSkills) {
    const skillFilePath = `skills/${skillName}/SKILL.md`;
    const metadataPath = `skills/${skillName}/agents/openai.yaml`;
    const skillFile = input.files.find((file) => file.relativePath === skillFilePath);
    const metadataFile = input.files.find((file) => file.relativePath === metadataPath);

    if (!skillFile) {
      findings.push(`Missing project skill: ${skillFilePath}`);
      continue;
    }

    if (!skillFile.content.startsWith("---\nname: ")) {
      findings.push(`Missing skill frontmatter: ${skillFilePath}`);
    }

    if (!skillFile.content.includes(`name: ${skillName}`)) {
      findings.push(`Skill name mismatch: ${skillFilePath}`);
    }

    for (const snippet of requiredSkillSnippets) {
      if (!skillFile.content.includes(snippet)) {
        findings.push(`Missing Gate 0 skill boundary snippet: ${skillFilePath} -> ${snippet}`);
      }
    }

    if (!metadataFile) {
      findings.push(`Missing project skill metadata: ${metadataPath}`);
      continue;
    }

    if (!metadataFile.content.includes("allow_implicit_invocation: false")) {
      findings.push(`Project skill must require explicit invocation: ${metadataPath}`);
    }

    if (!metadataFile.content.includes(`$${skillName}`)) {
      findings.push(`Project skill metadata default prompt must reference skill: ${metadataPath}`);
    }
  }

  const policyFile = input.files.find((file) => file.relativePath === requiredPolicyPath);

  if (!policyFile) {
    findings.push(`Missing skill library intake policy: ${requiredPolicyPath}`);
  } else {
    for (const snippet of requiredPolicySnippets) {
      if (!policyFile.content.includes(snippet)) {
        findings.push(`Missing skill library intake snippet: ${requiredPolicyPath} -> ${snippet}`);
      }
    }
  }

  return {
    ok: findings.length === 0,
    findings,
    checkedSkillCount: expectedSkills.length,
    checkedPolicyCount: 1
  };
}

export function renderGate0SkillGovernanceResult(result: Gate0SkillGovernanceResult): string {
  if (result.ok) {
    return [
      "Gate 0 skill governance check passed.",
      `Checked skills: ${result.checkedSkillCount}`,
      `Checked policy docs: ${result.checkedPolicyCount}`
    ].join("\n");
  }

  return ["Gate 0 skill governance check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0SkillGovernanceInput(process.cwd());
  const result = checkGate0SkillGovernance(input);
  const output = renderGate0SkillGovernanceResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

async function listSkillFiles(rootDir: string, dir: string): Promise<readonly string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listSkillFiles(rootDir, absolutePath)));
      continue;
    }

    if (entry.isFile() && [".json", ".md", ".yaml", ".yml"].includes(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files.sort();
}

function normalizeRelativePath(filePath: string): string {
  return filePath.replaceAll(path.sep, "/");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
