import type {
  EurUsdLondonRangeBreakoutObservation,
  EurUsdLondonRangeBreakoutStrategy,
  LondonRangeBreakoutAssessment,
  StrategyRuleResult
} from "@traderframe/contracts";

export const EURUSD_LONDON_RANGE_BREAKOUT_V1: EurUsdLondonRangeBreakoutStrategy = {
  strategyId: "EURUSD_LONDON_RANGE_BREAKOUT",
  version: "1.0.0",
  instrument: "EURUSD",
  sourceTimeframe: "15m",
  observationEngineVersion: "eurusd-london-range-observation-v1",
  range: {
    timezone: "UTC",
    startMinuteUtc: 420,
    endMinuteUtc: 480,
    minimumRangePips: 8,
    maximumRangePips: 45
  },
  breakout: {
    minimumCloseBeyondRangePips: 1,
    maximumAgeCandles: 3
  },
  eventRestriction: {
    blockedCurrencies: ["EUR", "USD"],
    minimumMinutesBeforeHighImpactEvent: 30,
    minimumMinutesAfterHighImpactEvent: 15
  },
  invalidation: {
    mode: "OPPOSITE_RANGE_BOUNDARY",
    bufferPips: 1
  },
  expiry: {
    maximumCandlesAfterBreakout: 4,
    sessionEndMinuteUtc: 720
  }
};

