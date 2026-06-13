import { z } from "zod";

export const IdentifierSchema = z.string().trim().min(1);
export const NonEmptyStringSchema = z.string().trim().min(1);
export const IsoDateTimeSchema = z.string().datetime({ offset: true });

export const PercentageSchema = z.number().min(0).max(100);

export const ReferenceSchema = z
  .object({
    id: IdentifierSchema,
    version: z.string().trim().min(1).optional()
  })
  .strict();

export const DateRangeSchema = z
  .object({
    start: z.string().date(),
    end: z.string().date()
  })
  .strict()
  .refine((range) => range.start <= range.end, {
    message: "date range start must be before or equal to end"
  });

export const AssumptionSchema = z
  .object({
    name: NonEmptyStringSchema,
    value: NonEmptyStringSchema,
    source: NonEmptyStringSchema
  })
  .strict();

export const RiskFlagSchema = z
  .object({
    code: NonEmptyStringSchema,
    severity: z.enum(["low", "medium", "high", "critical"]),
    description: NonEmptyStringSchema
  })
  .strict();

export const ResearchParameterValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.null()
]);

export const ResearchParametersSchema = z.record(z.string(), ResearchParameterValueSchema);

export const MetricSummarySchema = z
  .object({
    total_return_pct: z.number(),
    max_drawdown_pct: PercentageSchema,
    average_win_loss_ratio: z.number(),
    trade_count: z.number().int().nonnegative(),
    warnings: z.array(NonEmptyStringSchema)
  })
  .strict();

export const CurvePointSchema = z
  .object({
    timestamp: IsoDateTimeSchema,
    value: z.number()
  })
  .strict();
