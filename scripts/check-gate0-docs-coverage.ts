import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0DocsCoverageFile {
  readonly relativePath: string;
  readonly content: string;
}

export interface Gate0DocsCoverageInput {
  readonly docsReadme: string;
  readonly tracklist: string;
  readonly artifactMap: string;
  readonly operationsDocs: readonly Gate0DocsCoverageFile[];
}

export interface Gate0DocsCoverageResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly checkedDocumentCount: number;
}

const gate0OperationsDocPattern = /^docs\/operations\/GATE0_.*\.md$/;

export async function loadGate0DocsCoverageInput(rootDir: string): Promise<Gate0DocsCoverageInput> {
  const operationsDir = path.join(rootDir, "docs", "operations");
  const operationDocPaths = await listGate0OperationDocs(rootDir, operationsDir);

  return {
    docsReadme: await readFile(path.join(rootDir, "docs", "README.md"), "utf8"),
    tracklist: await readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8"),
    artifactMap: await readFile(
      path.join(rootDir, "docs", "operations", "GATE0_ERGONOMICS_ARTIFACT_MAP.md"),
      "utf8"
    ),
    operationsDocs: await Promise.all(
      operationDocPaths.map(async (filePath) => ({
        relativePath: normalizeRelativePath(path.relative(rootDir, filePath)),
        content: await readFile(filePath, "utf8")
      }))
    )
  };
}

export function checkGate0DocsCoverage(input: Gate0DocsCoverageInput): Gate0DocsCoverageResult {
  const findings: string[] = [];
  const operationDocs = input.operationsDocs
    .filter((file) => gate0OperationsDocPattern.test(file.relativePath))
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath));

  for (const file of operationDocs) {
    const docsReadmePath = file.relativePath.replace("docs/", "");

    if (!input.docsReadme.includes(`\`${docsReadmePath}\``)) {
      findings.push(`Missing docs index entry: ${docsReadmePath}`);
    }

    if (!file.content.includes("## Source Links")) {
      findings.push(`Missing source links section: ${file.relativePath}`);
    }

    if (!input.tracklist.includes(file.relativePath)) {
      findings.push(`Missing tracklist source link: ${file.relativePath}`);
    }

    if (isCoverageDocument(file.relativePath) && !input.artifactMap.includes(file.relativePath)) {
      findings.push(`Missing artifact map entry: ${file.relativePath}`);
    }

    const sourcePacket = file.content.match(/Source packet: `ops\/assignments\/(TRD-\d+)_/)?.[1];

    if (sourcePacket) {
      for (const suffix of ["QA_SECURITY_REVIEW", "RISK_REVIEW", "ORCHESTRATOR_ACCEPTANCE"]) {
        const expectedReview = `ops/runtime/reviews/${sourcePacket}_${suffix}.md`;

        if (!file.content.includes(expectedReview)) {
          findings.push(`Missing review reference: ${file.relativePath} -> ${expectedReview}`);
        }
      }
    }
  }

  return {
    ok: findings.length === 0,
    findings,
    checkedDocumentCount: operationDocs.length
  };
}

export function renderGate0DocsCoverageResult(result: Gate0DocsCoverageResult): string {
  if (result.ok) {
    return [
      "Gate 0 docs coverage check passed.",
      `Checked documents: ${result.checkedDocumentCount}`
    ].join("\n");
  }

  return ["Gate 0 docs coverage check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0DocsCoverageInput(process.cwd());
  const result = checkGate0DocsCoverage(input);
  const output = renderGate0DocsCoverageResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

async function listGate0OperationDocs(rootDir: string, dir: string): Promise<readonly string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listGate0OperationDocs(rootDir, absolutePath)));
      continue;
    }

    const relativePath = normalizeRelativePath(path.relative(rootDir, absolutePath));

    if (entry.isFile() && gate0OperationsDocPattern.test(relativePath)) {
      files.push(absolutePath);
    }
  }

  return files.sort();
}

function isCoverageDocument(relativePath: string): boolean {
  return (
    relativePath.includes("COVERAGE") ||
    relativePath.includes("COMMAND_INDEX") ||
    relativePath.includes("ARTIFACT_MAP") ||
    relativePath.includes("CROSS_LINK") ||
    relativePath.includes("VALIDATION_COMMAND_AUDIT")
  );
}

function normalizeRelativePath(filePath: string): string {
  return filePath.replaceAll(path.sep, "/");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
