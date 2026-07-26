import { createHash } from "node:crypto";
import type {
  HistoricalAdapterFailure,
  HistoricalAdapterResult,
  HistoricalSourceSnapshot,
  RawMarketCandle
} from "@traderframe/contracts";

const ADAPTER_VERSION = "dukascopy-csv-adapter-v1";
const EXPECTED_HEADER = ["timestamp", "open", "high", "low", "close", "volume"];

type AdaptDukascopyCsvInput = {
  sourceId: string;
  csv: string;
  rangeStart: string;
  rangeEnd: string;
  licenseNote: string;
};

export function adaptDukascopyCsv(input: AdaptDukascopyCsvInput): HistoricalAdapterResult {
  const rangeStartMs = Date.parse(input.rangeStart);
  const rangeEndMs = Date.parse(input.rangeEnd);
  if (!Number.isFinite(rangeStartMs) || !Number.isFinite(rangeEndMs) || rangeEndMs <= rangeStartMs) {
    throw new Error("A valid increasing UTC source range is required.");
  }

  const normalizedText = input.csv.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  const snapshot: HistoricalSourceSnapshot = {
    provider: "DUKASCOPY_CSV_EXPORT",
    sourceId: input.sourceId,
    instrument: "EURUSD",
    timeframe: "15m",
    timezone: "UTC",
    rangeStart: new Date(rangeStartMs).toISOString(),
    rangeEnd: new Date(rangeEndMs).toISOString(),
    rawContentHash: hash(normalizedText),
    adapterVersion: ADAPTER_VERSION,
    licenseNote: input.licenseNote
  };

  if (!normalizedText) {
    return {
      snapshot,
      candles: [],
      failures: [{ code: "EMPTY_SOURCE", message: "The source CSV is empty." }],
      rawRowCount: 0,
      acceptedRowCount: 0
    };
  }

  const lines = normalizedText.split("\n");
  const firstLine = lines[0];
  if (firstLine === undefined) {
    return {
      snapshot,
      candles: [],
      failures: [{ code: "EMPTY_SOURCE", message: "The source CSV is empty." }],
      rawRowCount: 0,
      acceptedRowCount: 0
    };
  }

  const header = splitCsvLine(firstLine).map((value) => value.trim().toLowerCase());
  if (header.length !== EXPECTED_HEADER.length || header.some((value, index) => value !== EXPECTED_HEADER[index])) {
    return {
      snapshot,
      candles: [],
      failures: [
        {
          rowNumber: 1,
          code: "INVALID_HEADER",
          message: `Expected header: ${EXPECTED_HEADER.join(",")}.`,
          rawRow: firstLine
        }
      ],
      rawRowCount: Math.max(0, lines.length - 1),
      acceptedRowCount: 0
    };
  }

  const failures: HistoricalAdapterFailure[] = [];
  const candles: RawMarketCandle[] = [];
  let previousTimestamp = Number.NEGATIVE_INFINITY;

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined) continue;

    const rawRow = line.trim();
    if (!rawRow) continue;
    const rowNumber = index + 1;
    const values = splitCsvLine(rawRow).map((value) => value.trim());
    if (values.length !== EXPECTED_HEADER.length) {
      failures.push({ rowNumber, code: "INVALID_ROW", message: "Row does not contain six columns.", rawRow });
      continue;
    }

    const timestamp = values[0];
    if (timestamp === undefined) {
      failures.push({ rowNumber, code: "INVALID_ROW", message: "Timestamp column is missing.", rawRow });
      continue;
    }

    const timestampMs = parseUtcTimestamp(timestamp);
    if (!Number.isFinite(timestampMs)) {
      failures.push({ rowNumber, code: "INVALID_TIMESTAMP", message: "Timestamp must be an ISO UTC datetime.", rawRow });
      continue;
    }
    if (timestampMs < previousTimestamp) {
      failures.push({ rowNumber, code: "OUT_OF_ORDER", message: "Rows must be chronological.", rawRow });
      continue;
    }
    if (timestampMs < rangeStartMs || timestampMs >= rangeEndMs) {
      failures.push({ rowNumber, code: "OUTSIDE_DECLARED_RANGE", message: "Timestamp is outside the declared source range.", rawRow });
      continue;
    }

    const numbers = values.slice(1).map(Number);
    if (numbers.some((value) => !Number.isFinite(value))) {
      failures.push({ rowNumber, code: "INVALID_NUMBER", message: "OHLCV fields must be finite numbers.", rawRow });
      continue;
    }

    const [open, high, low, close, volume] = numbers as [number, number, number, number, number];
    candles.push({
      sourceId: input.sourceId,
      instrument: "EURUSD",
      timeframe: "15m",
      timestamp: new Date(timestampMs).toISOString(),
      timezone: "UTC",
      open,
      high,
      low,
      close,
      volume,
      finalized: true
    });
    previousTimestamp = timestampMs;
  }

  return {
    snapshot,
    candles,
    failures,
    rawRowCount: Math.max(0, lines.length - 1),
    acceptedRowCount: candles.length
  };
}

function parseUtcTimestamp(value: string): number {
  if (!value.endsWith("Z")) return Number.NaN;
  return Date.parse(value);
}

function splitCsvLine(line: string): string[] {
  return line.split(",");
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
