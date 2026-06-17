import { describe, expect, it } from "vitest";
import {
  checkGate0SourceLinkDuplicates,
  renderGate0SourceLinkDuplicatesResult
} from "../../../scripts/check-gate0-source-link-duplicates.js";

const baseTracklist = [
  "# Tracklist",
  "## Source Of Truth Links",
  "- Alpha: `docs/operations/A.md`",
  "- Beta: `scripts/b.ts`",
  "## Source Of Truth Links Continued",
  "- Gamma: `docs/operations/C.md`",
  "## Other"
].join("\n");

describe("Gate 0 source-link duplicate check", () => {
  it("passes when tracklist source links are unique", () => {
    const result = checkGate0SourceLinkDuplicates({ tracklist: baseTracklist });

    expect(result.ok).toBe(true);
    expect(renderGate0SourceLinkDuplicatesResult(result)).toContain(
      "Gate 0 source-link duplicate check passed."
    );
  });

  it("fails when a source link appears more than once", () => {
    const result = checkGate0SourceLinkDuplicates({
      tracklist: baseTracklist.replace("## Other", "- Duplicate: `docs/operations/A.md`\n## Other")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Duplicate source link: docs/operations/A.md (2 entries)");
  });
});
