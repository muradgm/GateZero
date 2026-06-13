import { describe, expect, it } from "vitest";
import {
  createGate0ProgressSnapshot,
  renderGate0ProgressSnapshot,
  type Gate0ProgressSnapshotInput
} from "../../../scripts/generate-gate0-progress-snapshot.js";

describe("Gate 0 progress snapshot generator", () => {
  const input: Gate0ProgressSnapshotInput = {
    assignmentIds: ["TRD-001", "TRD-002", "TRD-003"],
    acceptedIds: ["TRD-001", "TRD-003"],
    generatedAt: "2026-06-13",
    latestAcceptedPacket: "TRD-003",
    latestAcceptedValidation: "2 test files, 9 tests passed"
  };

  it("creates a deterministic local progress snapshot", () => {
    const snapshot = createGate0ProgressSnapshot(input);

    expect(snapshot).toEqual({
      generatedAt: "2026-06-13",
      latestAcceptedPacket: "TRD-003",
      latestAcceptedValidation: "2 test files, 9 tests passed",
      assignmentCount: 3,
      acceptedCount: 2,
      openCount: 1,
      records: [
        { packetId: "TRD-001", status: "accepted" },
        { packetId: "TRD-002", status: "not_accepted" },
        { packetId: "TRD-003", status: "accepted" }
      ]
    });
  });

  it("renders a stable markdown snapshot", () => {
    const rendered = renderGate0ProgressSnapshot(createGate0ProgressSnapshot(input));

    expect(rendered).toContain("# Gate 0 Progress Snapshot");
    expect(rendered).toMatch(/\| Latest accepted packet\s+\| `TRD-003`\s+\|/);
    expect(rendered).toMatch(/\| Accepted count\s+\| 2\s+\|/);
    expect(rendered).toMatch(/\| `TRD-002`\s+\| `not_accepted`\s+\|/);
    expect(rendered).toMatch(/\| Financial gate\s+\| `G0_RESEARCH`\s+\|/);
    expect(rendered).toMatch(/\| Scope\s+\| `research_only`\s+\|/);
  });

  it("keeps the rendered snapshot free of raw review payload wording", () => {
    const rendered = renderGate0ProgressSnapshot(createGate0ProgressSnapshot(input));

    expect(rendered).not.toContain("hypothesis");
    expect(rendered).not.toContain("trade_list");
    expect(rendered).not.toContain("metric_report_id");
    expect(rendered).not.toContain("risk_review_id");
    expect(rendered).not.toContain("trace_event_id");
    expect(rendered).not.toContain("evidence");
    expect(rendered).not.toContain("advice");
    expect(rendered).not.toContain("readiness");
  });
});
