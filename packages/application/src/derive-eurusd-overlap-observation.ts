import type {
  EurUsdOverlapPullbackObservation,
  EurUsdOverlapPullbackStrategy,
  NormalizedMarketCandle,
  TimeBoundMarketCandle
} from "@traderframe/contracts";
import { EURUSD_OVERLAP_PULLBACK_V1 } from "./evaluate-eurusd-overlap-pullback.js";

const PIP_SIZE = 0.0001;

type Candle = Pick<
  NormalizedMarketCandle,
  "candleId" | "sourceHash" | "openedAt" | "closedAt" | "open" | "high" | "low" | "close"
>;

export type DeriveEurUsdOverlapObservationInput = {
  decisionTimestamp: string;
  candles15m: NormalizedMarketCandle[];
  candles1H: TimeBoundMarketCandle[];
  candles4H: TimeBoundMarketCandle[];
  eventContextStatus: "AVAILABLE" | "UNAVAILABLE";
  minutesToNearestHighImpactEvent: number;
  strategy?: EurUsdOverlapPullbackStrategy;
};

export type DerivedObservationDiagnostics = {
  observationEngineVersion: string;
  atr: number | null;
  ema1H: { fast: number | null; slow: number | null };
  ema4H: { fast: number | null; slow: number | null };
  sweepCandleId?: string;
  triggerCandleId?: string;
  excludedFutureCandleIds: string[];
  reasons: string[];
};

export type DerivedEurUsdOverlapObservation = {
  observation: EurUsdOverlapPullbackObservation;
  diagnostics: DerivedObservationDiagnostics;
};

export function deriveEurUsdOverlapObservation(
  input: DeriveEurUsdOverlapObservationInput
): DerivedEurUsdOverlapObservation {
  const strategy = input.strategy ?? EURUSD_OVERLAP_PULLBACK_V1;
  const decisionMs = Date.parse(input.decisionTimestamp);
  if (!Number.isFinite(decisionMs))
    throw new Error("decisionTimestamp must be a valid ISO datetime");

  const eligible15m = sortCandles(
    input.candles15m.filter((candle) => Date.parse(candle.closedAt) <= decisionMs)
  );
  const eligible1H = sortCandles(
    input.candles1H.filter((candle) => Date.parse(candle.availableAt) <= decisionMs)
  );
  const eligible4H = sortCandles(
    input.candles4H.filter((candle) => Date.parse(candle.availableAt) <= decisionMs)
  );
  const excludedFutureCandleIds = [
    ...input.candles15m
      .filter((candle) => Date.parse(candle.closedAt) > decisionMs)
      .map((candle) => candle.candleId),
    ...input.candles1H
      .filter((candle) => Date.parse(candle.availableAt) > decisionMs)
      .map((candle) => candle.candleId),
    ...input.candles4H
      .filter((candle) => Date.parse(candle.availableAt) > decisionMs)
      .map((candle) => candle.candleId)
  ].sort();

  const minimumSourceCandles = Math.max(
    strategy.pullback.atrPeriod + 1,
    strategy.liquiditySweep.swingLookbackCandles + strategy.liquiditySweep.reclaimWithinCandles + 2
  );
  const dataReady =
    eligible15m.length >= minimumSourceCandles &&
    eligible1H.length >= strategy.trend.slowEmaPeriod &&
    eligible4H.length >= strategy.trend.slowEmaPeriod;
  const reasons: string[] = [];
  if (!dataReady)
    reasons.push("Insufficient closed candles for ATR, sweep, or higher-timeframe EMA derivation.");
  if (eligible15m.length === 0)
    throw new Error("at least one decision-time eligible 15m candle is required");

  const ema1H = emaPair(eligible1H, strategy.trend.fastEmaPeriod, strategy.trend.slowEmaPeriod);
  const ema4H = emaPair(eligible4H, strategy.trend.fastEmaPeriod, strategy.trend.slowEmaPeriod);
  const direction = deriveDirection(ema1H, ema4H, strategy.directionMode);
  const higherTimeframeAligned =
    ema1H.fast !== null &&
    ema1H.slow !== null &&
    ema4H.fast !== null &&
    ema4H.slow !== null &&
    (direction === "LONG"
      ? ema1H.fast > ema1H.slow && ema4H.fast > ema4H.slow
      : ema1H.fast < ema1H.slow && ema4H.fast < ema4H.slow);

  const atr = averageTrueRange(eligible15m, strategy.pullback.atrPeriod);
  const latest = eligible15m.at(-1)!;
  const pullback = derivePullback(eligible15m, direction, atr, strategy.pullback.maximumAgeCandles);
  const sweep = deriveSweep(eligible15m, direction, atr, strategy);
  const trigger = sweep ? deriveTrigger(eligible15m, sweep, direction) : null;
  const invalidationPrice = sweep
    ? direction === "LONG"
      ? roundPrice(sweep.sweepCandle.low - strategy.invalidation.bufferPips * PIP_SIZE)
      : roundPrice(sweep.sweepCandle.high + strategy.invalidation.bufferPips * PIP_SIZE)
    : undefined;

  const decisionDate = new Date(decisionMs);
  const minuteUtc = decisionDate.getUTCHours() * 60 + decisionDate.getUTCMinutes();
  const sessionEligible =
    minuteUtc >= strategy.session.startMinuteUtc && minuteUtc < strategy.session.endMinuteUtc;
  const sessionEnded = minuteUtc >= strategy.session.endMinuteUtc;
  const evidenceIds = unique(
    [
      latest.sourceHash,
      latest.candleId,
      eligible1H.at(-1)?.sourceHash,
      eligible4H.at(-1)?.sourceHash,
      sweep?.sweepCandle.sourceHash,
      trigger?.candle.sourceHash
    ].filter((value): value is string => Boolean(value))
  );
  const latestAvailability = latestIso([
    latest.closedAt,
    eligible1H.at(-1)?.availableAt,
    eligible4H.at(-1)?.availableAt,
    sweep?.reclaimCandle.closedAt,
    trigger?.candle.closedAt
  ]);

  const observation: EurUsdOverlapPullbackObservation = {
    candidateId: stableId(
      [
        strategy.strategyId,
        strategy.version,
        input.decisionTimestamp,
        direction,
        ...evidenceIds
      ].join("|")
    ),
    decisionTimestamp: input.decisionTimestamp,
    direction,
    dataReady,
    sessionEligible,
    higherTimeframeAligned,
    pullbackRetracementAtr: pullback.retracementAtr,
    pullbackAgeCandles: pullback.ageCandles,
    liquiditySweepDetected: Boolean(sweep),
    sweepPenetrationPips: sweep?.penetrationPips ?? 0,
    sweepReclaimedWithinCandles:
      sweep?.reclaimWithinCandles ?? strategy.liquiditySweep.reclaimWithinCandles + 1,
    displacementAtr: sweep?.displacementAtr ?? 0,
    triggerConfirmed: Boolean(trigger),
    triggerAgeCandles: trigger?.ageCandles ?? strategy.trigger.maximumTriggerAgeCandles + 1,
    eventContextStatus: input.eventContextStatus,
    minutesToNearestHighImpactEvent: input.minutesToNearestHighImpactEvent,
    ...(invalidationPrice === undefined ? {} : { invalidationPrice }),
    currentPrice: latest.close,
    candlesSinceTrigger: trigger?.ageCandles ?? 0,
    sessionEnded,
    evidenceIds,
    availableAt: latestAvailability
  };

  if (!higherTimeframeAligned) reasons.push("Closed 1H and 4H EMA context is not aligned.");
  if (atr === null) reasons.push("ATR could not be derived from the available 15m series.");
  if (!sweep) reasons.push("No deterministic liquidity sweep and reclaim was found.");
  if (sweep && !trigger) reasons.push("Sweep exists, but no close-confirmed trigger followed it.");

  return {
    observation,
    diagnostics: {
      observationEngineVersion: strategy.observationEngineVersion,
      atr,
      ema1H,
      ema4H,
      ...(sweep ? { sweepCandleId: sweep.sweepCandle.candleId } : {}),
      ...(trigger ? { triggerCandleId: trigger.candle.candleId } : {}),
      excludedFutureCandleIds,
      reasons
    }
  };
}

