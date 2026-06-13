import { z } from "zod";
import {
  AssumptionSchema,
  IdentifierSchema,
  IsoDateTimeSchema,
  MetricSummarySchema,
  NonEmptyStringSchema,
  RiskFlagSchema
} from "./schemas.js";

export const MetricReportSchema = z
  .object({
    metric_report_id: IdentifierSchema,
    backtest_result_id: IdentifierSchema,
    strategy_id: IdentifierSchema,
    strategy_version: NonEmptyStringSchema,
    metrics: MetricSummarySchema,
    assumptions: z.array(AssumptionSchema).min(1),
    risk_flags: z.array(RiskFlagSchema),
    generated_at: IsoDateTimeSchema
  })
  .strict();

export type MetricReport = z.infer<typeof MetricReportSchema>;
