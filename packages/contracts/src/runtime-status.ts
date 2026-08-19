import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const OperatorOutcomeSchema = z.enum(["REJECT", "WATCH", "PAPER_SIMULATE"]);

export const RuntimeStatusBoundarySchema = z
  .object({
    product: z.literal("TraderFrame"),
    controlPlane: z.literal("GateZero"),
    operatingGate: z.literal("G2_PAPER_TRADING"),
    operatingScope: z.literal("paper_simulation_planning_only"),
    productMode: z.literal("local_research_and_read_only_decision_support"),
    executionAuthority: z.literal("none"),
    currentInitiative: NonEmptyStringSchema,
    currentMilestone: NonEmptyStringSchema,
    allowedOperatorOutcomes: z
      .array(OperatorOutcomeSchema)
      .length(3)
      .superRefine((outcomes, context) => {
        const expected = new Set(["REJECT", "WATCH", "PAPER_SIMULATE"]);
        const actual = new Set(outcomes);
        if (actual.size !== expected.size || [...expected].some((value) => !actual.has(value))) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "runtime status must expose exactly the three bounded operator outcomes"
          });
        }
      }),
    boundaries: z
      .object({
        blocked: z.array(NonEmptyStringSchema).min(1),
        allowed: z.array(NonEmptyStringSchema).min(1)
      })
      .strict()
  })
  .strict();

export const RuntimeValidationStatusSchema = z
  .object({
    testFileCount: z.number().int().nonnegative(),
    testCount: z.number().int().nonnegative(),
    status: z.enum(["passing", "failing", "unknown"]),
    command: NonEmptyStringSchema
  })
  .strict();

export const RuntimeCiStatusSchema = z
  .object({
    lastVerifiedCommit: z.string().regex(/^[a-f0-9]{7,40}$/).optional(),
    latestRunId: z.string().regex(/^\d+$/).optional(),
    state: z.enum(["success", "failure", "pending", "unknown"])
  })
  .strict();

export const RuntimeStatusSchema = RuntimeStatusBoundarySchema.extend({
  latestAcceptedEvidenceId: z.string().regex(/^TRD-\d+$/).optional(),
  validation: RuntimeValidationStatusSchema.optional(),
  ci: RuntimeCiStatusSchema.optional(),
  generatedAt: z.string().datetime()
}).strict();

export type OperatorOutcome = z.infer<typeof OperatorOutcomeSchema>;
export type RuntimeStatusBoundary = z.infer<typeof RuntimeStatusBoundarySchema>;
export type RuntimeValidationStatus = z.infer<typeof RuntimeValidationStatusSchema>;
export type RuntimeCiStatus = z.infer<typeof RuntimeCiStatusSchema>;
export type RuntimeStatus = z.infer<typeof RuntimeStatusSchema>;
