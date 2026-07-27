import { describe, expect, it } from "vitest";
import type {
  EurUsdOverlapPullbackObservation,
  EurUsdRiskPolicy,
  HistoricalCandidateEvaluation,
  HistoricalDecisionFreezeConfiguration,
  HistoricalIngestionRun,
  NormalizedMarketCandle,
  TimeBoundMarketCandle
} from "@traderframe/contracts";
import {
  assertFrozenHistoricalDecisionBundleIntegrity,
  buildCanonicalDecisionAssessment,
  calculateEurUsdRiskFromHistoricalRun,
  createCanonicalRiskReviewFromCalculation,
  freezeHistoricalDecisionBundle
} from "../src/index.js";

const DECISION_TIMESTAMP = "2026-07-24T13:00:00.000Z";
const RAW_HASH = "a".repeat(64);
const NORMALIZED_HASH = "b".repeat(64);
const ONE_HOUR_HASH = "c".repeat(64);
const FOUR_HOUR_HASH = "d".repeat(64);
const CONFIGURATION_HASH = "e".repeat(64);

const candle15m: NormalizedMarketCandle = {
  candleId: "EURUSD-15m-2026-07-24T12:45:00.000Z",
  sourceId: "eurusd-freeze-dataset",
  instrument: "EURUSD",
  timeframe: "15m",
  openedAt: "2026-07-24T12:45:00.000Z",
  closedAt: DECISION_TIMESTAMP,
  timezone: "UTC",
  open: 1.0828,
  high: 1.084,
  low: 1.0825,
  close: 1.0835,
  volume: 100,
  finalized: true,
  sourceHash: "source-15m-freeze",
  normalizationVersion: "market-normalization-v1"
};

function higherTimeframeCandle(timeframe: "1H" | "4H"): TimeBoundMarketCandle {
  const openedAt = timeframe === "1H" ? "2026-07-24T12:00:00.000Z" : "2026-07-24T09:00:00.000Z";
  return {
    candleId: `EURUSD-${timeframe}-${openedAt}`,
    sourceId: "eurusd-freeze-dataset",
    instrument: "EURUSD",
    timeframe,
    openedAt,
    closedAt: DECISION_TIMESTAMP,
    availableAt: DECISION_TIMESTAMP,
    timezone: "UTC",
    open: 1.08,
    high: 1.084,
    low: 1.079,
    close: 1.083,
    volume: 400,
    finalized: true,
    sourceHash: `source-${timeframe}-freeze`,
    normalizationVersion: "market-normalization-v1",
    derivedFromCandleIds: [`derived-${timeframe}-freeze`],
    derivedFromHashes: [`derived-hash-${timeframe}-freeze`],
    aggregationVersion: "timeframe-aggregation-v1"
  };
}

const candle1H = higherTimeframeCandle("1H");
const candle4H = higherTimeframeCandle("4H");

function candidateEvaluation(): HistoricalCandidateEvaluation {
  const observation: EurUsdOverlapPullbackObservation = {
    candidateId: "eurusd-freeze-historical-candidate",
    decisionTimestamp: DECISION_TIMESTAMP,
    direction: "LONG",
    dataReady: true,
    sessionEligible: true,
    higherTimeframeAligned: true,
    pullbackRetracementAtr: 0.65,
    pullbackAgeCandles: 4,
    liquiditySweepDetected: true,
    sweepPenetrationPips: 2,
    sweepReclaimedWithinCandles: 2,
    displacementAtr: 0.8,
    triggerConfirmed: true,
    triggerAgeCandles: 1,
    eventContextStatus: "AVAILABLE",
    minutesToNearestHighImpactEvent: 90,
    invalidationPrice: 1.081,
    currentPrice: 1.0835,
    candlesSinceTrigger: 1,
    sessionEnded: false,
    evidenceIds: [candle15m.candleId, candle1H.candleId, candle4H.candleId],
    availableAt: DECISION_TIMESTAMP
  };
  const assessment = buildCanonicalDecisionAssessment(observation);

  return {
    detection: {
      candidateId: observation.candidateId,
      strategyId: "EURUSD_LN_NY_PULLBACK",
      strategyVersion: "1.0.0",
      observationEngineVersion: "eurusd-overlap-observation-v1",
      instrument: "EURUSD",
      sourceTimeframe: "15m",
      direction: observation.direction,
      detectedAt: observation.decisionTimestamp,
      availableAt: observation.availableAt,
      triggerCandleId: candle15m.candleId,
      sweepCandleId: candle15m.candleId,
      sourceWindowHash: "f".repeat(64),
      evidenceIds: [...observation.evidenceIds],
      matchedConditions: [
        "DATA_READY",
        "SESSION_ELIGIBLE",
        "PULLBACK_PRESENT",
        "LIQUIDITY_SWEEP_DETECTED",
        "TRIGGER_CONFIRMED"
      ]
    },
    observation,
    assessment
  };
}

