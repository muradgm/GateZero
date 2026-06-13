import { z } from "zod";

export const StrategyMaturityLevelSchema = z.enum([
  "idea",
  "implemented_research",
  "backtested",
  "risk_reviewed"
]);

export type StrategyMaturityLevel = z.infer<typeof StrategyMaturityLevelSchema>;
