import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0ProgressSnapshotFreshnessInput {
  readonly assignmentIds: readonly string[];
  readonly acceptedIds: readonly string[];
  readonly tracklist: string;
  readonly snapshot: string;
}

export interface Gate0ProgressSnapshotFreshnessResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly latestAcceptedPacket: string;
  readonly snapshotLatestAcceptedPacket: string;
  readonly assignmentCount: number;
  readonly snapshotAssignmentCount: number;
  readonly acceptedCount: number;
  readonly snapshotAcceptedCount: number;
  readonly openCount: number;
  readonly snapshotOpenCount: number;
}

const assignmentPattern = /^TRD-\d+/;
const acceptanceSuffix = "_ORCHESTRATOR_ACCEPTANCE.md";

export async function loadGate0ProgressSnapshotFreshnessInput(
  rootDir: string
): Promise<Gate0ProgressSnapshotFreshnessInput> {
  return {
    assignmentIds: await listAssignmentIds(path.join(rootDir, "ops", "assignments")),
    acceptedIds: await listAcceptedIds(path.join(rootDir, "ops", "runtime", "reviews")),
    tracklist: await readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8"),
    snapshot: await readFile(
      path.join(rootDir, "ops", "runtime", "progress", "GATE0_PROGRESS_SNAPSHOT.md"),
      "utf8"
    )
  };
}

export function checkGate0ProgressSnapshotFreshness(
  input: Gate0ProgressSnapshotFreshnessInput
): Gate0ProgressSnapshotFreshnessResult {
  const assignmentIds = [...new Set(input.assignmentIds)].sort(comparePacketIds);
  const acceptedIds = [...new Set(input.acceptedIds)].sort(comparePacketIds);
  const latestAcceptedPacket = readTableValue(input.tracklist, "Latest accepted packet");
  const snapshotLatestAcceptedPacket = readTableValue(input.snapshot, "Latest accepted packet");
  const assignmentCount = assignmentIds.length;
  const acceptedCount = acceptedIds.length;
  const openCount = assignmentCount - acceptedCount;
  const snapshotAssignmentCount = readNumberValue(input.snapshot, "Assignment count");
  const snapshotAcceptedCount = readNumberValue(input.snapshot, "Accepted count");
  const snapshotOpenCount = readNumberValue(input.snapshot, "Open count");
  const findings: string[] = [];

  if (snapshotLatestAcceptedPacket !== latestAcceptedPacket) {
    findings.push(
      `Latest accepted packet mismatch: snapshot=${snapshotLatestAcceptedPacket}, tracklist=${latestAcceptedPacket}`
    );
  }

  if (snapshotAssignmentCount !== assignmentCount) {
    findings.push(
      `Assignment count mismatch: snapshot=${snapshotAssignmentCount}, records=${assignmentCount}`
    );
  }

  if (snapshotAcceptedCount !== acceptedCount) {
    findings.push(
      `Accepted count mismatch: snapshot=${snapshotAcceptedCount}, records=${acceptedCount}`
    );
  }

  if (snapshotOpenCount !== openCount) {
    findings.push(`Open count mismatch: snapshot=${snapshotOpenCount}, records=${openCount}`);
  }

  return {
    ok: findings.length === 0,
    findings,
    latestAcceptedPacket,
    snapshotLatestAcceptedPacket,
    assignmentCount,
    snapshotAssignmentCount,
    acceptedCount,
    snapshotAcceptedCount,
    openCount,
    snapshotOpenCount
  };
}

export function renderGate0ProgressSnapshotFreshnessResult(
  result: Gate0ProgressSnapshotFreshnessResult
): string {
  if (result.ok) {
    return [
      "Gate 0 progress snapshot freshness passed.",
      `Latest accepted packet: ${result.latestAcceptedPacket}`,
      `Assignment count: ${result.assignmentCount}`,
      `Accepted count: ${result.acceptedCount}`,
      `Open count: ${result.openCount}`
    ].join("\n");
  }

  return ["Gate 0 progress snapshot freshness failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0ProgressSnapshotFreshnessInput(process.cwd());
  const result = checkGate0ProgressSnapshotFreshness(input);
  const output = renderGate0ProgressSnapshotFreshnessResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

async function listAssignmentIds(assignmentDir: string): Promise<readonly string[]> {
  const entries = await readdir(assignmentDir);

  return entries
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => entry.match(assignmentPattern)?.[0])
    .filter((packetId): packetId is string => packetId !== undefined)
    .sort(comparePacketIds);
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

function readNumberValue(markdown: string, field: string): number {
  const value = Number(readTableValue(markdown, field));

  if (!Number.isInteger(value)) {
    throw new Error(`Invalid numeric value for ${field}`);
  }

  return value;
}

function readTableValue(markdown: string, field: string): string {
  const line = markdown.split("\n").find((candidate) => candidate.includes(`| ${field}`));
  const value = line?.split("|")[2]?.trim();

  if (!value) {
    throw new Error(`Missing field: ${field}`);
  }

  return value.replaceAll("`", "");
}

function comparePacketIds(left: string, right: string): number {
  return Number(left.replace("TRD-", "")) - Number(right.replace("TRD-", ""));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
