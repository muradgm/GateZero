import { mkdir, open, rm } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { SecurityBlockedError, type StrategyDecisionTrace } from "../../contracts/src/index.js";
import {
  appendLocalAuditLogRecord,
  readLocalAuditLogRecords,
  type LocalAuditLogRecord
} from "./local-audit-log.js";

export const LocalAuditLogOperationalPolicySchema = z
  .object({
    retention_days: z.number().int().min(1),
    backup_enabled: z.boolean(),
    backup_relative_directory: z.string().trim().min(1)
  })
  .strict()
  .superRefine((policy, context) => {
    if (!isSafeRelativePath(policy.backup_relative_directory)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "backup directory must stay inside the audit base directory",
        path: ["backup_relative_directory"]
      });
    }
  });

export type LocalAuditLogOperationalPolicy = z.infer<typeof LocalAuditLogOperationalPolicySchema>;

export interface ResolveLocalAuditLogPathInput {
  readonly baseDirectory: string;
  readonly relativeLogPath: string;
}

export interface GuardedAuditLogInput extends ResolveLocalAuditLogPathInput {
  readonly trace: StrategyDecisionTrace;
  readonly recordedAt: string;
}

export function resolveLocalAuditLogPath(input: ResolveLocalAuditLogPathInput): string {
  if (!isSafeRelativePath(input.relativeLogPath)) {
    throw new SecurityBlockedError("audit log path must stay inside the audit base directory");
  }

  if (path.extname(input.relativeLogPath) !== ".ndjson") {
    throw new SecurityBlockedError("audit log path must use .ndjson");
  }

  const resolvedBaseDirectory = path.resolve(input.baseDirectory);
  const resolvedLogPath = path.resolve(resolvedBaseDirectory, input.relativeLogPath);

  if (!isPathInside(resolvedBaseDirectory, resolvedLogPath)) {
    throw new SecurityBlockedError("audit log path must stay inside the audit base directory");
  }

  return resolvedLogPath;
}

export function validateLocalAuditLogOperationalPolicy(
  policy: LocalAuditLogOperationalPolicy
): LocalAuditLogOperationalPolicy {
  return LocalAuditLogOperationalPolicySchema.parse(policy);
}

export async function appendLocalAuditLogRecordWithGuard(
  input: GuardedAuditLogInput
): Promise<LocalAuditLogRecord> {
  const logFilePath = resolveLocalAuditLogPath(input);

  return withLocalAuditLogLock(logFilePath, async () => {
    return appendLocalAuditLogRecord({
      logFilePath,
      trace: input.trace,
      recordedAt: input.recordedAt
    });
  });
}

export async function readLocalAuditLogRecordsWithGuard(
  input: ResolveLocalAuditLogPathInput
): Promise<readonly LocalAuditLogRecord[]> {
  const logFilePath = resolveLocalAuditLogPath(input);

  return withLocalAuditLogLock(logFilePath, async () => {
    return readLocalAuditLogRecords(logFilePath);
  });
}

export async function withLocalAuditLogLock<T>(
  logFilePath: string,
  operation: () => Promise<T>
): Promise<T> {
  const lockFilePath = `${logFilePath}.lock`;
  await mkdir(path.dirname(logFilePath), { recursive: true });

  let lockHandle: Awaited<ReturnType<typeof open>> | undefined;

  try {
    lockHandle = await open(lockFilePath, "wx");
  } catch (error) {
    if (isExistingFileError(error)) {
      throw new SecurityBlockedError("audit log is already locked");
    }

    throw error;
  }

  try {
    return await operation();
  } finally {
    await lockHandle.close();
    await rm(lockFilePath, { force: true });
  }
}

function isSafeRelativePath(relativePath: string): boolean {
  if (path.isAbsolute(relativePath)) {
    return false;
  }

  const normalizedPath = path.normalize(relativePath);

  return (
    normalizedPath.length > 0 &&
    normalizedPath !== "." &&
    !normalizedPath.startsWith("..") &&
    !path.isAbsolute(normalizedPath)
  );
}

function isPathInside(baseDirectory: string, targetPath: string): boolean {
  const relativePath = path.relative(baseDirectory, targetPath);
  return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
}

function isExistingFileError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "EEXIST";
}
