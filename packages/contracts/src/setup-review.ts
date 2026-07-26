import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

const EvidenceReferenceSchema = z
  .object({
    id: NonEmptyStringSchema,
    type: z.enum([
      "market_context",
      "technical_structure",
      "backtest",
      "risk",
      "macro",
      "sentiment",
      "correlation",
      "operator_note"
    ]),
    source: NonEmptyStringSchema,
    observedAt: z.string().datetime(),
    summary: NonEmptyStringSchema,
    limitation: NonEmptyStringSchema
  })
  .strict();

const InvalidationRuleSchema = z
  .object({
    description: NonEmptyStringSchema,
    observable: NonEmptyStringSchema,
    threshold: NonEmptyStringSchema,
    action: z.literal("reject_or_exit_paper_setup")
  })
  .strict();

const RiskPlanSchema = z
  .object({
    accountCurrency: z.string().regex(/^[A-Z]{3}$/),
    accountEquity: z.number().positive(),
    maximumRiskPct: z.number().positive().max(100),
    maximumRiskAmount: z.number().nonnegative(),
    plannedEntry: z.number().positive(),
    plannedStop: z.number().positive(),
    plannedTarget: z.number().positive(),
    quantity: z.number().positive(),
    estimatedFees: z.number().nonnegative(),
    estimatedSlippage: z.number().nonnegative(),
    portfolioExposurePctAfterEntry: z.number().nonnegative().max(100),
    correlationWarning: z.boolean()
  })
  .strict()
  .superRefine((data, context) => {
    const allowedRisk = (data.accountEquity * data.maximumRiskPct) / 100;

    if (data.maximumRiskAmount > allowedRisk) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "maximum risk amount exceeds the declared account risk percentage",
        path: ["maximumRiskAmount"]
      });
    }

    if (data.plannedEntry === data.plannedStop) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "planned entry and stop must differ",
        path: ["plannedStop"]
      });
    }
  });

export const SetupReviewSchema = z
  .object({
    schemaVersion: z.literal(1),
    setupReviewId: NonEmptyStringSchema,
    researchCaseId: NonEmptyStringSchema,
    instrument: NonEmptyStringSchema,
    strategyFamily: NonEmptyStringSchema,
    gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    status: z.enum(["draft", "ready_for_risk_review", "reviewed"]),
    thesis: NonEmptyStringSchema,
    supportingEvidence: z.array(EvidenceReferenceSchema),
    contradictingEvidence: z.array(EvidenceReferenceSchema),
    backtestEvidenceId: NonEmptyStringSchema,
    invalidation: InvalidationRuleSchema,
    riskPlan: RiskPlanSchema,
    decision: z.enum(["REJECT", "WATCH", "PAPER_SIMULATE"]),
    decisionReasons: z.array(NonEmptyStringSchema).min(1),
    limitations: z.array(NonEmptyStringSchema).min(1),
    operatorRequired: z.literal(true),
    riskReviewRequired: z.literal(true),
    riskReviewId: NonEmptyStringSchema.optional(),
    externalAccess: z.literal(false),
    executionPath: z.literal(false),
    automatedAction: z.literal(false),
    approvalClaim: z.literal(false),
    performanceClaim: z.literal(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .strict()
  .superRefine((data, context) => {
    if (data.decision === "PAPER_SIMULATE" && data.supportingEvidence.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper simulation requires supporting evidence",
        path: ["supportingEvidence"]
      });
    }

    if (data.decision === "PAPER_SIMULATE" && !data.riskReviewId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper simulation requires a recorded risk review",
        path: ["riskReviewId"]
      });
    }

    if (data.status === "reviewed" && !data.riskReviewId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "reviewed setup reviews require a risk review reference",
        path: ["riskReviewId"]
      });
    }
  });

export type EvidenceReference = z.infer<typeof EvidenceReferenceSchema>;
export type SetupReview = z.infer<typeof SetupReviewSchema>;
