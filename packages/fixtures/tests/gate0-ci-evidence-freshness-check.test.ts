import { describe, expect, it } from "vitest";
import {
  checkGate0CiEvidenceFreshness,
  renderGate0CiEvidenceFreshnessResult,
  type Gate0CiEvidenceFreshnessInput
} from "../../../scripts/check-gate0-ci-evidence-freshness.js";

const baseEvidenceContent = [
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
].join("\n");

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
      content: baseEvidenceContent
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

  it("accepts remote CI evidence refresh records", () => {
    const result = checkGate0CiEvidenceFreshness({
      ...completeInput,
      evidenceFiles: [
        {
          relativePath:
            "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md",
          content: baseEvidenceContent
            .replace("| Run id | `1` |", "| Run id | `2` |")
            .replace("actions/runs/1", "actions/runs/2")
        }
      ]
    });

    expect(result.ok).toBe(true);
    expect(result.latestEvidencePath).toBe(
      "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md"
    );
  });

  it("counts GitHub, remote, and command-center CI evidence records", () => {
    const result = checkGate0CiEvidenceFreshness({
      ...completeInput,
      evidenceFiles: [
        {
          relativePath: "docs/operations/GATE0_GITHUB_CI_POST_PUSH_EVIDENCE.md",
          content: baseEvidenceContent
        },
        {
          relativePath:
            "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md",
          content: baseEvidenceContent
            .replace("| Run id | `1` |", "| Run id | `2` |")
            .replace("| Updated | `2026-06-14T07:00:00Z` |", "| Updated | `2026-06-14T07:01:00Z` |")
            .replace("actions/runs/1", "actions/runs/2")
        },
        {
          relativePath:
            "docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH_AFTER_TRD230_PUSH.md",
          content: baseEvidenceContent
            .replace("| Run id | `1` |", "| Run id | `3` |")
            .replace("| Updated | `2026-06-14T07:00:00Z` |", "| Updated | `2026-06-14T07:02:00Z` |")
            .replace("actions/runs/1", "actions/runs/3")
        }
      ]
    });

    expect(result.ok).toBe(true);
    expect(result.evidenceCount).toBe(3);
    expect(result.latestEvidencePath).toBe(
      "docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH_AFTER_TRD230_PUSH.md"
    );
  });
});
