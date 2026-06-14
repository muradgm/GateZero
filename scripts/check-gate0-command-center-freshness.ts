import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0CommandCenterFreshnessInput {
  readonly commandCenterData: string;
  readonly remoteEvidenceIndex: string;
  readonly tracklist: string;
  readonly acceptedIds: readonly string[];
}

export interface Gate0CommandCenterFreshnessResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly latestPacket: string;
  readonly commandCenterLatestPacket: string;
  readonly validationSummary: string;
  readonly commandCenterValidationSummary: string;
  readonly acceptedCount: number;
  readonly commandCenterAcceptedCount: number;
  readonly latestCiRunId: string;
  readonly commandCenterCiRunId: string;
}

const acceptanceSuffix = "_ORCHESTRATOR_ACCEPTANCE.md";
const assignmentPattern = /^TRD-\d+/;

export async function loadGate0CommandCenterFreshnessInput(
  rootDir: string
): Promise<Gate0CommandCenterFreshnessInput> {
  return {
    commandCenterData: await readFile(
      path.join(rootDir, "apps", "web", "src", "command-center-data.js"),
      "utf8"
    ),
    remoteEvidenceIndex: await readFile(
      path.join(rootDir, "docs", "operations", "GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md"),
      "utf8"
    ),
    tracklist: await readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8"),
    acceptedIds: await listAcceptedIds(path.join(rootDir, "ops", "runtime", "reviews"))
  };
}

export function checkGate0CommandCenterFreshness(
  input: Gate0CommandCenterFreshnessInput
): Gate0CommandCenterFreshnessResult {
  const latestPacket = readTableValue(input.tracklist, "Latest accepted packet");
  const validationSummary = normalizeValidationSummary(
    readTableValue(input.tracklist, "Latest accepted validation")
  );
  const acceptedCount = new Set(input.acceptedIds).size;
  const commandCenterLatestPacket = readJsStringValue(input.commandCenterData, "latestPacket");
  const commandCenterValidationSummary = readJsStringValue(
    input.commandCenterData,
    "localVerification"
  );
  const commandCenterAcceptedCount = readAcceptedRecordCount(input.commandCenterData);
  const latestCiRunId = readLatestCiRunId(input.remoteEvidenceIndex);
  const commandCenterCiRunId = readJsStringValue(input.commandCenterData, "ciRun");
  const findings: string[] = [];

  if (commandCenterLatestPacket !== latestPacket) {
    findings.push(
      `Command center latest packet mismatch: app=${commandCenterLatestPacket}, tracklist=${latestPacket}`
    );
  }

  if (commandCenterValidationSummary !== validationSummary) {
    findings.push(
      `Command center validation mismatch: app=${commandCenterValidationSummary}, tracklist=${validationSummary}`
    );
  }

  if (commandCenterAcceptedCount !== acceptedCount) {
    findings.push(
      `Command center review coverage mismatch: app=${commandCenterAcceptedCount}, records=${acceptedCount}`
    );
  }

  if (commandCenterCiRunId !== latestCiRunId) {
    findings.push(
      `Command center CI run mismatch: app=${commandCenterCiRunId}, evidence=${latestCiRunId}`
    );
  }

  return {
    ok: findings.length === 0,
    findings,
    latestPacket,
    commandCenterLatestPacket,
    validationSummary,
    commandCenterValidationSummary,
    acceptedCount,
    commandCenterAcceptedCount,
    latestCiRunId,
    commandCenterCiRunId
  };
}

export function renderGate0CommandCenterFreshnessResult(
  result: Gate0CommandCenterFreshnessResult
): string {
  if (result.ok) {
    return [
      "Gate 0 command center freshness passed.",
      `Latest packet: ${result.latestPacket}`,
      `Validation summary: ${result.validationSummary}`,
      `Accepted records: ${result.acceptedCount}`,
      `CI run: ${result.latestCiRunId}`
    ].join("\n");
  }

  return ["Gate 0 command center freshness failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0CommandCenterFreshnessInput(process.cwd());
  const result = checkGate0CommandCenterFreshness(input);
  const output = renderGate0CommandCenterFreshnessResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

async function listAcceptedIds(reviewDir: string): Promise<readonly string[]> {
  const entries = await readdir(reviewDir);
  const acceptedIds: string[] = [];

  for (const entry of entries) {
    if (!entry.endsWith(acceptanceSuffix)) {
      continue;
    }

    const content = await readFile(path.join(reviewDir, entry), "utf8");

    if (!content.match(/`accepted[^`]*`/)) {
      continue;
    }

    const packetId = entry.match(assignmentPattern)?.[0];

    if (packetId) {
      acceptedIds.push(packetId);
    }
  }

  return acceptedIds.sort(comparePacketIds);
}

function readJsStringValue(source: string, field: string): string {
  const match = source.match(new RegExp(`${field}: "([^"]+)"`));

  if (!match) {
    throw new Error(`Missing command center field: ${field}`);
  }

  return match[1]!;
}

function readAcceptedRecordCount(source: string): number {
  const match = source.match(/reference: "(\d+) accepted records"/);
  const value = Number(match?.[1]);

  if (!Number.isInteger(value)) {
    throw new Error("Missing command center accepted records reference.");
  }

  return value;
}

function readLatestCiRunId(source: string): string {
  const runIds = [...source.matchAll(/\|\s+`TRD-\d+`\s+\|[^|]+\|\s+`(\d+)`\s+\|/g)].map(
    (match) => match[1]!
  );

  const latestRunId = runIds.at(-1);

  if (!latestRunId) {
    throw new Error("Missing remote CI evidence run id.");
  }

  return latestRunId;
}

function readTableValue(markdown: string, field: string): string {
  const line = markdown.split("\n").find((candidate) => candidate.includes(`| ${field}`));
  const value = line?.split("|")[2]?.trim();

  if (!value) {
    throw new Error(`Missing tracklist field: ${field}`);
  }

  return value.replaceAll("`", "");
}

function normalizeValidationSummary(value: string): string {
  const match = value.match(/(\d+) test files,\s+(\d+) tests passed/);

  if (!match) {
    throw new Error(`Invalid tracklist validation summary: ${value}`);
  }

  return `${match[1]!} files / ${match[2]!} tests`;
}

function comparePacketIds(left: string, right: string): number {
  return Number(left.replace("TRD-", "")) - Number(right.replace("TRD-", ""));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
