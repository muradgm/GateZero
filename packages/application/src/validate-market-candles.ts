import type {
  MarketTimeframe,
  NormalizedMarketCandle,
  RawMarketCandle,
  TraceValidityFailure
} from "@traderframe/contracts";

const INTERVALS: Record<MarketTimeframe, number> = {
  "15m": 15 * 60 * 1000,
  "1H": 60 * 60 * 1000,
  "4H": 4 * 60 * 60 * 1000
};

export type MarketCandleValidationInput = {
  sourceId: string;
  instrument: "EURUSD";
  timeframe: MarketTimeframe;
  candles: RawMarketCandle[];
  checkedAt: string;
  normalizationVersion: string;
};

export type MarketCandleValidationResult = {
  sourceId: string;
  instrument: "EURUSD";
  timeframe: MarketTimeframe;
  normalizationVersion: string;
  expectedIntervalMs: number;
  rawRecordCount: number;
  normalizedRecordCount: number;
  normalizedCandles: NormalizedMarketCandle[];
  failures: TraceValidityFailure[];
};

export function validateAndNormalizeMarketCandles(input: MarketCandleValidationInput): MarketCandleValidationResult {
  const expectedIntervalMs = INTERVALS[input.timeframe];
  const failures: TraceValidityFailure[] = [];
  const normalized: NormalizedMarketCandle[] = [];
  const seen = new Set<number>();

  const parsed = input.candles
    .map((candle, index) => ({ candle, index, openedAtMs: Date.parse(candle.timestamp) }))
    .sort((a, b) => a.openedAtMs - b.openedAtMs);

  for (const item of parsed) {
    const { candle, index, openedAtMs } = item;
    const evidenceId = `${input.sourceId}:${index}`;

    if (!Number.isFinite(openedAtMs)) {
      failures.push(failure(input, "TIMEZONE_MISMATCH", "timestamp_integrity", "BLOCKER", `Candle ${index} has an invalid timestamp.`, [evidenceId]));
      continue;
    }

    if (candle.instrument !== input.instrument) {
      failures.push(failure(input, "INSTRUMENT_MISMATCH", "data_integrity", "BLOCKER", `Expected ${input.instrument} but received ${candle.instrument}.`, [evidenceId]));
      continue;
    }

    if (candle.timeframe !== input.timeframe) {
      failures.push(failure(input, "TIMEFRAME_MISMATCH", "data_integrity", "BLOCKER", `Expected ${input.timeframe} but received ${candle.timeframe}.`, [evidenceId]));
      continue;
    }

    if (candle.timezone !== "UTC" && !hasExplicitOffset(candle.timestamp)) {
      failures.push(failure(input, "TIMEZONE_MISMATCH", "timestamp_integrity", "BLOCKER", "Non-UTC source timestamps require an explicit numeric offset.", [evidenceId]));
      continue;
    }

    if (seen.has(openedAtMs)) {
      failures.push(failure(input, "DUPLICATE_TIMESTAMP", "data_integrity", "BLOCKER", `Duplicate candle timestamp ${new Date(openedAtMs).toISOString()}.`, [evidenceId]));
      continue;
    }
    seen.add(openedAtMs);

    if (!candle.finalized) {
      failures.push(failure(input, "INCOMPLETE_CANDLE", "data_integrity", "BLOCKER", `Candle ${new Date(openedAtMs).toISOString()} is not finalized.`, [evidenceId]));
      continue;
    }

    if (!validOhlc(candle)) {
      failures.push(failure(input, "INVALID_OHLC", "data_integrity", "BLOCKER", `Candle ${new Date(openedAtMs).toISOString()} violates OHLC invariants.`, [evidenceId]));
      continue;
    }

    const openedAt = new Date(openedAtMs).toISOString();
    const closedAt = new Date(openedAtMs + expectedIntervalMs).toISOString();
    const sourceHash = stableHash([
      input.sourceId,
      input.instrument,
      input.timeframe,
      openedAt,
      candle.open,
      candle.high,
      candle.low,
      candle.close,
      candle.volume ?? ""
    ].join("|"));

    normalized.push({
      candleId: `${input.instrument}-${input.timeframe}-${openedAt}`,
      sourceId: input.sourceId,
      instrument: input.instrument,
      timeframe: input.timeframe,
      openedAt,
      closedAt,
      timezone: "UTC",
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      ...(candle.volume === undefined ? {} : { volume: candle.volume }),
      finalized: true,
      sourceHash,
      normalizationVersion: input.normalizationVersion
    });
  }

  for (let index = 1; index < normalized.length; index += 1) {
    const previous = normalized[index - 1];
    const current = normalized[index];
    const actualGap = Date.parse(current.openedAt) - Date.parse(previous.openedAt);
    if (actualGap > expectedIntervalMs && !isExpectedWeekendClosure(previous.openedAt, current.openedAt)) {
      failures.push(failure(
        input,
        "DATA_GAP_UNCLASSIFIED",
        "data_integrity",
        "BLOCKER",
        `Unclassified gap of ${actualGap / 60000} minutes between ${previous.openedAt} and ${current.openedAt}.`,
        [previous.candleId, current.candleId]
      ));
    }
  }

  return {
    sourceId: input.sourceId,
    instrument: input.instrument,
    timeframe: input.timeframe,
    normalizationVersion: input.normalizationVersion,
    expectedIntervalMs,
    rawRecordCount: input.candles.length,
    normalizedRecordCount: normalized.length,
    normalizedCandles: normalized,
    failures
  };
}

function validOhlc(candle: RawMarketCandle): boolean {
  return candle.high >= candle.low && candle.high >= candle.open && candle.high >= candle.close && candle.low <= candle.open && candle.low <= candle.close;
}

function hasExplicitOffset(timestamp: string): boolean {
  return /(?:Z|[+-]\d{2}:\d{2})$/i.test(timestamp);
}

function isExpectedWeekendClosure(previousIso: string, currentIso: string): boolean {
  const previous = new Date(previousIso);
  const current = new Date(currentIso);
  const previousDay = previous.getUTCDay();
  const currentDay = current.getUTCDay();
  return (previousDay === 5 || previousDay === 6) && (currentDay === 0 || currentDay === 1);
}

function failure(
  input: MarketCandleValidationInput,
  code: TraceValidityFailure["code"],
  area: TraceValidityFailure["area"],
  severity: TraceValidityFailure["severity"],
  message: string,
  evidenceIds: string[]
): TraceValidityFailure {
  return {
    failureId: `${code}-${stableHash(message)}`,
    code,
    area,
    severity,
    message,
    evidenceIds,
    detectedAt: input.checkedAt,
    ruleVersion: "market-candle-integrity-v1",
    remediation: remediationFor(code)
  };
}

function remediationFor(code: TraceValidityFailure["code"]): string {
  const messages: Partial<Record<TraceValidityFailure["code"], string>> = {
    DATA_GAP_UNCLASSIFIED: "Classify the market closure or repair the source series before evaluation.",
    DUPLICATE_TIMESTAMP: "Remove the duplicate source record and regenerate normalized candles.",
    INVALID_OHLC: "Correct or reject the malformed source record.",
    INCOMPLETE_CANDLE: "Wait for candle finalization or exclude the incomplete record.",
    INSTRUMENT_MISMATCH: "Use a source series for the required instrument.",
    TIMEFRAME_MISMATCH: "Use or derive the required timeframe deterministically.",
    TIMEZONE_MISMATCH: "Provide an explicit source offset and normalize to UTC."
  };
  return messages[code] ?? "Resolve the validity failure before progressing the trace.";
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