function deriveDirection(
  ema1H: { fast: number | null; slow: number | null },
  ema4H: { fast: number | null; slow: number | null },
  mode: EurUsdOverlapPullbackStrategy["directionMode"]
): "LONG" | "SHORT" {
  if (mode === "LONG_ONLY") return "LONG";
  if (mode === "SHORT_ONLY") return "SHORT";
  const longVotes =
    Number((ema1H.fast ?? 0) > (ema1H.slow ?? 0)) + Number((ema4H.fast ?? 0) > (ema4H.slow ?? 0));
  return longVotes >= 1 ? "LONG" : "SHORT";
}

function derivePullback(
  candles: Candle[],
  direction: "LONG" | "SHORT",
  atr: number | null,
  maximumAge: number
) {
  if (!atr || atr <= 0) return { retracementAtr: 0, ageCandles: maximumAge + 1 };
  const window = candles.slice(-(maximumAge + 1));
  const latest = window.at(-1)!;
  let extremeIndex = 0;
  for (let index = 1; index < window.length; index += 1) {
    const candidate = window[index];
    const current = window[extremeIndex];
    if (!candidate || !current) continue;
    if (!candidate || !current) continue;
    if (
      (direction === "LONG" && candidate.high > current.high) ||
      (direction === "SHORT" && candidate.low < current.low)
    ) {
      extremeIndex = index;
    }
  }
  const extreme = window[extremeIndex];
  if (!extreme) throw new Error("pullback window must contain an extreme candle");
  const distance =
    direction === "LONG"
      ? Math.max(0, extreme.high - latest.close)
      : Math.max(0, latest.close - extreme.low);
  return {
    retracementAtr: roundMetric(distance / atr),
    ageCandles: window.length - 1 - extremeIndex
  };
}

