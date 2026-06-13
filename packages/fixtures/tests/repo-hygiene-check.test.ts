import { describe, expect, it } from "vitest";
import {
  checkRepoHygiene,
  renderRepoHygieneCheckResult,
  type RepoHygieneCheckInput
} from "../../../scripts/check-repo-hygiene.js";

const completeInput: RepoHygieneCheckInput = {
  gitignore: [
    "node_modules/",
    "dist/",
    "build/",
    "coverage/",
    ".env",
    ".env.*",
    "*.log",
    ".cache/"
  ].join("\n"),
  trackedFiles: ["package.json", "scripts/check-repo-hygiene.ts"]
};

describe("repository hygiene check", () => {
  it("passes when generated and local files are ignored and untracked", () => {
    const result = checkRepoHygiene(completeInput);

    expect(result).toEqual({
      ok: true,
      findings: [],
      trackedFileCount: 2
    });
    expect(renderRepoHygieneCheckResult(result)).toContain("Repository hygiene check passed.");
  });

  it("fails when required ignore entries are missing", () => {
    const result = checkRepoHygiene({
      ...completeInput,
      gitignore: "node_modules/"
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Missing .gitignore entry: dist/");
    expect(result.findings).toContain("Missing .gitignore entry: .env");
  });

  it("fails when blocked generated or local files are tracked", () => {
    const result = checkRepoHygiene({
      ...completeInput,
      trackedFiles: ["node_modules/package/index.js", ".env.local", "coverage/report.json"]
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Blocked generated or local file is tracked: node_modules/package/index.js"
    );
    expect(result.findings).toContain("Blocked generated or local file is tracked: .env.local");
    expect(result.findings).toContain(
      "Blocked generated or local file is tracked: coverage/report.json"
    );
  });
});
