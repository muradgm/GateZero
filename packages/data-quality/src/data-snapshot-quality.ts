import { DataSnapshotSchema, type DataSnapshot } from "../../contracts/src/index.js";

export type DataSnapshotQualityFindingCode =
  | "quality_warning"
  | "missing_expected_symbol"
  | "date_range_start_mismatch"
  | "date_range_end_mismatch"
  | "timeframe_mismatch"
  | "timezone_mismatch"
  | "missing_data_behavior_mismatch"
  | "corporate_action_policy_mismatch"
  | "data_adjustment_policy_mismatch";

export interface DataSnapshotQualityFinding {
  readonly code: DataSnapshotQualityFindingCode;
  readonly severity: "low" | "medium" | "high";
  readonly field: string;
  readonly message: string;
}

export interface DataSnapshotQualityExpectations {
  readonly expected_symbols?: readonly string[];
  readonly expected_start?: string;
  readonly expected_end?: string;
  readonly expected_timeframe?: string;
  readonly expected_timezone?: string;
  readonly expected_missing_data_behavior?: string;
  readonly expected_corporate_action_policy?: string;
  readonly expected_data_adjustment_policy?: DataSnapshot["data_adjustment_policy"];
}

export interface DataSnapshotQualityResult {
  readonly data_snapshot_id: string;
  readonly source_name: string;
  readonly source_version: string;
  readonly findings: readonly DataSnapshotQualityFinding[];
}

export function checkDataSnapshotQuality(
  snapshot: DataSnapshot,
  expectations: DataSnapshotQualityExpectations = {}
): DataSnapshotQualityResult {
  const parsedSnapshot = DataSnapshotSchema.parse(snapshot);
  const findings: DataSnapshotQualityFinding[] = [
    ...parsedSnapshot.quality_warnings.map((warning) => {
      return {
        code: "quality_warning" as const,
        severity: "medium" as const,
        field: "quality_warnings",
        message: warning
      };
    }),
    ...findMissingExpectedSymbols(parsedSnapshot, expectations.expected_symbols ?? []),
    ...findDateRangeMismatches(parsedSnapshot, expectations),
    ...findMetadataMismatches(parsedSnapshot, expectations)
  ];

  return {
    data_snapshot_id: parsedSnapshot.data_snapshot_id,
    source_name: parsedSnapshot.source_name,
    source_version: parsedSnapshot.source_version,
    findings
  };
}

function findMissingExpectedSymbols(
  snapshot: DataSnapshot,
  expectedSymbols: readonly string[]
): readonly DataSnapshotQualityFinding[] {
  const availableSymbols = new Set(snapshot.symbol_universe);

  return expectedSymbols
    .filter((symbol) => !availableSymbols.has(symbol))
    .map((symbol) => {
      return {
        code: "missing_expected_symbol",
        severity: "high",
        field: "symbol_universe",
        message: `expected symbol ${symbol} is missing`
      };
    });
}

function findDateRangeMismatches(
  snapshot: DataSnapshot,
  expectations: DataSnapshotQualityExpectations
): readonly DataSnapshotQualityFinding[] {
  const findings: DataSnapshotQualityFinding[] = [];

  if (expectations.expected_start && snapshot.date_range.start !== expectations.expected_start) {
    findings.push({
      code: "date_range_start_mismatch",
      severity: "high",
      field: "date_range.start",
      message: `expected start ${expectations.expected_start}, received ${snapshot.date_range.start}`
    });
  }

  if (expectations.expected_end && snapshot.date_range.end !== expectations.expected_end) {
    findings.push({
      code: "date_range_end_mismatch",
      severity: "high",
      field: "date_range.end",
      message: `expected end ${expectations.expected_end}, received ${snapshot.date_range.end}`
    });
  }

  return findings;
}

function findMetadataMismatches(
  snapshot: DataSnapshot,
  expectations: DataSnapshotQualityExpectations
): readonly DataSnapshotQualityFinding[] {
  const findings: DataSnapshotQualityFinding[] = [];

  addMetadataFinding(findings, {
    actual: snapshot.timeframe,
    code: "timeframe_mismatch",
    expected: expectations.expected_timeframe,
    field: "timeframe",
    severity: "medium"
  });
  addMetadataFinding(findings, {
    actual: snapshot.timezone,
    code: "timezone_mismatch",
    expected: expectations.expected_timezone,
    field: "timezone",
    severity: "medium"
  });
  addMetadataFinding(findings, {
    actual: snapshot.missing_data_behavior,
    code: "missing_data_behavior_mismatch",
    expected: expectations.expected_missing_data_behavior,
    field: "missing_data_behavior",
    severity: "high"
  });
  addMetadataFinding(findings, {
    actual: snapshot.corporate_action_policy,
    code: "corporate_action_policy_mismatch",
    expected: expectations.expected_corporate_action_policy,
    field: "corporate_action_policy",
    severity: "medium"
  });
  addMetadataFinding(findings, {
    actual: snapshot.data_adjustment_policy,
    code: "data_adjustment_policy_mismatch",
    expected: expectations.expected_data_adjustment_policy,
    field: "data_adjustment_policy",
    severity: "medium"
  });

  return findings;
}

interface MetadataFindingInput {
  readonly actual: string;
  readonly code: DataSnapshotQualityFindingCode;
  readonly expected: string | undefined;
  readonly field: string;
  readonly severity: DataSnapshotQualityFinding["severity"];
}

function addMetadataFinding(
  findings: DataSnapshotQualityFinding[],
  input: MetadataFindingInput
): void {
  if (!input.expected || input.actual === input.expected) {
    return;
  }

  findings.push({
    code: input.code,
    severity: input.severity,
    field: input.field,
    message: `expected ${input.field} ${input.expected}, received ${input.actual}`
  });
}
