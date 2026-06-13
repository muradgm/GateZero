import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0ProgressSnapshotInput {
  readonly assignmentIds: readonly string[];
  readonly acceptedIds: readonly string[];
  readonly generatedAt: string;
  readonly latestAcceptedPacket: string;
  readonly latestAcceptedValidation: string;
}

export interface Gate0ProgressSnapshotRecord {
  readonly packetId: string;
  readonly status: "accepted" | "not_accepted";
}

export interface Gate0ProgressSnapshot {
  readonly generatedAt: string;
  readonly latestAcceptedPacket: string;
  readonly latestAcceptedValidation: string;
  readonly assignmentCount: number;
  readonly acceptedCount: number;
  readonly openCount: number;
  readonly records: readonly Gate0ProgressSnapshotRecord[];
}

const assignmentPattern = /^TRD-\d+/;
const acceptanceSuffix = "_ORCHESTRATOR_ACCEPTANCE.md";

export async function loadGate0ProgressSnapshotInput(
  rootDir: string
): Promise<Gate0ProgressSnapshotInput> {
  const assignmentIds = await listAssignmentIds(path.join(rootDir, "ops", "assignments"));
  const acceptedIds = await listAcceptedIds(path.join(rootDir, "ops", "runtime", "reviews"));
  const tracklist = await readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8");

  return {
    assignmentIds,
    acceptedIds,
    generatedAt: readGeneratedDate(),
    latestAcceptedPacket: readTracklistValue(tracklist, "Latest accepted packet"),
    latestAcceptedValidation: readTracklistValue(tracklist, "Latest accepted validation")
  };
}

export function createGate0ProgressSnapshot(
  input: Gate0ProgressSnapshotInput
): Gate0ProgressSnapshot {
  const acceptedIdSet = new Set(input.acceptedIds);
  const records = input.assignmentIds.map((packetId) => ({
    packetId,
    status: acceptedIdSet.has(packetId) ? ("accepted" as const) : ("not_accepted" as const)
  }));

  return {
    generatedAt: input.generatedAt,
    latestAcceptedPacket: input.latestAcceptedPacket,
    latestAcceptedValidation: input.latestAcceptedValidation,
    assignmentCount: input.assignmentIds.length,
    acceptedCount: records.filter((record) => record.status === "accepted").length,
    openCount: records.filter((record) => record.status !== "accepted").length,
    records
  };
}

export function readGeneratedDate(date = new Date()): string {
  const configuredDate = process.env.GATEZERO_SNAPSHOT_DATE;

  if (configuredDate) {
    return configuredDate;
  }

  return date.toISOString().slice(0, 10);
}

export function renderGate0ProgressSnapshot(snapshot: Gate0ProgressSnapshot): string {
  const rows = snapshot.records.map((record) => [`\`${record.packetId}\``, `\`${record.status}\``]);

  return [
    "# Gate 0 Progress Snapshot",
    "",
    "## Summary",
    "",
    ...renderMarkdownTable(
      ["Field", "Value"],
      [
        ["Generated at", snapshot.generatedAt],
        ["Latest accepted packet", `\`${snapshot.latestAcceptedPacket}\``],
        ["Latest accepted validation", snapshot.latestAcceptedValidation],
        ["Assignment count", String(snapshot.assignmentCount)],
        ["Accepted count", String(snapshot.acceptedCount)],
        ["Open count", String(snapshot.openCount)]
      ]
    ),
    "",
    "## Boundary",
    "",
    ...renderMarkdownTable(
      ["Field", "Value"],
      [
        ["Financial gate", "`G0_RESEARCH`"],
        ["Scope", "`research_only`"],
        ["Source", "Local ops records"]
      ]
    ),
    "",
    "## Packet Status",
    "",
    ...renderMarkdownTable(["Packet", "Status"], rows),
    "",
    "## Notes",
    "",
    "- This snapshot is local and deterministic.",
    "- This snapshot summarizes accepted operating records only.",
    "- This snapshot does not change gate status, scope, risk controls, or operator decisions.",
    ""
  ].join("\n");
}

function renderMarkdownTable(
  headers: readonly string[],
  rows: readonly (readonly string[])[]
): readonly string[] {
  const widths = headers.map((header, index) => {
    const values = rows.map((row) => row[index] ?? "");
    return Math.max(header.length, ...values.map((value) => value.length), 3);
  });

  return [
    renderMarkdownTableRow(headers, widths),
    renderMarkdownTableRow(
      widths.map((width) => "-".repeat(width)),
      widths
    ),
    ...rows.map((row) => renderMarkdownTableRow(row, widths))
  ];
}

function renderMarkdownTableRow(row: readonly string[], widths: readonly number[]): string {
  const cells = widths.map((width, index) => (row[index] ?? "").padEnd(width, " "));

  return `| ${cells.join(" | ")} |`;
}

async function main(): Promise<void> {
  const rootDir = process.cwd();
  const outputPath = path.join(rootDir, "ops", "runtime", "progress", "GATE0_PROGRESS_SNAPSHOT.md");
  const input = await loadGate0ProgressSnapshotInput(rootDir);
  const snapshot = createGate0ProgressSnapshot(input);
  const output = renderGate0ProgressSnapshot(snapshot);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");

  console.log(`Gate 0 progress snapshot written: ${path.relative(rootDir, outputPath)}`);
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

function readTracklistValue(tracklist: string, field: string): string {
  const line = tracklist.split("\n").find((candidate) => candidate.includes(`| ${field}`));
  const value = line?.split("|")[2]?.trim();

  if (!value) {
    throw new Error(`Missing tracklist field: ${field}`);
  }

  return value.replaceAll("`", "");
}

function comparePacketIds(left: string, right: string): number {
  return Number(left.replace("TRD-", "")) - Number(right.replace("TRD-", ""));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
