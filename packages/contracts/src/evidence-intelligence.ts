import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const EvidenceIntelligenceRecordSchema = z
  .object({
    schemaVersion: z.literal(1),
    evidenceId: NonEmptyStringSchema,
    evidenceVersionId: NonEmptyStringSchema,
    revision: z.number().int().positive(),
    evidenceType: z.enum([
      "MARKET_DATA",
      "DERIVED_FEATURE",
      "STRATEGY_RULE",
      "RISK_REVIEW",
      "SIMULATION",
      "OUTCOME",
      "OPERATOR_NOTE"
    ]),
    producerRuleId: NonEmptyStringSchema,
    producerVersion: NonEmptyStringSchema,
    sourceIds: z.array(NonEmptyStringSchema).min(1),
    observedAt: z.string().datetime(),
    availableAt: z.string().datetime(),
    validUntil: z.string().datetime().optional(),
    verifiedAt: z.string().datetime(),
    freshnessStatus: z.enum(["CURRENT", "STALE"]),
    previousVersionId: NonEmptyStringSchema.optional(),
    dependsOnVersionIds: z.array(NonEmptyStringSchema),
    contradictsVersionIds: z.array(NonEmptyStringSchema),
    contentHash: NonEmptyStringSchema,
    limitations: z.array(NonEmptyStringSchema).min(1),
    redactionStatus: z.enum(["NONE", "REDACTED"]),
    recordHash: NonEmptyStringSchema,
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict()
  .superRefine((record, context) => {
    if (Date.parse(record.availableAt) < Date.parse(record.observedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "evidence cannot be available before it was observed",
        path: ["availableAt"]
      });
    }
    if (Date.parse(record.verifiedAt) < Date.parse(record.availableAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "evidence cannot be verified before it was available",
        path: ["verifiedAt"]
      });
    }
    if (record.validUntil && Date.parse(record.validUntil) < Date.parse(record.availableAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "evidence validity cannot end before availability",
        path: ["validUntil"]
      });
    }
    const expectedFreshness =
      record.validUntil && Date.parse(record.verifiedAt) > Date.parse(record.validUntil)
        ? "STALE"
        : "CURRENT";
    if (record.freshnessStatus !== expectedFreshness) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "freshness status must match the verification and validity timestamps",
        path: ["freshnessStatus"]
      });
    }
    if ((record.revision === 1) !== (record.previousVersionId === undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "only revisions after the first require a previous version",
        path: ["previousVersionId"]
      });
    }
  });

export const EvidenceDependencyGraphSchema = z
  .object({
    schemaVersion: z.literal(1),
    graphId: NonEmptyStringSchema,
    evidenceVersionIds: z.array(NonEmptyStringSchema).min(1),
    dependencyOrder: z.array(NonEmptyStringSchema).min(1),
    contradictionPairs: z.array(z.tuple([NonEmptyStringSchema, NonEmptyStringSchema])),
    graphHash: NonEmptyStringSchema,
    generatedAt: z.string().datetime(),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict();

export const DecisionTimeEvidenceViewSchema = z
  .object({
    schemaVersion: z.literal(1),
    viewId: NonEmptyStringSchema,
    graphHash: NonEmptyStringSchema,
    decisionTimestamp: z.string().datetime(),
    usableVersionIds: z.array(NonEmptyStringSchema),
    blockedEvidence: z.array(
      z
        .object({
          evidenceVersionId: NonEmptyStringSchema,
          reasons: z.array(NonEmptyStringSchema).min(1)
        })
        .strict()
    ),
    contradictionPairs: z.array(z.tuple([NonEmptyStringSchema, NonEmptyStringSchema])),
    reviewRequired: z.boolean(),
    viewHash: NonEmptyStringSchema,
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict();

export const EvidenceQualityInspectionSchema = z
  .object({
    schemaVersion: z.literal(1),
    inspectionId: NonEmptyStringSchema,
    graphHash: NonEmptyStringSchema,
    decisionViewHash: NonEmptyStringSchema,
    status: z.enum(["CLEAR", "REVIEW_REQUIRED", "BLOCKED"]),
    findings: z.array(
      z
        .object({
          code: z.enum([
            "TEMPORAL_BLOCK",
            "DEPENDENCY_BLOCK",
            "CONTRADICTION",
            "REDACTION",
            "LIMITATION"
          ]),
          severity: z.enum(["INFO", "REVIEW", "BLOCKING"]),
          evidenceVersionIds: z.array(NonEmptyStringSchema).min(1),
          detail: NonEmptyStringSchema
        })
        .strict()
    ),
    inspectedAt: z.string().datetime(),
    inspectionHash: NonEmptyStringSchema,
    recommendationFinal: z.literal(false),
    executionPath: z.literal(false)
  })
  .strict();

export const EvidenceRevisionHistorySchema = z
  .object({
    schemaVersion: z.literal(1),
    historyId: NonEmptyStringSchema,
    evidenceId: NonEmptyStringSchema,
    versionIds: z.array(NonEmptyStringSchema).min(1),
    currentVersionId: NonEmptyStringSchema,
    revisionCount: z.number().int().positive(),
    historyHash: NonEmptyStringSchema,
    generatedAt: z.string().datetime()
  })
  .strict();

export const EvidenceRevisionComparisonSchema = z
  .object({
    schemaVersion: z.literal(1),
    comparisonId: NonEmptyStringSchema,
    evidenceId: NonEmptyStringSchema,
    fromVersionId: NonEmptyStringSchema,
    toVersionId: NonEmptyStringSchema,
    changedFields: z.array(NonEmptyStringSchema),
    contentChanged: z.boolean(),
    provenanceChanged: z.boolean(),
    temporalValidityChanged: z.boolean(),
    limitationsChanged: z.boolean(),
    comparisonHash: NonEmptyStringSchema,
    comparedAt: z.string().datetime()
  })
  .strict();

export const EvidenceIntelligenceCheckpointSchema = z
  .object({
    schemaVersion: z.literal(1),
    checkpointId: NonEmptyStringSchema,
    graphHash: NonEmptyStringSchema,
    decisionViewHash: NonEmptyStringSchema,
    inspectionHash: NonEmptyStringSchema,
    revisionHistoryHashes: z.array(NonEmptyStringSchema),
    status: z.enum(["PASS", "FAIL"]),
    operatorReviewRequired: z.boolean(),
    reasons: z.array(NonEmptyStringSchema).min(1),
    checkedAt: z.string().datetime(),
    checkpointHash: NonEmptyStringSchema,
    recommendationFinal: z.literal(false),
    executionPath: z.literal(false)
  })
  .strict();

export type EvidenceIntelligenceRecord = z.infer<typeof EvidenceIntelligenceRecordSchema>;
export type EvidenceDependencyGraph = z.infer<typeof EvidenceDependencyGraphSchema>;
export type DecisionTimeEvidenceView = z.infer<typeof DecisionTimeEvidenceViewSchema>;
export type EvidenceQualityInspection = z.infer<typeof EvidenceQualityInspectionSchema>;
export type EvidenceRevisionHistory = z.infer<typeof EvidenceRevisionHistorySchema>;
export type EvidenceRevisionComparison = z.infer<typeof EvidenceRevisionComparisonSchema>;
export type EvidenceIntelligenceCheckpoint = z.infer<typeof EvidenceIntelligenceCheckpointSchema>;
