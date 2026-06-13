import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  type StrategyDecisionTrace
} from "../../contracts/src/index.js";
import {
  appendLocalAuditLogRecordWithGuard,
  buildCanonicalStrategyDecisionTrace,
  readLocalAuditLogRecordsWithGuard,
  resolveLocalAuditLogPath,
  validateLocalAuditLogOperationalPolicy,
  withLocalAuditLogLock,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "GateZero-audit-safety-"));
});

afterEach(async () => {
  await rm(temporaryDirectory, { recursive: true, force: true });
});

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

function createTrace(): StrategyDecisionTrace {
  return structuredClone(
    buildCanonicalStrategyDecisionTrace(createDraft())
  ) as StrategyDecisionTrace;
}

describe("audit log safety", () => {
  it("resolves safe relative paths inside the base directory", () => {
    const resolvedPath = resolveLocalAuditLogPath({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/decision-trace.ndjson"
    });

    expect(resolvedPath).toBe(path.join(temporaryDirectory, "audit", "decision-trace.ndjson"));
  });

  it("rejects absolute paths", () => {
    expect(() =>
      resolveLocalAuditLogPath({
        baseDirectory: temporaryDirectory,
        relativeLogPath: path.join(temporaryDirectory, "audit.ndjson")
      })
    ).toThrow("audit log path must stay inside the audit base directory");
  });

  it("rejects traversal paths", () => {
    expect(() =>
      resolveLocalAuditLogPath({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "../escape.ndjson"
      })
    ).toThrow("audit log path must stay inside the audit base directory");
  });

  it("rejects non-ndjson paths", () => {
    expect(() =>
      resolveLocalAuditLogPath({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "audit/decision-trace.json"
      })
    ).toThrow("audit log path must use .ndjson");
  });

  it("appends and reads through the lock guard", async () => {
    const input = {
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/decision-trace.ndjson",
      trace: createTrace(),
      recordedAt
    };

    await appendLocalAuditLogRecordWithGuard(input);
    const records = await readLocalAuditLogRecordsWithGuard(input);

    expect(records).toHaveLength(1);
    expect(records[0]?.trace_id).toBe("trace-001");
  });

  it("blocks guarded operations when a lock already exists", async () => {
    const logFilePath = resolveLocalAuditLogPath({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/decision-trace.ndjson"
    });
    await mkdir(path.dirname(logFilePath), { recursive: true });
    await writeFile(`${logFilePath}.lock`, "locked", "utf8");

    await expect(
      appendLocalAuditLogRecordWithGuard({
        baseDirectory: temporaryDirectory,
        relativeLogPath: "audit/decision-trace.ndjson",
        trace: createTrace(),
        recordedAt
      })
    ).rejects.toThrow("audit log is already locked");
  });

  it("removes locks after failed operations", async () => {
    const logFilePath = resolveLocalAuditLogPath({
      baseDirectory: temporaryDirectory,
      relativeLogPath: "audit/decision-trace.ndjson"
    });

    await expect(
      withLocalAuditLogLock(logFilePath, async () => {
        throw new Error("operation failed");
      })
    ).rejects.toThrow("operation failed");

    await expect(
      withLocalAuditLogLock(logFilePath, async () => {
        return "ok";
      })
    ).resolves.toBe("ok");
  });

  it("validates retention and backup policy", () => {
    expect(
      validateLocalAuditLogOperationalPolicy({
        retention_days: 365,
        backup_enabled: true,
        backup_relative_directory: "backup/audit"
      }).retention_days
    ).toBe(365);

    expect(() =>
      validateLocalAuditLogOperationalPolicy({
        retention_days: 0,
        backup_enabled: true,
        backup_relative_directory: "backup/audit"
      })
    ).toThrow();

    expect(() =>
      validateLocalAuditLogOperationalPolicy({
        retention_days: 365,
        backup_enabled: true,
        backup_relative_directory: "../outside"
      })
    ).toThrow("backup directory must stay inside the audit base directory");
  });
});
