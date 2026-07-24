import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const IntelligenceDimensionSchema = z.enum([
  "trend",
  "market_structure",
  "momentum",
  "liquidity",
  "order_flow",
  "macro",
  "sentiment",
  "correlation",
  "event_risk",
  "risk"
]);

export const EvidenceContributionSchema = z
  .object({
    contributionId: NonEmptyStringSchema,
    dimension: IntelligenceDimensionSchema,
    label: NonEmptyStringSchema,
    evidenceIds: z.array(NonEmptyStringSchema).min(1),
    direction: z.enum(["supporting", "contradicting", "neutral"]),
    points: z.number().int().min(-25).max(25),
    rationale: NonEmptyStringSchema,
    limitation: NonEmptyStringSchema
  })
  .strict()
  .superRefine((data, context) => {
    if (data.direction === "supporting" && data.points <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "supporting contributions require positive points",
        path: ["points"]
      });
    }
    if (data.direction === "contradicting" && data.points >= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "contradicting contributions require negative points",
        path: ["points"]
      });
    }
    if (data.direction === "neutral" && data.points !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "neutral contributions must use zero points",
        path: ["points"]
      });
    }
  });

export const IntelligenceCaseSchema = z
  .object({
    title: NonEmptyStringSchema,
    summary: NonEmptyStringSchema,
    evidenceIds: z.array(NonEmptyStringSchema),
    limitations: z.array(NonEmptyStringSchema).min(1)
  })
  .strict();

export const IntelligenceTimelineEventSchema = z
  .object({
    eventId: NonEmptyStringSchema,
    occurredAt: z.string().datetime(),
    type: z.enum([
      "market_open",
      "structure_change",
      "liquidity_event",
      "macro_event",
      "evidence_update",
      "risk_review",
      "operator_decision"
    ]),
    title: NonEmptyStringSchema,
    summary: NonEmptyStringSchema,
    evidenceIds: z.array(NonEmptyStringSchema),
    severity: z.enum(["info", "attention", "blocking"])
  })
  .strict();

export const TradingIntelligenceReportSchema = z
  .object({
    schemaVersion: z.literal(1),
    reportId: NonEmptyStringSchema,
    setupReviewId: NonEmptyStringSchema,
    instrument: NonEmptyStringSchema,
    generatedAt: z.string().datetime(),
    contributions: z.array(EvidenceContributionSchema).min(1),
    evidenceScore: z.number().int().min(0).max(100),
    confidence: z.enum(["none", "low", "moderate", "high"]),
    recommendation: z.enum(["REJECT", "WATCH", "PAPER_SIMULATE"]),
    bullCase: IntelligenceCaseSchema,
    bearCase: IntelligenceCaseSchema,
    neutralCase: IntelligenceCaseSchema,
    timeline: z.array(IntelligenceTimelineEventSchema),
    invalidationSummary: NonEmptyStringSchema,
    downgradeReasons: z.array(NonEmptyStringSchema),
    operatorRequired: z.literal(true),
    riskReviewRequired: z.literal(true),
    automatedAction: z.literal(false),
    executionPath: z.literal(false),
    performanceClaim: z.literal(false)
  })
  .strict()
  .superRefine((data, context) => {
    const calculatedScore = Math.max(
      0,
      Math.min(100, 50 + data.contributions.reduce((sum, contribution) => sum + contribution.points, 0))
    );
    if (data.evidenceScore !== calculatedScore) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "evidence score must equal the bounded contribution total",
        path: ["evidenceScore"]
      });
    }
    if (data.recommendation === "PAPER_SIMULATE" && data.confidence !== "high") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper simulation requires high confidence",
        path: ["confidence"]
      });
    }
    if (data.recommendation === "PAPER_SIMULATE" && data.downgradeReasons.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper simulation cannot retain downgrade reasons",
        path: ["downgradeReasons"]
      });
    }
  });

export const RankedIntelligenceCandidateSchema = z
  .object({
    rank: z.number().int().positive(),
    reportId: NonEmptyStringSchema,
    setupReviewId: NonEmptyStringSchema,
    instrument: NonEmptyStringSchema,
    evidenceScore: z.number().int().min(0).max(100),
    confidence: z.enum(["none", "low", "moderate", "high"]),
    recommendation: z.enum(["REJECT", "WATCH", "PAPER_SIMULATE"]),
    primaryReason: NonEmptyStringSchema,
    primaryRisk: NonEmptyStringSchema
  })
  .strict();

export type EvidenceContribution = z.infer<typeof EvidenceContributionSchema>;
export type TradingIntelligenceReport = z.infer<typeof TradingIntelligenceReportSchema>;
export type RankedIntelligenceCandidate = z.infer<typeof RankedIntelligenceCandidateSchema>;
