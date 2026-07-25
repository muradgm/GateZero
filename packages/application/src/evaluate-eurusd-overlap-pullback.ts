import type {
  EurUsdOverlapPullbackObservation,
  EurUsdOverlapPullbackStrategy,
  StrategyCandidateAssessment,
  StrategyRuleResult
} from "@traderframe/contracts";

export const EURUSD_OVERLAP_PULLBACK_V1: EurUsdOverlapPullbackStrategy = {
  strategyId: "EURUSD_LN_NY_PULLBACK",
  version: "1.0.0",
  instrument: "EURUSD",
  directionMode: "BOTH",
  sourceTimeframe: "15m",
  contextTimeframes: ["1H", "4H"],
  observationEngineVersion: "eurusd-overlap-observation-v1",
  session: {
    timezone: "UTC",
    startMinuteUtc: 720,
    endMinuteUtc: 960
  },
  trend: {
    fastEmaPeriod: 20,
    slowEmaPeriod: 50,
    requireClosedHigherTimeframes: true
  },
  pullback: {
    atrPeriod: 14,
    minimumRetracementAtr: 0.25,
    maximumRetracementAtr: 1.25,
    maximumAgeCandles: 12
  },
  liquiditySweep: {
    swingLookbackCandles: 12,
    minimumPenetrationPips: 1,
    reclaimWithinCandles: 3,
    minimumDisplacementAtr: 0.5
  },
  trigger: {
    requireCloseBeyondTriggerLevel: true,
    maximumTriggerAgeCandles: 4
  },
  eventRestriction: {
    blockedCurrencies: ["EUR", "USD"],
    minimumMinutesBeforeHighImpactEvent: 30,
    minimumMinutesAfterHighImpactEvent: 15
  },
  invalidation: {
    mode: "BEYOND_SWEEP_EXTREME",
    bufferPips: 1
  },
  expiry: {
    maximumCandlesAfterTrigger: 4,
    expireAtSessionEnd: true
  }
};

