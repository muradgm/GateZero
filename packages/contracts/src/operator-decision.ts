import { z } from "zod";
import { IdentifierSchema, IsoDateTimeSchema, NonEmptyStringSchema } from "./schemas.js";

export const OperatorDecisionTypeSchema = z.enum(["reject", "revise", "keep_research_only"]);

export const OperatorDecisionSchema = z
  .object({
    operator_decision_id: IdentifierSchema,
    strategy_id: IdentifierSchema,
    strategy_version: NonEmptyStringSchema,
    decision: OperatorDecisionTypeSchema,
    rationale: NonEmptyStringSchema,
    decided_by: NonEmptyStringSchema,
    decided_at: IsoDateTimeSchema
  })
  .strict();

export type OperatorDecisionType = z.infer<typeof OperatorDecisionTypeSchema>;
export type OperatorDecision = z.infer<typeof OperatorDecisionSchema>;
