import { createHash } from "node:crypto";
import type {
  EurUsdOverlapPullbackObservation,
  FrozenHistoricalDatasetManifest,
  HistoricalCandidateEvaluation,
  HistoricalIngestionRun,
  NormalizedMarketCandle,
  TimeBoundMarketCandle,
  TraceValidityFailure
} from "@traderframe/contracts";
import { HistoricalIngestionRunSchema } from "@traderframe/contracts";
import { aggregateValidatedMarketCandles } from "./aggregate-market-candles.js";
import { buildCanonicalDecisionAssessment } from "./build-canonical-decision-assessment.js";
import {
  deriveEurUsdOverlapObservation,
  type DerivedEurUsdOverlapObservation
} from "./derive-eurusd-overlap-observation.js";
import {
  detectEurUsdOverlapCandidates,
  type CandidateObservationFactory
} from "./detect-eurusd-overlap-candidates.js";
import { EURUSD_OVERLAP_PULLBACK_V1 } from "./evaluate-eurusd-overlap-pullback.js";
import { importFrozenHistoricalDataset } from "./import-frozen-historical-dataset.js";
import { validateAndNormalizeMarketCandles } from "./validate-market-candles.js";

const INGESTION_VERSION = "epoch1-historical-ingestion-v1";
const NORMALIZATION_VERSION = "market-normalization-v1";
const AGGREGATION_VERSION = "timeframe-aggregation-v1";

export type RunEpoch1HistoricalIngestionInput = {
  manifest: FrozenHistoricalDatasetManifest;
  csv: string;
  eventContextByDecisionTimestamp?: Record<string, number>;
};

export type RunEpoch1HistoricalIngestionDependencies = {
  observationFactory?: CandidateObservationFactory;
};

type RunState = {
  normalized15m: NormalizedMarketCandle[];
  aggregated1H: TimeBoundMarketCandle[];
  aggregated4H: TimeBoundMarketCandle[];
  validationFailures: TraceValidityFailure[];
  aggregation1HFailures: TraceValidityFailure[];
  aggregation4HFailures: TraceValidityFailure[];
  candidateEvaluations: HistoricalCandidateEvaluation[];
  candidateScan?: HistoricalIngestionRun["candidateScan"];
};

