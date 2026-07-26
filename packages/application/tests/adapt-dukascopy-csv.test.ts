import { describe, expect, it } from "vitest";
import { adaptDukascopyCsv } from "../src/index.js";

const csv = `timestamp,open,high,low,close,volume
2026-07-01T12:00:00.000Z,1.0800,1.0810,1.0795,1.0807,120
2026-07-01T12:15:00.000Z,1.0807,1.0815,1.0802,1.0812,145`;

const input = {
  sourceId: "dukascopy-eurusd-2026-07-01",
  csv,
  rangeStart: "2026-07-01T12:00:00.000Z",
  rangeEnd: "2026-07-01T12:30:00.000Z",
  licenseNote: "User-supplied Dukascopy historical export; usage remains subject to provider terms."
};

describe("Dukascopy CSV historical adapter", () => {
  it("maps a fixed EURUSD 15m export into provider-neutral raw candles", () => {
    const result = adaptDukascopyCsv(input);

    expect(result.failures).toEqual([]);
    expect(result.acceptedRowCount).toBe(2);
    expect(result.snapshot).toMatchObject({
      provider: "DUKASCOPY_CSV_EXPORT",
      instrument: "EURUSD",
      timeframe: "15m",
      timezone: "UTC",
      adapterVersion: "dukascopy-csv-adapter-v1"
    });
    expect(result.candles[0]).toMatchObject({
      sourceId: input.sourceId,
      instrument: "EURUSD",
      timeframe: "15m",
      timestamp: "2026-07-01T12:00:00.000Z",
      open: 1.08,
      high: 1.081,
      low: 1.0795,
      close: 1.0807,
      volume: 120,
      finalized: true
    });
  });

  it("produces a stable source hash for identical source bytes", () => {
    expect(adaptDukascopyCsv(input).snapshot.rawContentHash).toBe(
      adaptDukascopyCsv(input).snapshot.rawContentHash
    );
  });

  it("rejects an unexpected provider export header", () => {
    const result = adaptDukascopyCsv({ ...input, csv: csv.replace("timestamp", "time") });

    expect(result.candles).toEqual([]);
    expect(result.failures[0]?.code).toBe("INVALID_HEADER");
  });

  it("keeps malformed rows as explicit adapter failures", () => {
    const result = adaptDukascopyCsv({
      ...input,
      csv: `${csv}\n2026-07-01T12:20:00.000Z,bad,1.1,1.0,1.05,100`
    });

    expect(result.acceptedRowCount).toBe(2);
    expect(result.failures.some((failure) => failure.code === "INVALID_NUMBER")).toBe(true);
  });

  it("requires timestamps to be explicitly UTC", () => {
    const result = adaptDukascopyCsv({
      ...input,
      csv: csv.replace("2026-07-01T12:00:00.000Z", "2026-07-01T12:00:00")
    });

    expect(result.failures.some((failure) => failure.code === "INVALID_TIMESTAMP")).toBe(true);
  });

  it("rejects rows outside the frozen declared range", () => {
    const result = adaptDukascopyCsv({
      ...input,
      rangeEnd: "2026-07-01T12:15:00.000Z"
    });

    expect(result.acceptedRowCount).toBe(1);
    expect(result.failures.some((failure) => failure.code === "OUTSIDE_DECLARED_RANGE")).toBe(true);
  });
});
