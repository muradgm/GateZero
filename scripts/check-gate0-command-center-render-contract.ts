import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0CommandCenterRenderContractInput {
  readonly data: string;
  readonly html: string;
  readonly main: string;
  readonly styles: string;
}

export interface Gate0CommandCenterRenderContractResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
}

export async function loadGate0CommandCenterRenderContractInput(
  rootDir: string
): Promise<Gate0CommandCenterRenderContractInput> {
  return {
    data: await readFile(
      path.join(rootDir, "apps", "web", "src", "command-center-data.js"),
      "utf8"
    ),
    html: await readFile(path.join(rootDir, "apps", "web", "index.html"), "utf8"),
    main: await readFile(path.join(rootDir, "apps", "web", "src", "main.js"), "utf8"),
    styles: await readFile(path.join(rootDir, "apps", "web", "src", "styles.css"), "utf8")
  };
}

export function checkGate0CommandCenterRenderContract(
  input: Gate0CommandCenterRenderContractInput
): Gate0CommandCenterRenderContractResult {
  const findings: string[] = [];

  requireIncludes(findings, input.html, '<div id="app"></div>', "Missing static app mount.");
  requireIncludes(findings, input.html, 'class="skip-link"', "Missing skip link.");
  requireIncludes(findings, input.main, 'id="main"', "Missing main landmark target.");
  requireIncludes(findings, input.main, "data-section", "Missing hash-aware navigation markers.");
  requireIncludes(
    findings,
    input.main,
    "updateActiveNavigation",
    "Missing active navigation updater."
  );
  requireIncludes(findings, input.main, 'data-label="Area"', "Missing mobile table labels.");
  requireIncludes(findings, input.main, "data.docGroups", "Missing grouped source links.");
  requireIncludes(findings, input.styles, "td::before", "Missing mobile evidence label styling.");
  requireIncludes(findings, input.styles, ".doc-group", "Missing grouped source link styling.");
  requireIncludes(findings, input.data, "G0_RESEARCH", "Missing Gate 0 status.");
  requireIncludes(findings, input.data, "research_only", "Missing research-only scope.");

  const blockedCopies = [
    ["connect", "bro", "ker"],
    ["place", "order"],
    ["submit", "order"],
    ["ready", "to", "trade"],
    ["approved", "strategy"]
  ].map((parts) => parts.join(" "));

  for (const blockedCopy of blockedCopies) {
    if (input.data.toLowerCase().includes(blockedCopy)) {
      findings.push(`Blocked command-center copy found: ${blockedCopy}`);
    }
  }

  return {
    ok: findings.length === 0,
    findings
  };
}

export function renderGate0CommandCenterRenderContractResult(
  result: Gate0CommandCenterRenderContractResult
): string {
  if (result.ok) {
    return "Gate 0 command center render contract passed.";
  }

  return ["Gate 0 command center render contract failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0CommandCenterRenderContractInput(process.cwd());
  const result = checkGate0CommandCenterRenderContract(input);
  const output = renderGate0CommandCenterRenderContractResult(result);

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
