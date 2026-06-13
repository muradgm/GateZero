import { describe, expect, it } from "vitest";
import { DataSnapshotSchema, type DataSnapshot } from "../../contracts/src/index.js";
import { missingDataFixture } from "../../fixtures/src/index.js";
import { checkDataSnapshotQuality } from "../src/index.js";

function createCleanSnapshot(): DataSnapshot {
  return DataSnapshotSchema.parse({
    data_snapshot_id: "data-clean-001",
    source_name: "synthetic-fixture",
    source_version: "fixture-v1",
    symbol_universe: ["SYNTH", "ALT"],
    date_range: {
      start: "2025-01-01",
      end: "2025-01-31"
    },
    timeframe: "1d",
    timezone: "UTC",
    missing_data_behavior: "flag and block review until explained",
    corporate_action_policy: "not applicable for synthetic fixture",
    data_adjustment_policy: "not_applicable",
    captured_at: "2026-01-01T00:00:00.000Z",
    quality_warnings: []
  });
}

describe("data snapshot quality", () => {
  it("returns no findings for a clean synthetic snapshot", () => {
    const result = checkDataSnapshotQuality(createCleanSnapshot(), {
      expected_symbols: ["SYNTH", "ALT"],
      expected_start: "2025-01-01",
      expected_end: "2025-01-31",
      expected_timeframe: "1d",
      expected_timezone: "UTC",
      expected_missing_data_behavior: "flag and block review until explained",
      expected_corporate_action_policy: "not applicable for synthetic fixture",
      expected_data_adjustment_policy: "not_applicable"
    });

    expect(result.findings).toEqual([]);
  });

  it("propagates existing quality warnings", () => {
    const result = checkDataSnapshotQuality(missingDataFixture.payload);

    expect(result.findings).toEqual([
      {
        code: "quality_warning",
        severity: "medium",
        field: "quality_warnings",
        message: "missing records in synthetic fixture"
      }
    ]);
  });

  it("flags missing expected symbols", () => {
    const result = checkDataSnapshotQuality(createCleanSnapshot(), {
      expected_symbols: ["SYNTH", "MISSING"]
    });

    expect(result.findings).toContainEqual({
      code: "missing_expected_symbol",
      severity: "high",
      field: "symbol_universe",
      message: "expected symbol MISSING is missing"
    });
  });

  it("flags date range expectation mismatches", () => {
    const result = checkDataSnapshotQuality(createCleanSnapshot(), {
      expected_start: "2025-01-02",
      expected_end: "2025-02-01"
    });

    expect(result.findings.map((finding) => finding.code)).toEqual([
      "date_range_start_mismatch",
      "date_range_end_mismatch"
    ]);
  });

  it("flags timeframe mismatches", () => {
    const result = checkDataSnapshotQuality(createCleanSnapshot(), {
      expected_timeframe: "1h"
    });

    expect(result.findings).toContainEqual({
      code: "timeframe_mismatch",
      severity: "medium",
      field: "timeframe",
      message: "expected timeframe 1h, received 1d"
    });
  });

  it("flags metadata expectation mismatches", () => {
    const result = checkDataSnapshotQuality(createCleanSnapshot(), {
      expected_timezone: "America/New_York",
      expected_missing_data_behavior: "silent forward fill",
      expected_corporate_action_policy: "split adjusted",
      expected_data_adjustment_policy: "adjusted"
    });

    expect(result.findings.map((finding) => finding.code)).toEqual([
      "timezone_mismatch",
      "missing_data_behavior_mismatch",
      "corporate_action_policy_mismatch",
      "data_adjustment_policy_mismatch"
    ]);
  });

  it("rejects snapshots without required metadata", () => {
    const withoutTimezone = {
      ...createCleanSnapshot(),
      timezone: undefined
    };

    expect(() => DataSnapshotSchema.parse(withoutTimezone)).toThrow();
  });

  it("rejects invalid snapshot payloads", () => {
    const invalidSnapshot = {
      ...createCleanSnapshot(),
      symbol_universe: []
    };

    expect(() => checkDataSnapshotQuality(invalidSnapshot as DataSnapshot)).toThrow();
  });

  it("does not mutate input", () => {
    const snapshot = createCleanSnapshot();
    const before = JSON.stringify(snapshot);

    checkDataSnapshotQuality(snapshot, {
      expected_symbols: ["SYNTH", "MISSING"]
    });

    expect(JSON.stringify(snapshot)).toBe(before);
  });
});
