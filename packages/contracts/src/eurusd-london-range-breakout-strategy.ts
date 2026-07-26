import { z } from "zod";
import { StrategyCandidateAssessmentSchema } from "./eurusd-overlap-pullback-strategy.js";
import { NonEmptyStringSchema } from "./schemas.js";

export const EurUsdLondonRangeBreakoutStrategySchema = z
  .object({
    strategyId: z.literal("EURUSD_LONDON_RANGE_BREAKOUT"),
    version: z.literal("1.0.0"),
    instrument: z.literal("EURUSD"),
    sourceTimeframe: z.literal("15m"),
    observationEngineVersion: NonEmptyStringSchema,
    range: z
      .object({
        timezone: z.literal("UTC"),
        startMinuteUtc: z.number().int().min(0).max(1439),
        endMinuteUtc: z.number().int().min(1).max(1440),
        minimumRangePips: z.number().positive(),
        maximumRangePips: z.number().positive()
      })
      .strict(),
    breakout: z
      .object({
        minimumCloseBeyondRangePips: z.number().positive(),
        maximumAgeCandles: z.number().int().positive()
      })
      .strict(),
    eventRestriction: z
      .object({
        blockedCurrencies: z.tuple([z.literal("EUR"), z.literal("USD")]),
        minimumMinutesBeforeHighImpactEvent: z.number().int().nonnegative(),
        minimumMinutesAfterHighImpactEvent: z.number().int().nonnegative()
      })
      .strict(),
    invalidation: z
      .object({
        mode: z.literal("OPPOSITE_RANGE_BOUNDARY"),
        bufferPips: z.number().nonnegative()
      })
      .strict(),
    expiry: z
      .object({
        maximumCandlesAfterBreakout: z.number().int().positive(),
        sessionEndMinuteUtc: z.number().int().min(1).max(1440)
      })
      .strict()
  })
  .strict()
  .superRefine((strategy, context) => {
    if (strategy.range.endMinuteUtc <= strategy.range.startMinuteUtc) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "range end must follow range start",
        path: ["range", "endMinuteUtc"]
      });
    }
    if (strategy.range.minimumRangePips >= strategy.range.maximumRangePips) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "minimum range must be lower than maximum range",
        path: ["range", "minimumRangePips"]
      });
    }
    if (strategy.expiry.sessionEndMinuteUtc <= strategy.range.endMinuteUtc) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "strategy session must remain open after the range closes",
        path: ["expiry", "sessionEndMinuteUtc"]
      });
    }
  });

export const EurUsdLondonRangeBreakoutObservationSchema = z
  .object({
    candidateId: NonEmptyStringSchema,
    decisionTimestamp: z.string().datetime(),
    direction: z.enum(["LONG", "SHORT"]),
    dataReady: z.boolean(),
    rangeCompleted: z.boolean(),
    rangeHigh: z.number().positive(),
    rangeLow: z.number().positive(),
    breakoutClose: z.number().positive(),
    breakoutAgeCandles: z.number().int().nonnegative(),
    eventContextStatus: z.enum(["AVAILABLE", "UNAVAILABLE"]),
    minutesToNearestHighImpactEvent: z.number().int(),
    invalidationPrice: z.number().positive().optional(),
    sessionEnded: z.boolean(),
    evidenceIds: z.array(NonEmptyStringSchema).min(1),
    availableAt: z.string().datetime()
  })
  .strict()
  .superRefine((observation, context) => {
    if (observation.rangeLow >= observation.rangeHigh) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "range low must be below range high",
        path: ["rangeLow"]
      });
    }
  });

export const LondonRangeBreakoutAssessmentSchema = StrategyCandidateAssessmentSchema;

export type EurUsdLondonRangeBreakoutStrategy = z.infer<
  typeof EurUsdLondonRangeBreakoutStrategySchema
>;
export type EurUsdLondonRangeBreakoutObservation = z.infer<
  typeof EurUsdLondonRangeBreakoutObservationSchema
>;
export type LondonRangeBreakoutAssessment = z.infer<typeof LondonRangeBreakoutAssessmentSchema>;
