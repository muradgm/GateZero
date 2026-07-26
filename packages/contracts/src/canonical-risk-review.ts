import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const CanonicalRiskReviewSchema = z
  .object({
    schemaVersion: z.literal(1),
    riskReviewId: NonEmptyStringSchema,
    assessmentId: NonEmptyStringSchema,
    canonicalAssessmentHash: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    riskEngineVersion: NonEmptyStringSchema,
    reviewStatus: z.enum(["APPROVED_FOR_LOCAL_SIMULATION", "BLOCKED", "REVISION_REQUIRED"]),
    maximumRiskPct: z.number().positive().max(100),
    maximumRiskAmount: z.number().nonnegative(),
    positionSizeUnits: z.number().int().nonnegative(),
    portfolioExposurePctAfterEntry: z.number().min(0).max(100),
    spreadPips: z.number().nonnegative(),
    commissionAmount: z.number().nonnegative(),
    slippagePips: z.number().nonnegative(),
    assumptions: z.array(NonEmptyStringSchema).min(1),
    blockers: z.array(NonEmptyStringSchema),
    reviewedBy: NonEmptyStringSchema,
    reviewedAt: z.string().datetime(),
    validUntil: z.string().datetime(),
    reviewHash: NonEmptyStringSchema,
    localSimulationOnly: z.literal(true),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict()
  .superRefine((review, context) => {
    if (Date.parse(review.validUntil) <= Date.parse(review.reviewedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "risk review must remain valid after its review timestamp",
        path: ["validUntil"]
      });
    }

    if (review.reviewStatus === "APPROVED_FOR_LOCAL_SIMULATION" && review.blockers.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "approved risk reviews cannot retain blockers",
        path: ["blockers"]
      });
    }

    if (review.reviewStatus !== "APPROVED_FOR_LOCAL_SIMULATION" && review.blockers.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "non-approved risk reviews require blockers",
        path: ["blockers"]
      });
    }
  });

export type CanonicalRiskReview = z.infer<typeof CanonicalRiskReviewSchema>;
