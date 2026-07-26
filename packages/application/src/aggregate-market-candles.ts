import type {
  HigherMarketTimeframe,
  NormalizedMarketCandle,
  TimeBoundMarketCandle,
  TraceValidityFailure
} from "@traderframe/contracts";

const SOURCE_INTERVAL_MS = 15 * 60 * 1000;
const TARGET_INTERVALS: Record<HigherMarketTimeframe, number> = {
  "1H": 60 * 60 * 1000,
  "4H": 4 * 60 * 60 * 1000
};

export type TimeframeAggregationInput = {
  sourceId: string;
  candles: NormalizedMarketCandle[];
  targetTimeframe: HigherMarketTimeframe;
  asOf: string;
  checkedAt: string;
  aggregationVersion: string;
};

export type TimeframeAggregationOutput = {
  sourceId: string;
  instrument: "EURUSD";
  sourceTimeframe: "15m";
  targetTimeframe: HigherMarketTimeframe;
  asOf: string;
  aggregationVersion: string;
  expectedSourceCandlesPerTarget: number;
  sourceRecordCount: number;
  aggregatedRecordCount: number;
  candles: TimeBoundMarketCandle[];
  failures: TraceValidityFailure[];
};

type DecisionTimeCandle = Pick<NormalizedMarketCandle, "candleId" | "closedAt" | "timeframe"> & {
  availableAt?: string;
};

export type DecisionTimeSelection = {
  decisionTimestamp: string;
  eligibleCandles: DecisionTimeCandle[];
  excludedCandleIds: string[];
  failures: TraceValidityFailure[];
};

export function aggregateValidatedMarketCandles(
  input: TimeframeAggregationInput
): TimeframeAggregationOutput {
  const targetIntervalMs = TARGET_INTERVALS[input.targetTimeframe];
  const expectedSourceCandlesPerTarget = targetIntervalMs / SOURCE_INTERVAL_MS;
  const asOfMs = Date.parse(input.asOf);
  const failures: TraceValidityFailure[] = [];
  const groups = new Map<number, NormalizedMarketCandle[]>();

  const source = [...input.candles]
    .filter(
      (candle) => candle.instrument === "EURUSD" && candle.timeframe === "15m" && candle.finalized
    )
    .sort((left, right) => Date.parse(left.openedAt) - Date.parse(right.openedAt));

  for (const candle of source) {
    const openedAtMs = Date.parse(candle.openedAt);
    const bucketStart = Math.floor(openedAtMs / targetIntervalMs) * targetIntervalMs;
    const group = groups.get(bucketStart) ?? [];
    group.push(candle);
    groups.set(bucketStart, group);
  }

  const candles: TimeBoundMarketCandle[] = [];

  for (const [bucketStart, unsortedGroup] of [...groups.entries()].sort(
    ([left], [right]) => left - right
  )) {
    const group = [...unsortedGroup].sort(
      (left, right) => Date.parse(left.openedAt) - Date.parse(right.openedAt)
    );
    const bucketClose = bucketStart + targetIntervalMs;
    const complete = hasCompleteSourceWindow(group, bucketStart, expectedSourceCandlesPerTarget);

    if (!complete) {
      const code =
        bucketClose > asOfMs ? "UNCLOSED_HIGHER_TIMEFRAME_INPUT" : "DATA_GAP_UNCLASSIFIED";
      failures.push(
        createFailure(
          input,
          code,
          code === "UNCLOSED_HIGHER_TIMEFRAME_INPUT" ? "timestamp_integrity" : "data_integrity",
          "BLOCKER",
          code === "UNCLOSED_HIGHER_TIMEFRAME_INPUT"
            ? `${input.targetTimeframe} candle beginning ${new Date(bucketStart).toISOString()} is not closed at ${input.asOf}.`
            : `${input.targetTimeframe} candle beginning ${new Date(bucketStart).toISOString()} does not contain all expected 15m source candles.`,
          group.map((candle) => candle.candleId)
        )
      );
      continue;
    }

    if (bucketClose > asOfMs) {
      failures.push(
        createFailure(
          input,
          "UNCLOSED_HIGHER_TIMEFRAME_INPUT",
          "timestamp_integrity",
          "BLOCKER",
          `${input.targetTimeframe} candle beginning ${new Date(bucketStart).toISOString()} closes after the as-of boundary ${input.asOf}.`,
          group.map((candle) => candle.candleId)
        )
      );
      continue;
    }

    const openedAt = new Date(bucketStart).toISOString();
    const closedAt = new Date(bucketClose).toISOString();
    const first = group[0];
    const last = group[group.length - 1];
    const high = Math.max(...group.map((candle) => candle.high));
    const low = Math.min(...group.map((candle) => candle.low));
    const volumes = group.map((candle) => candle.volume);
    const hasCompleteVolume = volumes.every((volume) => volume !== undefined);
    const sourceHash = stableHash(
      [
        input.sourceId,
        input.targetTimeframe,
        openedAt,
        ...group.map((candle) => candle.sourceHash)
      ].join("|")
    );

    candles.push({
      candleId: `EURUSD-${input.targetTimeframe}-${openedAt}`,
      sourceId: input.sourceId,
      instrument: "EURUSD",
      timeframe: input.targetTimeframe,
      openedAt,
      closedAt,
      availableAt: closedAt,
      timezone: "UTC",
      open: first.open,
      high,
      low,
      close: last.close,
      ...(hasCompleteVolume
        ? { volume: volumes.reduce<number>((sum, volume) => sum + (volume ?? 0), 0) }
        : {}),
      finalized: true,
      sourceHash,
      normalizationVersion: first.normalizationVersion,
      derivedFromCandleIds: group.map((candle) => candle.candleId),
      derivedFromHashes: group.map((candle) => candle.sourceHash),
      aggregationVersion: input.aggregationVersion
    });
  }

  return {
    sourceId: input.sourceId,
    instrument: "EURUSD",
    sourceTimeframe: "15m",
    targetTimeframe: input.targetTimeframe,
    asOf: input.asOf,
    aggregationVersion: input.aggregationVersion,
    expectedSourceCandlesPerTarget,
    sourceRecordCount: source.length,
    aggregatedRecordCount: candles.length,
    candles,
    failures
  };
}

