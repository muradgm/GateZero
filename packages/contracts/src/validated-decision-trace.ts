import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const TraceRequirementStatusSchema = z.enum([
  "COMPLETE",
  "PARTIAL",
  "MISSING",
  "STALE",
  "NOT_APPLICABLE"
]);

export const TraceLifecycleStatusSchema = z.enum(["OPEN", "INCOMPLETE", "COMPLETE"]);

export const TraceValidityAreaSchema = z.enum([
  "data_integrity",
  "timestamp_integrity",
  "strategy_integrity",
  "evidence_integrity",
  "calculation_integrity",
  "risk_integrity",
  "simulation_integrity",
  "reproducibility",
  "provenance_integrity",
  "version_integrity"
]);

export const TraceGateStatusSchema = z.enum(["PASS", "FAIL", "BLOCKED", "NOT_RUN"]);

export const TemporalEvidenceReferenceSchema = z
  .object({
    evidenceId: NonEmptyStringSchema,
    sourceId: NonEmptyStringSchema,
    observedAt: z.string().datetime(),
    availableAt: z.string().datetime(),
    validUntil: z.string().datetime().optional(),
    transformationVersion: NonEmptyStringSchema,
    contentHash: NonEmptyStringSchema
  })
  .strict()
  .superRefine((value, context) => {
    if (Date.parse(value.availableAt) < Date.parse(value.observedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "availableAt cannot precede observedAt",
        path: ["availableAt"]
      });
    }

    if (value.validUntil && Date.parse(value.validUntil) < Date.parse(value.availableAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "validUntil cannot precede availableAt",
        path: ["validUntil"]
      });
    }
  });

export const TraceRequirementSchema = z
  .object({
    requirementId: NonEmptyStringSchema,
    label: NonEmptyStringSchema,
    status: TraceRequirementStatusSchema,
    weight: z.number().positive(),
    evidenceIds: z.array(NonEmptyStringSchema),
    failureReason: NonEmptyStringSchema.optional()
  })
  .strict()
  .superRefine((value, context) => {
    if (["MISSING", "STALE", "PARTIAL"].includes(value.status) && !value.failureReason) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "incomplete requirements require a failure reason",
        path: ["failureReason"]
      });
    }
  });

export const TraceValidityCheckSchema = z
  .object({
    checkId: NonEmptyStringSchema,
    area: TraceValidityAreaSchema,
    status: TraceGateStatusSchema,
    ruleVersion: NonEmptyStringSchema,
    message: NonEmptyStringSchema,
    evidenceIds: z.array(NonEmptyStringSchema),
    checkedAt: z.string().datetime()
  })
  .strict();

export const TraceGateResultSchema = z
  .object({
    gate: z.enum(["COMPLETENESS", "VALIDITY", "REPRODUCIBILITY", "WORKFLOW"]),
    status: TraceGateStatusSchema,
    reasons: z.array(NonEmptyStringSchema),
    checkedAt: z.string().datetime()
  })
  .strict();

export const FrozenDecisionBundleSchema = z
  .object({
    schemaVersion: z.literal(1),
    traceId: NonEmptyStringSchema,
    setupReviewId: NonEmptyStringSchema,
    instrument: z.literal("EURUSD"),
    decisionTimestamp: z.string().datetime(),
    operatorId: NonEmptyStringSchema,
    sourceId: NonEmptyStringSchema,
    rawDataHash: NonEmptyStringSchema,
    normalizedDataHash: NonEmptyStringSchema,
    strategyVersion: NonEmptyStringSchema,
    strategyParametersHash: NonEmptyStringSchema,
    featureEngineVersion: NonEmptyStringSchema,
    riskEngineVersion: NonEmptyStringSchema,
    simulationPolicyVersion: NonEmptyStringSchema,
    applicationCommit: NonEmptyStringSchema,
    configurationHash: NonEmptyStringSchema,
    evidenceBundleHash: NonEmptyStringSchema,
    canonicalAssessmentHash: NonEmptyStringSchema,
    recommendation: z.enum(["REJECT", "WATCH", "PAPER_SIMULATE"]),
    blockers: z.array(NonEmptyStringSchema),
    temporalEvidence: z.array(TemporalEvidenceReferenceSchema),
    createdAt: z.string().datetime()
  })
  .strict()
  .superRefine((value, context) => {
    const decisionTime = Date.parse(value.decisionTimestamp);

    value.temporalEvidence.forEach((evidence, index) => {
      if (Date.parse(evidence.availableAt) > decisionTime) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "decision bundle contains evidence unavailable at decision time",
          path: ["temporalEvidence", index, "availableAt"]
        });
      }
    });

    if (value.recommendation === "PAPER_SIMULATE" && value.blockers.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper simulation cannot retain unresolved blockers",
        path: ["blockers"]
      });
    }
  });

export const ValidatedDecisionTraceSchema = z
  .object({
    schemaVersion: z.literal(1),
    traceId: NonEmptyStringSchema,
    lifecycleStatus: TraceLifecycleStatusSchema,
    completenessScore: z.number().min(0).max(100),
    requirements: z.array(TraceRequirementSchema).min(1),
    validityChecks: z.array(TraceValidityCheckSchema).min(1),
    gates: z.array(TraceGateResultSchema).length(4),
    frozenDecisionBundle: FrozenDecisionBundleSchema,
    outcomeId: NonEmptyStringSchema.optional(),
    learningEventId: NonEmptyStringSchema.optional()
  })
  .strict()
  .superRefine((value, context) => {
    const uniqueGates = new Set(value.gates.map((gate) => gate.gate));
    if (uniqueGates.size !== 4) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "validated trace requires exactly one result for each release gate",
        path: ["gates"]
      });
    }

    if (value.lifecycleStatus === "COMPLETE" && (!value.outcomeId || !value.learningEventId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "complete lifecycle requires outcome and learning event references",
        path: ["lifecycleStatus"]
      });
    }

    if (
      value.lifecycleStatus === "COMPLETE" &&
      value.gates.some((gate) => gate.status !== "PASS")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "complete lifecycle requires all release gates to pass",
        path: ["gates"]
      });
    }
  });

export type TraceRequirementStatus = z.infer<typeof TraceRequirementStatusSchema>;
export type TraceValidityArea = z.infer<typeof TraceValidityAreaSchema>;
export type TemporalEvidenceReference = z.infer<typeof TemporalEvidenceReferenceSchema>;
export type FrozenDecisionBundle = z.infer<typeof FrozenDecisionBundleSchema>;
export type ValidatedDecisionTrace = z.infer<typeof ValidatedDecisionTraceSchema>;
