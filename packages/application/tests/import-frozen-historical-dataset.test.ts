import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { importFrozenHistoricalDataset } from "../src/index.js";

const csv = [
  "timestamp,open,high,low,close,volume",
  "2026-07-01T12:00:00.000Z,1.0800,1.0810,1.0795,1.0807,120",
  "2026-07-01T12:15:00.000Z,1.0807,1.0815,1.0802,1.0812,145"
].join("\n");

const expectedSha256 = createHash("sha256").update(csv).digest("hex");
const manifest = {
  schemaVersion: 1 as const,
  datasetId: "eurusd-15m-local-proof",
  provider: "DUKASCOPY_CSV_EXPORT" as const,
  sourceFilename: "EURUSD_15m.csv",
  instrument: "EURUSD" as const,
  timeframe: "15m" as const,
  timezone: "UTC" as const,
  rangeStart: "2026-07-01T12:00:00.000Z",
  rangeEnd: "2026-07-01T12:30:00.000Z",
  expectedSha256,
  expectedRowCount: 2,
  redistributionPolicy: "LOCAL_ONLY" as const,
  licenseNote: "Local test fixture only.",
  sourceReference: "test-fixture",
  createdAt: "2026-07-27T08:00:00.000Z"
};

describe("frozen historical dataset import", () => {
  it("accepts a source only when manifest, hash, range, rows, and adapter validation match", () => {
    const result = importFrozenHistoricalDataset({ manifest, csv });

    expect(result.verification).toMatchObject({
      ready: true,
      sourceHash: expectedSha256,
      expectedHash: expectedSha256,
      rawRowCount: 2,
      acceptedRowCount: 2,
      failures: [],
      adapterFailureCount: 0
    });
    expect(result.adapter.candles).toHaveLength(2);
  });

  it("fails closed when source content does not match the frozen hash", () => {
    const changed = csv.replace("1.0812,145", "1.0813,145");
    const result = importFrozenHistoricalDataset({ manifest, csv: changed });

    expect(result.verification.ready).toBe(false);
    expect(result.verification.failures.some((failure) => failure.code === "HASH_MISMATCH")).toBe(
      true
    );
  });

  it("fails closed when the manifest row count drifts", () => {
    const result = importFrozenHistoricalDataset({
      manifest: { ...manifest, expectedRowCount: 3 },
      csv
    });

    expect(result.verification.ready).toBe(false);
    expect(
      result.verification.failures.some((failure) => failure.code === "ROW_COUNT_MISMATCH")
    ).toBe(true);
  });

  it("surfaces provider adapter failures instead of importing a partial dataset", () => {
    const invalidCsv = csv.replace("2026-07-01T12:15:00.000Z", "2026-07-01T11:45:00.000Z");
    const invalidHash = createHash("sha256").update(invalidCsv).digest("hex");
    const result = importFrozenHistoricalDataset({
      manifest: { ...manifest, expectedSha256: invalidHash },
      csv: invalidCsv
    });

    expect(result.verification.ready).toBe(false);
    expect(result.verification.adapterFailureCount).toBeGreaterThan(0);
    expect(result.verification.failures.some((failure) => failure.code === "ADAPTER_FAILURE")).toBe(
      true
    );
  });
});
