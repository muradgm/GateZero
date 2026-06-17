import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0TracklistSectionLengthInput {
  readonly tracklist: string;
  readonly maxSectionLines: number;
}

export interface Gate0TracklistSectionLengthResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly checkedSections: number;
}

const headingPattern = /^##\s+(.+)$/;

export async function loadGate0TracklistSectionLengthInput(
  rootDir: string
): Promise<Gate0TracklistSectionLengthInput> {
  return {
    tracklist: await readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8"),
    maxSectionLines: 320
  };
}

export function checkGate0TracklistSectionLength(
  input: Gate0TracklistSectionLengthInput
): Gate0TracklistSectionLengthResult {
  const findings: string[] = [];
  const sections = splitSections(input.tracklist);

  for (const section of sections) {
    if (section.lines > input.maxSectionLines) {
      findings.push(
        `Oversized tracklist section: ${section.title} has ${section.lines} lines, max ${input.maxSectionLines}`
      );
    }
  }

  return {
    ok: findings.length === 0,
    findings,
    checkedSections: sections.length
  };
}

export function renderGate0TracklistSectionLengthResult(
  result: Gate0TracklistSectionLengthResult
): string {
  if (result.ok) {
    return [
      "Gate 0 tracklist section length check passed.",
      `Checked sections: ${result.checkedSections}`
    ].join("\n");
  }

  return ["Gate 0 tracklist section length check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0TracklistSectionLengthInput(process.cwd());
  const result = checkGate0TracklistSectionLength(input);
  const output = renderGate0TracklistSectionLengthResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

function splitSections(
  tracklist: string
): readonly { readonly title: string; readonly lines: number }[] {
  const sections: { title: string; lines: number }[] = [];
  let currentTitle = "preamble";
  let currentLines = 0;

  for (const line of tracklist.split("\n")) {
    const heading = line.match(headingPattern);

    if (heading) {
      sections.push({ title: currentTitle, lines: currentLines });
      currentTitle = heading[1] ?? "untitled";
      currentLines = 1;
      continue;
    }

    currentLines += 1;
  }

  sections.push({ title: currentTitle, lines: currentLines });

  return sections.filter((section) => section.lines > 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
