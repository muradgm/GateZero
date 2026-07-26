import { createHash } from "node:crypto";
import type {
  CandidateDetection,
  CandidateScanResult,
  EurUsdOverlapPullbackObservation,
  EurUsdOverlapPullbackStrategy,
  NormalizedMarketCandle,
  TimeBoundMarketCandle
} from "@traderframe/contracts";
import {
  deriveEurUsdOverlapObservation,
  type DeriveEurUsdOverlapObservationInput,
  type DerivedEurUsdOverlapObservation
} from "./derive-eurusd-overlap-observation.js";
import { EURUSD_OVERLAP_PULLBACK_V1 } from "./evaluate-eurusd-overlap-pullback.js";

export type CandidateObservationFactory = (
  input: DeriveEurUsdOverlapObservationInput
) => DerivedEurUsdOverlapObservation;

export type DetectEurUsdOverlapCandidatesInput = {
  candles15m: NormalizedMarketCandle[];
  candles1H: TimeBoundMarketCandle[];
  candles4H: TimeBoundMarketCandle[];
  minutesToNearestHighImpactEvent?: (decisionTimestamp: string) => number;
  strategy?: EurUsdOverlapPullbackStrategy;
  observationFactory?: CandidateObservationFactory;
};

export function detectEurUsdOverlapCandidates(
  input: DetectEurUsdOverlapCandidatesInput
): CandidateScanResult {
  const strategy = input.strategy ?? EURUSD_OVERLAP_PULLBACK_V1;
  const deriveObservation = input.observationFactory ?? deriveEurUsdOverlapObservation;
  const candles15m = [...input.candles15m].sort(byClosedAt);
  if (candles15m.length === 0) throw new Error("candidate scan requires at least one validated 15m candle");

  const detections: CandidateDetection[] = [];
  const seenTriggers = new Set<string>();
  let excludedDuplicateTriggerCount = 0;
  let evaluatedDecisionPoints = 0;

  for (const decisionCandle of candles15m) {
    const decisionTimestamp = decisionCandle.closedAt;
    const decisionMs = Date.parse(decisionTimestamp);
    const eligible15m = candles15m.filter((candle) => Date.parse(candle.closedAt) <= decisionMs);
    const eligible1H = input.candles1H
      .filter((candle) => Date.parse(candle.availableAt) <= decisionMs)
      .sort(byAvailableAt);
    const eligible4H = input.candles4H
      .filter((candle) => Date.parse(candle.availableAt) <= decisionMs)
      .sort(byAvailableAt);

    evaluatedDecisionPoints += 1;
    const derived = deriveObservation({
      decisionTimestamp,
      candles15m: eligible15m,
      candles1H: eligible1H,
      candles4H: eligible4H,
      minutesToNearestHighImpactEvent:
        input.minutesToNearestHighImpactEvent?.(decisionTimestamp) ?? Number.POSITIVE_INFINITY,
      strategy
    });

    if (!isDetectionEligible(derived.observation, strategy)) continue;
    const triggerCandleId = derived.diagnostics.triggerCandleId;
    if (!triggerCandleId) continue;

    const triggerKey = `${derived.observation.direction}:${triggerCandleId}`;
    if (seenTriggers.has(triggerKey)) {
      excludedDuplicateTriggerCount += 1;
      continue;
    }
    seenTriggers.add(triggerKey);

    const sourceWindowHash = hashCanonical({
      strategyId: strategy.strategyId,
      strategyVersion: strategy.version,
      observationEngineVersion: strategy.observationEngineVersion,
      decisionTimestamp,
      direction: derived.observation.direction,
      source15m: eligible15m.map((candle) => candle.sourceHash),
      source1H: eligible1H.map((candle) => candle.sourceHash),
      source4H: eligible4H.map((candle) => candle.sourceHash),
      evidenceIds: [...derived.observation.evidenceIds].sort()
    });

    detections.push({
      candidateId: hashCanonical({
        strategyId: strategy.strategyId,
        strategyVersion: strategy.version,
        triggerKey,
        sourceWindowHash
      }),
      strategyId: strategy.strategyId,
      strategyVersion: strategy.version,
      observationEngineVersion: strategy.observationEngineVersion,
      instrument: "EURUSD",
      sourceTimeframe: "15m",
      direction: derived.observation.direction,
      detectedAt: decisionTimestamp,
      availableAt: derived.observation.availableAt,
      triggerCandleId,
      ...(derived.diagnostics.sweepCandleId
        ? { sweepCandleId: derived.diagnostics.sweepCandleId }
        : {}),
      sourceWindowHash,
      evidenceIds: [...derived.observation.evidenceIds].sort(),
      matchedConditions: [
        "DATA_READY",
        "SESSION_ELIGIBLE",
        "PULLBACK_PRESENT",
        "LIQUIDITY_SWEEP_DETECTED",
        "TRIGGER_CONFIRMED"
      ]
    });
  }

  return {
    strategyId: strategy.strategyId,
    strategyVersion: strategy.version,
    observationEngineVersion: strategy.observationEngineVersion,
    instrument: "EURUSD",
    scannedFrom: candles15m[0].openedAt,
    scannedThrough: candles15m.at(-1)!.closedAt,
    sourceCandleCount: candles15m.length,
    evaluatedDecisionPoints,
    detections,
    excludedDuplicateTriggerCount
  };
}

function isDetectionEligible(
  observation: EurUsdOverlapPullbackObservation,
  strategy: EurUsdOverlapPullbackStrategy
): boolean {
  const pullbackPresent =
    observation.pullbackRetracementAtr >= strategy.pullback.minimumRetracementAtr &&
    observation.pullbackRetracementAtr <= strategy.pullback.maximumRetracementAtr &&
    observation.pullbackAgeCandles <= strategy.pullback.maximumAgeCandles;

  return (
    observation.dataReady &&
    observation.sessionEligible &&
    pullbackPresent &&
    observation.liquiditySweepDetected &&
    observation.triggerConfirmed &&
    Date.parse(observation.availableAt) <= Date.parse(observation.decisionTimestamp)
  );
}

function hashCanonical(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function byClosedAt(left: NormalizedMarketCandle, right: NormalizedMarketCandle): number {
  return Date.parse(left.closedAt) - Date.parse(right.closedAt);
}

function byAvailableAt(left: TimeBoundMarketCandle, right: TimeBoundMarketCandle): number {
  return Date.parse(left.availableAt) - Date.parse(right.availableAt);
}
