import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  CommandCenterRuntimeDataSchema,
  RuntimeStatusSchema,
  type CommandCenterRuntimeData,
  type RuntimeStatus
} from "../packages/contracts/src/index.js";
import { currentRuntimeStatus } from "../packages/fixtures/src/runtime-status/current-runtime-status.js";

const acceptanceSuffix = "_ORCHESTRATOR_ACCEPTANCE.md";
const runtimeSource = "local repository evidence";

interface RuntimeRepositoryEvidence {
  readonly evidenceIndex: string;
  readonly latestPacket: string;
  readonly validation: {
    readonly testFileCount: number;
    readonly testCount: number;
  };
  readonly latestEvidence: {
    readonly runId: string;
    readonly commit: string;
  };
}

export async function buildCanonicalRuntimeStatus(
  rootDir = process.cwd(),
  generatedAt = new Date().toISOString()
): Promise<RuntimeStatus> {
  const evidence = await readRuntimeRepositoryEvidence(rootDir);

  return RuntimeStatusSchema.parse({
    ...currentRuntimeStatus,
    latestAcceptedEvidenceId: evidence.latestPacket,
    validation: {
      testFileCount: evidence.validation.testFileCount,
      testCount: evidence.validation.testCount,
      status: "passing",
      command: "pnpm verify"
    },
    ci: {
      lastVerifiedCommit: evidence.latestEvidence.commit,
      latestRunId: evidence.latestEvidence.runId,
      state: "success"
    },
    generatedAt
  });
}

export async function buildCommandCenterRuntimeData(
  rootDir = process.cwd()
): Promise<CommandCenterRuntimeData> {
  const [status, evidence, acceptedRecords] = await Promise.all([
    buildCanonicalRuntimeStatus(rootDir),
    readRuntimeRepositoryEvidence(rootDir),
    countAcceptedRecords(path.join(rootDir, "ops", "runtime", "reviews"))
  ]);

  return CommandCenterRuntimeDataSchema.parse({
    project: status.product,
    gate: status.operatingGate,
    scope: status.operatingScope,
    source: runtimeSource,
    localOnly: true,
    evidenceOnly: true,
    operatorRequired: true,
    riskReviewRequired: true,
    externalAccess: status.executionAuthority === "none" ? false : false,
    executionPath: false,
    automatedAction: false,
    approvalClaim: false,
    performanceClaim: false,
    latestPacket: status.latestAcceptedEvidenceId,
    localVerification: `${status.validation?.testFileCount ?? 0} files / ${status.validation?.testCount ?? 0} tests`,
    testFileCount: status.validation?.testFileCount ?? 0,
    testCount: status.validation?.testCount ?? 0,
    ciRun: status.ci?.latestRunId,
    ciState: status.ci?.state,
    lastVerifiedCommit: status.ci?.lastVerifiedCommit,
    acceptedRecords,
    evidenceRecords: countEvidenceRecords(evidence.evidenceIndex)
  });
}

// Compatibility alias retained until the preview endpoint migrates to the canonical status contract.
export const buildTraderFrameRuntimeStatus = buildCommandCenterRuntimeData;

async function readRuntimeRepositoryEvidence(rootDir: string): Promise<RuntimeRepositoryEvidence> {
  const [tracklist, evidenceIndex] = await Promise.all([
    readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8"),
    readFile(
      path.join(rootDir, "docs", "operations", "GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md"),
      "utf8"
    )
  ]);

  return {
    evidenceIndex,
    latestPacket: readTracklistValue(tracklist, "Latest accepted packet"),
    validation: readValidationSummary(
      readTracklistValue(tracklist, "Latest accepted validation")
    ),
    latestEvidence: readLatestEvidenceRecord(evidenceIndex)
  };
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

function readValidationSummary(value: string): {
  readonly testFileCount: number;
  readonly testCount: number;
} {
  const match = value.match(/(\d+) test files,\s+(\d+) tests passed/);

  if (!match) {
    throw new Error(`Invalid tracklist validation summary: ${value}`);
  }

  return {
    testFileCount: Number(match[1]),
    testCount: Number(match[2])
  };
}

async function main(): Promise<void> {
  console.log(JSON.stringify(await buildCanonicalRuntimeStatus(), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
