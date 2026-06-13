import { describe, expect, it } from "vitest";
import {
  checkGate0ProgressSnapshotFreshness,
  renderGate0ProgressSnapshotFreshnessResult
} from "../../../scripts/check-gate0-progress-snapshot-freshness.js";

const matchingTracklist = [
  "# GateZero Project Tracklist",
  "",
  "| Field | Value |",
  "| --- | --- |",
  "| Latest accepted packet | `TRD-003` |",
  ""
].join("\n");

const matchingSnapshot = [
  "# Gate 0 Progress Snapshot",
  "",
  "| Field | Value |",
  "| --- | --- |",
  "| Latest accepted packet | `TRD-003` |",
  "| Assignment count | 3 |",
  "| Accepted count | 2 |",
  "| Open count | 1 |",
  ""
].join("\n");

describe("Gate 0 progress snapshot freshness check", () => {
  it("passes when the snapshot summary matches local records", () => {
    const result = checkGate0ProgressSnapshotFreshness({
      assignmentIds: ["TRD-001", "TRD-002", "TRD-003"],
      acceptedIds: ["TRD-001", "TRD-003"],
      tracklist: matchingTracklist,
      snapshot: matchingSnapshot
    });

    expect(result).toEqual({
      ok: true,
      findings: [],
      latestAcceptedPacket: "TRD-003",
      snapshotLatestAcceptedPacket: "TRD-003",
      assignmentCount: 3,
      snapshotAssignmentCount: 3,
      acceptedCount: 2,
      snapshotAcceptedCount: 2,
      openCount: 1,
      snapshotOpenCount: 1
    });
    expect(renderGate0ProgressSnapshotFreshnessResult(result)).toContain(
      "Gate 0 progress snapshot freshness passed."
    );
  });

  it("fails when the snapshot latest packet is stale", () => {
    const result = checkGate0ProgressSnapshotFreshness({
      assignmentIds: ["TRD-001", "TRD-002", "TRD-003"],
      acceptedIds: ["TRD-001", "TRD-002", "TRD-003"],
      tracklist: matchingTracklist,
      snapshot: matchingSnapshot.replace("TRD-003` |", "TRD-002` |")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Latest accepted packet mismatch: snapshot=TRD-002, tracklist=TRD-003"
    );
  });

  it("fails when snapshot counts are stale", () => {
    const result = checkGate0ProgressSnapshotFreshness({
      assignmentIds: ["TRD-001", "TRD-002", "TRD-003", "TRD-004"],
      acceptedIds: ["TRD-001", "TRD-002", "TRD-003"],
      tracklist: matchingTracklist,
      snapshot: matchingSnapshot
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Assignment count mismatch: snapshot=3, records=4");
    expect(result.findings).toContain("Accepted count mismatch: snapshot=2, records=3");
  });
});
