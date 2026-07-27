import { createHash } from "node:crypto";
import type { FrozenHistoricalDatasetManifest } from "@traderframe/contracts";
import { describe, expect, it } from "vitest";
import { runEpoch1HistoricalIngestion } from "../src/index.js";

const RANGE_START = "2026-07-16T04:00:00.000Z";
const RANGE_END = "2026-07-24T16:00:00.000Z";
const SOURCE_CANDLE_COUNT = 816;
const PATTERN_START_INDEX = 787;
const PATTERN = [
  [1.1, 1.10055, 1.0996, 1.10025],
  [1.10025, 1.1008, 1.09985, 1.1005],
  [1.1005, 1.10105, 1.1001, 1.10075],
  [1.10075, 1.1013, 1.10035, 1.101],
  [1.101, 1.10155, 1.1006, 1.10125],
  [1.10125, 1.1018, 1.10085, 1.1015],
  [1.1015, 1.10205, 1.1011, 1.10175],
  [1.10175, 1.1023, 1.10135, 1.102],
  [1.102, 1.10255, 1.1016, 1.10225],
  [1.10225, 1.1028, 1.10185, 1.1025],
  [1.1025, 1.10305, 1.1021, 1.10275],
  [1.10275, 1.1033, 1.10235, 1.103],
  [1.1012, 1.1017, 1.0993, 1.10015],
  [1.1002, 1.1022, 1.1001, 1.1019],
  [1.1019, 1.103, 1.1016, 1.1027],
  [1.1027, 1.10285, 1.1019, 1.10225],
  [1.10225, 1.1026, 1.1018, 1.1022]
] as const;

function buildCsv(invalidOhlcAt?: number): string {
  const rows = ["timestamp,open,high,low,close,volume"];
  for (let index = 0; index < SOURCE_CANDLE_COUNT; index += 1) {
    const timestamp = new Date(Date.parse(RANGE_START) + index * 15 * 60 * 1000).toISOString();
    const [open, originalHigh, low, close] = valuesFor(index);
    const high = invalidOhlcAt === index ? open - 0.00001 : originalHigh;
    rows.push(
      `${timestamp},${price(open)},${price(high)},${price(low)},${price(close)},${100 + index}`
    );
  }
  return rows.join("\n");
}

function valuesFor(index: number): readonly [number, number, number, number] {
  const patternIndex = index - PATTERN_START_INDEX;
  const pattern = PATTERN[patternIndex];
  if (pattern) return pattern;

  if (index > PATTERN_START_INDEX + PATTERN.length - 1) {
    const open = 1.1022 + (index - (PATTERN_START_INDEX + PATTERN.length)) * 0.00005;
    return [open, open + 0.00008, open - 0.00004, open + 0.00003];
  }

  const open = 1.02 + index * 0.0001;
  return [open, open + 0.00008, open - 0.00004, open + 0.00004];
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
    expectedRowCount: SOURCE_CANDLE_COUNT,
    redistributionPolicy: "LOCAL_ONLY",
    licenseNote: "Test fixture generated in memory and not provider data.",
    sourceReference: "application ingestion unit test",
    createdAt: "2026-07-24T17:00:00.000Z"
  };
}

function eventContext(): Record<string, number> {
  return Object.fromEntries(
    Array.from({ length: SOURCE_CANDLE_COUNT }, (_, index) => [
      new Date(Date.parse(RANGE_START) + (index + 1) * 15 * 60 * 1000).toISOString(),
      120
    ])
  );
}

describe("runEpoch1HistoricalIngestion", () => {
  it(
    "runs import, validation, aggregation, real detection, and assessment deterministically",
    () => {
      const csv = buildCsv();
      const input = {
        manifest: manifest(csv),
        csv,
        eventContextByDecisionTimestamp: eventContext()
      };

      const first = runEpoch1HistoricalIngestion(input);
      const second = runEpoch1HistoricalIngestion(input);
      const evaluation = first.candidateEvaluations.at(0);
      if (!evaluation) throw new Error("expected at least one canonical candidate evaluation");

      expect(second).toEqual(first);
      expect(first.status).toBe("COMPLETED");
      expect(first.importVerification.ready).toBe(true);
      expect(first.counts.rawRows).toBe(SOURCE_CANDLE_COUNT);
      expect(first.counts.normalized15m).toBe(SOURCE_CANDLE_COUNT);
      expect(first.counts.aggregated1H).toBe(204);
      expect(first.counts.aggregated4H).toBe(51);
      expect(first.counts.candidates).toBeGreaterThanOrEqual(1);
      expect(first.counts.assessments).toBe(first.counts.candidates);
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
      expect(evaluation.observation.liquiditySweepDetected).toBe(true);
      expect(evaluation.observation.triggerConfirmed).toBe(true);
      expect(evaluation.assessment.recommendation).toBe("PAPER_SIMULATE");
    }
  );

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

function price(value: number): string {
  return value.toFixed(5);
}

function sha256(value: string): string {
  return createHash("sha256").update(value.trim()).digest("hex");
}
