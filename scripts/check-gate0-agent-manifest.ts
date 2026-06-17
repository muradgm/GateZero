import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0AgentManifestFile {
  readonly relativePath: string;
  readonly content: string;
}

export interface Gate0AgentManifestCheckInput {
  readonly manifest: string;
  readonly agentDirectoryNames: readonly string[];
  readonly files: readonly Gate0AgentManifestFile[];
}

export interface Gate0AgentManifestCheckResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly manifestAgentCount: number;
  readonly agentFolderCount: number;
}

interface AgentsManifest {
  readonly agents: readonly string[];
  readonly required_per_agent: readonly string[];
}

const previousDisplayName = ["Trade", "Frame"].join("");
const previousPackageName = ["trade", "frame"].join("");
const localReferencePattern = /URL\/path:\s*`([^`]+)`/g;

export async function loadGate0AgentManifestCheckInput(
  rootDir: string
): Promise<Gate0AgentManifestCheckInput> {
  const agentsDir = path.join(rootDir, "ops", "agents");
  const agentDirectoryNames = await listAgentDirectoryNames(agentsDir);
  const filePaths = await listAgentFiles(rootDir, agentsDir);

  return {
    manifest: await readFile(path.join(rootDir, "ops", "AGENTS_MANIFEST.json"), "utf8"),
    agentDirectoryNames,
    files: await Promise.all(
      filePaths.map(async (filePath) => ({
        relativePath: normalizeRelativePath(path.relative(rootDir, filePath)),
        content: await readFile(filePath, "utf8")
      }))
    )
  };
}

export function checkGate0AgentManifest(
  input: Gate0AgentManifestCheckInput
): Gate0AgentManifestCheckResult {
  const findings: string[] = [];
  const manifest = parseManifest(input.manifest, findings);
  const manifestAgents = manifest ? uniqueSorted(manifest.agents) : [];
  const agentFolders = uniqueSorted(input.agentDirectoryNames);
  const filesByPath = new Map(input.files.map((file) => [file.relativePath, file.content]));

  compareSets("manifest agent without folder", manifestAgents, agentFolders, findings);
  compareSets("agent folder missing from manifest", agentFolders, manifestAgents, findings);

  if (manifest) {
    for (const agent of manifestAgents) {
      for (const requiredFile of manifest.required_per_agent) {
        const relativePath = `ops/agents/${agent}/${requiredFile}`;

        if (!filesByPath.has(relativePath)) {
          findings.push(`Missing required agent file: ${relativePath}`);
        }
      }

      const evalPath = `ops/agents/${agent}/evals/evals.json`;
      const evalContent = filesByPath.get(evalPath);

      if (evalContent) {
        try {
          JSON.parse(evalContent);
        } catch {
          findings.push(`Invalid agent eval JSON: ${evalPath}`);
        }
      }
    }
  }

  for (const file of input.files) {
    if (file.relativePath.endsWith("SKILL.md") || file.relativePath.includes("/references/")) {
      if (
        file.content.includes(previousDisplayName) ||
        file.content.includes(previousPackageName)
      ) {
        findings.push(`Previous project name found in agent file: ${file.relativePath}`);
      }
    }

    if (
      file.relativePath.endsWith("/references/README.md") ||
      file.relativePath.endsWith("/references/required_refs.md")
    ) {
      const agentRoot = file.relativePath.match(/^ops\/agents\/[^/]+/)?.[0];

      if (!agentRoot) {
        continue;
      }

      for (const reference of findLocalReferences(file.content)) {
        const resolvedPath = normalizeRelativePath(path.normalize(path.join(agentRoot, reference)));

        if (!filesByPath.has(resolvedPath)) {
          findings.push(`Unresolved agent reference: ${file.relativePath} -> ${reference}`);
        }
      }
    }
  }

  return {
    ok: findings.length === 0,
    findings,
    manifestAgentCount: manifestAgents.length,
    agentFolderCount: agentFolders.length
  };
}

export function renderGate0AgentManifestCheckResult(result: Gate0AgentManifestCheckResult): string {
  if (result.ok) {
    return [
      "Gate 0 agent manifest check passed.",
      `Manifest agents: ${result.manifestAgentCount}`,
      `Agent folders: ${result.agentFolderCount}`
    ].join("\n");
  }

  return ["Gate 0 agent manifest check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0AgentManifestCheckInput(process.cwd());
  const result = checkGate0AgentManifest(input);
  const output = renderGate0AgentManifestCheckResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

function parseManifest(manifest: string, findings: string[]): AgentsManifest | undefined {
  try {
    const parsed = JSON.parse(manifest) as Partial<AgentsManifest>;

    if (!Array.isArray(parsed.agents) || !Array.isArray(parsed.required_per_agent)) {
      findings.push("Agent manifest must include agents and required_per_agent arrays");
      return undefined;
    }

    return {
      agents: parsed.agents,
      required_per_agent: parsed.required_per_agent
    };
  } catch {
    findings.push("Agent manifest JSON is invalid");
    return undefined;
  }
}

function compareSets(
  label: string,
  expected: readonly string[],
  actual: readonly string[],
  findings: string[]
): void {
  for (const value of expected) {
    if (!actual.includes(value)) {
      findings.push(`${label}: ${value}`);
    }
  }
}

function findLocalReferences(content: string): readonly string[] {
  return [...content.matchAll(localReferencePattern)]
    .map((match) => match[1])
    .filter(
      (reference): reference is string =>
        reference !== undefined &&
        !reference.startsWith("http://") &&
        !reference.startsWith("https://")
    );
}

async function listAgentDirectoryNames(agentsDir: string): Promise<readonly string[]> {
  const entries = await readdir(agentsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function listAgentFiles(rootDir: string, dir: string): Promise<readonly string[]> {
  const files = [...(await listFilesRecursive(dir))];

  for (const supportDir of [
    "ops/truth",
    "ops/governance",
    "ops/core",
    "ops/validation",
    "ops/learning"
  ]) {
    files.push(...(await listMarkdownAndJsonFiles(path.join(rootDir, supportDir))));
  }

  const docsDir = path.join(rootDir, "docs");
  files.push(...(await listMarkdownAndJsonFiles(docsDir)));

  return files.sort();
}

async function listFilesRecursive(dir: string): Promise<readonly string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(absolutePath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files.sort();
}

async function listMarkdownAndJsonFiles(dir: string): Promise<readonly string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listMarkdownAndJsonFiles(absolutePath)));
      continue;
    }

    if (entry.isFile() && [".md", ".json"].includes(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort();
}

function normalizeRelativePath(filePath: string): string {
  return filePath.replaceAll(path.sep, "/");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
