import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0CiEvidenceFile {
  readonly relativePath: string;
  readonly content: string;
}

export interface Gate0CiEvidenceFreshnessInput {
  readonly evidenceFiles: readonly Gate0CiEvidenceFile[];
  readonly knownCommitShas: readonly string[];
  readonly currentHeadSha: string;
  readonly nowIso: string;
  readonly maxAgeDays: number;
}

export interface Gate0CiEvidenceFreshnessResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly evidenceCount: number;
  readonly latestEvidencePath: string;
  readonly latestEvidenceCommit: string;
  readonly latestEvidenceAgeDays: number;
}

interface ParsedEvidence {
  readonly relativePath: string;
  readonly workflow: string;
  readonly runId: string;
  readonly event: string;
  readonly status: string;
  readonly conclusion: string;
  readonly commit: string;
  readonly updated: string;
  readonly url: string;
}

const evidenceFilePattern = /^GATE0_(?:GITHUB_CI|REMOTE_CI|COMMAND_CENTER_CI)_.*EVIDENCE.*\.md$/;

export async function loadGate0CiEvidenceFreshnessInput(
  rootDir: string
): Promise<Gate0CiEvidenceFreshnessInput> {
  const docsDir = path.join(rootDir, "docs", "operations");
  const evidenceFiles = await listEvidenceFiles(rootDir, docsDir);

  return {
    evidenceFiles,
    knownCommitShas: listKnownCommitShas(rootDir),
    currentHeadSha: readGitOutput(rootDir, ["rev-parse", "HEAD"]),
    nowIso: new Date().toISOString(),
    maxAgeDays: 14
  };
}

export function checkGate0CiEvidenceFreshness(
  input: Gate0CiEvidenceFreshnessInput
): Gate0CiEvidenceFreshnessResult {
  const findings: string[] = [];
  const parsed = input.evidenceFiles
    .map((file) => parseEvidence(file, findings))
    .filter((evidence): evidence is ParsedEvidence => evidence !== undefined);
  const latest = parsed.sort((left, right) => right.updated.localeCompare(left.updated))[0];

  if (!latest) {
    findings.push("No Gate 0 GitHub CI evidence documents found.");

    return emptyResult(findings, input.evidenceFiles.length);
  }

  if (latest.workflow !== "Gate 0 Verification") {
    findings.push(`Latest CI evidence has unexpected workflow: ${latest.workflow}`);
  }

  if (latest.event !== "push") {
    findings.push(`Latest CI evidence has unexpected event: ${latest.event}`);
  }

  if (latest.status !== "completed") {
    findings.push(`Latest CI evidence is not completed: ${latest.status}`);
  }

  if (latest.conclusion !== "success") {
    findings.push(`Latest CI evidence is not successful: ${latest.conclusion}`);
  }

  if (!input.knownCommitShas.includes(latest.commit)) {
    findings.push(`Latest CI evidence commit is not in local git history: ${latest.commit}`);
  }

  if (!input.knownCommitShas.includes(input.currentHeadSha)) {
    findings.push(`Current HEAD is not in local git history: ${input.currentHeadSha}`);
  }

  if (!latest.url.includes(`actions/runs/${latest.runId}`)) {
    findings.push(`Latest CI evidence URL does not match run id: ${latest.relativePath}`);
  }

  const ageDays = calculateAgeDays(latest.updated, input.nowIso, findings);

  if (ageDays > input.maxAgeDays) {
    findings.push(`Latest CI evidence is stale: ${ageDays} days old, max ${input.maxAgeDays} days`);
  }

  return {
    ok: findings.length === 0,
    findings,
    evidenceCount: parsed.length,
    latestEvidencePath: latest.relativePath,
    latestEvidenceCommit: latest.commit,
    latestEvidenceAgeDays: ageDays
  };
}

