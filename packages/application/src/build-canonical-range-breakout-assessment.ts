import type {
  CanonicalDecisionAssessment,
  EurUsdLondonRangeBreakoutObservation,
  EurUsdLondonRangeBreakoutStrategy
} from "@traderframe/contracts";
import { buildCanonicalAssessmentFromEvaluation } from "./build-canonical-decision-assessment.js";
import {
  EURUSD_LONDON_RANGE_BREAKOUT_V1,
  evaluateEurUsdLondonRangeBreakout
} from "./evaluate-eurusd-london-range-breakout.js";

export function buildCanonicalRangeBreakoutAssessment(
  observation: EurUsdLondonRangeBreakoutObservation,
  strategy: EurUsdLondonRangeBreakoutStrategy = EURUSD_LONDON_RANGE_BREAKOUT_V1
): CanonicalDecisionAssessment {
  return buildCanonicalAssessmentFromEvaluation({
    candidateId: observation.candidateId,
    instrument: "EURUSD",
    strategyId: strategy.strategyId,
    strategyVersion: strategy.version,
    observationEngineVersion: strategy.observationEngineVersion,
    decisionTimestamp: observation.decisionTimestamp,
    availableAt: observation.availableAt,
    evaluated: evaluateEurUsdLondonRangeBreakout(observation, strategy)
  });
}
