import { describe, expect, it } from "vitest";
import {
  checkGate0ProjectName,
  renderGate0ProjectNameCheckResult
} from "../../../scripts/check-gate0-project-name.js";

const packageJson = {
  relativePath: "package.json",
  content: JSON.stringify({
    name: "gatezero",
    description: "Gate 0 Research-Only foundation for GateZero."
  })
};

const tracklist = {
  relativePath: "ops/runtime/tracklist.md",
  content: [
    "# GateZero Project Tracklist",
    "",
    "| Field                      | Value |",
    "| -------------------------- | ----- |",
    "| Project                    | GateZero |",
    ""
  ].join("\n")
};

describe("Gate 0 project name check", () => {
  it("passes when app-name surfaces use GateZero", () => {
    const result = checkGate0ProjectName({
      files: [packageJson, tracklist, { relativePath: "README.md", content: "# GateZero" }]
    });

    expect(result).toEqual({
      ok: true,
      findings: [],
      checkedFileCount: 3
    });
    expect(renderGate0ProjectNameCheckResult(result)).toContain(
      "Gate 0 project name check passed."
    );
  });

  it("fails when old display name appears in content", () => {
    const result = checkGate0ProjectName({
      files: [
        packageJson,
        tracklist,
        { relativePath: "README.md", content: `# ${["Trade", "Frame"].join("")}` }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Previous display name found in file: README.md");
  });

  it("fails when old package name appears in paths", () => {
    const result = checkGate0ProjectName({
      files: [
        packageJson,
        tracklist,
        { relativePath: `docs/${["trade", "frame"].join("")}.md`, content: "# GateZero" }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      `Previous package name found in path: docs/${["trade", "frame"].join("")}.md`
    );
  });
});
