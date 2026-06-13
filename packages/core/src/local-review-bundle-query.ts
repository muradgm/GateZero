import { z } from "zod";
import {
  readLocalReviewBundleLogRecords,
  readLocalReviewBundleLogRecordsWithGuard,
  type LocalReviewBundleLogRecord
} from "./local-review-bundle-log.js";

export const LocalReviewBundleQuerySchema = z
  .object({
    strategy_review_bundle_id: z.string().trim().min(1).optional(),
    trace_id: z.string().trim().min(1).optional(),
    strategy_id: z.string().trim().min(1).optional(),
    strategy_version: z.string().trim().min(1).optional()
  })
  .strict()
  .refine((query) => Object.values(query).some((value) => value !== undefined), {
    message: "at least one review bundle query filter is required"
  });

export type LocalReviewBundleQuery = z.infer<typeof LocalReviewBundleQuerySchema>;

export interface QueryLocalReviewBundleLogRecordsInput {
  readonly logFilePath: string;
  readonly query: LocalReviewBundleQuery;
}

export interface QueryLocalReviewBundleLogRecordsWithGuardInput {
  readonly baseDirectory: string;
  readonly relativeLogPath: string;
  readonly query: LocalReviewBundleQuery;
}

export async function queryLocalReviewBundleLogRecords(
  input: QueryLocalReviewBundleLogRecordsInput
): Promise<readonly LocalReviewBundleLogRecord[]> {
  const query = LocalReviewBundleQuerySchema.parse(input.query);
  const records = await readLocalReviewBundleLogRecords(input.logFilePath);

  return filterLocalReviewBundleLogRecords(records, query);
}

export async function queryLocalReviewBundleLogRecordsWithGuard(
  input: QueryLocalReviewBundleLogRecordsWithGuardInput
): Promise<readonly LocalReviewBundleLogRecord[]> {
  const query = LocalReviewBundleQuerySchema.parse(input.query);
  const records = await readLocalReviewBundleLogRecordsWithGuard({
    baseDirectory: input.baseDirectory,
    relativeLogPath: input.relativeLogPath
  });

  return filterLocalReviewBundleLogRecords(records, query);
}

export function filterLocalReviewBundleLogRecords(
  records: readonly LocalReviewBundleLogRecord[],
  query: LocalReviewBundleQuery
): readonly LocalReviewBundleLogRecord[] {
  const parsedQuery = LocalReviewBundleQuerySchema.parse(query);

  return records.filter((record) => {
    return (
      matchesFilter(record.strategy_review_bundle_id, parsedQuery.strategy_review_bundle_id) &&
      matchesFilter(record.trace_id, parsedQuery.trace_id) &&
      matchesFilter(record.strategy_id, parsedQuery.strategy_id) &&
      matchesFilter(record.strategy_version, parsedQuery.strategy_version)
    );
  });
}

function matchesFilter(actual: string, expected: string | undefined): boolean {
  return expected === undefined || actual === expected;
}
