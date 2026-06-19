import { describe, expect, it } from "vitest";
import {
  checkGate0TracklistConsistency,
  renderGate0TracklistConsistencyResult
} from "../../../scripts/check-gate0-tracklist-consistency.js";

const matchingTracklist = [
  "# GateZero Project Tracklist",
  "",
  "| Field | Value |",
  "| --- | --- |",
  "| Latest accepted packet | `TRD-003` |",
  "",
  "## Accepted Packet Ledger",
  "",
  "| Packet | Status | Workstream | Primary outcome |",
  "| --- | --- | --- | --- |",
  "| `TRD-001` | accepted | Foundation | One. |",
  "| `TRD-002` | accepted | Foundation | Two. |",
  "| `TRD-003` | accepted | Foundation | Three. |",
  "",
  "## Next Queue",
  ""
].join("\n");

describe("Gate 0 tracklist consistency check", () => {
  it("passes when accepted records and ledger rows align", () => {
    const result = checkGate0TracklistConsistency({
      acceptedIds: ["TRD-001", "TRD-002", "TRD-003"],
      tracklist: matchingTracklist
    });

    expect(result).toEqual({
      ok: true,
      findings: [],
      acceptedCount: 3,
      ledgerCount: 3,
      latestAcceptedPacket: "TRD-003"
    });
    expect(renderGate0TracklistConsistencyResult(result)).toContain(
      "Gate 0 tracklist consistency passed."
    );
  });

  it("fails when the latest accepted packet is stale", () => {
    const result = checkGate0TracklistConsistency({
      acceptedIds: ["TRD-001", "TRD-002", "TRD-003"],
      tracklist: matchingTracklist.replace("TRD-003` |", "TRD-002` |")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Latest accepted packet mismatch: tracklist=TRD-002, records=TRD-003"
    );
  });

  it("passes when accepted ledger rows are split into continued sections", () => {
    const splitTracklist = [
      "# GateZero Project Tracklist",
      "",
      "| Field | Value |",
      "| --- | --- |",
      "| Latest accepted packet | `TRD-004` |",
      "",
      "## Accepted Packet Ledger",
      "",
      "| Packet | Status | Workstream | Primary outcome |",
      "| --- | --- | --- | --- |",
      "| `TRD-001` | accepted | Foundation | One. |",
      "| `TRD-002` | accepted | Foundation | Two. |",
      "",
      "## Accepted Packet Ledger Continued",
      "",
      "| Packet | Status | Workstream | Primary outcome |",
      "| --- | --- | --- | --- |",
      "| `TRD-003` | accepted | Foundation | Three. |",
      "| `TRD-004` | accepted | Foundation | Four. |",
      "",
      "## Next Queue",
      ""
    ].join("\n");

    const result = checkGate0TracklistConsistency({
      acceptedIds: ["TRD-001", "TRD-002", "TRD-003", "TRD-004"],
      tracklist: splitTracklist
    });

    expect(result.ok).toBe(true);
    expect(result.ledgerCount).toBe(4);
  });

  it("fails when ledger rows are missing or unexpected", () => {
    const result = checkGate0TracklistConsistency({
      acceptedIds: ["TRD-001", "TRD-002"],
      tracklist: matchingTracklist
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Unexpected accepted packet ledger row: TRD-003");
  });
});
