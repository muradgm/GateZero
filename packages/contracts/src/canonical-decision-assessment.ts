import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";
import { StrategyGateSchema, StrategyRuleResultSchema } from "./eurusd-overlap-pullback-strategy.js";

export const CanonicalBlockerSchema = z
  .object({
    blockerId: NonEmptyStringSchema,
    gate: StrategyGateSchema,
    severity: z.enum(["HARD", "CONDITIONAL"]),
    reason: NonEmptyStringSchema,
    requiredResolution: NonEmptyStringSchema,
    evidenceIds: z.array(NonEmptyStringSchema),
    availableAt: z.string().datetime()
  })
  .strict();

export const CanonicalDecisionAssessmentSchema = z
  .object({
    schemaVersion: z.literal(1),
    assessmentId: NonEmptyStringSchema,
    candidateId: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    strategyId: z.literal("EURUSD_LN_NY_PULLBACK"),
    strategyVersion: z.literal("1.0.0"),
    observationEngineVersion: NonEmptyStringSchema,
    decisionTimestamp: z.string().datetime(),
    availableAt: z.string().datetime(),
    lifecycleState: z.enum(["REJECTED", "AWAITING_CONDITIONS", "READY_FOR_RISK_REVIEW"]),
    eligible: z.boolean(),
    recommendation: z.enum(["REJECT", "WATCH", "PAPER_SIMULATE"]),
    blockers: z.array(CanonicalBlockerSchema),
    passedGates: z.array(StrategyGateSchema),
    failedGates: z.array(StrategyGateSchema),
    nextAction: NonEmptyStringSchema,
    expiresAt: z.string().datetime().optional(),
    ruleResults: z.array(StrategyRuleResultSchema).length(9)
  })
  .strict()
  .superRefine((value, context) => {
    if (value.recommendation === "PAPER_SIMULATE" && (!value.eligible || value.blockers.length > 0)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper simulation requires eligibility without blockers",
        path: ["recommendation"]
      });
    }

    if (Date.parse(value.availableAt) > Date.parse(value.decisionTimestamp)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "canonical assessment cannot depend on future information",
        path: ["availableAt"]
      });
    }
  });

export type CanonicalBlocker = z.infer<typeof CanonicalBlockerSchema>;
export type CanonicalDecisionAssessment = z.infer<typeof CanonicalDecisionAssessmentSchema>;
