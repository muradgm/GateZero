import { describe, expect, it } from "vitest";
import {
  checkGate0TracklistSectionLength,
  renderGate0TracklistSectionLengthResult
} from "../../../scripts/check-gate0-tracklist-section-length.js";

describe("Gate 0 tracklist section length check", () => {
  it("passes when sections stay under the configured line limit", () => {
    const result = checkGate0TracklistSectionLength({
      tracklist: ["# Tracklist", "## One", "a", "b", "## Two", "c"].join("\n"),
      maxSectionLines: 3
    });

    expect(result.ok).toBe(true);
    expect(renderGate0TracklistSectionLengthResult(result)).toContain(
      "Gate 0 tracklist section length check passed."
    );
  });

  it("fails when a section is too long", () => {
    const result = checkGate0TracklistSectionLength({
      tracklist: ["# Tracklist", "## Large", "a", "b", "c"].join("\n"),
      maxSectionLines: 3
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Oversized tracklist section: Large has 4 lines, max 3");
  });
});
