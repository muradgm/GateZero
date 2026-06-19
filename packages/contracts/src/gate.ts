import { z } from "zod";

export const FinancialGateSchema = z.enum(["G0_RESEARCH", "G1_BACKTESTING"]);

export const CurrentOperatingScopeSchema = z.literal("historical_backtesting_only");

export type FinancialGate = z.infer<typeof FinancialGateSchema>;
export type CurrentOperatingScope = z.infer<typeof CurrentOperatingScopeSchema>;

export const CURRENT_FINANCIAL_GATE: FinancialGate = "G1_BACKTESTING";
export const CURRENT_OPERATING_SCOPE: CurrentOperatingScope = "historical_backtesting_only";