export function runEpoch1HistoricalIngestion(
  input: RunEpoch1HistoricalIngestionInput,
  dependencies: RunEpoch1HistoricalIngestionDependencies = {}
): HistoricalIngestionRun {
  const imported = importFrozenHistoricalDataset({ manifest: input.manifest, csv: input.csv });
  const manifest = imported.manifest;
  const checkedAt = manifest.createdAt;
  const asOf = manifest.rangeEnd;
  const eventContextEntries = normalizeEventContext(input.eventContextByDecisionTimestamp);
  const configurationHash = hashCanonical({
    ingestionVersion: INGESTION_VERSION,
    normalizationVersion: NORMALIZATION_VERSION,
    aggregationVersion: AGGREGATION_VERSION,
    strategyId: EURUSD_OVERLAP_PULLBACK_V1.strategyId,
    strategyVersion: EURUSD_OVERLAP_PULLBACK_V1.version,
    observationEngineVersion: EURUSD_OVERLAP_PULLBACK_V1.observationEngineVersion,
    eventContextEntries
  });

  const emptyState: RunState = {
    normalized15m: [],
    aggregated1H: [],
    aggregated4H: [],
    validationFailures: [],
    aggregation1HFailures: [],
    aggregation4HFailures: [],
    candidateEvaluations: []
  };

  if (!imported.verification.ready) {
    return finalizeRun({
      imported,
      checkedAt,
      asOf,
      configurationHash,
      state: emptyState,
      status: "REJECTED"
    });
  }

  const validation = validateAndNormalizeMarketCandles({
    sourceId: manifest.datasetId,
    instrument: "EURUSD",
    timeframe: "15m",
    candles: imported.adapter.candles,
    checkedAt,
    normalizationVersion: NORMALIZATION_VERSION
  });
  const validationState: RunState = {
    ...emptyState,
    normalized15m: validation.normalizedCandles,
    validationFailures: validation.failures
  };

  if (validation.failures.length > 0) {
    return finalizeRun({
      imported,
      checkedAt,
      asOf,
      configurationHash,
      state: validationState,
      status: "REJECTED"
    });
  }

  const aggregation1H = aggregateValidatedMarketCandles({
    sourceId: manifest.datasetId,
    candles: validation.normalizedCandles,
    targetTimeframe: "1H",
    asOf,
    checkedAt,
    aggregationVersion: AGGREGATION_VERSION
  });
  const aggregation4H = aggregateValidatedMarketCandles({
    sourceId: manifest.datasetId,
    candles: validation.normalizedCandles,
    targetTimeframe: "4H",
    asOf,
    checkedAt,
    aggregationVersion: AGGREGATION_VERSION
  });
  const aggregationState: RunState = {
    ...validationState,
    aggregated1H: aggregation1H.candles,
    aggregated4H: aggregation4H.candles,
    aggregation1HFailures: aggregation1H.failures,
    aggregation4HFailures: aggregation4H.failures
  };

  if (aggregation1H.failures.length > 0 || aggregation4H.failures.length > 0) {
    return finalizeRun({
      imported,
      checkedAt,
      asOf,
      configurationHash,
      state: aggregationState,
      status: "REJECTED"
    });
  }

  const eventContext = new Map(eventContextEntries);
  const observationFactory = dependencies.observationFactory ?? deriveEurUsdOverlapObservation;
  const eventResolver = (decisionTimestamp: string): number | null =>
    eventContext.get(decisionTimestamp) ?? null;
  const candidateScan = detectEurUsdOverlapCandidates({
    candles15m: validation.normalizedCandles,
    candles1H: aggregation1H.candles,
    candles4H: aggregation4H.candles,
    minutesToNearestHighImpactEvent: eventResolver,
    observationFactory
  });
  const candidateEvaluations = candidateScan.detections.map((detection) =>
    evaluateDetection({
      detection,
      candles15m: validation.normalizedCandles,
      candles1H: aggregation1H.candles,
      candles4H: aggregation4H.candles,
      eventContext,
      observationFactory
    })
  );

  return finalizeRun({
    imported,
    checkedAt,
    asOf,
    configurationHash,
    state: {
      ...aggregationState,
      candidateScan,
      candidateEvaluations
    },
    status: "COMPLETED"
  });
}

function evaluateDetection(input: {
  detection: NonNullable<HistoricalIngestionRun["candidateScan"]>["detections"][number];
  candles15m: NormalizedMarketCandle[];
  candles1H: TimeBoundMarketCandle[];
  candles4H: TimeBoundMarketCandle[];
  eventContext: Map<string, number>;
  observationFactory: CandidateObservationFactory;
}): HistoricalCandidateEvaluation {
  const decisionMs = Date.parse(input.detection.detectedAt);
  const eventMinutes = input.eventContext.get(input.detection.detectedAt) ?? null;
  const derived: DerivedEurUsdOverlapObservation = input.observationFactory({
    decisionTimestamp: input.detection.detectedAt,
    candles15m: input.candles15m.filter((candle) => Date.parse(candle.closedAt) <= decisionMs),
    candles1H: input.candles1H.filter((candle) => Date.parse(candle.availableAt) <= decisionMs),
    candles4H: input.candles4H.filter((candle) => Date.parse(candle.availableAt) <= decisionMs),
    eventContextStatus: eventMinutes === null ? "UNAVAILABLE" : "AVAILABLE",
    minutesToNearestHighImpactEvent: eventMinutes ?? 0,
    strategy: EURUSD_OVERLAP_PULLBACK_V1
  });
  const observation: EurUsdOverlapPullbackObservation = {
    ...derived.observation,
    candidateId: input.detection.candidateId
  };

  if (observation.direction !== input.detection.direction) {
    throw new Error("candidate direction changed between detection and canonical assessment");
  }

  return {
    detection: input.detection,
    observation,
    assessment: buildCanonicalDecisionAssessment(observation, EURUSD_OVERLAP_PULLBACK_V1)
  };
}

