import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0GithubActionsRuntimeInput {
  readonly workflow: string;
}

export interface Gate0GithubActionsRuntimeResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
}

export async function loadGate0GithubActionsRuntimeInput(
  rootDir: string
): Promise<Gate0GithubActionsRuntimeInput> {
  return {
    workflow: await readFile(path.join(rootDir, ".github", "workflows", "gate0-verify.yml"), "utf8")
  };
}

export function checkGate0GithubActionsRuntime(
  input: Gate0GithubActionsRuntimeInput
): Gate0GithubActionsRuntimeResult {
  const findings: string[] = [];

  requireIncludes(
    findings,
    input.workflow,
    "uses: actions/checkout@v6",
    "Checkout action is not on v6."
  );
  requireIncludes(
    findings,
    input.workflow,
    "uses: actions/setup-node@v6",
    "Setup Node action is not on v6."
  );
  requireIncludes(
    findings,
    input.workflow,
    'node-version: "22"',
    "Project runtime is not pinned to Node.js 22."
  );
  requireIncludes(findings, input.workflow, "cache: pnpm", "pnpm cache is not configured.");
  requireIncludes(
    findings,
    input.workflow,
    "pnpm verify:gate0",
    "Gate 0 verification command is missing."
  );

  if (input.workflow.includes("FORCE_JAVASCRIPT_ACTIONS_TO_NODE24")) {
    findings.push("Legacy Node.js action-runtime override is still present.");
  }

  if (input.workflow.includes("actions/checkout@v4")) {
    findings.push("Deprecated checkout action v4 is still present.");
  }

  if (input.workflow.includes("actions/setup-node@v4")) {
    findings.push("Deprecated setup-node action v4 is still present.");
  }

  return {
    ok: findings.length === 0,
    findings
  };
}

export function renderGate0GithubActionsRuntimeResult(
  result: Gate0GithubActionsRuntimeResult
): string {
  if (result.ok) {
    return "Gate 0 GitHub Actions runtime check passed.";
  }

  return ["Gate 0 GitHub Actions runtime check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0GithubActionsRuntimeInput(process.cwd());
  const result = checkGate0GithubActionsRuntime(input);
  const output = renderGate0GithubActionsRuntimeResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

function requireIncludes(
  findings: string[],
  source: string,
  expectedContent: string,
  finding: string
): void {
  if (!source.includes(expectedContent)) {
    findings.push(finding);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
