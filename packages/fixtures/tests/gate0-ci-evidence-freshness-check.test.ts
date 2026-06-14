import { describe, expect, it } from "vitest";
import {
  checkGate0CiEvidenceFreshness,
  renderGate0CiEvidenceFreshnessResult,
  type Gate0CiEvidenceFreshnessInput
} from "../../../scripts/check-gate0-ci-evidence-freshness.js";

const completeInput: Gate0CiEvidenceFreshnessInput = {
  currentHeadSha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  knownCommitShas: [
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  ],
  nowIso: "2026-06-14T08:00:00Z",
  maxAgeDays: 14,
  evidenceFiles: [
    {
      relativePath: "docs/operations/GATE0_GITHUB_CI_POST_PUSH_EVIDENCE.md",
      content: [
        "| Field | Value |",
        "| --- | --- |",
        "| Workflow | `Gate 0 Verification` |",
        "| Run id | `1` |",
        "| Event | `push` |",
        "| Status | `completed` |",
        "| Conclusion | `success` |",
        "| Commit | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` |",
        "| Updated | `2026-06-14T07:00:00Z` |",
        "| URL | `https://github.com/muradgm/GateZero/actions/runs/1` |"
      ].join("\n")
    }
  ]
};

describe("Gate 0 CI evidence freshness check", () => {
  it("passes when the latest CI evidence is successful, recent, and tied to local history", () => {
    const result = checkGate0CiEvidenceFreshness(completeInput);

    expect(result).toEqual({
      ok: true,
      findings: [],
      evidenceCount: 1,
      latestEvidencePath: "docs/operations/GATE0_GITHUB_CI_POST_PUSH_EVIDENCE.md",
      latestEvidenceCommit: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      latestEvidenceAgeDays: 0
    });
    expect(renderGate0CiEvidenceFreshnessResult(result)).toContain(
      "Gate 0 CI evidence freshness check passed."
    );
  });

  it("fails when the latest CI evidence is not successful", () => {
    const result = checkGate0CiEvidenceFreshness({
      ...completeInput,
      evidenceFiles: completeInput.evidenceFiles.map((file) => ({
        ...file,
        content: file.content.replace("| Conclusion | `success` |", "| Conclusion | `failure` |")
      }))
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Latest CI evidence is not successful: failure");
  });

  it("fails when the latest CI evidence commit is unknown locally", () => {
    const result = checkGate0CiEvidenceFreshness({
      ...completeInput,
      knownCommitShas: ["bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"]
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Latest CI evidence commit is not in local git history: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    );
  });

  it("fails when the latest CI evidence is stale", () => {
    const result = checkGate0CiEvidenceFreshness({
      ...completeInput,
      nowIso: "2026-07-15T08:00:00Z"
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Latest CI evidence is stale: 31 days old, max 14 days");
  });
});
