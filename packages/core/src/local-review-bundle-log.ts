import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  ContractValidationError,
  StrategyReviewBundleSchema,
  type StrategyReviewBundle
} from "../../contracts/src/index.js";
import { canonicalSerialize, hashCanonicalValue } from "./trace-hashing.js";
import { createImmutableStrategyReviewBundle } from "./strategy-review-bundle.js";
import { resolveLocalAuditLogPath, withLocalAuditLogLock } from "./audit-log-safety.js";

export const LocalReviewBundleLogRecordSchema = z
  .object({
    audit_record_id: z.string().trim().min(1),
    strategy_review_bundle_id: z.string().trim().min(1),
    trace_id: z.string().trim().min(1),
    strategy_id: z.string().trim().min(1),
    strategy_version: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    bundle_hash: z.string().regex(/^[a-f0-9]{64}$/),
    trace_hash: z.string().regex(/^[a-f0-9]{64}$/),
    bundle: StrategyReviewBundleSchema,
    recorded_at: z.string().datetime({ offset: true })
  })
  .strict();

export type LocalReviewBundleLogRecord = z.infer<typeof LocalReviewBundleLogRecordSchema>;

export interface AppendLocalReviewBundleLogRecordInput {
  readonly logFilePath: string;
  readonly bundle: StrategyReviewBundle;
  readonly recordedAt: string;
}

export interface GuardedReviewBundleLogInput {
  readonly baseDirectory: string;
  readonly relativeLogPath: string;
  readonly bundle: StrategyReviewBundle;
  readonly recordedAt: string;
}

export interface ReadGuardedReviewBundleLogInput {
  readonly baseDirectory: string;
  readonly relativeLogPath: string;
}

export async function appendLocalReviewBundleLogRecord(
  input: AppendLocalReviewBundleLogRecordInput
): Promise<LocalReviewBundleLogRecord> {
  const existingRecords = await readLocalReviewBundleLogRecords(input.logFilePath);
  const bundle = createImmutableStrategyReviewBundle(input.bundle);

  if (
    existingRecords.some(
      (record) => record.strategy_review_bundle_id === bundle.strategy_review_bundle_id
    )
  ) {
    throw new ContractValidationError("review bundle log already contains this bundle id");
  }

  if (existingRecords.some((record) => record.trace_id === bundle.trace.trace_id)) {
    throw new ContractValidationError("review bundle log already contains this trace id");
  }

  const record = LocalReviewBundleLogRecordSchema.parse({
    audit_record_id: `review-bundle-${bundle.strategy_review_bundle_id}`,
    strategy_review_bundle_id: bundle.strategy_review_bundle_id,
    trace_id: bundle.trace.trace_id,
    strategy_id: bundle.strategy_idea.strategy_id,
    strategy_version: bundle.backtest_result.strategy_version,
    financial_gate: bundle.financial_gate,
    bundle_hash: hashCanonicalValue(bundle),
    trace_hash: hashCanonicalValue(bundle.trace),
    bundle,
    recorded_at: input.recordedAt
  });

  await mkdir(path.dirname(input.logFilePath), { recursive: true });
  await writeFile(input.logFilePath, `${canonicalSerialize(record)}\n`, {
    encoding: "utf8",
    flag: "a"
  });

  return record;
}

export async function readLocalReviewBundleLogRecords(
  logFilePath: string
): Promise<readonly LocalReviewBundleLogRecord[]> {
  const content = await readLogFileIfPresent(logFilePath);

  if (content.trim().length === 0) {
    return [];
  }

  return content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line, index) => parseReviewBundleLogLine(line, index + 1));
}

export async function appendLocalReviewBundleLogRecordWithGuard(
  input: GuardedReviewBundleLogInput
): Promise<LocalReviewBundleLogRecord> {
  const logFilePath = resolveLocalAuditLogPath(input);

  return withLocalAuditLogLock(logFilePath, async () => {
    return appendLocalReviewBundleLogRecord({
      logFilePath,
      bundle: input.bundle,
      recordedAt: input.recordedAt
    });
  });
}

export async function readLocalReviewBundleLogRecordsWithGuard(
  input: ReadGuardedReviewBundleLogInput
): Promise<readonly LocalReviewBundleLogRecord[]> {
  const logFilePath = resolveLocalAuditLogPath(input);

  return withLocalAuditLogLock(logFilePath, async () => {
    return readLocalReviewBundleLogRecords(logFilePath);
  });
}

function parseReviewBundleLogLine(line: string, lineNumber: number): LocalReviewBundleLogRecord {
  try {
    const parsedLine: unknown = JSON.parse(line);
    const record = LocalReviewBundleLogRecordSchema.parse(parsedLine);

    createImmutableStrategyReviewBundle(record.bundle);

    const expectedBundleHash = hashCanonicalValue(record.bundle);
    const expectedTraceHash = hashCanonicalValue(record.bundle.trace);

    if (record.bundle_hash !== expectedBundleHash) {
      throw new ContractValidationError("review bundle hash does not match bundle payload");
    }

    if (record.trace_hash !== expectedTraceHash) {
      throw new ContractValidationError("review bundle trace hash does not match trace payload");
    }

    return record;
  } catch (error) {
    if (error instanceof ContractValidationError) {
      throw error;
    }

    throw new ContractValidationError(`review bundle log line ${lineNumber} is malformed`);
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
