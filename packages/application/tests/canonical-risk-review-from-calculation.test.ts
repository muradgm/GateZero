import { describe, expect, it } from "vitest";
import type {
  EurUsdOverlapPullbackObservation,
  EurUsdRiskPolicy,
  HistoricalCandidateEvaluation,
  HistoricalRiskSourceLineage
} from "@traderframe/contracts";
import {
  assertLocalSimulationRiskEligibility,
  buildCanonicalDecisionAssessment,
  calculateEurUsdRisk,
  createCanonicalRiskReviewFromCalculation
} from "../src/index.js";

const observation: EurUsdOverlapPullbackObservation = {
  candidateId: "eurusd-risk-review-candidate",
  decisionTimestamp: "2026-07-24T13:00:00.000Z",
  direction: "LONG",
  dataReady: true,
  sessionEligible: true,
  higherTimeframeAligned: true,
  pullbackRetracementAtr: 0.65,
  pullbackAgeCandles: 4,
  liquiditySweepDetected: true,
  sweepPenetrationPips: 2,
  sweepReclaimedWithinCandles: 2,
  displacementAtr: 0.8,
  triggerConfirmed: true,
  triggerAgeCandles: 1,
  eventContextStatus: "AVAILABLE",
  minutesToNearestHighImpactEvent: 90,
  invalidationPrice: 1.081,
  currentPrice: 1.0835,
  candlesSinceTrigger: 1,
  sessionEnded: false,
  evidenceIds: ["risk-review-15m", "risk-review-1h", "risk-review-4h"],
  availableAt: "2026-07-24T13:00:00.000Z"
};
const assessment = buildCanonicalDecisionAssessment(observation);
const evaluation: HistoricalCandidateEvaluation = {
  detection: {
    candidateId: observation.candidateId,
    strategyId: "EURUSD_LN_NY_PULLBACK",
    strategyVersion: "1.0.0",
    observationEngineVersion: "eurusd-overlap-observation-v1",
    instrument: "EURUSD",
    sourceTimeframe: "15m",
    direction: "LONG",
    detectedAt: observation.decisionTimestamp,
    availableAt: observation.availableAt,
    triggerCandleId: "risk-review-trigger",
    sweepCandleId: "risk-review-sweep",
    sourceWindowHash: "a".repeat(64),
    evidenceIds: [...observation.evidenceIds],
    matchedConditions: ["DATA_READY", "TRIGGER_CONFIRMED"]
  },
  observation,
  assessment
};
const sourceLineage: HistoricalRiskSourceLineage = {
  historicalRunId: "historical-ingestion-aaaaaaaaaaaaaaaaaaaaaaaa",
  datasetId: "risk-review-dataset",
  rawDataHash: "a".repeat(64),
  normalized15mHash: "b".repeat(64),
  aggregated1HHash: "c".repeat(64),
  aggregated4HHash: "d".repeat(64),
  ingestionConfigurationHash: "e".repeat(64)
};

function policy(minimumPositionUnits = 1_000): EurUsdRiskPolicy {
  return {
    schemaVersion: 1,
    policyId: "risk-review-policy",
    policyVersion: "1.0.0",
    accountCurrency: "USD",
    accountEquity: 10_000,
    maximumRiskPct: 0.5,
    pipSize: 0.0001,
    pipValuePolicy: { mode: "QUOTE_CURRENCY" },
    spreadPips: 0.8,
    entrySlippagePips: 0.2,
    stopSlippagePips: 0.2,
    commissionModel: { mode: "FIXED_ACCOUNT_CURRENCY", amount: 4 },
    unitIncrement: 1_000,
    minimumPositionUnits,
    maximumPositionUnits: 100_000,
    assumptions: ["Local deterministic paper simulation only."]
  };
}

describe("createCanonicalRiskReviewFromCalculation", () => {
  it("creates an operator-approved review linked to deterministic risk", () => {
    const calculation = calculateEurUsdRisk({ evaluation, sourceLineage, policy: policy() });
    const review = createCanonicalRiskReviewFromCalculation({
      riskReviewId: "risk-review-from-calculation",
      assessment,
      calculation,
      reviewDecision: "APPROVE",
      portfolioExposurePctAfterEntry: 12,
      reviewedBy: "operator-risk-reviewer",
      reviewedAt: "2026-07-24T13:05:00.000Z",
      validUntil: "2026-07-24T14:00:00.000Z"
    });

    expect(review.riskCalculationId).toBe(calculation.riskCalculationId);
    expect(review.riskCalculationHash).toBe(calculation.calculationHash);
    expect(review.positionSizeUnits).toBe(calculation.positionSizeUnits);
    expect(review.maximumRiskAmount).toBe(calculation.riskBudgetAmount);
    expect(() =>
      assertLocalSimulationRiskEligibility({
        assessment,
        riskReview: review,
        simulationTimestamp: "2026-07-24T13:30:00.000Z"
      })
    ).not.toThrow();
  });

  it("prevents operator approval when the calculated risk gate is blocked", () => {
    const calculation = calculateEurUsdRisk({
      evaluation,
      sourceLineage,
      policy: policy(20_000)
    });

    expect(calculation.riskGate).toBe("BLOCKED");
    expect(() =>
      createCanonicalRiskReviewFromCalculation({
        riskReviewId: "risk-review-blocked-calculation",
        assessment,
        calculation,
        reviewDecision: "APPROVE",
        portfolioExposurePctAfterEntry: 12,
        reviewedBy: "operator-risk-reviewer",
        reviewedAt: "2026-07-24T13:05:00.000Z",
        validUntil: "2026-07-24T14:00:00.000Z"
      })
    ).toThrow(/cannot be approved/);
  });

  it("rejects a structurally valid risk calculation after its content is altered", () => {
    const calculation = calculateEurUsdRisk({ evaluation, sourceLineage, policy: policy() });

    expect(() =>
      createCanonicalRiskReviewFromCalculation({
        riskReviewId: "risk-review-altered-calculation",
        assessment,
        calculation: { ...calculation, positionSizeUnits: 99_000 },
        reviewDecision: "APPROVE",
        portfolioExposurePctAfterEntry: 12,
        reviewedBy: "operator-risk-reviewer",
        reviewedAt: "2026-07-24T13:05:00.000Z",
        validUntil: "2026-07-24T14:00:00.000Z"
      })
    ).toThrow(/calculated risk content hash mismatch/);
  });
});
