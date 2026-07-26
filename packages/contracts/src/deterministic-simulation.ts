import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const DeterministicSimulationResultSchema = z
  .object({
    schemaVersion: z.literal(1),
    simulationId: NonEmptyStringSchema,
    frozenBundleHash: NonEmptyStringSchema,
    policyId: NonEmptyStringSchema,
    policyVersion: NonEmptyStringSchema,
    status: z.enum(["TARGET", "STOP", "EXPIRED", "NOT_FILLED", "INVALID"]),
    filledAt: z.string().datetime().optional(),
    exitedAt: z.string().datetime().optional(),
    fillPrice: z.number().positive().optional(),
    exitPrice: z.number().positive().optional(),
    maeR: z.number().nonpositive().optional(),
    mfeR: z.number().nonnegative().optional(),
    realizedR: z.number().optional(),
    barsHeld: z.number().int().nonnegative(),
    commissionAmount: z.number().nonnegative(),
    spreadPips: z.number().nonnegative(),
    slippagePips: z.number().nonnegative(),
    invalidationReason: NonEmptyStringSchema.optional(),
    outputHash: NonEmptyStringSchema,
    localSimulationOnly: z.literal(true),
    executionPath: z.literal(false),
    automatedAction: z.literal(false),
    performanceClaim: z.literal(false)
  })
  .strict()
  .superRefine((result, context) => {
    const completed = ["TARGET", "STOP", "EXPIRED"].includes(result.status);
    if (
      completed &&
      (!result.filledAt ||
        !result.exitedAt ||
        result.fillPrice === undefined ||
        result.exitPrice === undefined ||
        result.maeR === undefined ||
        result.mfeR === undefined ||
        result.realizedR === undefined)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "completed simulations require fill, exit, excursion, and R-multiple evidence",
        path: ["status"]
      });
    }
    if (result.status === "INVALID" && !result.invalidationReason) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "invalid simulations require a reason",
        path: ["invalidationReason"]
      });
    }
  });

export type DeterministicSimulationResult = z.infer<typeof DeterministicSimulationResultSchema>;
