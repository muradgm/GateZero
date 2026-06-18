import { execFileSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { format, resolveConfig } from "prettier";

export interface Gate0CiRunMetadata {
  readonly conclusion: string;
  readonly createdAt: string;
  readonly databaseId: number;
  readonly displayTitle: string;
  readonly event: string;
  readonly headSha: string;
  readonly status: string;
  readonly updatedAt: string;
  readonly url: string;
  readonly workflowName: string;
}

export interface Gate0CiEvidenceRefreshOptions {
  readonly afterPacketId: string;
  readonly packetId: string;
  readonly recordPath: string;
}

export interface Gate0CiEvidenceRefreshResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly packetId: string;
  readonly runId: string;
  readonly shortCommit: string;
  readonly recordPath: string;
}

const acceptanceSuffix = "_ORCHESTRATOR_ACCEPTANCE.md";
const runViewFields = [
  "conclusion",
  "createdAt",
  "databaseId",
  "displayTitle",
  "event",
  "headSha",
  "status",
  "updatedAt",
  "url",
  "workflowName"
].join(",");

export function validateGate0CiRunMetadata(
  metadata: Gate0CiRunMetadata
): Gate0CiEvidenceRefreshResult["findings"] {
  const findings: string[] = [];

  if (metadata.workflowName !== "Gate 0 Verification") {
    findings.push(`Unexpected workflow: ${metadata.workflowName}`);
  }

  if (metadata.event !== "push") {
    findings.push(`Unexpected event: ${metadata.event}`);
  }

  if (metadata.status !== "completed") {
    findings.push(`Run is not completed: ${metadata.status}`);
  }

  if (metadata.conclusion !== "success") {
    findings.push(`Run is not successful: ${metadata.conclusion}`);
  }

  if (!Number.isInteger(metadata.databaseId) || metadata.databaseId <= 0) {
    findings.push(`Invalid run id: ${metadata.databaseId}`);
  }

  if (!metadata.url.includes(`actions/runs/${metadata.databaseId}`)) {
    findings.push(`Run URL does not match run id: ${metadata.url}`);
  }

  if (!metadata.headSha.match(/^[a-f0-9]{40}$/)) {
    findings.push(`Invalid commit SHA: ${metadata.headSha}`);
  }

  return findings;
}

export function renderGate0CiEvidenceRecord(
  metadata: Gate0CiRunMetadata,
  options: Gate0CiEvidenceRefreshOptions
): string {
  return [
    `# Gate 0 Remote CI Evidence Refresh After ${options.afterPacketId} Push`,
    "",
    "## Purpose",
    "",
    `This record captures the successful GitHub Actions evidence after ${options.afterPacketId} was pushed to`,
    "`main`.",
    "",
    "This is repository-quality evidence only. It does not approve deployment, strategy readiness,",
    "profitability, execution authority, product expansion, or gate movement.",
    "",
    "## CI Evidence",
    "",
    "| Field      | Value                                                          |",
    "| ---------- | -------------------------------------------------------------- |",
    `| Workflow   | \`${metadata.workflowName}\`                                          |`,
    `| Run id     | \`${metadata.databaseId}\`                                                  |`,
    `| Event      | \`${metadata.event}\`                                                         |`,
    `| Status     | \`${metadata.status}\`                                                    |`,
    `| Conclusion | \`${metadata.conclusion}\`                                                      |`,
    `| Commit     | \`${metadata.headSha}\`                     |`,
    `| Created    | \`${metadata.createdAt}\`                                         |`,
    `| Updated    | \`${metadata.updatedAt}\`                                         |`,
    `| URL        | \`${metadata.url}\` |`,
    "",
    "## Boundary",
    "",
    "This refresh does not add UI expansion, external execution, account connectivity, AI prediction,",
    "strategy approval, readiness claims, profitability claims, report publishing, or risk-gate",
    "movement.",
    "",
    "## Source Links",
    "",
    `- Source packet: \`ops/assignments/${options.packetId}_GATE0_CI_EVIDENCE_REFRESH_AUTOMATION.md\``,
    `- Reviews: \`ops/runtime/reviews/${options.packetId}_QA_SECURITY_REVIEW.md\`,`,
    `  \`ops/runtime/reviews/${options.packetId}_RISK_REVIEW.md\`,`,
    `  \`ops/runtime/reviews/${options.packetId}_ORCHESTRATOR_ACCEPTANCE.md\``,
    "- Remote evidence index: `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`",
    "- Refresh helper: `scripts/refresh-gate0-ci-evidence.ts`",
    "- Tracker: `ops/runtime/tracklist.md`",
    ""
  ].join("\n");
}

