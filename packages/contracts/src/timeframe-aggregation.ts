import { z } from "zod";
import { MarketTimeframeSchema } from "./market-data-candle.js";
import { NonEmptyStringSchema } from "./schemas.js";

export const HigherMarketTimeframeSchema = z.enum(["1H", "4H"]);

export const TimeBoundMarketCandleSchema = z
  .object({
    candleId: NonEmptyStringSchema,
    sourceId: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    timeframe: HigherMarketTimeframeSchema,
    openedAt: z.string().datetime(),
    closedAt: z.string().datetime(),
    availableAt: z.string().datetime(),
    timezone: z.literal("UTC"),
    open: z.number().finite().positive(),
    high: z.number().finite().positive(),
    low: z.number().finite().positive(),
    close: z.number().finite().positive(),
    volume: z.number().finite().nonnegative().optional(),
    finalized: z.literal(true),
    sourceHash: NonEmptyStringSchema,
    normalizationVersion: NonEmptyStringSchema,
    derivedFromCandleIds: z.array(NonEmptyStringSchema).min(1),
    derivedFromHashes: z.array(NonEmptyStringSchema).min(1),
    aggregationVersion: NonEmptyStringSchema
  })
  .strict()
  .superRefine((value, context) => {
    if (value.high < Math.max(value.open, value.close) || value.low > Math.min(value.open, value.close) || value.high < value.low) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "aggregated candle violates OHLC invariants",
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

    if (Date.parse(value.availableAt) !== Date.parse(value.closedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "aggregated candle is only available when the target candle closes",
        path: ["availableAt"]
      });
    }

    if (value.derivedFromCandleIds.length !== value.derivedFromHashes.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "derived candle ids and hashes must have matching cardinality",
        path: ["derivedFromHashes"]
      });
    }
  });

export const TimeframeAggregationResultSchema = z
  .object({
    sourceId: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    sourceTimeframe: z.literal("15m"),
    targetTimeframe: HigherMarketTimeframeSchema,
    asOf: z.string().datetime(),
    aggregationVersion: NonEmptyStringSchema,
    expectedSourceCandlesPerTarget: z.number().int().positive(),
    sourceRecordCount: z.number().int().nonnegative(),
    aggregatedRecordCount: z.number().int().nonnegative(),
    candles: z.array(TimeBoundMarketCandleSchema),
    failures: z.array(z.unknown())
  })
  .strict();

export const DecisionTimeCandleSetSchema = z
  .object({
    decisionTimestamp: z.string().datetime(),
    timeframe: MarketTimeframeSchema,
    eligibleCandles: z.array(
      z.object({
        candleId: NonEmptyStringSchema,
        availableAt: z.string().datetime()
      })
    ),
    excludedCandleIds: z.array(NonEmptyStringSchema)
  })
  .strict();

export type HigherMarketTimeframe = z.infer<typeof HigherMarketTimeframeSchema>;
export type TimeBoundMarketCandle = z.infer<typeof TimeBoundMarketCandleSchema>;
export type TimeframeAggregationResult = z.infer<typeof TimeframeAggregationResultSchema>;
