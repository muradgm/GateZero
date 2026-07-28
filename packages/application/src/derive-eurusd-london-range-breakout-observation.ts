import {
  EurUsdLondonRangeBreakoutObservationSchema,
  type EurUsdLondonRangeBreakoutObservation,
  type EurUsdLondonRangeBreakoutStrategy,
  type NormalizedMarketCandle
} from "@traderframe/contracts";
import { hashCanonicalValue } from "./canonical-risk-review.js";
import { EURUSD_LONDON_RANGE_BREAKOUT_V1 } from "./evaluate-eurusd-london-range-breakout.js";

export type DerivedLondonRangeBreakoutObservation = {
  readonly observation: EurUsdLondonRangeBreakoutObservation;
  readonly diagnostics: {
    readonly rangeCandleIds: readonly string[];
    readonly breakoutCandleId: string;
    readonly excludedFutureCandleCount: number;
  };
};

export function deriveEurUsdLondonRangeBreakoutObservation(input: {
  readonly decisionTimestamp: string;
  readonly candles15m: readonly NormalizedMarketCandle[];
  readonly eventContextStatus: "AVAILABLE" | "UNAVAILABLE";
  readonly minutesToNearestHighImpactEvent: number;
  readonly strategy?: EurUsdLondonRangeBreakoutStrategy;
}): DerivedLondonRangeBreakoutObservation {
  const strategy = input.strategy ?? EURUSD_LONDON_RANGE_BREAKOUT_V1;
  const decisionMs = Date.parse(input.decisionTimestamp);
  if (!Number.isFinite(decisionMs)) throw new Error("decision timestamp must be valid");

  const sorted = [...input.candles15m].sort(
    (left, right) => Date.parse(left.closedAt) - Date.parse(right.closedAt)
  );
  const eligible = sorted.filter((candle) => Date.parse(candle.closedAt) <= decisionMs);
  const excludedFutureCandleCount = sorted.length - eligible.length;
  const decisionDate = input.decisionTimestamp.slice(0, 10);
  const sameDay = eligible.filter((candle) => candle.openedAt.startsWith(decisionDate));
  const rangeCandles = sameDay.filter((candle) => {
    const openedMinute = utcMinute(candle.openedAt);
    const closedMinute = utcMinute(candle.closedAt);
    return (
      openedMinute >= strategy.range.startMinuteUtc && closedMinute <= strategy.range.endMinuteUtc
    );
  });
  if (rangeCandles.length === 0) {
    throw new Error("range-breakout observation requires a completed London range");
  }
  if (utcMinute(input.decisionTimestamp) < strategy.range.endMinuteUtc) {
    throw new Error("range-breakout observation cannot use an incomplete London range");
  }

  const postRange = sameDay.filter(
    (candle) =>
      utcMinute(candle.closedAt) > strategy.range.endMinuteUtc &&
      Date.parse(candle.closedAt) <= decisionMs
  );
  const decisionCandle = postRange.at(-1);
  if (!decisionCandle || decisionCandle.closedAt !== input.decisionTimestamp) {
    throw new Error("decision timestamp must match a closed post-range candle");
  }

  const rangeHigh = Math.max(...rangeCandles.map((candle) => candle.high));
  const rangeLow = Math.min(...rangeCandles.map((candle) => candle.low));
  const longThreshold = rangeHigh + strategy.breakout.minimumCloseBeyondRangePips * 0.0001;
  const shortThreshold = rangeLow - strategy.breakout.minimumCloseBeyondRangePips * 0.0001;
  const direction =
    decisionCandle.close >= longThreshold
      ? ("LONG" as const)
      : decisionCandle.close <= shortThreshold
        ? ("SHORT" as const)
        : null;
  if (!direction) {
    throw new Error("decision candle does not contain a qualifying closed range breakout");
  }

  const firstBreakoutIndex = postRange.findIndex((candle) =>
    direction === "LONG" ? candle.close >= longThreshold : candle.close <= shortThreshold
  );
  if (firstBreakoutIndex < 0) throw new Error("qualifying breakout candle is unavailable");
  const breakoutCandle = postRange[firstBreakoutIndex]!;
  const breakoutAgeCandles = postRange.length - firstBreakoutIndex - 1;
  const evidenceIds = [
    ...rangeCandles.map((candle) => candle.sourceHash),
    breakoutCandle.sourceHash,
    decisionCandle.sourceHash
  ].filter((value, index, values) => values.indexOf(value) === index);
  const invalidationPrice =
    direction === "LONG"
      ? rangeLow - strategy.invalidation.bufferPips * 0.0001
      : rangeHigh + strategy.invalidation.bufferPips * 0.0001;

  const observation = EurUsdLondonRangeBreakoutObservationSchema.parse({
    candidateId: `range-breakout:${hashCanonicalValue({
      strategyId: strategy.strategyId,
      strategyVersion: strategy.version,
      decisionTimestamp: input.decisionTimestamp,
      direction,
      evidenceIds
    }).slice("sha256:".length, 25)}`,
    decisionTimestamp: input.decisionTimestamp,
    direction,
    dataReady: rangeCandles.length === 4,
    rangeCompleted: true,
    rangeHigh,
    rangeLow,
    breakoutClose: decisionCandle.close,
    breakoutAgeCandles,
    eventContextStatus: input.eventContextStatus,
    minutesToNearestHighImpactEvent: input.minutesToNearestHighImpactEvent,
    invalidationPrice,
    sessionEnded: utcMinute(input.decisionTimestamp) >= strategy.expiry.sessionEndMinuteUtc,
    evidenceIds,
    availableAt: decisionCandle.closedAt
  });

  return {
    observation,
    diagnostics: {
      rangeCandleIds: rangeCandles.map((candle) => candle.candleId),
      breakoutCandleId: breakoutCandle.candleId,
      excludedFutureCandleCount
    }
  };
}

function utcMinute(timestamp: string): number {
  const date = new Date(timestamp);
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}
