import { createHash } from "node:crypto";
import type {
  CanonicalBlocker,
  CanonicalDecisionAssessment,
  EurUsdOverlapPullbackObservation,
  EurUsdOverlapPullbackStrategy,
  StrategyCandidateAssessment,
  StrategyRuleResult
} from "@traderframe/contracts";
import { CanonicalDecisionAssessmentSchema } from "@traderframe/contracts";
import {
  EURUSD_OVERLAP_PULLBACK_V1,
  evaluateEurUsdOverlapPullback
} from "./evaluate-eurusd-overlap-pullback.js";

const HARD_GATES = new Set<StrategyRuleResult["gate"]>([
  "DATA_READY",
  "SESSION_ELIGIBLE",
  "INVALIDATION_DEFINED",
  "NOT_EXPIRED"
]);

export function buildCanonicalDecisionAssessment(
  observation: EurUsdOverlapPullbackObservation,
  strategy: EurUsdOverlapPullbackStrategy = EURUSD_OVERLAP_PULLBACK_V1
): CanonicalDecisionAssessment {
  const evaluated = evaluateEurUsdOverlapPullback(observation, strategy);
  return buildCanonicalAssessmentFromEvaluation({
    candidateId: observation.candidateId,
    instrument: "EURUSD",
    strategyId: strategy.strategyId,
    strategyVersion: strategy.version,
    observationEngineVersion: strategy.observationEngineVersion,
    decisionTimestamp: observation.decisionTimestamp,
    availableAt: observation.availableAt,
    evaluated
  });
}

export function buildCanonicalAssessmentFromEvaluation(input: {
  readonly candidateId: string;
  readonly instrument: "EURUSD";
  readonly strategyId: CanonicalDecisionAssessment["strategyId"];
  readonly strategyVersion: "1.0.0";
  readonly observationEngineVersion: string;
  readonly decisionTimestamp: string;
  readonly availableAt: string;
  readonly evaluated: StrategyCandidateAssessment;
}): CanonicalDecisionAssessment {
  const evaluated = input.evaluated;
  const failedRules = evaluated.ruleResults.filter((rule) => rule.status !== "PASS");
  const blockers: CanonicalBlocker[] = failedRules.map((rule) => ({
    blockerId: `${input.candidateId}:${rule.ruleId}`,
    gate: rule.gate,
    severity: HARD_GATES.has(rule.gate) || rule.status === "BLOCKED" ? "HARD" : "CONDITIONAL",
    reason: rule.reason,
    requiredResolution: rule.expectedCondition,
    evidenceIds: [...rule.evidenceIds],
    availableAt: rule.availableAt
  }));

  const lifecycleState =
    evaluated.recommendation === "REJECT"
      ? "REJECTED"
      : evaluated.recommendation === "PAPER_SIMULATE"
        ? "READY_FOR_RISK_REVIEW"
        : "AWAITING_CONDITIONS";

  const canonicalPayload = {
    candidateId: input.candidateId,
    strategyId: input.strategyId,
    strategyVersion: input.strategyVersion,
    observationEngineVersion: input.observationEngineVersion,
    decisionTimestamp: input.decisionTimestamp,
    availableAt: input.availableAt,
    recommendation: evaluated.recommendation,
    ruleResults: evaluated.ruleResults.map((rule) => ({
      ruleId: rule.ruleId,
      gate: rule.gate,
      status: rule.status,
      observedValue: rule.observedValue,
      expectedCondition: rule.expectedCondition,
      reason: rule.reason,
      evidenceIds: [...rule.evidenceIds].sort(),
      availableAt: rule.availableAt
    }))
  };

  return CanonicalDecisionAssessmentSchema.parse({
    schemaVersion: 1,
    assessmentId: `assessment-${createHash("sha256").update(JSON.stringify(canonicalPayload)).digest("hex").slice(0, 24)}`,
    candidateId: input.candidateId,
    instrument: input.instrument,
    strategyId: input.strategyId,
    strategyVersion: input.strategyVersion,
    observationEngineVersion: input.observationEngineVersion,
    decisionTimestamp: input.decisionTimestamp,
    availableAt: input.availableAt,
    lifecycleState,
    eligible: evaluated.eligible,
    recommendation: evaluated.recommendation,
    blockers,
    passedGates: evaluated.ruleResults
      .filter((rule) => rule.status === "PASS")
      .map((rule) => rule.gate),
    failedGates: failedRules.map((rule) => rule.gate),
    nextAction: evaluated.nextAction,
    ...(evaluated.expiresAt ? { expiresAt: evaluated.expiresAt } : {}),
    ruleResults: evaluated.ruleResults
  });
}
