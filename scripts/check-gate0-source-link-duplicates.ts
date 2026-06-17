import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0SourceLinkDuplicatesInput {
  readonly tracklist: string;
}

export interface Gate0SourceLinkDuplicatesResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly checkedLinks: number;
}

const sourceLinksHeading = "## Source Of Truth Links";
const nextHeadingPattern = /^## /;
const backtickPathPattern = /`([^`]+\.(?:md|ts|js|json|yml|yaml|css|html))`/g;

export async function loadGate0SourceLinkDuplicatesInput(
  rootDir: string
): Promise<Gate0SourceLinkDuplicatesInput> {
  return {
    tracklist: await readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8")
  };
}

export function checkGate0SourceLinkDuplicates(
  input: Gate0SourceLinkDuplicatesInput
): Gate0SourceLinkDuplicatesResult {
  const findings: string[] = [];
  const sourceLinks = extractSourceLinksSection(input.tracklist);
  const linkCounts = new Map<string, number>();

  for (const match of sourceLinks.matchAll(backtickPathPattern)) {
    const link = match[1];

    if (!link) {
      continue;
    }

    linkCounts.set(link, (linkCounts.get(link) ?? 0) + 1);
  }

  for (const [link, count] of [...linkCounts.entries()].sort()) {
    if (count > 1) {
      findings.push(`Duplicate source link: ${link} (${count} entries)`);
    }
  }

  return {
    ok: findings.length === 0,
    findings,
    checkedLinks: linkCounts.size
  };
}

export function renderGate0SourceLinkDuplicatesResult(
  result: Gate0SourceLinkDuplicatesResult
): string {
  if (result.ok) {
    return [
      "Gate 0 source-link duplicate check passed.",
      `Checked links: ${result.checkedLinks}`
    ].join("\n");
  }

  return ["Gate 0 source-link duplicate check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0SourceLinkDuplicatesInput(process.cwd());
  const result = checkGate0SourceLinkDuplicates(input);
  const output = renderGate0SourceLinkDuplicatesResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

function extractSourceLinksSection(tracklist: string): string {
  const lines = tracklist.split("\n");
  const sectionLines: string[] = [];
  let insideSourceLinks = false;

  for (const line of lines) {
    if (line.trim().startsWith(sourceLinksHeading)) {
      insideSourceLinks = true;
      continue;
    }

    if (insideSourceLinks && nextHeadingPattern.test(line)) {
      insideSourceLinks = false;
      continue;
    }

    if (insideSourceLinks) {
      sectionLines.push(line);
    }
  }

  if (sectionLines.length === 0) {
    throw new Error("Missing tracklist Source Of Truth Links section.");
  }

  return sectionLines.join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
