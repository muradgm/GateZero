import { z } from "zod";

export const FinancialGateSchema = z.literal("G0_RESEARCH");

export type FinancialGate = z.infer<typeof FinancialGateSchema>;

export const CURRENT_FINANCIAL_GATE: FinancialGate = "G0_RESEARCH";