function deriveSweep(
  candles: Candle[],
  direction: "LONG" | "SHORT",
  atr: number | null,
  strategy: EurUsdOverlapPullbackStrategy
) {
  if (!atr || atr <= 0) return null;
  const lookback = strategy.liquiditySweep.swingLookbackCandles;
  let selected: {
    sweepIndex: number;
    reclaimIndex: number;
    sweepCandle: Candle;
    reclaimCandle: Candle;
    penetrationPips: number;
    reclaimWithinCandles: number;
    displacementAtr: number;
  } | null = null;

  for (let sweepIndex = lookback; sweepIndex < candles.length; sweepIndex += 1) {
    const prior = candles.slice(sweepIndex - lookback, sweepIndex);
    const swingLevel =
      direction === "LONG"
        ? Math.min(...prior.map((candle) => candle.low))
        : Math.max(...prior.map((candle) => candle.high));
    const sweepCandle = candles[sweepIndex];
    if (!sweepCandle) continue;
    const penetration =
      direction === "LONG" ? swingLevel - sweepCandle.low : sweepCandle.high - swingLevel;
    const penetrationPips = penetration / PIP_SIZE;
    if (penetrationPips < strategy.liquiditySweep.minimumPenetrationPips) continue;

    const lastReclaimIndex = Math.min(
      candles.length - 1,
      sweepIndex + strategy.liquiditySweep.reclaimWithinCandles
    );
    let reclaimIndex = -1;
    for (let index = sweepIndex; index <= lastReclaimIndex; index += 1) {
      const candle = candles[index];
      if (!candle) continue;
      const reclaimed =
        direction === "LONG" ? candle.close > swingLevel : candle.close < swingLevel;
      if (reclaimed) {
        reclaimIndex = index;
        break;
      }
    }
    if (reclaimIndex < 0) continue;

    const postSweep = candles.slice(
      reclaimIndex,
      Math.min(candles.length, reclaimIndex + strategy.trigger.maximumTriggerAgeCandles + 1)
    );
    const favorableMove =
      direction === "LONG"
        ? Math.max(...postSweep.map((candle) => candle.close)) - sweepCandle.close
        : sweepCandle.close - Math.min(...postSweep.map((candle) => candle.close));
    const displacementAtr = Math.max(0, favorableMove) / atr;
    if (displacementAtr < strategy.liquiditySweep.minimumDisplacementAtr) continue;

    const reclaimCandle = candles[reclaimIndex];
    if (!reclaimCandle) continue;

    selected = {
      sweepIndex,
      reclaimIndex,
      sweepCandle,
      reclaimCandle,
      penetrationPips: roundMetric(penetrationPips),
      reclaimWithinCandles: reclaimIndex - sweepIndex,
      displacementAtr: roundMetric(displacementAtr)
    };
  }
  return selected;
}

function deriveTrigger(
  candles: Candle[],
  sweep: NonNullable<ReturnType<typeof deriveSweep>>,
  direction: "LONG" | "SHORT"
) {
  const triggerLevel = direction === "LONG" ? sweep.sweepCandle.high : sweep.sweepCandle.low;
  for (let index = sweep.reclaimIndex; index < candles.length; index += 1) {
    const candle = candles[index];
    if (!candle) continue;
    const confirmed =
      direction === "LONG" ? candle.close > triggerLevel : candle.close < triggerLevel;
    if (confirmed) {
      return {
        candle,
        index,
        ageCandles: candles.length - 1 - index
      };
    }
  }
  return null;
}

function averageTrueRange(candles: Candle[], period: number): number | null {
  if (candles.length < period + 1) return null;
  const values: number[] = [];
  for (let index = candles.length - period; index < candles.length; index += 1) {
    const candle = candles[index];
    const previous = candles[index - 1];
    if (!candle || !previous) {
      throw new Error("ATR window must contain current and previous candles");
    }
    const previousClose = previous.close;
    values.push(
      Math.max(
        candle.high - candle.low,
        Math.abs(candle.high - previousClose),
        Math.abs(candle.low - previousClose)
      )
    );
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function emaPair(candles: Candle[], fastPeriod: number, slowPeriod: number) {
  return {
    fast: exponentialMovingAverage(
      candles.map((candle) => candle.close),
      fastPeriod
    ),
    slow: exponentialMovingAverage(
      candles.map((candle) => candle.close),
      slowPeriod
    )
  };
}

function exponentialMovingAverage(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const seed = values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  const multiplier = 2 / (period + 1);
  let value = seed;
  for (const current of values.slice(period)) value = (current - value) * multiplier + value;
  return value;
}

function sortCandles<T extends Candle>(candles: T[]): T[] {
  return [...candles].sort((a, b) => Date.parse(a.openedAt) - Date.parse(b.openedAt));
}

function latestIso(values: Array<string | undefined>): string {
  const valid = values.filter((value): value is string => Boolean(value));
  return new Date(Math.max(...valid.map((value) => Date.parse(value)))).toISOString();
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function roundMetric(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function roundPrice(value: number): number {
  return Math.round(value * 100000) / 100000;
}

function stableId(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `eurusd-candidate-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
