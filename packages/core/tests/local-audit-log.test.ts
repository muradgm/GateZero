import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  type StrategyDecisionTrace
} from "../../contracts/src/index.js";
import {
  appendLocalAuditLogRecord,
  buildCanonicalStrategyDecisionTrace,
  readLocalAuditLogRecords,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-audit-log-"));
});

afterEach(async () => {
  await rm(temporaryDirectory, { recursive: true, force: true });
});

function createLogFilePath(): string {
  return path.join(temporaryDirectory, "decision-trace.ndjson");
}

function createDraft(traceId = "trace-001"): StrategyDecisionTraceDraft {
  return {
    trace_id: traceId,
    strategy_id: "strat-001",
    strategy_version: "v0.1.0",
    financial_gate: "G0_RESEARCH",
    append_only: true,
    events: STRATEGY_DECISION_TRACE_EVENT_ORDER.map((eventType, index) => {
      return {
        trace_event_id: `${traceId}-event-${index + 1}`,
        trace_id: traceId,
        sequence: index + 1,
        event_type: eventType,
        artifact_ref: {
          id: `${eventType}-artifact-001`,
          kind: eventType,
          version: "v0.1.0"
        },
        recorded_at: recordedAt
      };
    }),
    created_at: recordedAt
  };
}

describe("local audit log", () => {
  it("appends and reads one valid audit record", async () => {
    const trace = buildCanonicalStrategyDecisionTrace(createDraft());
    const logFilePath = createLogFilePath();

    const record = await appendLocalAuditLogRecord({
      logFilePath,
      trace: structuredClone(trace) as StrategyDecisionTrace,
      recordedAt
    });
    const records = await readLocalAuditLogRecords(logFilePath);

    expect(record.trace_id).toBe("trace-001");
    expect(record.trace_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(records).toHaveLength(1);
    expect(records[0]?.trace_id).toBe("trace-001");
  });

  it("rejects duplicate trace ids", async () => {
    const trace = structuredClone(
      buildCanonicalStrategyDecisionTrace(createDraft())
    ) as StrategyDecisionTrace;
    const logFilePath = createLogFilePath();

    await appendLocalAuditLogRecord({
      logFilePath,
      trace,
      recordedAt
    });

    await expect(
      appendLocalAuditLogRecord({
        logFilePath,
        trace,
        recordedAt
      })
    ).rejects.toThrow("audit log already contains this trace id");
  });

  it("rejects tampered traces before append", async () => {
    const trace = structuredClone(
      buildCanonicalStrategyDecisionTrace(createDraft())
    ) as StrategyDecisionTrace;
    const event = trace.events[2];

    if (!event) {
      throw new Error("fixture must include the third event");
    }

    trace.events[2] = {
      ...event,
      artifact_ref: {
        ...event.artifact_ref,
        id: "tampered-artifact"
      }
    };

    await expect(
      appendLocalAuditLogRecord({
        logFilePath: createLogFilePath(),
        trace,
        recordedAt
      })
    ).rejects.toThrow("trace event hash does not match canonical payload");
  });

  it("rejects malformed existing log lines on read", async () => {
    const logFilePath = createLogFilePath();
    await writeFile(logFilePath, "{not-json}\n", "utf8");

    await expect(readLocalAuditLogRecords(logFilePath)).rejects.toThrow(
      "audit log line 1 is malformed"
    );
  });

  it("rejects malformed existing log lines before append", async () => {
    const logFilePath = createLogFilePath();
    const trace = structuredClone(
      buildCanonicalStrategyDecisionTrace(createDraft())
    ) as StrategyDecisionTrace;
    await writeFile(logFilePath, "{not-json}\n", "utf8");

    await expect(
      appendLocalAuditLogRecord({
        logFilePath,
        trace,
        recordedAt
      })
    ).rejects.toThrow("audit log line 1 is malformed");
  });

  it("appends separate trace ids as separate records", async () => {
    const firstTrace = structuredClone(
      buildCanonicalStrategyDecisionTrace(createDraft("trace-001"))
    ) as StrategyDecisionTrace;
    const secondTrace = structuredClone(
      buildCanonicalStrategyDecisionTrace(createDraft("trace-002"))
    ) as StrategyDecisionTrace;
    const logFilePath = createLogFilePath();

    await appendLocalAuditLogRecord({
      logFilePath,
      trace: firstTrace,
      recordedAt
    });
    await appendLocalAuditLogRecord({
      logFilePath,
      trace: secondTrace,
      recordedAt
    });

    const records = await readLocalAuditLogRecords(logFilePath);

    expect(records.map((record) => record.trace_id)).toEqual(["trace-001", "trace-002"]);
  });
});
