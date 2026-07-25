import { describe, expect, it } from "vitest";
import {
  EURUSD_OVERLAP_PULLBACK_V1,
  evaluateEurUsdOverlapPullback
} from "../src/index.js";

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

describe("EURUSD London-New York overlap pullback v1", () => {
  it("defines a fixed deterministic strategy specification", () => {
    expect(EURUSD_OVERLAP_PULLBACK_V1).toMatchObject({
      strategyId: "EURUSD_LN_NY_PULLBACK",
      version: "1.0.0",
      instrument: "EURUSD",
      sourceTimeframe: "15m",
      contextTimeframes: ["1H", "4H"]
    });
  });

  it("allows paper simulation only when every qualification gate passes", () => {
    const result = evaluateEurUsdOverlapPullback(base);

    expect(result.eligible).toBe(true);
    expect(result.recommendation).toBe("PAPER_SIMULATE");
    expect(result.blockers).toEqual([]);
    expect(result.ruleResults).toHaveLength(9);
    expect(result.ruleResults.every((rule) => rule.status === "PASS")).toBe(true);
  });

  it("returns WATCH when event risk is unresolved", () => {
    const result = evaluateEurUsdOverlapPullback({
      ...base,
      minutesToNearestHighImpactEvent: 20
    });

    expect(result.eligible).toBe(false);
    expect(result.recommendation).toBe("WATCH");
    expect(result.blockers.some((item) => item.startsWith("EVENT_RISK_CLEAR"))).toBe(true);
  });

  it("rejects expired candidates", () => {
    const result = evaluateEurUsdOverlapPullback({
      ...base,
      candlesSinceTrigger: 5
    });

    expect(result.recommendation).toBe("REJECT");
    expect(result.ruleResults.find((item) => item.gate === "NOT_EXPIRED")?.status).toBe("FAIL");
  });

  it("rejects missing invalidation", () => {
    const { invalidationPrice: _ignored, ...withoutInvalidation } = base;
    const result = evaluateEurUsdOverlapPullback(withoutInvalidation);

    expect(result.recommendation).toBe("REJECT");
    expect(result.ruleResults.find((item) => item.gate === "INVALIDATION_DEFINED")?.status).toBe("BLOCKED");
  });

  it("blocks observations that were not available at decision time", () => {
    const result = evaluateEurUsdOverlapPullback({
      ...base,
      availableAt: "2026-07-24T13:15:00.000Z"
    });

    expect(result.recommendation).toBe("REJECT");
    expect(result.ruleResults.find((item) => item.gate === "DATA_READY")?.status).toBe("BLOCKED");
  });

  it("keeps arbitrary score aggregation out of the assessment", () => {
    const result = evaluateEurUsdOverlapPullback(base);

    expect(result).not.toHaveProperty("score");
    expect(result).not.toHaveProperty("confidence");
  });
});
