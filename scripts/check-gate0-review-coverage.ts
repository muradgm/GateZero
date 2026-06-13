import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0ReviewCoverageInput {
  readonly assignmentIds: readonly string[];
  readonly qaReviewIds: readonly string[];
  readonly riskReviewIds: readonly string[];
  readonly acceptanceIds: readonly string[];
}

export interface Gate0ReviewCoverageResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly assignmentCount: number;
  readonly qaReviewCount: number;
  readonly riskReviewCount: number;
  readonly acceptanceCount: number;
}

const packetIdPattern = /^(TRD-\d+)/;

export async function loadGate0ReviewCoverageInput(
  rootDir: string
): Promise<Gate0ReviewCoverageInput> {
  const assignmentsDir = path.join(rootDir, "ops", "assignments");
  const reviewsDir = path.join(rootDir, "ops", "runtime", "reviews");

  return {
    assignmentIds: await listPacketIds(assignmentsDir, ".md"),
    qaReviewIds: await listPacketIds(reviewsDir, "_QA_SECURITY_REVIEW.md"),
    riskReviewIds: await listPacketIds(reviewsDir, "_RISK_REVIEW.md"),
    acceptanceIds: await listPacketIds(reviewsDir, "_ORCHESTRATOR_ACCEPTANCE.md")
  };
}

export function checkGate0ReviewCoverage(
  input: Gate0ReviewCoverageInput
): Gate0ReviewCoverageResult {
  const assignmentIds = uniqueSortedPacketIds(input.assignmentIds);
  const qaReviewIds = uniqueSortedPacketIds(input.qaReviewIds);
  const riskReviewIds = uniqueSortedPacketIds(input.riskReviewIds);
  const acceptanceIds = uniqueSortedPacketIds(input.acceptanceIds);
  const findings = [
    ...comparePacketSets("QA_SECURITY review", assignmentIds, qaReviewIds),
    ...comparePacketSets("RISK review", assignmentIds, riskReviewIds),
    ...comparePacketSets("ORCHESTRATOR acceptance", assignmentIds, acceptanceIds)
  ];

  return {
    ok: findings.length === 0,
    findings,
    assignmentCount: assignmentIds.length,
    qaReviewCount: qaReviewIds.length,
    riskReviewCount: riskReviewIds.length,
    acceptanceCount: acceptanceIds.length
  };
}

export function renderGate0ReviewCoverageResult(result: Gate0ReviewCoverageResult): string {
  if (result.ok) {
    return [
      "Gate 0 review coverage check passed.",
      `Assignments: ${result.assignmentCount}`,
      `QA_SECURITY reviews: ${result.qaReviewCount}`,
      `RISK reviews: ${result.riskReviewCount}`,
      `ORCHESTRATOR acceptances: ${result.acceptanceCount}`
    ].join("\n");
  }

  return ["Gate 0 review coverage check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0ReviewCoverageInput(process.cwd());
  const result = checkGate0ReviewCoverage(input);
  const output = renderGate0ReviewCoverageResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

async function listPacketIds(dir: string, suffix: string): Promise<readonly string[]> {
  const entries = await readdir(dir);
  const packetIds: string[] = [];

  for (const entry of entries) {
    if (!entry.endsWith(suffix)) {
      continue;
    }

    const packetId = entry.match(packetIdPattern)?.[1];

    if (packetId) {
      packetIds.push(packetId);
    }
  }

  return uniqueSortedPacketIds(packetIds);
}

function comparePacketSets(
  label: string,
  assignmentIds: readonly string[],
  reviewIds: readonly string[]
): readonly string[] {
  const findings: string[] = [];

  for (const assignmentId of assignmentIds) {
    if (!reviewIds.includes(assignmentId)) {
      findings.push(`Missing ${label}: ${assignmentId}`);
    }
  }

  for (const reviewId of reviewIds) {
    if (!assignmentIds.includes(reviewId)) {
      findings.push(`Unexpected ${label}: ${reviewId}`);
    }
  }

  return findings;
}

function uniqueSortedPacketIds(packetIds: readonly string[]): readonly string[] {
  return [...new Set(packetIds)].sort(comparePacketIds);
}

function comparePacketIds(left: string, right: string): number {
  return Number(left.replace("TRD-", "")) - Number(right.replace("TRD-", ""));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
