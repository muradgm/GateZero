import { z } from "zod";
import { FinancialGateSchema } from "./gate.js";
import {
  IdentifierSchema,
  IsoDateTimeSchema,
  NonEmptyStringSchema,
  PercentageSchema
} from "./schemas.js";

export const RiskVerdictSchema = z.enum([
  "blocked_by_risk",
  "requires_revision",
  "research_only",
  "paper_candidate"
]);

export const RiskReviewSchema = z
  .object({
    risk_review_id: IdentifierSchema,
    strategy_id: IdentifierSchema,
    strategy_version: NonEmptyStringSchema,
    financial_gate_requested: FinancialGateSchema,
    verdict: RiskVerdictSchema,
    approved: z.boolean(),
    blocking_findings: z.array(NonEmptyStringSchema),
    required_controls: z.array(NonEmptyStringSchema),
    max_position_size_pct: PercentageSchema,
    max_daily_loss_pct: PercentageSchema,
    max_weekly_loss_pct: PercentageSchema,
    max_drawdown_before_freeze_pct: PercentageSchema,
    kill_switch_required: z.boolean(),
    human_approval_required: z.boolean(),
    reviewer: z.literal("Risk Officer"),
    reviewed_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((review, context) => {
    if (!review.approved && review.blocking_findings.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "unapproved risk reviews must include blocking findings",
        path: ["blocking_findings"]
      });
    }

    if (review.verdict === "blocked_by_risk" && review.approved) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_by_risk cannot be approved",
        path: ["approved"]
      });
    }

    if (review.verdict === "paper_candidate") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper_candidate is blocked while GateZero remains at G0_RESEARCH",
        path: ["verdict"]
      });
    }
  });

export type RiskVerdict = z.infer<typeof RiskVerdictSchema>;
export type RiskReview = z.infer<typeof RiskReviewSchema>;
