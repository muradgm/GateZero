import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const FrozenHistoricalDatasetManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    datasetId: NonEmptyStringSchema,
    provider: z.literal("DUKASCOPY_CSV_EXPORT"),
    sourceFilename: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    timeframe: z.literal("15m"),
    timezone: z.literal("UTC"),
    rangeStart: z.string().datetime(),
    rangeEnd: z.string().datetime(),
    expectedSha256: z.string().regex(/^[a-f0-9]{64}$/),
    expectedRowCount: z.number().int().positive(),
    redistributionPolicy: z.enum(["LOCAL_ONLY", "REDISTRIBUTABLE"]),
    licenseNote: NonEmptyStringSchema,
    sourceReference: NonEmptyStringSchema,
    createdAt: z.string().datetime()
  })
  .strict()
  .superRefine((value, context) => {
    if (Date.parse(value.rangeEnd) <= Date.parse(value.rangeStart)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rangeEnd must be later than rangeStart",
        path: ["rangeEnd"]
      });
    }
  });

export const FrozenHistoricalDatasetFailureSchema = z
  .object({
    code: z.enum([
      "HASH_MISMATCH",
      "ROW_COUNT_MISMATCH",
      "ADAPTER_FAILURE",
      "MANIFEST_MISMATCH"
    ]),
    message: NonEmptyStringSchema
  })
  .strict();

export const FrozenHistoricalDatasetImportResultSchema = z
  .object({
    datasetId: NonEmptyStringSchema,
    ready: z.boolean(),
    sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
    expectedHash: z.string().regex(/^[a-f0-9]{64}$/),
    rawRowCount: z.number().int().nonnegative(),
    acceptedRowCount: z.number().int().nonnegative(),
    failures: z.array(FrozenHistoricalDatasetFailureSchema),
    adapterFailureCount: z.number().int().nonnegative()
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.ready &&
      (value.failures.length > 0 || value.adapterFailureCount > 0)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ready imports cannot contain failures",
        path: ["ready"]
      });
    }
  });

export type FrozenHistoricalDatasetManifest = z.infer<
  typeof FrozenHistoricalDatasetManifestSchema
>;
export type FrozenHistoricalDatasetFailure = z.infer<
  typeof FrozenHistoricalDatasetFailureSchema
>;
export type FrozenHistoricalDatasetImportResult = z.infer<
  typeof FrozenHistoricalDatasetImportResultSchema
>;