function finalizeRun(input: {
  imported: ReturnType<typeof importFrozenHistoricalDataset>;
  checkedAt: string;
  asOf: string;
  configurationHash: string;
  state: RunState;
  status: HistoricalIngestionRun["status"];
}): HistoricalIngestionRun {
  const normalized15mHash = hashSeries(input.state.normalized15m);
  const aggregated1HHash = hashSeries(input.state.aggregated1H);
  const aggregated4HHash = hashSeries(input.state.aggregated4H);
  const hashes = {
    rawDataHash: input.imported.adapter.snapshot.rawContentHash,
    normalized15mHash,
    aggregated1HHash,
    aggregated4HHash
  };
  const counts = {
    rawRows: input.imported.adapter.rawRowCount,
    normalized15m: input.state.normalized15m.length,
    aggregated1H: input.state.aggregated1H.length,
    aggregated4H: input.state.aggregated4H.length,
    candidates: input.state.candidateScan?.detections.length ?? 0,
    assessments: input.state.candidateEvaluations.length
  };
  const runIdentity = hashCanonical({
    ingestionVersion: INGESTION_VERSION,
    status: input.status,
    datasetId: input.imported.manifest.datasetId,
    checkedAt: input.checkedAt,
    asOf: input.asOf,
    configurationHash: input.configurationHash,
    hashes,
    counts,
    importFailures: input.imported.verification.failures,
    adapterFailures: input.imported.adapter.failures,
    validationFailureIds: input.state.validationFailures.map((failure) => failure.failureId),
    aggregation1HFailureIds: input.state.aggregation1HFailures.map(
      (failure) => failure.failureId
    ),
    aggregation4HFailureIds: input.state.aggregation4HFailures.map(
      (failure) => failure.failureId
    ),
    candidateIds: input.state.candidateScan?.detections.map((item) => item.candidateId) ?? [],
    assessmentIds: input.state.candidateEvaluations.map((item) => item.assessment.assessmentId)
  });

  return HistoricalIngestionRunSchema.parse({
    schemaVersion: 1,
    ingestionVersion: INGESTION_VERSION,
    runId: `historical-ingestion-${runIdentity.slice(0, 24)}`,
    status: input.status,
    dataMode: "FROZEN_HISTORICAL_IMPORT",
    checkedAt: input.checkedAt,
    asOf: input.asOf,
    manifest: input.imported.manifest,
    sourceSnapshot: input.imported.adapter.snapshot,
    importVerification: input.imported.verification,
    versions: {
      adapterVersion: input.imported.adapter.snapshot.adapterVersion,
      normalizationVersion: NORMALIZATION_VERSION,
      aggregationVersion: AGGREGATION_VERSION,
      strategyVersion: EURUSD_OVERLAP_PULLBACK_V1.version,
      observationEngineVersion: EURUSD_OVERLAP_PULLBACK_V1.observationEngineVersion
    },
    configurationHash: input.configurationHash,
    hashes,
    counts,
    failures: {
      import: input.imported.verification.failures,
      adapter: input.imported.adapter.failures,
      validation: input.state.validationFailures,
      aggregation1H: input.state.aggregation1HFailures,
      aggregation4H: input.state.aggregation4HFailures
    },
    series: {
      normalized15m: input.state.normalized15m,
      aggregated1H: input.state.aggregated1H,
      aggregated4H: input.state.aggregated4H
    },
    ...(input.state.candidateScan ? { candidateScan: input.state.candidateScan } : {}),
    candidateEvaluations: input.state.candidateEvaluations
  });
}

function normalizeEventContext(
  values: Record<string, number> | undefined
): Array<readonly [string, number]> {
  if (!values) return [];

  return Object.entries(values)
    .map(([timestamp, minutes]) => {
      if (!Number.isFinite(Date.parse(timestamp))) {
        throw new Error(`event context key ${timestamp} is not a valid ISO datetime`);
      }
      if (!Number.isFinite(minutes) || !Number.isInteger(minutes)) {
        throw new Error(`event context for ${timestamp} must be a finite integer minute distance`);
      }
      return [new Date(timestamp).toISOString(), minutes] as const;
    })
    .sort(([left], [right]) => left.localeCompare(right));
}

function hashSeries(series: Array<NormalizedMarketCandle | TimeBoundMarketCandle>): string | null {
  if (series.length === 0) return null;
  return hashCanonical(series);
}

function hashCanonical(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
