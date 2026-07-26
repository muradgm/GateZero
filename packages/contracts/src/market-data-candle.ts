import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const MarketTimeframeSchema = z.enum(["15m", "1H", "4H"]);

export const RawMarketCandleSchema = z
  .object({
    sourceId: NonEmptyStringSchema,
    instrument: NonEmptyStringSchema,
    timeframe: MarketTimeframeSchema,
    timestamp: NonEmptyStringSchema,
    timezone: NonEmptyStringSchema,
    open: z.number().finite().positive(),
    high: z.number().finite().positive(),
    low: z.number().finite().positive(),
    close: z.number().finite().positive(),
    volume: z.number().finite().nonnegative().optional(),
    finalized: z.boolean()
  })
  .strict();

export const NormalizedMarketCandleSchema = z
  .object({
    candleId: NonEmptyStringSchema,
    sourceId: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    timeframe: MarketTimeframeSchema,
    openedAt: z.string().datetime(),
    closedAt: z.string().datetime(),
    timezone: z.literal("UTC"),
    open: z.number().finite().positive(),
    high: z.number().finite().positive(),
    low: z.number().finite().positive(),
    close: z.number().finite().positive(),
    volume: z.number().finite().nonnegative().optional(),
    finalized: z.literal(true),
    sourceHash: NonEmptyStringSchema,
    normalizationVersion: NonEmptyStringSchema
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.high < Math.max(value.open, value.close) ||
      value.low > Math.min(value.open, value.close) ||
      value.high < value.low
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "normalized candle violates OHLC invariants",
        path: ["high"]
      });
    }

    if (Date.parse(value.closedAt) <= Date.parse(value.openedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "closedAt must be later than openedAt",
        path: ["closedAt"]
      });
    }
  });

export const MarketDataValidationResultSchema = z
  .object({
    sourceId: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    timeframe: MarketTimeframeSchema,
    normalizationVersion: NonEmptyStringSchema,
    normalizedCandles: z.array(NormalizedMarketCandleSchema),
    failures: z.array(z.unknown()),
    expectedIntervalMs: z.number().int().positive(),
    rawRecordCount: z.number().int().nonnegative(),
    normalizedRecordCount: z.number().int().nonnegative()
  })
  .strict();

export type MarketTimeframe = z.infer<typeof MarketTimeframeSchema>;
export type RawMarketCandle = z.infer<typeof RawMarketCandleSchema>;
export type NormalizedMarketCandle = z.infer<typeof NormalizedMarketCandleSchema>;