export function upsertGate0EvidenceIndexRow(
  evidenceIndex: string,
  metadata: Gate0CiRunMetadata,
  options: Gate0CiEvidenceRefreshOptions
): string {
  const row = renderEvidenceIndexRow(metadata, options);
  const rows = evidenceIndex.split("\n");
  const existingPacketIndex = rows.findIndex((line) => line.includes(`| \`${options.packetId}\``));
  const existingRunIndex = rows.findIndex((line) => line.includes(`| \`${metadata.databaseId}\``));

  if (existingRunIndex !== -1 && existingRunIndex !== existingPacketIndex) {
    throw new Error(`Run ${metadata.databaseId} is already recorded in the evidence index.`);
  }

  if (existingPacketIndex !== -1) {
    rows[existingPacketIndex] = row;
    return rows.join("\n");
  }

  const supportingRecordsIndex = rows.findIndex((line) => line.trim() === "## Supporting Records");

  if (supportingRecordsIndex === -1) {
    throw new Error("Missing Supporting Records section in evidence index.");
  }

  rows.splice(supportingRecordsIndex - 1, 0, row);
  return rows.join("\n");
}

export function updateCommandCenterCiMetadata(
  commandCenterData: string,
  metadata: Gate0CiRunMetadata,
  packetId: string,
  acceptedRecords: number
): string {
  return commandCenterData
    .replace(/latestPacket: "TRD-\d+"/, `latestPacket: "${packetId}"`)
    .replace(/ciRun: "\d+"/, `ciRun: "${metadata.databaseId}"`)
    .replace(/lastVerifiedCommit: "[a-f0-9]+"/, `lastVerifiedCommit: "${shortCommit(metadata)}"`)
    .replace(/value: "\d+ \/ \d+"/, `value: "${acceptedRecords} / ${acceptedRecords}"`)
    .replace(
      /reference: "\d+ accepted records"/,
      `reference: "${acceptedRecords} accepted records"`
    )
    .replace(/signal: "Run \d+"/, `signal: "Run ${metadata.databaseId}"`)
    .replace(/reference: "Run \d+"/, `reference: "Run ${metadata.databaseId}"`);
}

