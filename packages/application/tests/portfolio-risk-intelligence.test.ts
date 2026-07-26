import { describe, expect, it } from "vitest";
import { createPortfolioRiskCheckpoint, evaluatePortfolioRisk } from "../src/index.js";
import type { PortfolioRiskContext } from "@traderframe/contracts";

function context(candidateOverrides: Partial<PortfolioRiskContext["candidatePosition"]> = {}) {
  return {
    schemaVersion: 1 as const,
    contextId: "epoch3-portfolio-context",
    policy: {
      policyId: "bounded-paper-risk-policy",
      policyVersion: "1.0.0",
      accountCurrency: "USD",
      accountEquity: 10_000,
      equityHighWaterMark: 10_400,
      maximumInstrumentExposurePct: 20,
      maximumCurrencyExposurePct: 30,
      maximumCorrelationExposurePct: 25,
      maximumEventRiskPct: 0.5,
      maximumSessionRiskAmount: 100,
      maximumDailyRiskAmount: 150,
      maximumDrawdownPct: 5,
      warningUtilizationPct: 80
    },
    existingPositions: [
      {
        positionId: "existing-gbpusd",
        instrument: "GBPUSD",
        baseCurrency: "GBP",
        quoteCurrency: "USD",
        side: "LONG" as const,
        notionalAmount: 1_000,
        plannedRiskAmount: 25,
        correlationGroup: "USD_DIRECTION",
        session: "OVERLAP" as const,
        eventIds: ["US_CPI"],
        evidenceVersionIds: ["gbpusd-position-v1"]
      }
    ],
    candidatePosition: {
      positionId: "candidate-eurusd",
      instrument: "EURUSD",
      baseCurrency: "EUR",
      quoteCurrency: "USD",
      side: "LONG" as const,
      notionalAmount: 1_000,
      plannedRiskAmount: 25,
      correlationGroup: "USD_DIRECTION",
      session: "OVERLAP" as const,
      eventIds: ["US_CPI"],
      evidenceVersionIds: ["eurusd-candidate-v1"],
      ...candidateOverrides
    },
    realizedSessionLossAmount: 20,
    realizedDailyLossAmount: 30,
    evidenceVersionIds: ["portfolio-state-v1", "risk-policy-v1"],
    evaluatedAt: "2026-07-24T16:30:00.000Z",
    localSimulationOnly: true as const,
    executionPath: false as const,
    automatedAction: false as const
  };
}

function assess(
  candidateOverrides: Partial<PortfolioRiskContext["candidatePosition"]> = {},
  assessmentId = "epoch3-review-assessment"
) {
  return evaluatePortfolioRisk({
    assessmentId,
    context: context(candidateOverrides),
    limitations: [
      "One local paper-simulation portfolio fixture only.",
      "Risk status is not approval or execution authority."
    ]
  });
}

describe("portfolio risk intelligence", () => {
  it("produces a deterministic review-required assessment without approval semantics", () => {
    const first = assess();
    const second = assess();

    expect(second).toEqual(first);
    expect(first.status).toBe("REVIEW_REQUIRED");
    expect(first.assessmentHash).toMatch(/^sha256:/);
    expect(first.findings.map((finding) => finding.code)).toEqual(
      expect.arrayContaining(["CORRELATION_EXPOSURE", "EVENT_EXPOSURE"])
    );
    expect(first.riskApproval).toBe(false);
    expect(first.operatorReviewRequired).toBe(true);
    expect(first.executionPath).toBe(false);
    expect(first).not.toHaveProperty("score");
    expect(first).not.toHaveProperty("recommendation");
  });

  it("blocks a candidate that breaches correlation and event exposure limits", () => {
    const assessment = assess(
      {
        notionalAmount: 1_800,
        plannedRiskAmount: 40
      },
      "epoch3-blocked-assessment"
    );

    expect(assessment.status).toBe("BLOCKED");
    expect(
      assessment.findings
        .filter((finding) => finding.severity === "BLOCKING")
        .map((finding) => finding.code)
    ).toEqual(["CORRELATION_EXPOSURE", "EVENT_EXPOSURE"]);
    expect(assessment.blockers).toHaveLength(2);
  });

  it("includes instrument, currency, correlation, event, budget, and drawdown context", () => {
    const assessment = assess();

    expect(assessment.instrumentExposures.map((metric) => metric.subject)).toEqual([
      "EURUSD",
      "GBPUSD"
    ]);
    expect(assessment.currencyExposures.find((metric) => metric.subject === "USD")).toMatchObject({
      currentPct: 10,
      afterCandidatePct: 20,
      limitPct: 30
    });
    expect(assessment.sessionRiskBudget).toMatchObject({
      currentAmount: 45,
      afterCandidateAmount: 70,
      limitAmount: 100,
      utilizationPct: 70
    });
    expect(assessment.drawdownPct).toBeCloseTo(3.8462);
  });

  it("fails closed for duplicate positions and invalid fixed policies", () => {
    expect(() =>
      evaluatePortfolioRisk({
        assessmentId: "duplicate",
        context: {
          ...context(),
          candidatePosition: {
            ...context().candidatePosition,
            positionId: "existing-gbpusd"
          }
        },
        limitations: ["Local fixture."]
      })
    ).toThrow(/duplicate position/i);

    expect(() =>
      evaluatePortfolioRisk({
        assessmentId: "invalid-policy",
        context: {
          ...context(),
          policy: {
            ...context().policy,
            equityHighWaterMark: 9_000
          }
        },
        limitations: ["Local fixture."]
      })
    ).toThrow(/high-water mark/i);
  });

  it("accepts the epoch only when reruns match and portfolio blockers are exercised", () => {
    const first = assess();
    const second = assess();
    const blocked = assess(
      {
        notionalAmount: 1_800,
        plannedRiskAmount: 40
      },
      "epoch3-blocked-assessment"
    );
    const checkpoint = createPortfolioRiskCheckpoint({
      checkpointId: "epoch3-risk-checkpoint",
      firstReviewAssessment: first,
      secondReviewAssessment: second,
      blockedAssessment: blocked,
      checkedAt: "2026-07-24T16:35:00.000Z"
    });

    expect(checkpoint.status).toBe("PASS");
    expect(checkpoint.deterministic).toBe(true);
    expect(checkpoint.portfolioBlockersExercised).toBe(true);
    expect(checkpoint.riskApproval).toBe(false);
  });
});
