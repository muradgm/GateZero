import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  ContractValidationError,
  StrategyDecisionTraceSchema,
  type StrategyDecisionTrace
} from "../../contracts/src/index.js";
import {
  assertCanonicalStrategyDecisionTraceHashes,
  canonicalSerialize,
  hashCanonicalValue
} from "./trace-hashing.js";

export const LocalAuditLogRecordSchema = z
  .object({
    audit_record_id: z.string().trim().min(1),
    trace_id: z.string().trim().min(1),
    strategy_id: z.string().trim().min(1),
    strategy_version: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    trace_hash: z.string().regex(/^[a-f0-9]{64}$/),
    trace: StrategyDecisionTraceSchema,
    recorded_at: z.string().datetime({ offset: true })
  })
  .strict();

export type LocalAuditLogRecord = z.infer<typeof LocalAuditLogRecordSchema>;

export interface AppendLocalAuditLogRecordInput {
  readonly logFilePath: string;
  readonly trace: StrategyDecisionTrace;
  readonly recordedAt: string;
}

export async function appendLocalAuditLogRecord(
  input: AppendLocalAuditLogRecordInput
): Promise<LocalAuditLogRecord> {
  const existingRecords = await readLocalAuditLogRecords(input.logFilePath);
  const parsedTrace = StrategyDecisionTraceSchema.parse(input.trace);

  assertCanonicalStrategyDecisionTraceHashes(parsedTrace);

  if (existingRecords.some((record) => record.trace_id === parsedTrace.trace_id)) {
    throw new ContractValidationError("audit log already contains this trace id");
  }

  const record = LocalAuditLogRecordSchema.parse({
    audit_record_id: `audit-${parsedTrace.trace_id}`,
    trace_id: parsedTrace.trace_id,
    strategy_id: parsedTrace.strategy_id,
    strategy_version: parsedTrace.strategy_version,
    financial_gate: parsedTrace.financial_gate,
    trace_hash: hashCanonicalValue(parsedTrace),
    trace: parsedTrace,
    recorded_at: input.recordedAt
  });

  await mkdir(path.dirname(input.logFilePath), { recursive: true });
  await writeFile(input.logFilePath, `${canonicalSerialize(record)}\n`, {
    encoding: "utf8",
    flag: "a"
  });

  return record;
}

export async function readLocalAuditLogRecords(
  logFilePath: string
): Promise<readonly LocalAuditLogRecord[]> {
  const content = await readLogFileIfPresent(logFilePath);

  if (content.trim().length === 0) {
    return [];
  }

  return content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line, index) => parseAuditLogLine(line, index + 1));
}

function parseAuditLogLine(line: string, lineNumber: number): LocalAuditLogRecord {
  try {
    const parsedLine: unknown = JSON.parse(line);
    const record = LocalAuditLogRecordSchema.parse(parsedLine);

    assertCanonicalStrategyDecisionTraceHashes(record.trace);

    const expectedTraceHash = hashCanonicalValue(record.trace);

    if (record.trace_hash !== expectedTraceHash) {
      throw new ContractValidationError("audit log trace hash does not match trace payload");
    }

    return record;
  } catch (error) {
    if (error instanceof ContractValidationError) {
      throw error;
    }

    throw new ContractValidationError(`audit log line ${lineNumber} is malformed`);
  }
}

async function readLogFileIfPresent(logFilePath: string): Promise<string> {
  try {
    return await readFile(logFilePath, "utf8");
  } catch (error) {
    if (isMissingFileError(error)) {
      return "";
    }

    throw error;
  }
}

function isMissingFileError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