export function renderGate0CiEvidenceRefreshResult(result: Gate0CiEvidenceRefreshResult): string {
  if (result.ok) {
    return [
      "Gate 0 CI evidence refresh prepared.",
      `Packet: ${result.packetId}`,
      `Run id: ${result.runId}`,
      `Commit: ${result.shortCommit}`,
      `Record: ${result.recordPath}`
    ].join("\n");
  }

  return ["Gate 0 CI evidence refresh blocked.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const rootDir = process.cwd();
  const { runId, repo, options } = parseArgs(process.argv.slice(2));
  const metadata = fetchRunMetadata(runId, repo);
  const findings = validateGate0CiRunMetadata(metadata);

  if (findings.length > 0) {
    console.error(
      renderGate0CiEvidenceRefreshResult({
        ok: false,
        findings,
        packetId: options.packetId,
        runId: String(metadata.databaseId),
        shortCommit: shortCommit(metadata),
        recordPath: options.recordPath
      })
    );
    process.exitCode = 1;
    return;
  }

  await writeRefreshFiles(rootDir, metadata, options);
  console.log(
    renderGate0CiEvidenceRefreshResult({
      ok: true,
      findings: [],
      packetId: options.packetId,
      runId: String(metadata.databaseId),
      shortCommit: shortCommit(metadata),
      recordPath: options.recordPath
    })
  );
}

async function writeRefreshFiles(
  rootDir: string,
  metadata: Gate0CiRunMetadata,
  options: Gate0CiEvidenceRefreshOptions
): Promise<void> {
  const evidenceIndexPath = path.join(
    rootDir,
    "docs",
    "operations",
    "GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md"
  );
  const commandCenterDataPath = path.join(rootDir, "apps", "web", "src", "command-center-data.js");
  const reviewDir = path.join(rootDir, "ops", "runtime", "reviews");
  const [evidenceIndex, commandCenterData, acceptedRecords, packetAlreadyAccepted] =
    await Promise.all([
      readFile(evidenceIndexPath, "utf8"),
      readFile(commandCenterDataPath, "utf8"),
      countAcceptedRecords(reviewDir),
      hasAcceptedPacket(reviewDir, options.packetId)
    ]);

  const evidenceRecordPath = path.join(rootDir, options.recordPath);
  await writeFile(
    evidenceRecordPath,
    await formatWithRepoConfig(evidenceRecordPath, renderGate0CiEvidenceRecord(metadata, options), {
      parser: "markdown"
    }),
    "utf8"
  );
  await writeFile(
    evidenceIndexPath,
    await formatWithRepoConfig(
      evidenceIndexPath,
      upsertGate0EvidenceIndexRow(evidenceIndex, metadata, options),
      {
        parser: "markdown"
      }
    )
  );
  await writeFile(
    commandCenterDataPath,
    await formatWithRepoConfig(
      commandCenterDataPath,
      updateCommandCenterCiMetadata(
        commandCenterData,
        metadata,
        options.packetId,
        acceptedRecords + (packetAlreadyAccepted ? 0 : 1)
      ),
      { parser: "babel" }
    )
  );
}

async function hasAcceptedPacket(reviewDir: string, packetId: string): Promise<boolean> {
  try {
    const content = await readFile(
      path.join(reviewDir, `${packetId}_ORCHESTRATOR_ACCEPTANCE.md`),
      "utf8"
    );

    return content.includes("`accepted`");
  } catch {
    return false;
  }
}

async function countAcceptedRecords(reviewDir: string): Promise<number> {
  const entries = await readdir(reviewDir);

  return entries.filter((entry) => entry.endsWith(acceptanceSuffix)).length;
}

function parseArgs(args: readonly string[]): {
  readonly runId: string;
  readonly repo: string;
  readonly options: Gate0CiEvidenceRefreshOptions;
} {
  const runId = readArg(args, "--run");
  const packetId = readArg(args, "--packet");
  const afterPacketId = readArg(args, "--after") ?? packetId;
  const recordPath = readArg(args, "--record");
  const repo = readArg(args, "--repo") ?? "muradgm/GateZero";

  if (!runId || !packetId || !afterPacketId || !recordPath) {
    throw new Error(
      "Usage: pnpm refresh:gate0-ci-evidence -- --run <id> --packet <TRD-id> --after <TRD-id> --record <path>"
    );
  }

  if (!packetId.match(/^TRD-\d+$/)) {
    throw new Error(`Invalid packet id: ${packetId}`);
  }

  if (!afterPacketId.match(/^TRD-\d+$/)) {
    throw new Error(`Invalid after packet id: ${afterPacketId}`);
  }

  if (!recordPath.startsWith("docs/operations/") || !recordPath.endsWith(".md")) {
    throw new Error(`Record path must be under docs/operations and end with .md: ${recordPath}`);
  }

  return {
    runId,
    repo,
    options: {
      afterPacketId,
      packetId,
      recordPath
    }
  };
}

function readArg(args: readonly string[], name: string): string | undefined {
  const index = args.indexOf(name);

  return index === -1 ? undefined : args[index + 1];
}

function fetchRunMetadata(runId: string, repo: string): Gate0CiRunMetadata {
  const raw = execFileSync("gh", ["run", "view", runId, "--repo", repo, "--json", runViewFields], {
    encoding: "utf8"
  });

  return JSON.parse(raw) as Gate0CiRunMetadata;
}

async function formatWithRepoConfig(
  filePath: string,
  source: string,
  options: { readonly parser: "babel" | "markdown" }
): Promise<string> {
  return format(source, {
    ...((await resolveConfig(filePath)) ?? {}),
    ...options,
    filepath: filePath
  });
}

function renderEvidenceIndexRow(
  metadata: Gate0CiRunMetadata,
  options: Gate0CiEvidenceRefreshOptions
): string {
  return `| \`${options.packetId}\` | \`${options.recordPath}\` | \`${metadata.databaseId}\` | \`${shortCommit(metadata)}\` | \`${metadata.conclusion}\` |`;
}

function shortCommit(metadata: Gate0CiRunMetadata): string {
  return metadata.headSha.slice(0, 7);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
