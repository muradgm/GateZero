import { describe, expect, it } from "vitest";
import type {
  EurUsdOverlapPullbackObservation,
  EurUsdRiskPolicy,
  HistoricalCandidateEvaluation,
  HistoricalIngestionRun,
  HistoricalRiskSourceLineage
} from "@traderframe/contracts";
import {
  buildCanonicalDecisionAssessment,
  calculateEurUsdRisk,
  calculateEurUsdRiskFromHistoricalRun
} from "../src/index.js";

const DECISION_TIMESTAMP = "2026-07-24T13:00:00.000Z";
const HASH_A = "a".repeat(64);
const HASH_B = "b".repeat(64);
const HASH_C = "c".repeat(64);
const HASH_D = "d".repeat(64);
const HASH_E = "e".repeat(64);

function evaluation(
  overrides: Partial<EurUsdOverlapPullbackObservation> = {}
): HistoricalCandidateEvaluation {
  const observation: EurUsdOverlapPullbackObservation = {
    candidateId: "eurusd-risk-candidate-001",
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
    evidenceIds: ["ev-risk-15m", "ev-risk-1h", "ev-risk-4h"],
    availableAt: DECISION_TIMESTAMP,
    ...overrides
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
      triggerCandleId: "trigger-risk-001",
      sweepCandleId: "sweep-risk-001",
      sourceWindowHash: HASH_A,
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

function lineage(): HistoricalRiskSourceLineage {
  return {
    historicalRunId: "historical-ingestion-aaaaaaaaaaaaaaaaaaaaaaaa",
    datasetId: "eurusd-risk-dataset",
    rawDataHash: HASH_A,
    normalized15mHash: HASH_B,
    aggregated1HHash: HASH_C,
    aggregated4HHash: HASH_D,
    ingestionConfigurationHash: HASH_E
  };
}

function policy(overrides: Partial<EurUsdRiskPolicy> = {}): EurUsdRiskPolicy {
  return {
    schemaVersion: 1,
    policyId: "eurusd-risk-policy-local",
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
    assumptions: ["Local deterministic paper simulation only."],
    ...overrides
  };
}

function completedRun(candidateEvaluation = evaluation()): HistoricalIngestionRun {
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
      datasetId: "eurusd-risk-dataset",
      provider: "DUKASCOPY_CSV_EXPORT",
      sourceFilename: "EURUSD_15m.csv",
      instrument: "EURUSD",
      timeframe: "15m",
      timezone: "UTC",
      rangeStart: "2026-07-24T12:00:00.000Z",
      rangeEnd: "2026-07-24T16:00:00.000Z",
      expectedSha256: HASH_A,
      expectedRowCount: 1,
      redistributionPolicy: "LOCAL_ONLY",
      licenseNote: "Local test fixture.",
      sourceReference: "risk-engine unit test",
      createdAt: "2026-07-24T17:00:00.000Z"
    },
    sourceSnapshot: {
      provider: "DUKASCOPY_CSV_EXPORT",
      sourceId: "eurusd-risk-dataset",
      instrument: "EURUSD",
      timeframe: "15m",
      timezone: "UTC",
      rangeStart: "2026-07-24T12:00:00.000Z",
      rangeEnd: "2026-07-24T16:00:00.000Z",
      rawContentHash: HASH_A,
      adapterVersion: "dukascopy-csv-adapter-v1",
      licenseNote: "Local test fixture."
    },
    importVerification: {
      datasetId: "eurusd-risk-dataset",
      ready: true,
      sourceHash: HASH_A,
      expectedHash: HASH_A,
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
    configurationHash: HASH_E,
    hashes: {
      rawDataHash: HASH_A,
      normalized15mHash: HASH_B,
      aggregated1HHash: HASH_C,
      aggregated4HHash: HASH_D
    },
    counts: {
      rawRows: 1,
      normalized15m: 0,
      aggregated1H: 0,
      aggregated4H: 0,
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
      normalized15m: [],
      aggregated1H: [],
      aggregated4H: []
    },
    candidateScan: {
      strategyId: "EURUSD_LN_NY_PULLBACK",
      strategyVersion: "1.0.0",
      observationEngineVersion: "eurusd-overlap-observation-v1",
      instrument: "EURUSD",
      scannedFrom: "2026-07-24T12:00:00.000Z",
      scannedThrough: "2026-07-24T16:00:00.000Z",
      sourceCandleCount: 0,
      evaluatedDecisionPoints: 1,
      detections: [candidateEvaluation.detection],
      excludedDuplicateTriggerCount: 0
    },
    candidateEvaluations: [candidateEvaluation]
  };
}

describe("calculateEurUsdRisk", () => {
  it("sizes a USD EURUSD position inside the total worst-case risk budget", () => {
    const first = calculateEurUsdRisk({
      evaluation: evaluation(),
      sourceLineage: lineage(),
      policy: policy()
    });
    const second = calculateEurUsdRisk({
      evaluation: evaluation(),
      sourceLineage: lineage(),
      policy: policy()
    });

    expect(second).toEqual(first);
    expect(first.riskGate).toBe("WITHIN_LIMIT");
    expect(first.riskBudgetAmount).toBe(50);
    expect(first.stopDistancePips).toBe(25);
    expect(first.worstCaseExecutionPrice).toBe(1.0836);
    expect(first.worstCaseStopPrice).toBe(1.08098);
    expect(first.positionSizeUnits).toBe(17_000);
    expect(first.plannedGrossLoss).toBe(42.5);
    expect(first.estimatedSpreadCost).toBe(1.36);
    expect(first.estimatedSlippageCost).toBe(0.68);
    expect(first.estimatedCommissionCost).toBe(4);
    expect(first.estimatedCosts).toBe(6.04);
    expect(first.totalWorstCasePlannedLoss).toBe(48.54);
    expect(first.riskUtilizationPct).toBe(97.08);
    expect(first.calculationHash).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it("uses entry-price conversion for an EUR account", () => {
    const result = calculateEurUsdRisk({
      evaluation: evaluation(),
      sourceLineage: lineage(),
      policy: policy({
        accountCurrency: "EUR",
        pipValuePolicy: { mode: "BASE_CURRENCY_AT_ENTRY" }
      })
    });

    expect(result.accountCurrency).toBe("EUR");
    expect(result.pipValuePerUnit).toBeCloseTo(0.0001 / 1.0835, 12);
    expect(result.riskGate).toBe("WITHIN_LIMIT");
    expect(result.totalWorstCasePlannedLoss).toBeLessThanOrEqual(result.riskBudgetAmount);
  });

  it("blocks the plan when no allowed unit increment reaches the minimum position", () => {
    const result = calculateEurUsdRisk({
      evaluation: evaluation(),
      sourceLineage: lineage(),
      policy: policy({ minimumPositionUnits: 20_000 })
    });

    expect(result.riskGate).toBe("BLOCKED");
    expect(result.positionSizeUnits).toBe(0);
    expect(result.totalWorstCasePlannedLoss).toBe(0);
    expect(result.blockers[0]).toContain("below the minimum");
  });

  it("calculates adverse execution prices correctly for a short candidate", () => {
    const result = calculateEurUsdRisk({
      evaluation: evaluation({ direction: "SHORT", invalidationPrice: 1.086 }),
      sourceLineage: lineage(),
      policy: policy()
    });

    expect(result.direction).toBe("SHORT");
    expect(result.stopDistancePips).toBe(25);
    expect(result.worstCaseExecutionPrice).toBe(1.0834);
    expect(result.worstCaseStopPrice).toBe(1.08602);
  });

  it("rejects risk calculation before canonical PAPER_SIMULATE eligibility", () => {
    expect(() =>
      calculateEurUsdRisk({
        evaluation: evaluation({
          eventContextStatus: "UNAVAILABLE",
          minutesToNearestHighImpactEvent: 0
        }),
        sourceLineage: lineage(),
        policy: policy()
      })
    ).toThrow(/PAPER_SIMULATE/);
  });

  it("binds the risk result to a completed historical ingestion run", () => {
    const candidateEvaluation = evaluation();
    const result = calculateEurUsdRiskFromHistoricalRun({
      run: completedRun(candidateEvaluation),
      candidateId: candidateEvaluation.detection.candidateId,
      policy: policy()
    });

    expect(result.sourceLineage.historicalRunId).toBe(
      "historical-ingestion-aaaaaaaaaaaaaaaaaaaaaaaa"
    );
    expect(result.sourceLineage.rawDataHash).toBe(HASH_A);
    expect(result.candidateId).toBe(candidateEvaluation.detection.candidateId);
  });
});
