import { describe, expect, it } from "vitest";
import {
  assertLocalSimulationRiskEligibility,
  buildCanonicalDecisionAssessment,
  createCanonicalRiskReview
} from "../src/index.js";

const assessment = buildCanonicalDecisionAssessment({
  candidateId: "eurusd-case-risk-001",
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
  evidenceIds: ["ev-15m-risk", "ev-1h-risk", "ev-4h-risk"],
  availableAt: "2026-07-24T13:00:00.000Z"
});

function approvedRiskReview() {
  return createCanonicalRiskReview({
    riskReviewId: "risk-review-canonical-001",
    assessment,
    riskEngineVersion: "risk-engine-1.0.0",
    reviewStatus: "APPROVED_FOR_LOCAL_SIMULATION",
    maximumRiskPct: 0.5,
    maximumRiskAmount: 50,
    positionSizeUnits: 10_000,
    portfolioExposurePctAfterEntry: 12,
    spreadPips: 0.8,
    commissionAmount: 4,
    slippagePips: 0.2,
    assumptions: ["Local deterministic paper simulation only."],
    blockers: [],
    reviewedBy: "operator-risk-reviewer",
    reviewedAt: "2026-07-24T13:05:00.000Z",
    validUntil: "2026-07-24T14:00:00.000Z"
  });
}

describe("canonical risk review", () => {
  it("creates a hash-linked review and admits a matching local simulation", () => {
    const review = approvedRiskReview();

    expect(review.canonicalAssessmentHash).toMatch(/^sha256:/);
    expect(review.reviewHash).toMatch(/^sha256:/);
    expect(() =>
      assertLocalSimulationRiskEligibility({
        assessment,
        riskReview: review,
        simulationTimestamp: "2026-07-24T13:30:00.000Z"
      })
    ).not.toThrow();
  });

  it("rejects a tampered risk review", () => {
    const review = { ...approvedRiskReview(), maximumRiskAmount: 500 };

    expect(() =>
      assertLocalSimulationRiskEligibility({
        assessment,
        riskReview: review,
        simulationTimestamp: "2026-07-24T13:30:00.000Z"
      })
    ).toThrow(/content hash mismatch/);
  });

  it("rejects a review linked to a different assessment", () => {
    const review = { ...approvedRiskReview(), assessmentId: "assessment-other" };

    expect(() =>
      assertLocalSimulationRiskEligibility({
        assessment,
        riskReview: review,
        simulationTimestamp: "2026-07-24T13:30:00.000Z"
      })
    ).toThrow(/does not match/);
  });

  it("rejects stale risk evidence", () => {
    expect(() =>
      assertLocalSimulationRiskEligibility({
        assessment,
        riskReview: approvedRiskReview(),
        simulationTimestamp: "2026-07-24T14:00:01.000Z"
      })
    ).toThrow(/stale/);
  });

  it("requires blockers when the review is not approved", () => {
    expect(() =>
      createCanonicalRiskReview({
        riskReviewId: "risk-review-blocked-001",
        assessment,
        riskEngineVersion: "risk-engine-1.0.0",
        reviewStatus: "BLOCKED",
        maximumRiskPct: 0.5,
        maximumRiskAmount: 50,
        positionSizeUnits: 0,
        portfolioExposurePctAfterEntry: 0,
        spreadPips: 0.8,
        commissionAmount: 4,
        slippagePips: 0.2,
        assumptions: ["Local deterministic paper simulation only."],
        blockers: [],
        reviewedBy: "operator-risk-reviewer",
        reviewedAt: "2026-07-24T13:05:00.000Z",
        validUntil: "2026-07-24T14:00:00.000Z"
      })
    ).toThrow(/require blockers/);
  });
});
