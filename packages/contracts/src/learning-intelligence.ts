import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const LearningRegimeSchema = z.enum([
  "TREND_PULLBACK",
  "RANGE",
  "EVENT_RISK",
  "VOLATILITY_EXPANSION",
  "UNKNOWN"
]);

export const LearningInvalidationCodeSchema = z.enum([
  "NONE",
  "STRUCTURE_BREAK",
  "EVENT_WINDOW",
  "TIME_EXPIRY",
  "ENTRY_NOT_REACHED",
  "SIMULATION_AMBIGUITY"
]);

export const LearningFailureModeSchema = z.enum([
  "THESIS",
  "EVIDENCE",
  "TIMING",
  "RISK",
  "PROCESS"
]);

export const OperatorProcessErrorSchema = z.enum([
  "EARLY_ENTRY",
  "MISSED_CONTRADICTION",
  "INVALIDATION_IGNORED",
  "RISK_OVERRIDE_ATTEMPT",
  "LATE_REVIEW"
]);

export const LearningIntelligenceCaseSchema = z
  .object({
    schemaVersion: z.literal(1),
    caseRecordId: NonEmptyStringSchema,
    frozenBundleHash: NonEmptyStringSchema,
    outcomeId: NonEmptyStringSchema,
    outcomeHash: NonEmptyStringSchema,
    disposition: z.enum(["TARGET", "STOP", "EXPIRED", "NOT_FILLED", "INVALID"]),
    learningEventId: NonEmptyStringSchema,
    learningHash: NonEmptyStringSchema,
    learningCategory: z.enum([
      "PLAN_COMPLETED",
      "RISK_REALIZED",
      "TIME_EXIT",
      "ENTRY_NOT_REACHED",
      "SIMULATION_INVALID"
    ]),
    strategyVersion: NonEmptyStringSchema,
    regime: LearningRegimeSchema,
    invalidationCode: LearningInvalidationCodeSchema,
    evidenceCombination: z.array(NonEmptyStringSchema).min(1),
    failureModes: z.array(LearningFailureModeSchema),
    operatorProcessErrors: z.array(OperatorProcessErrorSchema),
    attributionMode: z.literal("MANUAL_LOCAL"),
    operatorConfirmed: z.literal(true),
    observedAt: z.string().datetime(),
    limitations: z.array(NonEmptyStringSchema).min(1),
    caseHash: NonEmptyStringSchema,
    predictiveClaim: z.literal(false),
    performanceClaim: z.literal(false),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict();

const RecurringInvalidationSchema = z
  .object({
    invalidationCode: LearningInvalidationCodeSchema.exclude(["NONE"]),
    caseRecordIds: z.array(NonEmptyStringSchema).min(2),
    occurrenceCount: z.number().int().min(2)
  })
  .strict();

const EvidenceFailurePatternSchema = z
  .object({
    evidenceCombination: z.array(NonEmptyStringSchema).min(1),
    failureMode: LearningFailureModeSchema,
    caseRecordIds: z.array(NonEmptyStringSchema).min(2),
    occurrenceCount: z.number().int().min(2)
  })
  .strict();

const OperatorProcessPatternSchema = z
  .object({
    processError: OperatorProcessErrorSchema,
    caseRecordIds: z.array(NonEmptyStringSchema).min(2),
    occurrenceCount: z.number().int().min(2),
    attributionMode: z.literal("MANUAL_LOCAL")
  })
  .strict();

const ComparableCaseClusterSchema = z
  .object({
    clusterId: NonEmptyStringSchema,
    clusterKey: NonEmptyStringSchema,
    strategyVersion: NonEmptyStringSchema,
    regime: LearningRegimeSchema,
    evidenceCombination: z.array(NonEmptyStringSchema).min(1),
    caseRecordIds: z.array(NonEmptyStringSchema).min(2),
    dispositions: z.array(z.enum(["TARGET", "STOP", "EXPIRED", "NOT_FILLED", "INVALID"])).min(1),
    invalidationCodes: z.array(LearningInvalidationCodeSchema).min(1),
    limitations: z.array(NonEmptyStringSchema).min(1)
  })
  .strict();

const LearningDriftInspectionSchema = z
  .object({
    strategyVersions: z.array(NonEmptyStringSchema).min(1),
    strategyVersionChanged: z.boolean(),
    regimeSequence: z.array(LearningRegimeSchema).min(1),
    regimeChangeCount: z.number().int().nonnegative(),
    status: z.enum(["STABLE", "REVIEW_REQUIRED"]),
    reasons: z.array(NonEmptyStringSchema).min(1)
  })
  .strict();

export const LearningIntelligenceReportSchema = z
  .object({
    schemaVersion: z.literal(1),
    reportId: NonEmptyStringSchema,
    sourceCaseHashes: z.array(NonEmptyStringSchema).min(3),
    recurringInvalidations: z.array(RecurringInvalidationSchema),
    evidenceFailurePatterns: z.array(EvidenceFailurePatternSchema),
    operatorProcessPatterns: z.array(OperatorProcessPatternSchema),
    comparableCaseClusters: z.array(ComparableCaseClusterSchema),
    driftInspection: LearningDriftInspectionSchema,
    status: z.enum(["CLEAR", "REVIEW_REQUIRED"]),
    reasons: z.array(NonEmptyStringSchema).min(1),
    limitations: z.array(NonEmptyStringSchema).min(1),
    generatedAt: z.string().datetime(),
    reportHash: NonEmptyStringSchema,
    operatorReviewRequired: z.literal(true),
    recommendationFinal: z.literal(false),
    updatesRules: z.literal(false),
    updatesRiskLimits: z.literal(false),
    predictiveClaim: z.literal(false),
    performanceClaim: z.literal(false),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict()
  .superRefine((report, context) => {
    const hasReviewConcern =
      report.recurringInvalidations.length > 0 ||
      report.evidenceFailurePatterns.length > 0 ||
      report.operatorProcessPatterns.length > 0 ||
      report.driftInspection.status === "REVIEW_REQUIRED";
    if ((report.status === "REVIEW_REQUIRED") !== hasReviewConcern) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "learning report status must match its inspectable review concerns",
        path: ["status"]
      });
    }
  });

export const LearningIntelligenceCheckpointSchema = z
  .object({
    schemaVersion: z.literal(1),
    checkpointId: NonEmptyStringSchema,
    firstReportHash: NonEmptyStringSchema,
    secondReportHash: NonEmptyStringSchema,
    status: z.enum(["PASS", "FAIL"]),
    deterministic: z.boolean(),
    sourceChainsValid: z.boolean(),
    requiredPatternsExercised: z.boolean(),
    reasons: z.array(NonEmptyStringSchema).min(1),
    checkedAt: z.string().datetime(),
    checkpointHash: NonEmptyStringSchema,
    recommendationFinal: z.literal(false),
    predictiveClaim: z.literal(false),
    performanceClaim: z.literal(false),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict();

export type LearningRegime = z.infer<typeof LearningRegimeSchema>;
export type LearningInvalidationCode = z.infer<typeof LearningInvalidationCodeSchema>;
export type LearningFailureMode = z.infer<typeof LearningFailureModeSchema>;
export type OperatorProcessError = z.infer<typeof OperatorProcessErrorSchema>;
export type LearningIntelligenceCase = z.infer<typeof LearningIntelligenceCaseSchema>;
export type LearningIntelligenceReport = z.infer<typeof LearningIntelligenceReportSchema>;
export type LearningIntelligenceCheckpoint = z.infer<typeof LearningIntelligenceCheckpointSchema>;
