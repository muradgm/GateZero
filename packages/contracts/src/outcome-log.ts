import { z } from "zod";
import { IdentifierSchema, IsoDateTimeSchema, NonEmptyStringSchema } from "./schemas.js";

export const OutcomeTypeSchema = z.enum([
  "rejected",
  "revision_requested",
  "research_only_recorded"
]);

export const OutcomeLogSchema = z
  .object({
    outcome_log_id: IdentifierSchema,
    strategy_id: IdentifierSchema,
    strategy_version: NonEmptyStringSchema,
    outcome: OutcomeTypeSchema,
    reasons: z.array(NonEmptyStringSchema).min(1),
    linked_operator_decision_id: IdentifierSchema,
    logged_at: IsoDateTimeSchema
  })
  .strict();

export type OutcomeType = z.infer<typeof OutcomeTypeSchema>;
export type OutcomeLog = z.infer<typeof OutcomeLogSchema>;