function completedRun(evaluation = candidateEvaluation()): HistoricalIngestionRun {
  return {
    schemaVersion: 1,
    ingestionVersion: "epoch1-historical-ingestion-v1",
    runId: "historical-ingestion-aaaaaaaaaaaaaaaaaaaaaaaa",
    status: "COMPLETED",
    dataMode: "FROZEN_HISTORICAL_IMPORT",
    checkedAt: "2026-07-24T17:00:00.000Z",
    asOf: "2026-07-24T16:00:00.000Z",
    manifest: {
      schemaVersion: 1,
      datasetId: "eurusd-freeze-dataset",
      provider: "DUKASCOPY_CSV_EXPORT",
      sourceFilename: "EURUSD_15m.csv",
      instrument: "EURUSD",
      timeframe: "15m",
      timezone: "UTC",
      rangeStart: "2026-07-24T12:00:00.000Z",
      rangeEnd: "2026-07-24T16:00:00.000Z",
      expectedSha256: RAW_HASH,
      expectedRowCount: 1,
      redistributionPolicy: "LOCAL_ONLY",
      licenseNote: "Local deterministic unit-test fixture.",
      sourceReference: "historical decision freeze test",
      createdAt: "2026-07-24T17:00:00.000Z"
    },
    sourceSnapshot: {
      provider: "DUKASCOPY_CSV_EXPORT",
      sourceId: "eurusd-freeze-dataset",
      instrument: "EURUSD",
      timeframe: "15m",
      timezone: "UTC",
      rangeStart: "2026-07-24T12:00:00.000Z",
      rangeEnd: "2026-07-24T16:00:00.000Z",
      rawContentHash: RAW_HASH,
      adapterVersion: "dukascopy-csv-adapter-v1",
      licenseNote: "Local deterministic unit-test fixture."
    },
    importVerification: {
      datasetId: "eurusd-freeze-dataset",
      ready: true,
      sourceHash: RAW_HASH,
      expectedHash: RAW_HASH,
      rawRowCount: 1,
      acceptedRowCount: 1,
      failures: [],
      adapterFailureCount: 0
    },
    versions: {
      adapterVersion: "dukascopy-csv-adapter-v1",
      normalizationVersion: "market-normalization-v1",
      aggregationVersion: "timeframe-aggregation-v1",
      strategyVersion: "1.0.0",
      observationEngineVersion: "eurusd-overlap-observation-v1"
    },
    configurationHash: CONFIGURATION_HASH,
    hashes: {
      rawDataHash: RAW_HASH,
      normalized15mHash: NORMALIZED_HASH,
      aggregated1HHash: ONE_HOUR_HASH,
      aggregated4HHash: FOUR_HOUR_HASH
    },
    counts: {
      rawRows: 1,
      normalized15m: 1,
      aggregated1H: 1,
      aggregated4H: 1,
      candidates: 1,
      assessments: 1
    },
    failures: {
      import: [],
      adapter: [],
      validation: [],
      aggregation1H: [],
      aggregation4H: []
    },
    series: {
      normalized15m: [candle15m],
      aggregated1H: [candle1H],
      aggregated4H: [candle4H]
    },
    candidateScan: {
      strategyId: "EURUSD_LN_NY_PULLBACK",
      strategyVersion: "1.0.0",
      observationEngineVersion: "eurusd-overlap-observation-v1",
      instrument: "EURUSD",
      scannedFrom: "2026-07-24T12:00:00.000Z",
      scannedThrough: DECISION_TIMESTAMP,
      sourceCandleCount: 1,
      evaluatedDecisionPoints: 1,
      detections: [evaluation.detection],
      excludedDuplicateTriggerCount: 0
    },
    candidateEvaluations: [evaluation]
  };
}

function riskPolicy(): EurUsdRiskPolicy {
  return {
    schemaVersion: 1,
    policyId: "eurusd-freeze-risk-policy",
    policyVersion: "1.0.0",
    accountCurrency: "USD",
    accountEquity: 10_000,
    maximumRiskPct: 0.5,
    pipSize: 0.0001,
    pipValuePolicy: { mode: "QUOTE_CURRENCY" },
    spreadPips: 0.8,
    entrySlippagePips: 0.2,
    stopSlippagePips: 0.2,
    commissionModel: { mode: "FIXED_ACCOUNT_CURRENCY", amount: 4 },
    unitIncrement: 1_000,
    minimumPositionUnits: 1_000,
    maximumPositionUnits: 100_000,
    assumptions: ["Local deterministic paper simulation only."]
  };
}

