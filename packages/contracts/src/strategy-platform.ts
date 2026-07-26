import { z } from "zod";
import { CanonicalDecisionAssessmentSchema } from "./canonical-decision-assessment.js";
import {
  StrategyGateSchema,
  SupportedStrategyIdSchema
} from "./eurusd-overlap-pullback-strategy.js";
import { NonEmptyStringSchema } from "./schemas.js";
import { ValidatedDecisionTraceSchema } from "./validated-decision-trace.js";

export const StrategyRegistrationSchema = z
  .object({
    schemaVersion: z.literal(1),
    strategyId: SupportedStrategyIdSchema,
    strategyVersion: z.literal("1.0.0"),
    strategyFamily: z.enum(["EURUSD_OVERLAP_PULLBACK", "EURUSD_LONDON_RANGE_BREAKOUT"]),
    instrument: z.literal("EURUSD"),
    sourceTimeframe: z.literal("15m"),
    contextTimeframes: z.array(z.enum(["1H", "4H"])).max(2),
    observationEngineVersion: NonEmptyStringSchema,
    definitionHash: NonEmptyStringSchema,
    requiredGates: z.array(StrategyGateSchema).min(1),
    riskReviewRequired: z.literal(true),
    deterministicSimulationRequired: z.literal(true),
    outcomeRequired: z.literal(true),
    learningRequired: z.literal(true),
    localResearchOnly: z.literal(true),
    optimizationAuthority: z.literal(false),
    recommendationFinal: z.literal(false),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict()
  .superRefine((registration, context) => {
    if (new Set(registration.requiredGates).size !== registration.requiredGates.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "strategy registration requires unique protected-loop gates",
        path: ["requiredGates"]
      });
    }
  });

export const RegisteredStrategyAssessmentSchema = z
  .object({
    registration: StrategyRegistrationSchema,
    assessment: CanonicalDecisionAssessmentSchema,
    assessmentHash: NonEmptyStringSchema
  })
  .strict();

export const MultiStrategyLifecycleSchema = z
  .object({
    strategyId: SupportedStrategyIdSchema,
    strategyVersion: NonEmptyStringSchema,
    registrationHash: NonEmptyStringSchema,
    trace: ValidatedDecisionTraceSchema,
    traceHash: NonEmptyStringSchema
  })
  .strict();

export const MultiStrategyCheckpointSchema = z
  .object({
    schemaVersion: z.literal(1),
    checkpointId: NonEmptyStringSchema,
    registryHash: NonEmptyStringSchema,
    registrationHashes: z.array(NonEmptyStringSchema).min(2),
    assessmentHashes: z.array(NonEmptyStringSchema).min(2),
    lifecycleHashes: z.array(NonEmptyStringSchema).min(2),
    strategyIds: z.array(SupportedStrategyIdSchema).min(2),
    status: z.enum(["PASS", "FAIL"]),
    deterministic: z.boolean(),
    identityIsolated: z.boolean(),
    protectedLoopShared: z.boolean(),
    completeLifecycleCount: z.number().int().nonnegative(),
    reasons: z.array(NonEmptyStringSchema).min(1),
    checkedAt: z.string().datetime(),
    checkpointHash: NonEmptyStringSchema,
    localResearchOnly: z.literal(true),
    optimizationAuthority: z.literal(false),
    recommendationFinal: z.literal(false),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict();

export type StrategyRegistration = z.infer<typeof StrategyRegistrationSchema>;
export type RegisteredStrategyAssessment = z.infer<typeof RegisteredStrategyAssessmentSchema>;
export type MultiStrategyLifecycle = z.infer<typeof MultiStrategyLifecycleSchema>;
export type MultiStrategyCheckpoint = z.infer<typeof MultiStrategyCheckpointSchema>;