export function selectCandlesAvailableAtDecision(
  candles: DecisionTimeCandle[],
  decisionTimestamp: string,
  checkedAt: string
): DecisionTimeSelection {
  const decisionTimeMs = Date.parse(decisionTimestamp);
  const eligibleCandles: DecisionTimeCandle[] = [];
  const excludedCandleIds: string[] = [];
  const failures: TraceValidityFailure[] = [];

  for (const candle of candles) {
    const availableAt = candle.availableAt ?? candle.closedAt;
    if (Date.parse(availableAt) <= decisionTimeMs) {
      eligibleCandles.push(candle);
      continue;
    }

    excludedCandleIds.push(candle.candleId);
    failures.push({
      failureId: `FUTURE_EVIDENCE-${stableHash(`${candle.candleId}|${decisionTimestamp}`)}`,
      code: candle.timeframe === "15m" ? "FUTURE_EVIDENCE" : "UNCLOSED_HIGHER_TIMEFRAME_INPUT",
      area: "timestamp_integrity",
      severity: "BLOCKER",
      message: `${candle.candleId} was available at ${availableAt}, after decision time ${decisionTimestamp}.`,
      evidenceIds: [candle.candleId],
      detectedAt: checkedAt,
      ruleVersion: "decision-time-candle-boundary-v1",
      remediation:
        "Exclude the candle or move the decision timestamp to a time when the candle was finalized."
    });
  }

  return { decisionTimestamp, eligibleCandles, excludedCandleIds, failures };
}

function hasCompleteSourceWindow(
  group: NormalizedMarketCandle[],
  bucketStart: number,
  expectedCount: number
): boolean {
  if (group.length !== expectedCount) return false;
  return group.every(
    (candle, index) => Date.parse(candle.openedAt) === bucketStart + index * SOURCE_INTERVAL_MS
  );
}

function createFailure(
  input: TimeframeAggregationInput,
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
    ruleVersion: "timeframe-aggregation-v1",
    remediation:
      code === "UNCLOSED_HIGHER_TIMEFRAME_INPUT"
        ? "Wait for the higher-timeframe candle to close before using it in a decision."
        : "Repair or classify the missing source interval before aggregation."
  };
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
