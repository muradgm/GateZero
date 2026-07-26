import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const ValidatedSimulationOutcomeSchema = z
  .object({
    schemaVersion: z.literal(1),
    outcomeId: NonEmptyStringSchema,
    traceId: NonEmptyStringSchema,
    frozenBundleHash: NonEmptyStringSchema,
    simulationId: NonEmptyStringSchema,
    simulationOutputHash: NonEmptyStringSchema,
    disposition: z.enum(["TARGET", "STOP", "EXPIRED", "NOT_FILLED", "INVALID"]),
    realizedR: z.number().optional(),
    maeR: z.number().nonpositive().optional(),
    mfeR: z.number().nonnegative().optional(),
    operatorNote: NonEmptyStringSchema,
    operatorNoteAuthorship: z.literal("MANUAL_LOCAL"),
    attributedAt: z.string().datetime(),
    outcomeHash: NonEmptyStringSchema,
    performanceClaim: z.literal(false),
    executionPath: z.literal(false)
  })
  .strict();

export const DeterministicLearningEventSchema = z
  .object({
    schemaVersion: z.literal(1),
    learningEventId: NonEmptyStringSchema,
    sourceOutcomeId: NonEmptyStringSchema,
    sourceOutcomeHash: NonEmptyStringSchema,
    category: z.enum([
      "PLAN_COMPLETED",
      "RISK_REALIZED",
      "TIME_EXIT",
      "ENTRY_NOT_REACHED",
      "SIMULATION_INVALID"
    ]),
    summary: NonEmptyStringSchema,
    evidenceIds: z.array(NonEmptyStringSchema).min(2),
    createdAt: z.string().datetime(),
    learningHash: NonEmptyStringSchema,
    updatesRules: z.literal(false),
    updatesRiskLimits: z.literal(false),
    autonomyChange: z.literal("NONE")
  })
  .strict();

export type ValidatedSimulationOutcome = z.infer<typeof ValidatedSimulationOutcomeSchema>;
export type DeterministicLearningEvent = z.infer<typeof DeterministicLearningEventSchema>;
