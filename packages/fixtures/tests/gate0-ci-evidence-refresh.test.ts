import { describe, expect, it } from "vitest";
import {
  renderGate0CiEvidenceRecord,
  renderGate0CiEvidenceRefreshResult,
  updateCommandCenterCiMetadata,
  upsertGate0EvidenceIndexRow,
  validateGate0CiRunMetadata,
  type Gate0CiRunMetadata
} from "../../../scripts/refresh-gate0-ci-evidence.js";

const successfulRun: Gate0CiRunMetadata = {
  conclusion: "success",
  createdAt: "2026-06-18T19:59:49Z",
  databaseId: 27785795555,
  displayTitle: "Add command center runtime security boundary",
  event: "push",
  headSha: "b18752c9c7691f4801ea70dcf2c57c75b6103e12",
  status: "completed",
  updatedAt: "2026-06-18T20:01:10Z",
  url: "https://github.com/muradgm/GateZero/actions/runs/27785795555",
  workflowName: "Gate 0 Verification"
};

const options = {
  afterPacketId: "TRD-257",
  assignmentPath: "ops/assignments/TRD-258_GATE0_CI_EVIDENCE_REFRESH_AUTOMATION.md",
  packetId: "TRD-258",
  recordPath: "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD257_PUSH.md"
};

describe("Gate 0 CI evidence refresh helper", () => {
  it("accepts a successful pushed Gate 0 Verification run", () => {
    expect(validateGate0CiRunMetadata(successfulRun)).toEqual([]);
  });

  it("blocks non-successful or non-Gate 0 runs", () => {
    expect(
      validateGate0CiRunMetadata({
        ...successfulRun,
        conclusion: "failure",
        workflowName: "Other Workflow"
      })
    ).toEqual(["Unexpected workflow: Other Workflow", "Run is not successful: failure"]);
  });

  it("renders a bounded evidence record", () => {
    const record = renderGate0CiEvidenceRecord(successfulRun, options);

    expect(record).toContain("# Gate 0 Remote CI Evidence Refresh After TRD-257 Push");
    expect(record).toContain("| Run id     | `27785795555`");
    expect(record).toContain(
      "Source packet: `ops/assignments/TRD-258_GATE0_CI_EVIDENCE_REFRESH_AUTOMATION.md`"
    );
    expect(record).toContain("repository-quality evidence only");
    expect(record).toContain("does not approve deployment");
  });

  it("upserts the evidence-index row and rejects duplicate run ids", () => {
    const index = [
      "# Gate 0 Remote Verification Evidence Index",
      "",
      "## Evidence Records",
      "",
      "| Packet    | Evidence record | Run id | Commit | Result |",
      "| --------- | --------------- | ------ | ------ | ------ |",
      "| `TRD-257` | `docs/operations/previous.md` | `1` | `abc1234` | `success` |",
      "",
      "## Supporting Records"
    ].join("\n");
    const updated = upsertGate0EvidenceIndexRow(index, successfulRun, options);

    expect(updated).toContain(
      "| `TRD-258` | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD257_PUSH.md` | `27785795555` | `b18752c` | `success` |"
    );
    expect(() =>
      upsertGate0EvidenceIndexRow(
        updated.replace("| `TRD-258`", "| `TRD-259`"),
        successfulRun,
        options
      )
    ).toThrow("Run 27785795555 is already recorded in the evidence index.");
  });

  it("updates command-center CI metadata without changing trading scope", () => {
    const data = [
      'latestPacket: "TRD-257",',
      'ciRun: "27737830833",',
      'lastVerifiedCommit: "44121b7",',
      'value: "257 / 257",',
      'signal: "44121b7",',
      'signal: "Run 27737830833",',
      'reference: "Run 27737830833",',
      'reference: "257 accepted records"'
    ].join("\n");

    expect(updateCommandCenterCiMetadata(data, successfulRun, "TRD-258", 258)).toBe(
      [
        'latestPacket: "TRD-258",',
        'ciRun: "27785795555",',
        'lastVerifiedCommit: "b18752c",',
        'value: "258 / 258",',
        'signal: "b18752c",',
        'signal: "Run 27785795555",',
        'reference: "Run 27785795555",',
        'reference: "258 accepted records"'
      ].join("\n")
    );
  });

  it("can render an accepted packet count without inflating reruns", () => {
    const data = 'value: "258 / 258",\nreference: "258 accepted records"';

    expect(updateCommandCenterCiMetadata(data, successfulRun, "TRD-258", 258)).toBe(
      'value: "258 / 258",\nreference: "258 accepted records"'
    );
  });

  it("renders operator output for successful refreshes", () => {
    expect(
      renderGate0CiEvidenceRefreshResult({
        ok: true,
        findings: [],
        packetId: "TRD-258",
        runId: "27785795555",
        shortCommit: "b18752c",
        recordPath: options.recordPath
      })
    ).toContain("Gate 0 CI evidence refresh prepared.");
  });
});
