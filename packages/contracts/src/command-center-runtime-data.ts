import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const CommandCenterRuntimeDataSchema = z
  .object({
    latestPacket: z.string().regex(/^TRD-\d+$/),
    localVerification: z.string().regex(/^\d+ files \/ \d+ tests$/),
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
  });

export const CommandCenterRuntimeBoundarySchema = z
  .object({
    gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    source: NonEmptyStringSchema,
    externalAccess: z.literal(false),
    executionPath: z.literal(false)
  })
  .strict();

export type CommandCenterRuntimeData = z.infer<typeof CommandCenterRuntimeDataSchema>;
export type CommandCenterRuntimeBoundary = z.infer<typeof CommandCenterRuntimeBoundarySchema>;