export function renderGate0CiEvidenceFreshnessResult(
  result: Gate0CiEvidenceFreshnessResult
): string {
  if (result.ok) {
    return [
      "Gate 0 CI evidence freshness check passed.",
      `Evidence records: ${result.evidenceCount}`,
      `Latest evidence: ${result.latestEvidencePath}`,
      `Latest evidence commit: ${result.latestEvidenceCommit}`,
      `Latest evidence age days: ${result.latestEvidenceAgeDays}`
    ].join("\n");
  }

  return ["Gate 0 CI evidence freshness check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0CiEvidenceFreshnessInput(process.cwd());
  const result = checkGate0CiEvidenceFreshness(input);
  const output = renderGate0CiEvidenceFreshnessResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

async function listEvidenceFiles(
  rootDir: string,
  docsDir: string
): Promise<readonly Gate0CiEvidenceFile[]> {
  const entries = await readdir(docsDir);
  const evidenceFiles: Gate0CiEvidenceFile[] = [];

  for (const entry of entries) {
    if (!evidenceFilePattern.test(entry)) {
      continue;
    }

    const absolutePath = path.join(docsDir, entry);
    evidenceFiles.push({
      relativePath: normalizeRelativePath(path.relative(rootDir, absolutePath)),
      content: await readFile(absolutePath, "utf8")
    });
  }

  return evidenceFiles.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function parseEvidence(file: Gate0CiEvidenceFile, findings: string[]): ParsedEvidence | undefined {
  const fields = parseMarkdownTableFields(file.content);
  const requiredFields = [
    "Workflow",
    "Run id",
    "Event",
    "Status",
    "Conclusion",
    "Commit",
    "Updated",
    "URL"
  ];

  for (const field of requiredFields) {
    if (!fields.has(field)) {
      findings.push(`Missing CI evidence field ${field}: ${file.relativePath}`);
    }
  }

  if (requiredFields.some((field) => !fields.has(field))) {
    return undefined;
  }

  return {
    relativePath: file.relativePath,
    workflow: fields.get("Workflow") ?? "",
    runId: fields.get("Run id") ?? "",
    event: fields.get("Event") ?? "",
    status: fields.get("Status") ?? "",
    conclusion: fields.get("Conclusion") ?? "",
    commit: fields.get("Commit") ?? "",
    updated: fields.get("Updated") ?? "",
    url: fields.get("URL") ?? ""
  };
}

function parseMarkdownTableFields(content: string): ReadonlyMap<string, string> {
  const fields = new Map<string, string>();

  for (const line of content.split("\n")) {
    const cells = line
      .split("|")
      .map((cell) => cell.trim().replaceAll("`", ""))
      .filter((cell) => cell.length > 0);

    const [field, value] = cells;

    if (!field || !value || field === "Field" || field.startsWith("---")) {
      continue;
    }

    fields.set(field, value);
  }

  return fields;
}

function calculateAgeDays(updatedIso: string, nowIso: string, findings: string[]): number {
  const updatedTime = Date.parse(updatedIso);
  const nowTime = Date.parse(nowIso);

  if (Number.isNaN(updatedTime)) {
    findings.push(`Latest CI evidence has invalid updated timestamp: ${updatedIso}`);
    return Number.POSITIVE_INFINITY;
  }

  if (Number.isNaN(nowTime)) {
    findings.push(`Invalid current timestamp: ${nowIso}`);
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(0, Math.floor((nowTime - updatedTime) / 86_400_000));
}

function listKnownCommitShas(rootDir: string): readonly string[] {
  return readGitOutput(rootDir, ["rev-list", "HEAD"]).split("\n").filter(Boolean);
}

function readGitOutput(rootDir: string, args: readonly string[]): string {
  return execFileSync("git", [...args], {
    cwd: rootDir,
    encoding: "utf8"
  }).trim();
}

function emptyResult(
  findings: readonly string[],
  evidenceCount: number
): Gate0CiEvidenceFreshnessResult {
  return {
    ok: false,
    findings,
    evidenceCount,
    latestEvidencePath: "",
    latestEvidenceCommit: "",
    latestEvidenceAgeDays: Number.POSITIVE_INFINITY
  };
}

function normalizeRelativePath(filePath: string): string {
  return filePath.replaceAll(path.sep, "/");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
