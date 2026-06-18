import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  CommandCenterRuntimeDataSchema,
  type CommandCenterRuntimeData
} from "../packages/contracts/src/index.js";

const acceptanceSuffix = "_ORCHESTRATOR_ACCEPTANCE.md";

export async function buildCommandCenterRuntimeData(
  rootDir = process.cwd()
): Promise<CommandCenterRuntimeData> {
  const [tracklist, evidenceIndex, acceptedRecords] = await Promise.all([
    readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8"),
    readFile(
      path.join(rootDir, "docs", "operations", "GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md"),
      "utf8"
    ),
    countAcceptedRecords(path.join(rootDir, "ops", "runtime", "reviews"))
  ]);
  const latestEvidence = readLatestEvidenceRecord(evidenceIndex);

  return CommandCenterRuntimeDataSchema.parse({
    latestPacket: readTracklistValue(tracklist, "Latest accepted packet"),
    localVerification: normalizeValidationSummary(
      readTracklistValue(tracklist, "Latest accepted validation")
    ),
    ciRun: latestEvidence.runId,
    ciState: "success",
    lastVerifiedCommit: latestEvidence.commit,
    acceptedRecords,
    evidenceRecords: countEvidenceRecords(evidenceIndex)
  });
}

async function countAcceptedRecords(reviewDir: string): Promise<number> {
  const entries = await readdir(reviewDir);

  return entries.filter((entry) => entry.endsWith(acceptanceSuffix)).length;
}

function readLatestEvidenceRecord(evidenceIndex: string): {
  readonly runId: string;
  readonly commit: string;
} {
  const records = [
    ...evidenceIndex.matchAll(/\|\s+`TRD-\d+`\s+\|[^|]+\|\s+`(\d+)`\s+\|\s+`([a-f0-9]+)`/g)
  ];
  const latest = records.at(-1);

  if (!latest) {
    throw new Error("Missing remote verification evidence record.");
  }

  return {
    runId: latest[1] ?? "",
    commit: latest[2] ?? ""
  };
}

function countEvidenceRecords(evidenceIndex: string): number {
  return [...evidenceIndex.matchAll(/\|\s+`TRD-\d+`\s+\|/g)].length;
}

function readTracklistValue(tracklist: string, field: string): string {
  const line = tracklist.split("\n").find((candidate) => candidate.includes(`| ${field}`));
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

async function main(): Promise<void> {
  console.log(JSON.stringify(await buildCommandCenterRuntimeData(), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
