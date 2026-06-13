import { z } from "zod";
import {
  AssumptionSchema,
  IdentifierSchema,
  IsoDateTimeSchema,
  NonEmptyStringSchema
} from "./schemas.js";

export const StrategyIdeaSchema = z
  .object({
    strategy_id: IdentifierSchema,
    title: NonEmptyStringSchema,
    hypothesis: NonEmptyStringSchema,
    author: NonEmptyStringSchema,
    assumptions: z.array(AssumptionSchema).min(1),
    created_at: IsoDateTimeSchema
  })
  .strict();

export type StrategyIdea = z.infer<typeof StrategyIdeaSchema>;
