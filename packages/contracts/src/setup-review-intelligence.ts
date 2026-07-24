import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const TimeframeStateSchema = z
  .object({
    timeframe: z.enum(["1M", "1W", "1D", "4H", "1H", "15M", "5M"]),
    trend: z.enum(["bullish", "bearish", "neutral", "mixed"]),
    structure: z.enum(["expansion", "pullback", "range", "transition", "breakdown"]),
    momentum: z.enum(["strengthening", "stable", "weakening", "conflicted"]),
    evidenceIds: z.array(NonEmptyStringSchema).min(1)
  })
  .strict();

export const MarketContextSchema = z
  .object({
    marketContextId: NonEmptyStringSchema,
    instrument: NonEmptyStringSchema,
    session: z.enum(["asia", "london", "new_york", "overlap", "closed"]),
    volatilityRegime: z.enum(["compressed", "normal", "elevated", "event_risk"]),
    liquidityCondition: z.enum(["thin", "normal", "deep", "uncertain"]),
    broadBias: z.enum(["bullish", "bearish", "neutral", "mixed"]),
    timeframes: z.array(TimeframeStateSchema).min(2),
    macroEventRisk: z.enum(["none", "low", "medium", "high"]),
    correlationRisk: z.enum(["none", "low", "medium", "high"]),
    observedAt: z.string().datetime(),
    validUntil: z.string().datetime(),
    limitations: z.array(NonEmptyStringSchema).min(1)
  })
  .strict()
  .superRefine((data, context) => {
    if (Date.parse(data.validUntil) <= Date.parse(data.observedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "market context validity must end after observation time",
        path: ["validUntil"]
      });
    }
  });

export const EvidenceQualitySchema = z
  .object({
    evidenceId: NonEmptyStringSchema,
    freshness: z.enum(["current", "aging", "stale"]),
    provenance: z.enum(["verified", "declared", "unverified"]),
    sampleSufficiency: z.enum(["sufficient", "limited", "insufficient", "not_applicable"]),
    regimeRelevance: z.enum(["matched", "partial", "mismatched", "unknown"]),
    independence: z.enum(["independent", "partially_correlated", "correlated", "unknown"]),
    qualityScore: z.number().int().min(0).max(100),
    limitations: z.array(NonEmptyStringSchema).min(1)
  })
  .strict();

export const SetupReviewAssessmentSchema = z
  .object({
    assessmentId: NonEmptyStringSchema,
    setupReviewId: NonEmptyStringSchema,
    marketContextId: NonEmptyStringSchema,
    evaluatedAt: z.string().datetime(),
    evidenceQuality: z.array(EvidenceQualitySchema).min(1),
    supportingScore: z.number().int().min(0).max(100),
    contradictingScore: z.number().int().min(0).max(100),
    riskScore: z.number().int().min(0).max(100),
    compositeScore: z.number().int().min(0).max(100),
    confidence: z.enum(["none", "low", "moderate", "high"]),
    recommendation: z.enum(["REJECT", "WATCH", "PAPER_SIMULATE"]),
    downgradeReasons: z.array(NonEmptyStringSchema),
    decisionReasons: z.array(NonEmptyStringSchema).min(1),
    operatorRequired: z.literal(true),
    riskReviewRequired: z.literal(true),
    automatedAction: z.literal(false),
    executionPath: z.literal(false)
  })
  .strict()
  .superRefine((data, context) => {
    if (data.recommendation === "PAPER_SIMULATE" && data.confidence !== "high") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper simulation requires high calibrated confidence",
        path: ["confidence"]
      });
    }

    if (data.recommendation === "PAPER_SIMULATE" && data.downgradeReasons.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper simulation cannot retain unresolved downgrade reasons",
        path: ["downgradeReasons"]
      });
    }
  });

export type MarketContext = z.infer<typeof MarketContextSchema>;
export type EvidenceQuality = z.infer<typeof EvidenceQualitySchema>;
export type SetupReviewAssessment = z.infer<typeof SetupReviewAssessmentSchema>;
