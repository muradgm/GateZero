import { describe, expect, it } from "vitest";
import {
  checkGate0CommandCenterFreshness,
  renderGate0CommandCenterFreshnessResult
} from "../../../scripts/check-gate0-command-center-freshness.js";

const baseTracklist = [
  "| Field                      | Value                    |",
  "| -------------------------- | ------------------------ |",
  "| Latest accepted packet     | `TRD-197`                |",
  "| Latest accepted validation | 61 test files, 309 tests passed |"
].join("\n");

const baseData = `
export const commandCenterData = {
  latestPacket: "TRD-197",
  localVerification: "61 files / 309 tests",
  ciRun: "999001",
  evidenceRows: [
    {
      area: "Review coverage",
      reference: "197 accepted records"
    }
  ]
};
`;

const baseRemoteEvidenceIndex = [
  "| Packet    | Evidence record | Run id   | Commit    | Result    |",
  "| --------- | --------------- | -------- | --------- | --------- |",
  "| `TRD-198` | `docs/operations/record.md` | `999001` | `abc1234` | `success` |"
].join("\n");

describe("Gate 0 command center freshness check", () => {
  it("accepts command center evidence aligned to the tracklist and reviews", () => {
    const result = checkGate0CommandCenterFreshness({
      acceptedIds: makeAcceptedIds(197),
      commandCenterData: baseData,
      remoteEvidenceIndex: baseRemoteEvidenceIndex,
      tracklist: baseTracklist
    });

    expect(result.ok).toBe(true);
    expect(renderGate0CommandCenterFreshnessResult(result)).toContain(
      "Gate 0 command center freshness passed."
    );
  });

  it("rejects stale command center packet references", () => {
    const result = checkGate0CommandCenterFreshness({
      acceptedIds: makeAcceptedIds(197),
      commandCenterData: baseData.replace('latestPacket: "TRD-197"', 'latestPacket: "TRD-196"'),
      remoteEvidenceIndex: baseRemoteEvidenceIndex,
      tracklist: baseTracklist
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Command center latest packet mismatch: app=TRD-196, tracklist=TRD-197"
    );
  });

  it("rejects stale command center validation and coverage references", () => {
    const result = checkGate0CommandCenterFreshness({
      acceptedIds: makeAcceptedIds(197),
      commandCenterData: baseData
        .replace(
          'localVerification: "61 files / 309 tests"',
          'localVerification: "60 files / 305 tests"'
        )
        .replace('reference: "197 accepted records"', 'reference: "196 accepted records"'),
      remoteEvidenceIndex: baseRemoteEvidenceIndex,
      tracklist: baseTracklist
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toEqual([
      "Command center validation mismatch: app=60 files / 305 tests, tracklist=61 files / 309 tests",
      "Command center review coverage mismatch: app=196, records=197"
    ]);
  });

  it("rejects stale command center CI run evidence", () => {
    const result = checkGate0CommandCenterFreshness({
      acceptedIds: makeAcceptedIds(197),
      commandCenterData: baseData.replace('ciRun: "999001"', 'ciRun: "999000"'),
      remoteEvidenceIndex: baseRemoteEvidenceIndex,
      tracklist: baseTracklist
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Command center CI run mismatch: app=999000, evidence=999001"
    );
  });
});

function makeAcceptedIds(count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => {
    const packetNumber = index + 1;
    return `TRD-${String(packetNumber).padStart(3, "0")}`;
  });
}