export function evaluateEurUsdLondonRangeBreakout(
  observation: EurUsdLondonRangeBreakoutObservation,
  strategy: EurUsdLondonRangeBreakoutStrategy = EURUSD_LONDON_RANGE_BREAKOUT_V1
): LondonRangeBreakoutAssessment {
  const temporalIntegrity =
    Date.parse(observation.availableAt) <= Date.parse(observation.decisionTimestamp);
  const rangePips = (observation.rangeHigh - observation.rangeLow) / 0.0001;
  const rangeQualified =
    observation.rangeCompleted &&
    rangePips >= strategy.range.minimumRangePips &&
    rangePips <= strategy.range.maximumRangePips;
  const breakoutDistancePips =
    observation.direction === "LONG"
      ? (observation.breakoutClose - observation.rangeHigh) / 0.0001
      : (observation.rangeLow - observation.breakoutClose) / 0.0001;
  const breakoutQualified =
    breakoutDistancePips >= strategy.breakout.minimumCloseBeyondRangePips &&
    observation.breakoutAgeCandles <= strategy.breakout.maximumAgeCandles;
  const eventClear =
    observation.eventContextStatus === "AVAILABLE" &&
    eventRestrictionPassed(observation.minutesToNearestHighImpactEvent, strategy);
  const expectedInvalidation =
    observation.direction === "LONG"
      ? observation.rangeLow - strategy.invalidation.bufferPips * 0.0001
      : observation.rangeHigh + strategy.invalidation.bufferPips * 0.0001;
  const invalidationDefined =
    observation.invalidationPrice !== undefined &&
    Math.abs(observation.invalidationPrice - expectedInvalidation) < 0.000001;
  const expired =
    observation.sessionEnded ||
    observation.breakoutAgeCandles > strategy.expiry.maximumCandlesAfterBreakout;

  const rules: StrategyRuleResult[] = [
    rule(
      "data-ready",
      "DATA_READY",
      observation.dataReady && temporalIntegrity ? "PASS" : "BLOCKED",
      `dataReady=${observation.dataReady}; availableAt=${observation.availableAt}`,
      "Closed source candles must be available no later than decision time.",
      temporalIntegrity
        ? "Validated range inputs are available at decision time."
        : "Range evidence includes information unavailable at decision time.",
      observation
    ),
    rule(
      "session-eligible",
      "SESSION_ELIGIBLE",
      observation.rangeCompleted && !observation.sessionEnded ? "PASS" : "FAIL",
      `rangeCompleted=${observation.rangeCompleted}; sessionEnded=${observation.sessionEnded}`,
      "The fixed London range must be closed and the research session must remain open.",
      observation.rangeCompleted && !observation.sessionEnded
        ? "The completed range is eligible for breakout review."
        : "The range is incomplete or the research session has ended.",
      observation
    ),
    rule(
      "range-established",
      "RANGE_ESTABLISHED",
      rangeQualified ? "PASS" : "FAIL",
      `${rangePips.toFixed(1)} pips`,
      `Completed range width must be ${strategy.range.minimumRangePips}-${strategy.range.maximumRangePips} pips.`,
      rangeQualified
        ? "The completed range width is inside the declared strategy boundary."
        : "The range is incomplete or outside its declared width boundary.",
      observation
    ),
    rule(
      "breakout-confirmed",
      "BREAKOUT_CONFIRMED",
      breakoutQualified ? "PASS" : "FAIL",
      `${breakoutDistancePips.toFixed(1)} pips; age=${observation.breakoutAgeCandles}`,
      `A closed candle must finish at least ${strategy.breakout.minimumCloseBeyondRangePips} pip beyond the range and be no older than ${strategy.breakout.maximumAgeCandles} candles.`,
      breakoutQualified
        ? "The closed breakout and age satisfy the deterministic rule."
        : "The breakout close or age does not satisfy the rule.",
      observation
    ),
    rule(
      "event-risk-clear",
      "EVENT_RISK_CLEAR",
      observation.eventContextStatus === "UNAVAILABLE" ? "BLOCKED" : eventClear ? "PASS" : "FAIL",
      observation.eventContextStatus === "UNAVAILABLE"
        ? "eventContext=unavailable"
        : `nearestEventMinutes=${observation.minutesToNearestHighImpactEvent}`,
      `No EUR or USD high-impact event may occur within ${strategy.eventRestriction.minimumMinutesBeforeHighImpactEvent} minutes before or ${strategy.eventRestriction.minimumMinutesAfterHighImpactEvent} minutes after the decision.`,
      observation.eventContextStatus === "UNAVAILABLE"
        ? "High-impact event context is unavailable."
        : eventClear
          ? "The declared high-impact event restriction is clear."
          : "Event timing blocks progression.",
      observation
    ),
    rule(
      "invalidation-defined",
      "INVALIDATION_DEFINED",
      invalidationDefined ? "PASS" : "BLOCKED",
      observation.invalidationPrice === undefined
        ? "missing"
        : observation.invalidationPrice.toFixed(5),
      `Invalidation must equal the opposite range boundary plus the fixed ${strategy.invalidation.bufferPips} pip buffer.`,
      invalidationDefined
        ? "Invalidation matches the deterministic opposite-boundary rule."
        : "Invalidation is missing or does not match the declared rule.",
      observation
    ),
    rule(
      "not-expired",
      "NOT_EXPIRED",
      expired ? "FAIL" : "PASS",
      `breakoutAge=${observation.breakoutAgeCandles}; sessionEnded=${observation.sessionEnded}`,
      `The candidate expires after ${strategy.expiry.maximumCandlesAfterBreakout} candles or at session end.`,
      expired ? "The range-breakout candidate has expired." : "The candidate remains current.",
      observation
    )
  ];

  const blockers = rules
    .filter((item) => item.status !== "PASS")
    .map((item) => `${item.gate}: ${item.reason}`);
  const allPassed = rules.every((item) => item.status === "PASS");
  const hardReject = rules.some(
    (item) =>
      ["DATA_READY", "SESSION_ELIGIBLE", "INVALIDATION_DEFINED", "NOT_EXPIRED"].includes(
        item.gate
      ) && item.status !== "PASS"
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
    nextAction:
      recommendation === "PAPER_SIMULATE"
        ? "Submit the eligible setup to instrument-aware risk review."
        : recommendation === "REJECT"
          ? "Close the candidate and preserve the failed range-breakout gates."
          : `Wait for or resolve ${rules.find((item) => item.status !== "PASS")?.gate ?? "the blocked gate"}.`,
    ...(expired
      ? {}
      : {
          expiresAt: new Date(
            Date.parse(observation.decisionTimestamp) +
              strategy.expiry.maximumCandlesAfterBreakout * 15 * 60 * 1000
          ).toISOString()
        }),
    ruleResults: rules
  };
}

function eventRestrictionPassed(
  minutes: number,
  strategy: EurUsdLondonRangeBreakoutStrategy
): boolean {
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
  observation: EurUsdLondonRangeBreakoutObservation
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
