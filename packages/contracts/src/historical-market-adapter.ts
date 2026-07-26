import { z } from "zod";
import { RawMarketCandleSchema } from "./market-data-candle.js";
import { NonEmptyStringSchema } from "./schemas.js";

export const HistoricalProviderSchema = z.literal("DUKASCOPY_CSV_EXPORT");

export const HistoricalSourceSnapshotSchema = z
  .object({
    provider: HistoricalProviderSchema,
    sourceId: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    timeframe: z.literal("15m"),
    timezone: z.literal("UTC"),
    rangeStart: z.string().datetime(),
    rangeEnd: z.string().datetime(),
    rawContentHash: NonEmptyStringSchema,
    adapterVersion: NonEmptyStringSchema,
    licenseNote: NonEmptyStringSchema
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

export const HistoricalAdapterFailureSchema = z
  .object({
    rowNumber: z.number().int().positive().optional(),
    code: z.enum([
      "EMPTY_SOURCE",
      "INVALID_HEADER",
      "INVALID_ROW",
      "INVALID_TIMESTAMP",
      "INVALID_NUMBER",
      "OUT_OF_ORDER",
      "OUTSIDE_DECLARED_RANGE"
    ]),
    message: NonEmptyStringSchema,
    rawRow: z.string().optional()
  })
  .strict();

export const HistoricalAdapterResultSchema = z
  .object({
    snapshot: HistoricalSourceSnapshotSchema,
    candles: z.array(RawMarketCandleSchema),
    failures: z.array(HistoricalAdapterFailureSchema),
    rawRowCount: z.number().int().nonnegative(),
    acceptedRowCount: z.number().int().nonnegative()
  })
  .strict();

export type HistoricalSourceSnapshot = z.infer<typeof HistoricalSourceSnapshotSchema>;
export type HistoricalAdapterFailure = z.infer<typeof HistoricalAdapterFailureSchema>;
export type HistoricalAdapterResult = z.infer<typeof HistoricalAdapterResultSchema>;
