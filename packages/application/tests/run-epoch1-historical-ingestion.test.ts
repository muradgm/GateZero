import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import type {
  EurUsdOverlapPullbackObservation,
  FrozenHistoricalDatasetManifest
} from "@traderframe/contracts";
import {
  runEpoch1HistoricalIngestion,
  type CandidateObservationFactory
} from "../src/index.js";

const RANGE_START = "2026-07-24T12:00:00.000Z";
const RANGE_END = "2026-07-24T16:00:00.000Z";

function buildCsv(invalidOhlcAt?: number): string {
  const rows = ["timestamp,open,high,low,close,volume"];
  for (let index = 0; index < 16; index += 1) {
    const timestamp = new Date(Date.parse(RANGE_START) + index * 15 * 60 * 1000).toISOString();
    const open = 1.08 + index * 0.00001;
    const close = open + 0.00002;
    const high = invalidOhlcAt === index ? open - 0.00001 : close + 0.00003;
    const low = open - 0.00003;
    rows.push(`${timestamp},${open},${high},${low},${close},${100 + index}`);
  }
  return rows.join("\n");
}

function manifest(csv: string, expectedSha256 = sha256(csv)): FrozenHistoricalDatasetManifest {
  return {
    schemaVersion: 1,
    datasetId: "eurusd-15m-ingestion-test",
    provider: "DUKASCOPY_CSV_EXPORT",
    sourceFilename: "EURUSD_15m.csv",
    instrument: "EURUSD",
    timeframe: "15m",
    timezone: "UTC",
    rangeStart: RANGE_START,
    rangeEnd: RANGE_END,
    expectedSha256,
    expectedRowCount: 16,
    redistributionPolicy: "LOCAL_ONLY",
    licenseNote: "Test fixture generated in memory and not provider data.",
    sourceReference: "application ingestion unit test",
    createdAt: "2026-07-24T17:00:00.000Z"
  };
}

function eventContext(): Record<string, number> {
  return Object.fromEntries(
    Array.from({ length: 16 }, (_, index) => [
      new Date(Date.parse(RANGE_START) + (index + 1) * 15 * 60 * 1000).toISOString(),
      90
    ])
  );
}

function observationFactory(triggerAtIndex = 8): CandidateObservationFactory {
  return (input) => {
    const currentIndex = input.candles15m.length - 1;
    const detected = currentIndex >= triggerAtIndex;
    const observation: EurUsdOverlapPullbackObservation = {
      candidateId: `observation-${currentIndex}`,
      decisionTimestamp: input.decisionTimestamp,
      direction: "LONG",
      dataReady: true,
      sessionEligible: true,
      higherTimeframeAligned: true,
      pullbackRetracementAtr: 0.5,
      pullbackAgeCandles: 2,
      liquiditySweepDetected: detected,
      sweepPenetrationPips: detected ? 2 : 0,
      sweepReclaimedWithinCandles: detected ? 1 : 4,
      displacementAtr: detected ? 0.8 : 0,
      triggerConfirmed: detected,
      triggerAgeCandles: detected ? currentIndex - triggerAtIndex : 5,
      eventContextStatus: input.eventContextStatus,
      minutesToNearestHighImpactEvent: input.minutesToNearestHighImpactEvent,
      invalidationPrice: 1.079,
      currentPrice: 1.0805,
      candlesSinceTrigger: detected ? currentIndex - triggerAtIndex : 0,
      sessionEnded: false,
      evidenceIds: [`evidence-${currentIndex}`],
      availableAt: input.decisionTimestamp
    };

    return {
      observation,
      diagnostics: {
        observationEngineVersion: "eurusd-overlap-observation-v1",
        atr: 0.001,
        ema1H: { fast: 1.08, slow: 1.07 },
        ema4H: { fast: 1.08, slow: 1.07 },
        ...(detected
          ? {
              sweepCandleId: "sweep-1",
              triggerCandleId: "trigger-1"
            }
          : {}),
        excludedFutureCandleIds: [],
        reasons: []
      }
    };
  };
}

describe("runEpoch1HistoricalIngestion", () => {
  it("runs import, validation, aggregation, detection, and canonical assessment deterministically", () => {
    const csv = buildCsv();
    const input = {
      manifest: manifest(csv),
      csv,
      eventContextByDecisionTimestamp: eventContext()
    };
    const dependencies = { observationFactory: observationFactory() };

    const first = runEpoch1HistoricalIngestion(input, dependencies);
    const second = runEpoch1HistoricalIngestion(input, dependencies);
    const evaluation = first.candidateEvaluations.at(0);
    if (!evaluation) throw new Error("expected one canonical candidate evaluation");

    expect(second).toEqual(first);
    expect(first.status).toBe("COMPLETED");
    expect(first.importVerification.ready).toBe(true);
    expect(first.counts).toEqual({
      rawRows: 16,
      normalized15m: 16,
      aggregated1H: 4,
      aggregated4H: 1,
      candidates: 1,
      assessments: 1
    });
    expect(first.failures).toEqual({
      import: [],
      adapter: [],
      validation: [],
      aggregation1H: [],
      aggregation4H: []
    });
    expect(first.hashes.normalized15mHash).toHaveLength(64);
    expect(first.hashes.aggregated1HHash).toHaveLength(64);
    expect(first.hashes.aggregated4HHash).toHaveLength(64);
    expect(evaluation.detection.candidateId).toBe(evaluation.observation.candidateId);
    expect(evaluation.assessment.candidateId).toBe(evaluation.detection.candidateId);
    expect(evaluation.assessment.recommendation).toBe("PAPER_SIMULATE");
  });

  it("fails closed before normalization when the frozen source hash differs", () => {
    const csv = buildCsv();
    const result = runEpoch1HistoricalIngestion({
      manifest: manifest(csv, "0".repeat(64)),
      csv
    });

    expect(result.status).toBe("REJECTED");
    expect(result.failures.import.map((failure) => failure.code)).toContain("HASH_MISMATCH");
    expect(result.series.normalized15m).toEqual([]);
    expect(result.candidateScan).toBeUndefined();
    expect(result.candidateEvaluations).toEqual([]);
  });

  it("fails closed before aggregation when normalized candles violate OHLC invariants", () => {
    const csv = buildCsv(3);
    const result = runEpoch1HistoricalIngestion({ manifest: manifest(csv), csv });

    expect(result.status).toBe("REJECTED");
    expect(result.failures.validation.map((failure) => failure.code)).toContain("INVALID_OHLC");
    expect(result.series.aggregated1H).toEqual([]);
    expect(result.series.aggregated4H).toEqual([]);
    expect(result.candidateScan).toBeUndefined();
  });

  it("rejects non-deterministic event-context values", () => {
    const csv = buildCsv();
    expect(() =>
      runEpoch1HistoricalIngestion({
        manifest: manifest(csv),
        csv,
        eventContextByDecisionTimestamp: { [RANGE_END]: Number.POSITIVE_INFINITY }
      })
    ).toThrow("finite integer");
  });
});

function sha256(value: string): string {
  return createHash("sha256").update(value.trim()).digest("hex");
}