export function evaluateEurUsdOverlapPullback(
  observation: EurUsdOverlapPullbackObservation,
  strategy: EurUsdOverlapPullbackStrategy = EURUSD_OVERLAP_PULLBACK_V1
): StrategyCandidateAssessment {
  const decisionMs = Date.parse(observation.decisionTimestamp);
  const availableMs = Date.parse(observation.availableAt);
  const temporalIntegrity = availableMs <= decisionMs;
  const pullbackQualified =
    observation.pullbackRetracementAtr >= strategy.pullback.minimumRetracementAtr &&
    observation.pullbackRetracementAtr <= strategy.pullback.maximumRetracementAtr &&
    observation.pullbackAgeCandles <= strategy.pullback.maximumAgeCandles;
  const sweepQualified =
    observation.liquiditySweepDetected &&
    observation.sweepPenetrationPips >= strategy.liquiditySweep.minimumPenetrationPips &&
    observation.sweepReclaimedWithinCandles <= strategy.liquiditySweep.reclaimWithinCandles &&
    observation.displacementAtr >= strategy.liquiditySweep.minimumDisplacementAtr;
  const triggerQualified = observation.triggerConfirmed && observation.triggerAgeCandles <= strategy.trigger.maximumTriggerAgeCandles;
  const eventClear = eventRestrictionPassed(observation.minutesToNearestHighImpactEvent, strategy);
  const invalidationDefined = observation.invalidationPrice !== undefined && observation.invalidationPrice !== observation.currentPrice;
  const expired = observation.sessionEnded || observation.candlesSinceTrigger > strategy.expiry.maximumCandlesAfterTrigger;

  const rules: StrategyRuleResult[] = [
    rule(
      "data-ready",
      "DATA_READY",
      observation.dataReady && temporalIntegrity ? "PASS" : "BLOCKED",
      `dataReady=${observation.dataReady}; availableAt=${observation.availableAt}`,
      "Validated data must be available no later than the decision timestamp.",
      temporalIntegrity ? "Validated market inputs are available at decision time." : "Observation includes information unavailable at decision time.",
      observation
    ),
    rule(
      "session-eligible",
      "SESSION_ELIGIBLE",
      observation.sessionEligible ? "PASS" : "FAIL",
      `sessionEligible=${observation.sessionEligible}`,
      `Decision time must fall inside ${formatMinute(strategy.session.startMinuteUtc)}–${formatMinute(strategy.session.endMinuteUtc)} UTC.`,
      observation.sessionEligible ? "Candidate is inside the eligible overlap window." : "Candidate is outside the eligible overlap window.",
      observation
    ),
    rule(
      "higher-timeframe-aligned",
      "HIGHER_TIMEFRAME_ALIGNED",
      observation.higherTimeframeAligned ? "PASS" : "FAIL",
      `aligned=${observation.higherTimeframeAligned}`,
      "Closed 1H and 4H context must align with the proposed direction.",
      observation.higherTimeframeAligned ? "Closed higher-timeframe context is aligned." : "Higher-timeframe context is not aligned.",
      observation
    ),
    rule(
      "pullback-qualified",
      "PULLBACK_QUALIFIED",
      pullbackQualified ? "PASS" : "FAIL",
      `${observation.pullbackRetracementAtr.toFixed(2)} ATR; age=${observation.pullbackAgeCandles}`,
      `Retracement must be ${strategy.pullback.minimumRetracementAtr}–${strategy.pullback.maximumRetracementAtr} ATR and no older than ${strategy.pullback.maximumAgeCandles} candles.`,
      pullbackQualified ? "Pullback depth and age are within the strategy boundary." : "Pullback depth or age is outside the strategy boundary.",
      observation
    ),
    rule(
      "liquidity-event-qualified",
      "LIQUIDITY_EVENT_QUALIFIED",
      sweepQualified ? "PASS" : "FAIL",
      `${observation.sweepPenetrationPips} pips; reclaim=${observation.sweepReclaimedWithinCandles}; displacement=${observation.displacementAtr.toFixed(2)} ATR`,
      `Sweep must penetrate by at least ${strategy.liquiditySweep.minimumPenetrationPips} pip, reclaim within ${strategy.liquiditySweep.reclaimWithinCandles} candles, and displace at least ${strategy.liquiditySweep.minimumDisplacementAtr} ATR.`,
      sweepQualified ? "Liquidity event satisfies the deterministic sweep rule." : "Liquidity event does not satisfy all sweep conditions.",
      observation
    ),
    rule(
      "trigger-confirmed",
      "TRIGGER_CONFIRMED",
      triggerQualified ? "PASS" : "FAIL",
      `confirmed=${observation.triggerConfirmed}; age=${observation.triggerAgeCandles}`,
      `A close-confirmed trigger must be no older than ${strategy.trigger.maximumTriggerAgeCandles} candles.`,
      triggerQualified ? "Entry trigger is confirmed and current." : "Entry trigger is absent or stale.",
      observation
    ),
    rule(
      "event-risk-clear",
      "EVENT_RISK_CLEAR",
      eventClear ? "PASS" : "FAIL",
      `nearestEventMinutes=${observation.minutesToNearestHighImpactEvent}`,
      `No EUR or USD high-impact event may occur within ${strategy.eventRestriction.minimumMinutesBeforeHighImpactEvent} minutes before or ${strategy.eventRestriction.minimumMinutesAfterHighImpactEvent} minutes after the decision.`,
      eventClear ? "High-impact event restriction is clear." : "High-impact EUR or USD event restriction blocks progression.",
      observation
    ),
    rule(
      "invalidation-defined",
      "INVALIDATION_DEFINED",
      invalidationDefined ? "PASS" : "BLOCKED",
      observation.invalidationPrice === undefined ? "missing" : String(observation.invalidationPrice),
      "A numeric invalidation beyond the sweep extreme must be defined and differ from current price.",
      invalidationDefined ? "Invalidation is explicit and observable." : "Invalidation is missing or unusable.",
      observation
    ),
    rule(
      "not-expired",
      "NOT_EXPIRED",
      expired ? "FAIL" : "PASS",
      `candlesSinceTrigger=${observation.candlesSinceTrigger}; sessionEnded=${observation.sessionEnded}`,
      `Candidate expires after ${strategy.expiry.maximumCandlesAfterTrigger} candles or at session end.`,
      expired ? "Candidate has expired." : "Candidate remains inside its validity window.",
      observation
    )
  ];

  const blockers = rules
    .filter((item) => item.status === "BLOCKED" || item.status === "FAIL")
    .map((item) => `${item.gate}: ${item.reason}`);
  const allPassed = rules.every((item) => item.status === "PASS");
  const hardReject = rules.some(
    (item) =>
      ["DATA_READY", "SESSION_ELIGIBLE", "INVALIDATION_DEFINED", "NOT_EXPIRED"].includes(item.gate) &&
      item.status !== "PASS"
  );
  const recommendation = allPassed ? "PAPER_SIMULATE" : hardReject ? "REJECT" : "WATCH";

  return {
    strategyId: strategy.strategyId,
    strategyVersion: strategy.version,
    candidateId: observation.candidateId,
    decisionTimestamp: observation.decisionTimestamp,
    eligible: allPassed,
    recommendation,
    blockers,
    nextAction: nextActionFor(recommendation, rules),
    ...(expired ? {} : { expiresAt: calculateExpiry(observation.decisionTimestamp, strategy.expiry.maximumCandlesAfterTrigger) }),
    ruleResults: rules
  };
}

function eventRestrictionPassed(minutes: number, strategy: EurUsdOverlapPullbackStrategy): boolean {
  if (minutes >= 0) return minutes > strategy.eventRestriction.minimumMinutesBeforeHighImpactEvent;
  return Math.abs(minutes) > strategy.eventRestriction.minimumMinutesAfterHighImpactEvent;
}

function rule(
  ruleId: string,
  gate: StrategyRuleResult["gate"],
  status: StrategyRuleResult["status"],
  observedValue: string,
  expectedCondition: string,
  reason: string,
  observation: EurUsdOverlapPullbackObservation
): StrategyRuleResult {
  return {
    ruleId,
    gate,
    status,
    observedValue,
    expectedCondition,
    reason,
    evidenceIds: observation.evidenceIds,
    availableAt: observation.availableAt
  };
}

function nextActionFor(recommendation: StrategyCandidateAssessment["recommendation"], rules: StrategyRuleResult[]): string {
  if (recommendation === "PAPER_SIMULATE") return "Submit the eligible setup to instrument-aware risk review.";
  if (recommendation === "REJECT") return "Close the candidate and preserve the failed gate reasons in the decision trace.";
  const first = rules.find((item) => item.status !== "PASS");
  return first ? `Wait for or resolve ${first.gate}: ${first.expectedCondition}` : "Continue evidence review.";
}

function calculateExpiry(decisionTimestamp: string, candles: number): string {
  return new Date(Date.parse(decisionTimestamp) + candles * 15 * 60 * 1000).toISOString();
}

function formatMinute(value: number): string {
  const hours = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (value % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
