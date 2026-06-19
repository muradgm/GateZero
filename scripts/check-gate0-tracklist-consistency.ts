import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0TracklistConsistencyInput {
  readonly acceptedIds: readonly string[];
  readonly tracklist: string;
}

export interface Gate0TracklistConsistencyResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly acceptedCount: number;
  readonly ledgerCount: number;
  readonly latestAcceptedPacket: string;
}

const assignmentPattern = /^TRD-\d+/;
const acceptanceSuffix = "_ORCHESTRATOR_ACCEPTANCE.md";

export async function loadGate0TracklistConsistencyInput(
  rootDir: string
): Promise<Gate0TracklistConsistencyInput> {
  const reviewDir = path.join(rootDir, "ops", "runtime", "reviews");

  return {
    acceptedIds: await listAcceptedIds(reviewDir),
    tracklist: await readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8")
  };
}

export function checkGate0TracklistConsistency(
  input: Gate0TracklistConsistencyInput
): Gate0TracklistConsistencyResult {
  const acceptedIds = [...new Set(input.acceptedIds)].sort(comparePacketIds);
  const ledgerIds = extractAcceptedLedgerIds(input.tracklist);
  const latestAcceptedPacket = readTracklistValue(input.tracklist, "Latest accepted packet");
  const expectedLatestAcceptedPacket = acceptedIds.at(-1) ?? "";
  const findings: string[] = [];

  if (latestAcceptedPacket !== expectedLatestAcceptedPacket) {
    findings.push(
      `Latest accepted packet mismatch: tracklist=${latestAcceptedPacket}, records=${expectedLatestAcceptedPacket}`
    );
  }

  for (const acceptedId of acceptedIds) {
    if (!ledgerIds.includes(acceptedId)) {
      findings.push(`Missing accepted packet ledger row: ${acceptedId}`);
    }
  }

  for (const ledgerId of ledgerIds) {
    if (!acceptedIds.includes(ledgerId)) {
      findings.push(`Unexpected accepted packet ledger row: ${ledgerId}`);
    }
  }

  return {
    ok: findings.length === 0,
    findings,
    acceptedCount: acceptedIds.length,
    ledgerCount: ledgerIds.length,
    latestAcceptedPacket
  };
}

export function renderGate0TracklistConsistencyResult(
  result: Gate0TracklistConsistencyResult
): string {
  if (result.ok) {
    return [
      "Gate 0 tracklist consistency passed.",
      `Accepted records: ${result.acceptedCount}`,
      `Tracklist ledger rows: ${result.ledgerCount}`,
      `Latest accepted packet: ${result.latestAcceptedPacket}`
    ].join("\n");
  }

  return ["Gate 0 tracklist consistency failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0TracklistConsistencyInput(process.cwd());
  const result = checkGate0TracklistConsistency(input);

  const output = renderGate0TracklistConsistencyResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

function extractAcceptedLedgerIds(tracklist: string): readonly string[] {
  const ledgerSection = readSectionsWithPrefix(tracklist, "Accepted Packet Ledger").join("\n");
  const ledgerIds: string[] = [];

  for (const line of ledgerSection.split("\n")) {
    if (!line.includes("| accepted |")) {
      continue;
    }

    const packetId = line.match(/`(TRD-\d+)`/)?.[1];

    if (packetId) {
      ledgerIds.push(packetId);
    }
  }

  return ledgerIds.sort(comparePacketIds);
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

function readSectionsWithPrefix(markdown: string, headingPrefix: string): readonly string[] {
  const sections = splitTopLevelSections(markdown).filter((section) =>
    section.heading.startsWith(headingPrefix)
  );

  if (sections.length === 0) {
    throw new Error(`Missing tracklist section: ## ${headingPrefix}`);
  }

  return sections.map((section) => section.content);
}

function splitTopLevelSections(
  markdown: string
): readonly { readonly heading: string; readonly content: string }[] {
  const lines = markdown.split("\n");
  const sections: { heading: string; contentLines: string[] }[] = [];
  let current: { heading: string; contentLines: string[] } | undefined;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/)?.[1];

    if (heading) {
      if (current) {
        sections.push(current);
      }

      current = { heading, contentLines: [line] };
      continue;
    }

    current?.contentLines.push(line);
  }

  if (current) {
    sections.push(current);
  }

  return sections.map((section) => ({
    heading: section.heading,
    content: section.contentLines.join("\n")
  }));
}

function comparePacketIds(left: string, right: string): number {
  return Number(left.replace("TRD-", "")) - Number(right.replace("TRD-", ""));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