function freezeConfiguration(): HistoricalDecisionFreezeConfiguration {
  return {
    schemaVersion: 1,
    operatorId: "operator-freeze-local",
    applicationCommit: "abc1234",
    simulationPolicyVersion: "simulation-policy-1.0.0",
    targetRewardRiskMultiple: 2,
    frozenAt: "2026-07-24T13:10:00.000Z"
  };
}

function fixture() {
  const evaluation = candidateEvaluation();
  const run = completedRun(evaluation);
  const riskCalculation = calculateEurUsdRiskFromHistoricalRun({
    run,
    candidateId: evaluation.detection.candidateId,
    policy: riskPolicy()
  });
  const riskReview = createCanonicalRiskReviewFromCalculation({
    riskReviewId: "risk-review-historical-freeze",
    assessment: evaluation.assessment,
    calculation: riskCalculation,
    reviewDecision: "APPROVE",
    portfolioExposurePctAfterEntry: 12,
    reviewedBy: "operator-risk-reviewer",
    reviewedAt: "2026-07-24T13:05:00.000Z",
    validUntil: "2026-07-24T14:00:00.000Z"
  });

  return { run, riskCalculation, riskReview };
}

describe("freezeHistoricalDecisionBundle", () => {
  it("freezes one deterministic real-source decision artifact with complete lineage", () => {
    const { run, riskCalculation, riskReview } = fixture();
    const input = {
      run,
      riskCalculation,
      riskReview,
      configuration: freezeConfiguration()
    };
    const first = freezeHistoricalDecisionBundle(input);
    const second = freezeHistoricalDecisionBundle(input);

    expect(second).toEqual(first);
    expect(first.historicalRunId).toBe(run.runId);
    expect(first.sourceHashes).toMatchObject({
      rawDataHash: RAW_HASH,
      normalized15mHash: NORMALIZED_HASH,
      aggregated1HHash: ONE_HOUR_HASH,
      aggregated4HHash: FOUR_HOUR_HASH,
      ingestionConfigurationHash: CONFIGURATION_HASH
    });
    expect(first.riskCalculation.riskCalculationId).toBe(riskCalculation.riskCalculationId);
    expect(first.riskReview.riskCalculationHash).toBe(riskCalculation.calculationHash);
    expect(first.decisionRecord.bundle.riskReviewHash).toBe(riskReview.reviewHash);
    expect(first.decisionRecord.bundle.simulationPlan).toEqual({
      direction: "LONG",
      entryPrice: 1.0835,
      stopPrice: 1.081,
      targetPrice: 1.0885,
      positionSizeUnits: riskCalculation.positionSizeUnits,
      plannedRiskAmount: riskCalculation.totalWorstCasePlannedLoss
    });
    expect(first.decisionRecord.bundle.temporalEvidence).toHaveLength(3);
    expect(first.artifactHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.decisionRecord.bundle)).toBe(true);
    expect(() => assertFrozenHistoricalDecisionBundleIntegrity(first)).not.toThrow();
  });

  it("rejects a tampered calculated-risk artifact before freezing", () => {
    const { run, riskCalculation, riskReview } = fixture();

    expect(() =>
      freezeHistoricalDecisionBundle({
        run,
        riskCalculation: { ...riskCalculation, positionSizeUnits: 99_000 },
        riskReview,
        configuration: freezeConfiguration()
      })
    ).toThrow(/calculated risk content hash mismatch/);
  });

  it("rejects an operator review that does not link to the calculated risk", () => {
    const { run, riskCalculation, riskReview } = fixture();

    expect(() =>
      freezeHistoricalDecisionBundle({
        run,
        riskCalculation,
        riskReview: { ...riskReview, riskCalculationHash: `sha256:${"0".repeat(64)}` },
        configuration: freezeConfiguration()
      })
    ).toThrow(/not linked to the calculated risk plan/);
  });

  it("fails closed when decision evidence is absent from the historical source series", () => {
    const { run, riskCalculation, riskReview } = fixture();
    const incompleteRun = {
      ...run,
      counts: { ...run.counts, aggregated4H: 0 },
      series: { ...run.series, aggregated4H: [] }
    };

    expect(() =>
      freezeHistoricalDecisionBundle({
        run: incompleteRun,
        riskCalculation,
        riskReview,
        configuration: freezeConfiguration()
      })
    ).toThrow(/is absent from the historical run/);
  });
});
