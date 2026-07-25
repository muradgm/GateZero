import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const StrategyRuleStatusSchema = z.enum(["PASS", "FAIL", "BLOCKED", "NOT_EVALUATED"]);
export const StrategyGateSchema = z.enum([
  "DATA_READY",
  "SESSION_ELIGIBLE",
  "HIGHER_TIMEFRAME_ALIGNED",
  "PULLBACK_QUALIFIED",
  "LIQUIDITY_EVENT_QUALIFIED",
  "TRIGGER_CONFIRMED",
  "EVENT_RISK_CLEAR",
  "INVALIDATION_DEFINED",
  "NOT_EXPIRED"
]);

export const StrategyRuleResultSchema = z
  .object({
    ruleId: NonEmptyStringSchema,
    gate: StrategyGateSchema,
    status: StrategyRuleStatusSchema,
    observedValue: NonEmptyStringSchema,
    expectedCondition: NonEmptyStringSchema,
    reason: NonEmptyStringSchema,
    evidenceIds: z.array(NonEmptyStringSchema),
    availableAt: z.string().datetime()
  })
  .strict();

export const EurUsdOverlapPullbackStrategySchema = z
  .object({
    strategyId: z.literal("EURUSD_LN_NY_PULLBACK"),
    version: z.literal("1.0.0"),
    instrument: z.literal("EURUSD"),
    directionMode: z.enum(["LONG_ONLY", "SHORT_ONLY", "BOTH"]),
    sourceTimeframe: z.literal("15m"),
    contextTimeframes: z.tuple([z.literal("1H"), z.literal("4H")]),
    session: z
      .object({
        timezone: z.literal("UTC"),
        startMinuteUtc: z.number().int().min(0).max(1439),
        endMinuteUtc: z.number().int().min(1).max(1440)
      })
      .strict(),
    trend: z
      .object({
        fastEmaPeriod: z.number().int().positive(),
        slowEmaPeriod: z.number().int().positive(),
        requireClosedHigherTimeframes: z.literal(true)
      })
      .strict(),
    pullback: z
      .object({
        minimumRetracementAtr: z.number().positive(),
        maximumRetracementAtr: z.number().positive(),
        maximumAgeCandles: z.number().int().positive()
      })
      .strict(),
    liquiditySweep: z
      .object({
        swingLookbackCandles: z.number().int().positive(),
        minimumPenetrationPips: z.number().positive(),
        reclaimWithinCandles: z.number().int().positive(),
        minimumDisplacementAtr: z.number().positive()
      })
      .strict(),
    trigger: z
      .object({
        requireCloseBeyondTriggerLevel: z.literal(true),
        maximumTriggerAgeCandles: z.number().int().positive()
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
        mode: z.literal("BEYOND_SWEEP_EXTREME"),
        bufferPips: z.number().nonnegative()
      })
      .strict(),
    expiry: z
      .object({
        maximumCandlesAfterTrigger: z.number().int().positive(),
        expireAtSessionEnd: z.literal(true)
      })
      .strict()
  })
  .strict()
  .superRefine((value, context) => {
    if (value.session.endMinuteUtc <= value.session.startMinuteUtc) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "session end must follow session start within the same UTC day",
        path: ["session", "endMinuteUtc"]
      });
    }

    if (value.trend.fastEmaPeriod >= value.trend.slowEmaPeriod) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "fast EMA period must be lower than slow EMA period",
        path: ["trend", "fastEmaPeriod"]
      });
    }

    if (value.pullback.minimumRetracementAtr >= value.pullback.maximumRetracementAtr) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "minimum pullback retracement must be lower than maximum retracement",
        path: ["pullback", "minimumRetracementAtr"]
      });
    }
  });

export const EurUsdOverlapPullbackObservationSchema = z
  .object({
    candidateId: NonEmptyStringSchema,
    decisionTimestamp: z.string().datetime(),
    direction: z.enum(["LONG", "SHORT"]),
    dataReady: z.boolean(),
    sessionEligible: z.boolean(),
    higherTimeframeAligned: z.boolean(),
    pullbackRetracementAtr: z.number().finite().nonnegative(),
    pullbackAgeCandles: z.number().int().nonnegative(),
    liquiditySweepDetected: z.boolean(),
    sweepPenetrationPips: z.number().finite().nonnegative(),
    sweepReclaimedWithinCandles: z.number().int().nonnegative(),
    displacementAtr: z.number().finite().nonnegative(),
    triggerConfirmed: z.boolean(),
    triggerAgeCandles: z.number().int().nonnegative(),
    minutesToNearestHighImpactEvent: z.number().int(),
    invalidationPrice: z.number().finite().positive().optional(),
    currentPrice: z.number().finite().positive(),
    candlesSinceTrigger: z.number().int().nonnegative(),
    sessionEnded: z.boolean(),
    evidenceIds: z.array(NonEmptyStringSchema).min(1),
    availableAt: z.string().datetime()
  })
  .strict();

export const StrategyCandidateAssessmentSchema = z
  .object({
    strategyId: z.literal("EURUSD_LN_NY_PULLBACK"),
    strategyVersion: z.literal("1.0.0"),
    candidateId: NonEmptyStringSchema,
    decisionTimestamp: z.string().datetime(),
    eligible: z.boolean(),
    recommendation: z.enum(["REJECT", "WATCH", "PAPER_SIMULATE"]),
    blockers: z.array(NonEmptyStringSchema),
    nextAction: NonEmptyStringSchema,
    expiresAt: z.string().datetime().optional(),
    ruleResults: z.array(StrategyRuleResultSchema).length(9)
  })
  .strict()
  .superRefine((value, context) => {
    if (value.recommendation === "PAPER_SIMULATE" && (!value.eligible || value.blockers.length > 0)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper simulation requires an eligible candidate without blockers",
        path: ["recommendation"]
      });
    }
  });

export type EurUsdOverlapPullbackStrategy = z.infer<typeof EurUsdOverlapPullbackStrategySchema>;
export type EurUsdOverlapPullbackObservation = z.infer<typeof EurUsdOverlapPullbackObservationSchema>;
export type StrategyCandidateAssessment = z.infer<typeof StrategyCandidateAssessmentSchema>;
