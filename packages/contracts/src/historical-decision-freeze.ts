import { z } from "zod";
import { CanonicalRiskReviewSchema } from "./canonical-risk-review.js";
import { EurUsdRiskCalculationSchema } from "./eurusd-risk-calculation.js";
import { FrozenHistoricalDatasetManifestSchema } from "./frozen-historical-dataset.js";
import { HistoricalCandidateEvaluationSchema } from "./historical-ingestion-run.js";
import { HistoricalSourceSnapshotSchema } from "./historical-market-adapter.js";
import { NonEmptyStringSchema } from "./schemas.js";
import { FrozenDecisionRecordSchema } from "./validated-decision-trace.js";

const Sha256HexSchema = z.string().regex(/^[a-f0-9]{64}$/);
const CanonicalSha256Schema = z.string().regex(/^sha256:[a-f0-9]{64}$/);

export const HistoricalRiskReviewDecisionSchema = z
  .object({
    schemaVersion: z.literal(1),
    reviewDecision: z.enum(["APPROVE", "BLOCK", "REVISE"]),
    portfolioExposurePctAfterEntry: z.number().finite().min(0).max(100),
    reviewedBy: NonEmptyStringSchema,
    reviewedAt: z.string().datetime(),
    validUntil: z.string().datetime(),
    additionalAssumptions: z.array(NonEmptyStringSchema).optional(),
    additionalBlockers: z.array(NonEmptyStringSchema).optional()
  })
  .strict()
  .superRefine((decision, context) => {
    if (Date.parse(decision.validUntil) <= Date.parse(decision.reviewedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "risk review validity must extend beyond the review timestamp",
        path: ["validUntil"]
      });
    }
  });

export const HistoricalDecisionFreezeConfigurationSchema = z
  .object({
    schemaVersion: z.literal(1),
    operatorId: NonEmptyStringSchema,
    applicationCommit: NonEmptyStringSchema,
    simulationPolicyVersion: NonEmptyStringSchema,
    targetRewardRiskMultiple: z.number().finite().positive(),
    frozenAt: z.string().datetime()
  })
  .strict();

export const FrozenHistoricalDecisionBundleSchema = z
  .object({
    schemaVersion: z.literal(1),
    artifactId: z.string().regex(/^frozen-historical-decision-[a-f0-9]{24}$/),
    traceId: NonEmptyStringSchema,
    historicalRunId: NonEmptyStringSchema,
    sourceManifest: FrozenHistoricalDatasetManifestSchema,
    sourceSnapshot: HistoricalSourceSnapshotSchema,
    sourceHashes: z
      .object({
        rawDataHash: Sha256HexSchema,
        normalized15mHash: Sha256HexSchema,
        aggregated1HHash: Sha256HexSchema,
        aggregated4HHash: Sha256HexSchema,
        ingestionConfigurationHash: Sha256HexSchema,
        decisionConfigurationHash: CanonicalSha256Schema
      })
      .strict(),
    candidateEvaluation: HistoricalCandidateEvaluationSchema,
    riskCalculation: EurUsdRiskCalculationSchema,
    riskReview: CanonicalRiskReviewSchema,
    decisionRecord: FrozenDecisionRecordSchema,
    targetRewardRiskMultiple: z.number().finite().positive(),
    frozenAt: z.string().datetime(),
    artifactHash: CanonicalSha256Schema,
    localSimulationOnly: z.literal(true),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict()
  .superRefine((artifact, context) => {
    const bundle = artifact.decisionRecord.bundle;
    const assessment = artifact.candidateEvaluation.assessment;
    const calculation = artifact.riskCalculation;
    const review = artifact.riskReview;

    if (artifact.decisionRecord.frozenAt !== artifact.frozenAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "decision record and historical artifact must share one freeze timestamp",
        path: ["frozenAt"]
      });
    }

    if (bundle.traceId !== artifact.traceId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical artifact trace id must match the frozen decision record",
        path: ["traceId"]
      });
    }

    if (
      artifact.historicalRunId !== calculation.sourceLineage.historicalRunId ||
      artifact.sourceManifest.datasetId !== calculation.sourceLineage.datasetId
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "risk calculation source lineage must match the historical artifact",
        path: ["riskCalculation", "sourceLineage"]
      });
    }

    if (
      artifact.sourceHashes.rawDataHash !== calculation.sourceLineage.rawDataHash ||
      artifact.sourceHashes.normalized15mHash !== calculation.sourceLineage.normalized15mHash ||
      artifact.sourceHashes.aggregated1HHash !== calculation.sourceLineage.aggregated1HHash ||
      artifact.sourceHashes.aggregated4HHash !== calculation.sourceLineage.aggregated4HHash ||
      artifact.sourceHashes.ingestionConfigurationHash !==
        calculation.sourceLineage.ingestionConfigurationHash
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical source hashes must match the calculated risk lineage",
        path: ["sourceHashes"]
      });
    }

    if (
      calculation.candidateId !== artifact.candidateEvaluation.detection.candidateId ||
      calculation.assessmentId !== assessment.assessmentId ||
      calculation.canonicalAssessmentHash !== bundle.canonicalAssessmentHash
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "candidate, assessment, risk, and frozen decision links must remain identical",
        path: ["candidateEvaluation"]
      });
    }

    if (
      review.riskCalculationId !== calculation.riskCalculationId ||
      review.riskCalculationHash !== calculation.calculationHash ||
      bundle.riskReviewId !== review.riskReviewId ||
      bundle.riskReviewHash !== review.reviewHash
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "frozen decision must preserve calculated-risk and operator-review lineage",
        path: ["riskReview"]
      });
    }

    if (
      bundle.sourceId !== artifact.sourceManifest.datasetId ||
      bundle.rawDataHash !== artifact.sourceHashes.rawDataHash ||
      bundle.normalizedDataHash !== artifact.sourceHashes.normalized15mHash ||
      bundle.configurationHash !== artifact.sourceHashes.decisionConfigurationHash ||
      bundle.simulationPolicyVersion !== artifact.riskReview.riskEngineVersion &&
        bundle.riskEngineVersion !== artifact.riskReview.riskEngineVersion
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "frozen record does not match the historical decision artifact configuration",
        path: ["decisionRecord", "bundle"]
      });
    }
  });

export type HistoricalRiskReviewDecision = z.infer<typeof HistoricalRiskReviewDecisionSchema>;
export type HistoricalDecisionFreezeConfiguration = z.infer<
  typeof HistoricalDecisionFreezeConfigurationSchema
>;
export type FrozenHistoricalDecisionBundle = z.infer<
  typeof FrozenHistoricalDecisionBundleSchema
>;
