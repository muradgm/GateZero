import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const CommandCenterRuntimeBoundarySchema = z
  .object({
    project: z.literal("TraderFrame"),
    gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    source: NonEmptyStringSchema,
    localOnly: z.literal(true),
    evidenceOnly: z.literal(true),
    operatorRequired: z.literal(true),
    riskReviewRequired: z.literal(true),
    externalAccess: z.literal(false),
    executionPath: z.literal(false),
    automatedAction: z.literal(false),
    approvalClaim: z.literal(false),
    performanceClaim: z.literal(false)
  })
  .strict();

export const CommandCenterRuntimeDataSchema = CommandCenterRuntimeBoundarySchema.extend({
  latestPacket: z.string().regex(/^TRD-\d+$/),
  localVerification: z.string().regex(/^\d+ files \/ \d+ tests$/),
  testFileCount: z.number().int().nonnegative(),
  testCount: z.number().int().nonnegative(),
  ciRun: z.string().regex(/^\d+$/),
  ciState: z.literal("success"),
  lastVerifiedCommit: z.string().regex(/^[a-f0-9]{7,40}$/),
  acceptedRecords: z.number().int().positive(),
  evidenceRecords: z.number().int().positive()
})
  .strict()
  .superRefine((data, context) => {
    if (data.acceptedRecords < Number(data.latestPacket.replace("TRD-", ""))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "accepted records must not lag behind the latest packet number",
        path: ["acceptedRecords"]
      });
    }

    if (data.localVerification !== `${data.testFileCount} files / ${data.testCount} tests`) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "local verification summary must match its canonical numeric fields",
        path: ["localVerification"]
      });
    }
  });

export type CommandCenterRuntimeData = z.infer<typeof CommandCenterRuntimeDataSchema>;
export type CommandCenterRuntimeBoundary = z.infer<typeof CommandCenterRuntimeBoundarySchema>;
