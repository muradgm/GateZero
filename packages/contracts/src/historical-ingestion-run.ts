import { z } from "zod";
import { CandidateDetectionSchema, CandidateScanResultSchema } from "./candidate-detection.js";
import { CanonicalDecisionAssessmentSchema } from "./canonical-decision-assessment.js";
import { EurUsdOverlapPullbackObservationSchema } from "./eurusd-overlap-pullback-strategy.js";
import {
  FrozenHistoricalDatasetFailureSchema,
  FrozenHistoricalDatasetImportResultSchema,
  FrozenHistoricalDatasetManifestSchema
} from "./frozen-historical-dataset.js";
import {
  HistoricalAdapterFailureSchema,
  HistoricalSourceSnapshotSchema
} from "./historical-market-adapter.js";
import { NormalizedMarketCandleSchema } from "./market-data-candle.js";
import { NonEmptyStringSchema } from "./schemas.js";
import { TimeBoundMarketCandleSchema } from "./timeframe-aggregation.js";
import { TraceValidityFailureSchema } from "./trace-validity-failures.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);

export const HistoricalCandidateEvaluationSchema = z
  .object({
    detection: CandidateDetectionSchema,
    observation: EurUsdOverlapPullbackObservationSchema,
    assessment: CanonicalDecisionAssessmentSchema
  })
  .strict()
  .superRefine((value, context) => {
    const candidateIds = [
      value.detection.candidateId,
      value.observation.candidateId,
      value.assessment.candidateId
    ];
    if (new Set(candidateIds).size !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "detection, observation, and assessment must share one candidate id",
        path: ["assessment", "candidateId"]
      });
    }

    if (value.detection.detectedAt !== value.observation.decisionTimestamp) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "candidate detection and observation decision timestamps must match",
        path: ["observation", "decisionTimestamp"]
      });
    }
  });

export const HistoricalIngestionRunSchema = z
  .object({
    schemaVersion: z.literal(1),
    ingestionVersion: NonEmptyStringSchema,
    runId: z.string().regex(/^historical-ingestion-[a-f0-9]{24}$/),
    status: z.enum(["REJECTED", "COMPLETED"]),
    dataMode: z.literal("FROZEN_HISTORICAL_IMPORT"),
    checkedAt: z.string().datetime(),
    asOf: z.string().datetime(),
    manifest: FrozenHistoricalDatasetManifestSchema,
    sourceSnapshot: HistoricalSourceSnapshotSchema,
    importVerification: FrozenHistoricalDatasetImportResultSchema,
    versions: z
      .object({
        adapterVersion: NonEmptyStringSchema,
        normalizationVersion: NonEmptyStringSchema,
        aggregationVersion: NonEmptyStringSchema,
        strategyVersion: NonEmptyStringSchema,
        observationEngineVersion: NonEmptyStringSchema
      })
      .strict(),
    configurationHash: Sha256Schema,
    hashes: z
      .object({
        rawDataHash: Sha256Schema,
        normalized15mHash: Sha256Schema.nullable(),
        aggregated1HHash: Sha256Schema.nullable(),
        aggregated4HHash: Sha256Schema.nullable()
      })
      .strict(),
    counts: z
      .object({
        rawRows: z.number().int().nonnegative(),
        normalized15m: z.number().int().nonnegative(),
        aggregated1H: z.number().int().nonnegative(),
        aggregated4H: z.number().int().nonnegative(),
        candidates: z.number().int().nonnegative(),
        assessments: z.number().int().nonnegative()
      })
      .strict(),
    failures: z
      .object({
        import: z.array(FrozenHistoricalDatasetFailureSchema),
        adapter: z.array(HistoricalAdapterFailureSchema),
        validation: z.array(TraceValidityFailureSchema),
        aggregation1H: z.array(TraceValidityFailureSchema),
        aggregation4H: z.array(TraceValidityFailureSchema)
      })
      .strict(),
    series: z
      .object({
        normalized15m: z.array(NormalizedMarketCandleSchema),
        aggregated1H: z.array(TimeBoundMarketCandleSchema),
        aggregated4H: z.array(TimeBoundMarketCandleSchema)
      })
      .strict(),
    candidateScan: CandidateScanResultSchema.optional(),
    candidateEvaluations: z.array(HistoricalCandidateEvaluationSchema)
  })
  .strict()
  .superRefine((value, context) => {
    if (value.asOf !== value.manifest.rangeEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "historical ingestion as-of boundary must equal the frozen manifest range end",
        path: ["asOf"]
      });
    }

    if (value.hashes.rawDataHash !== value.sourceSnapshot.rawContentHash) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "run raw-data hash must match the provider source snapshot",
        path: ["hashes", "rawDataHash"]
      });
    }

    if (value.counts.rawRows !== value.importVerification.rawRowCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "raw row count must match the frozen import verification",
        path: ["counts", "rawRows"]
      });
    }

    const expectedCounts = {
      normalized15m: value.series.normalized15m.length,
      aggregated1H: value.series.aggregated1H.length,
      aggregated4H: value.series.aggregated4H.length,
      candidates: value.candidateScan?.detections.length ?? 0,
      assessments: value.candidateEvaluations.length
    };

    for (const [key, expected] of Object.entries(expectedCounts)) {
      if (value.counts[key as keyof typeof expectedCounts] !== expected) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${key} count does not match the canonical payload`,
          path: ["counts", key]
        });
      }
    }

    if (value.status === "COMPLETED") {
      const downstreamFailures = [
        ...value.failures.import,
        ...value.failures.adapter,
        ...value.failures.validation,
        ...value.failures.aggregation1H,
        ...value.failures.aggregation4H
      ];
      const hashesComplete =
        value.hashes.normalized15mHash !== null &&
        value.hashes.aggregated1HHash !== null &&
        value.hashes.aggregated4HHash !== null;
      if (
        !value.importVerification.ready ||
        downstreamFailures.length > 0 ||
        !value.candidateScan ||
        !hashesComplete
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "completed ingestion requires verified data, complete hashes, no failures, and a candidate scan",
          path: ["status"]
        });
      }
    }

    if (
      value.status === "REJECTED" &&
      (value.candidateScan || value.candidateEvaluations.length > 0)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rejected ingestion cannot emit candidates or canonical assessments",
        path: ["candidateScan"]
      });
    }
  });

export type HistoricalCandidateEvaluation = z.infer<typeof HistoricalCandidateEvaluationSchema>;
export type HistoricalIngestionRun = z.infer<typeof HistoricalIngestionRunSchema>;
