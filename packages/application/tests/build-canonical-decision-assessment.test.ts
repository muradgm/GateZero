import { describe, expect, it } from "vitest";
import { buildCanonicalDecisionAssessment } from "../src/index.js";

const base = {
  candidateId: "eurusd-case-001",
  decisionTimestamp: "2026-07-24T13:00:00.000Z",
  direction: "LONG" as const,
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
  minutesToNearestHighImpactEvent: 90,
  invalidationPrice: 1.081,
  currentPrice: 1.0835,
  candlesSinceTrigger: 1,
  sessionEnded: false,
  evidenceIds: ["ev-15m-001", "ev-1h-001", "ev-4h-001"],
  availableAt: "2026-07-24T13:00:00.000Z"
};

describe("buildCanonicalDecisionAssessment", () => {
  it("owns the eligible recommendation and next action", () => {
    const result = buildCanonicalDecisionAssessment(base);

    expect(result.lifecycleState).toBe("READY_FOR_RISK_REVIEW");
    expect(result.recommendation).toBe("PAPER_SIMULATE");
    expect(result.eligible).toBe(true);
    expect(result.blockers).toEqual([]);
    expect(result.passedGates).toHaveLength(9);
    expect(result.nextAction).toContain("risk review");
  });

  it("projects unresolved conditions into structured blockers", () => {
    const result = buildCanonicalDecisionAssessment({
      ...base,
      minutesToNearestHighImpactEvent: 20
    });

    expect(result.lifecycleState).toBe("AWAITING_CONDITIONS");
    expect(result.recommendation).toBe("WATCH");
    expect(result.failedGates).toContain("EVENT_RISK_CLEAR");
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "EVENT_RISK_CLEAR",
          severity: "CONDITIONAL"
        })
      ])
    );
  });

  it("marks hard failed gates as rejected", () => {
    const result = buildCanonicalDecisionAssessment({
      ...base,
      candlesSinceTrigger: 5
    });

    expect(result.lifecycleState).toBe("REJECTED");
    expect(result.recommendation).toBe("REJECT");
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gate: "NOT_EXPIRED", severity: "HARD" })
      ])
    );
  });

  it("is deterministic for identical inputs", () => {
    const first = buildCanonicalDecisionAssessment(base);
    const second = buildCanonicalDecisionAssessment(base);

    expect(second).toEqual(first);
    expect(second.assessmentId).toBe(first.assessmentId);
  });

  it("does not introduce score or confidence fields", () => {
    const result = buildCanonicalDecisionAssessment(base);

    expect(result).not.toHaveProperty("score");
    expect(result).not.toHaveProperty("confidence");
  });
});
