import { describe, expect, it } from "vitest";
import type {
  CandidateDetection,
  EurUsdOverlapPullbackObservation,
  NormalizedMarketCandle
} from "@traderframe/contracts";
import { detectEurUsdOverlapCandidates, type CandidateObservationFactory } from "../src/index.js";

function candle(index: number): NormalizedMarketCandle {
  const openedAt = new Date(Date.UTC(2026, 6, 24, 12, index * 15)).toISOString();
  const closedAt = new Date(Date.UTC(2026, 6, 24, 12, (index + 1) * 15)).toISOString();
  return {
    candleId: `c-${index}`,
    sourceId: "fixture",
    instrument: "EURUSD",
    timeframe: "15m",
    openedAt,
    closedAt,
    timezone: "UTC",
    open: 1.08,
    high: 1.081,
    low: 1.079,
    close: 1.0805,
    finalized: true,
    sourceHash: `hash-${index}`,
    normalizationVersion: "test-v1"
  };
}

function observationFactory(
  triggerAtIndex: number,
  triggerCandleId = "trigger-1"
): CandidateObservationFactory {
  return (input) => {
    const currentIndex = input.candles15m.length - 1;
    const detected = currentIndex >= triggerAtIndex;
    const observation: EurUsdOverlapPullbackObservation = {
      candidateId: `observation-${currentIndex}`,
      decisionTimestamp: input.decisionTimestamp,
      direction: "LONG",
      dataReady: true,
      sessionEligible: true,
      higherTimeframeAligned: true,
      pullbackRetracementAtr: 0.5,
      pullbackAgeCandles: 2,
      liquiditySweepDetected: detected,
      sweepPenetrationPips: detected ? 2 : 0,
      sweepReclaimedWithinCandles: detected ? 1 : 4,
      displacementAtr: detected ? 0.8 : 0,
      triggerConfirmed: detected,
      triggerAgeCandles: detected ? currentIndex - triggerAtIndex : 5,
      eventContextStatus: "AVAILABLE",
      minutesToNearestHighImpactEvent: 90,
      invalidationPrice: 1.079,
      currentPrice: 1.0805,
      candlesSinceTrigger: detected ? currentIndex - triggerAtIndex : 0,
      sessionEnded: false,
      evidenceIds: [`evidence-${currentIndex}`],
      availableAt: input.decisionTimestamp
    };

    return {
      observation,
      diagnostics: {
        observationEngineVersion: "eurusd-overlap-observation-v1",
        atr: 0.001,
        ema1H: { fast: 1.08, slow: 1.07 },
        ema4H: { fast: 1.08, slow: 1.07 },
        ...(detected ? { sweepCandleId: "sweep-1", triggerCandleId } : {}),
        excludedFutureCandleIds: [],
        reasons: []
      }
    };
  };
}

function requireSingleDetection(detections: CandidateDetection[]): CandidateDetection {
  const detection = detections.at(0);
  if (!detection) throw new Error("expected one candidate detection");
  return detection;
}

describe("detectEurUsdOverlapCandidates", () => {
  it("scans decision points chronologically without exposing future 15m candles", () => {
    const candles = [candle(0), candle(1), candle(2), candle(3)];
    const observedWindowSizes: number[] = [];
    const baseFactory = observationFactory(2);
    const factory: CandidateObservationFactory = (input) => {
      observedWindowSizes.push(input.candles15m.length);
      expect(
        input.candles15m.every(
          (item) => Date.parse(item.closedAt) <= Date.parse(input.decisionTimestamp)
        )
      ).toBe(true);
      return baseFactory(input);
    };

    const result = detectEurUsdOverlapCandidates({
      candles15m: [...candles].reverse(),
      candles1H: [],
      candles4H: [],
      observationFactory: factory
    });
    const detection = requireSingleDetection(result.detections);
    const triggerCandle = candles.at(2);
    if (!triggerCandle) throw new Error("expected trigger candle fixture");

    expect(observedWindowSizes).toEqual([1, 2, 3, 4]);
    expect(result.evaluatedDecisionPoints).toBe(4);
    expect(result.detections).toHaveLength(1);
    expect(detection.detectedAt).toBe(triggerCandle.closedAt);
  });

  it("deduplicates repeated observations of the same directional trigger", () => {
    const result = detectEurUsdOverlapCandidates({
      candles15m: [candle(0), candle(1), candle(2), candle(3), candle(4)],
      candles1H: [],
      candles4H: [],
      observationFactory: observationFactory(1, "shared-trigger")
    });
    const detection = requireSingleDetection(result.detections);

    expect(result.detections).toHaveLength(1);
    expect(result.excludedDuplicateTriggerCount).toBe(3);
    expect(detection.triggerCandleId).toBe("shared-trigger");
  });

  it("produces deterministic candidate and source-window hashes for identical inputs", () => {
    const input = {
      candles15m: [candle(0), candle(1), candle(2)],
      candles1H: [],
      candles4H: [],
      observationFactory: observationFactory(2)
    };

    const first = detectEurUsdOverlapCandidates(input);
    const second = detectEurUsdOverlapCandidates(input);
    const detection = requireSingleDetection(first.detections);

    expect(second).toEqual(first);
    expect(detection.candidateId).toHaveLength(64);
    expect(detection.sourceWindowHash).toHaveLength(64);
  });

  it("does not duplicate recommendation or confidence ownership", () => {
    const result = detectEurUsdOverlapCandidates({
      candles15m: [candle(0), candle(1), candle(2)],
      candles1H: [],
      candles4H: [],
      observationFactory: observationFactory(2)
    });
    const detection = requireSingleDetection(result.detections);

    expect(detection).not.toHaveProperty("recommendation");
    expect(detection).not.toHaveProperty("confidence");
    expect(detection).not.toHaveProperty("score");
  });

  it("marks missing event context unavailable instead of treating it as clear", () => {
    const observedStatuses: string[] = [];
    const baseFactory = observationFactory(2);
    const factory: CandidateObservationFactory = (input) => {
      observedStatuses.push(input.eventContextStatus);
      expect(input.minutesToNearestHighImpactEvent).toBe(0);
      return baseFactory(input);
    };

    detectEurUsdOverlapCandidates({
      candles15m: [candle(0), candle(1), candle(2)],
      candles1H: [],
      candles4H: [],
      observationFactory: factory
    });

    expect(observedStatuses).toEqual(["UNAVAILABLE", "UNAVAILABLE", "UNAVAILABLE"]);
  });

  it("rejects malformed event-context distances", () => {
    expect(() =>
      detectEurUsdOverlapCandidates({
        candles15m: [candle(0)],
        candles1H: [],
        candles4H: [],
        minutesToNearestHighImpactEvent: () => Number.POSITIVE_INFINITY,
        observationFactory: observationFactory(0)
      })
    ).toThrow("finite integer");
  });
});
