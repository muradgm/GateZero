import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface RepoHygieneCheckInput {
  readonly gitignore: string;
  readonly trackedFiles: readonly string[];
}

export interface RepoHygieneCheckResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly trackedFileCount: number;
}

const requiredGitignoreEntries = [
  "node_modules/",
  "dist/",
  "build/",
  "coverage/",
  ".env",
  ".env.*",
  "*.log",
  ".cache/"
] as const;

const blockedTrackedPatterns = [
  /^node_modules\//,
  /^dist\//,
  /^build\//,
  /^coverage\//,
  /^\.cache\//,
  /(^|\/)\.env($|\.)/,
  /\.log$/,
  /\.tsbuildinfo$/
] as const;

export async function loadRepoHygieneCheckInput(rootDir: string): Promise<RepoHygieneCheckInput> {
  return {
    gitignore: await readFile(path.join(rootDir, ".gitignore"), "utf8"),
    trackedFiles: listTrackedFiles(rootDir)
  };
}

export function checkRepoHygiene(input: RepoHygieneCheckInput): RepoHygieneCheckResult {
  const findings: string[] = [];

  for (const entry of requiredGitignoreEntries) {
    if (!input.gitignore.includes(entry)) {
      findings.push(`Missing .gitignore entry: ${entry}`);
    }
  }

  for (const trackedFile of input.trackedFiles) {
    if (blockedTrackedPatterns.some((pattern) => pattern.test(trackedFile))) {
      findings.push(`Blocked generated or local file is tracked: ${trackedFile}`);
    }
  }

  return {
    ok: findings.length === 0,
    findings,
    trackedFileCount: input.trackedFiles.length
  };
}

export function renderRepoHygieneCheckResult(result: RepoHygieneCheckResult): string {
  if (result.ok) {
    return ["Repository hygiene check passed.", `Tracked files: ${result.trackedFileCount}`].join(
      "\n"
    );
  }

  return ["Repository hygiene check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadRepoHygieneCheckInput(process.cwd());
  const result = checkRepoHygiene(input);
  const output = renderRepoHygieneCheckResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

function listTrackedFiles(rootDir: string): readonly string[] {
  const output = execFileSync("git", ["ls-files", "-z"], {
    cwd: rootDir,
    encoding: "utf8"
  });

  return output.split("\0").filter((filePath) => filePath.length > 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
