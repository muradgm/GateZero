import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const SimulationPolicySchema = z
  .object({
    schemaVersion: z.literal(1),
    policyId: NonEmptyStringSchema,
    version: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    executionMode: z.literal("deterministic_paper_simulation"),
    orderType: z.enum(["MARKET", "LIMIT", "STOP"]),
    triggerCondition: NonEmptyStringSchema,
    fillAssumption: z.enum([
      "NEXT_AVAILABLE_PRICE",
      "TOUCH_WITH_SPREAD",
      "CLOSE_CONFIRMATION_NEXT_OPEN"
    ]),
    spreadModel: z
      .object({
        type: z.enum(["FIXED_PIPS", "SOURCE_RECORDED"]),
        valuePips: z.number().nonnegative().optional()
      })
      .strict(),
    commissionModel: z
      .object({
        type: z.enum(["NONE", "FIXED_ACCOUNT_CURRENCY", "PER_NOTIONAL"]),
        value: z.number().nonnegative()
      })
      .strict(),
    slippageModel: z
      .object({
        type: z.enum(["NONE", "FIXED_PIPS", "ADVERSE_TICKS"]),
        value: z.number().nonnegative()
      })
      .strict(),
    gapPolicy: z.enum(["FILL_AT_FIRST_AVAILABLE_PRICE", "INVALIDATE_SIMULATION"]),
    stopExecutionPolicy: z.enum(["TOUCH", "CLOSE_THROUGH", "NEXT_OPEN_AFTER_CLOSE"]),
    targetExecutionPolicy: z.enum(["TOUCH", "CLOSE_THROUGH", "NEXT_OPEN_AFTER_CLOSE"]),
    sameCandleConflictPolicy: z.enum([
      "STOP_FIRST",
      "TARGET_FIRST",
      "LOWER_TIMEFRAME_REQUIRED",
      "INVALID_RESULT"
    ]),
    partialFillPolicy: z.enum(["NOT_SUPPORTED", "FULL_FILL_ONLY", "SOURCE_RECORDED"]),
    sessionClosurePolicy: z.enum(["HOLD", "CLOSE_AT_SESSION_END", "EXPIRE_UNFILLED"]),
    maximumHoldingBars: z.number().int().positive(),
    pricePrecision: z.number().int().min(1).max(10),
    pipSize: z.number().positive(),
    createdAt: z.string().datetime()
  })
  .strict()
  .superRefine((value, context) => {
    if (value.spreadModel.type === "FIXED_PIPS" && value.spreadModel.valuePips === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "fixed spread model requires valuePips",
        path: ["spreadModel", "valuePips"]
      });
    }

    if (value.spreadModel.type === "SOURCE_RECORDED" && value.spreadModel.valuePips !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "source-recorded spread must not define a fixed value",
        path: ["spreadModel", "valuePips"]
      });
    }
  });

export type SimulationPolicy = z.infer<typeof SimulationPolicySchema>;
