import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const CandidateDetectionDirectionSchema = z.enum(["LONG", "SHORT"]);

export const CandidateDetectionSchema = z
  .object({
    candidateId: NonEmptyStringSchema,
    strategyId: NonEmptyStringSchema,
    strategyVersion: NonEmptyStringSchema,
    observationEngineVersion: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    sourceTimeframe: z.literal("15m"),
    direction: CandidateDetectionDirectionSchema,
    detectedAt: z.string().datetime(),
    availableAt: z.string().datetime(),
    triggerCandleId: NonEmptyStringSchema,
    sweepCandleId: NonEmptyStringSchema.optional(),
    sourceWindowHash: NonEmptyStringSchema,
    evidenceIds: z.array(NonEmptyStringSchema).min(1),
    matchedConditions: z.array(NonEmptyStringSchema).min(1)
  })
  .strict()
  .superRefine((value, context) => {
    if (Date.parse(value.availableAt) > Date.parse(value.detectedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "candidate information cannot become available after detection",
        path: ["availableAt"]
      });
    }
  });

export const CandidateScanResultSchema = z
  .object({
    strategyId: NonEmptyStringSchema,
    strategyVersion: NonEmptyStringSchema,
    observationEngineVersion: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    scannedFrom: z.string().datetime(),
    scannedThrough: z.string().datetime(),
    sourceCandleCount: z.number().int().nonnegative(),
    evaluatedDecisionPoints: z.number().int().nonnegative(),
    detections: z.array(CandidateDetectionSchema),
    excludedDuplicateTriggerCount: z.number().int().nonnegative()
  })
  .strict();

export type CandidateDetectionDirection = z.infer<typeof CandidateDetectionDirectionSchema>;
export type CandidateDetection = z.infer<typeof CandidateDetectionSchema>;
export type CandidateScanResult = z.infer<typeof CandidateScanResultSchema>;
