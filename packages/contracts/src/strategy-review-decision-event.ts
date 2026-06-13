import { z } from "zod";
import { FinancialGateSchema } from "./gate.js";
import { RiskVerdictSchema } from "./risk-review.js";
import {
  AssumptionSchema,
  IdentifierSchema,
  IsoDateTimeSchema,
  ReferenceSchema,
  RiskFlagSchema
} from "./schemas.js";
import { StrategyMaturityLevelSchema } from "./strategy-maturity.js";

export const StrategyReviewDecisionEventSchema = z
  .object({
    strategy_review_decision_event_id: IdentifierSchema,
    strategy_idea_ref: ReferenceSchema,
    data_snapshot_ref: ReferenceSchema,
    backtest_result_ref: ReferenceSchema,
    metric_report_ref: ReferenceSchema,
    risk_review_ref: ReferenceSchema,
    operator_decision_ref: ReferenceSchema,
    financial_gate: FinancialGateSchema,
    maturity_level: StrategyMaturityLevelSchema,
    assumptions: z.array(AssumptionSchema).min(1),
    risk_flags: z.array(RiskFlagSchema).min(1),
    final_verdict: RiskVerdictSchema,
    recorded_at: IsoDateTimeSchema
  })
  .strict();

export type StrategyReviewDecisionEvent = z.infer<typeof StrategyReviewDecisionEventSchema>;
