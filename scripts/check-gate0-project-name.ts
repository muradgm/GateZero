import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0ProjectNameCheckInput {
  readonly files: readonly Gate0ProjectNameFile[];
}

export interface Gate0ProjectNameFile {
  readonly relativePath: string;
  readonly content: string;
}

export interface Gate0ProjectNameCheckResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly checkedFileCount: number;
}

const displayName = "GateZero";
const packageName = "gatezero";
const previousDisplayName = ["Trade", "Frame"].join("");
const previousPackageName = ["trade", "frame"].join("");
const ignoredDirectories = new Set(["node_modules", "dist", ".git"]);
const checkedExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".svg",
  ".ts",
  ".yaml",
  ".yml"
]);

export async function loadGate0ProjectNameCheckInput(
  rootDir: string
): Promise<Gate0ProjectNameCheckInput> {
  const files = await listCheckedFiles(rootDir);

  return {
    files: await Promise.all(
      files.map(async (filePath) => ({
        relativePath: normalizeRelativePath(path.relative(rootDir, filePath)),
        content: await readFile(filePath, "utf8")
      }))
    )
  };
}

export function checkGate0ProjectName(
  input: Gate0ProjectNameCheckInput
): Gate0ProjectNameCheckResult {
  const findings: string[] = [];
  const packageJson = input.files.find((file) => file.relativePath === "package.json");
  const tracklist = input.files.find((file) => file.relativePath === "ops/runtime/tracklist.md");

  for (const file of input.files) {
    if (file.relativePath.includes(previousPackageName)) {
      findings.push(`Previous package name found in path: ${file.relativePath}`);
    }

    if (file.content.includes(previousDisplayName)) {
      findings.push(`Previous display name found in file: ${file.relativePath}`);
    }

    if (file.content.includes(previousPackageName)) {
      findings.push(`Previous package name found in file: ${file.relativePath}`);
    }
  }

  if (!packageJson?.content.match(new RegExp(`"name"\\s*:\\s*"${packageName}"`))) {
    findings.push(`package.json name must be ${packageName}`);
  }

  if (!packageJson?.content.includes(displayName)) {
    findings.push(`package.json description must include ${displayName}`);
  }

  if (!tracklist?.content.includes(`| Project                    | ${displayName}`)) {
    findings.push(`tracklist project field must be ${displayName}`);
  }

  if (!tracklist?.content.startsWith(`# ${displayName} Project Tracklist`)) {
    findings.push(`tracklist title must start with ${displayName}`);
  }

  return {
    ok: findings.length === 0,
    findings,
    checkedFileCount: input.files.length
  };
}

export function renderGate0ProjectNameCheckResult(result: Gate0ProjectNameCheckResult): string {
  if (result.ok) {
    return [
      "Gate 0 project name check passed.",
      `Display name: ${displayName}`,
      `Package name: ${packageName}`,
      `Checked files: ${result.checkedFileCount}`
    ].join("\n");
  }

  return ["Gate 0 project name check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0ProjectNameCheckInput(process.cwd());
  const result = checkGate0ProjectName(input);
  const output = renderGate0ProjectNameCheckResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

async function listCheckedFiles(rootDir: string): Promise<readonly string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listCheckedFiles(absolutePath)));
      continue;
    }

    if (entry.isFile() && checkedExtensions.has(path.extname(entry.name))) {
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
