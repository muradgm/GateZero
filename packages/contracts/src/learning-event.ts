import { z } from "zod";
import { IdentifierSchema, IsoDateTimeSchema, NonEmptyStringSchema } from "./schemas.js";

export const LearningEventSchema = z
  .object({
    learning_event_id: IdentifierSchema,
    source_outcome_log_id: IdentifierSchema,
    summary: NonEmptyStringSchema,
    evidence_used: z.array(NonEmptyStringSchema).min(1),
    updates_rules: z.boolean(),
    updates_tests: z.boolean(),
    updates_docs: z.boolean(),
    risk_limit_change: z.literal("none"),
    autonomy_change: z.literal("none"),
    created_at: IsoDateTimeSchema
  })
  .strict();

export type LearningEvent = z.infer<typeof LearningEventSchema>;
