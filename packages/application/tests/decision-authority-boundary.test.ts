import { describe, expect, it } from "vitest";
import { buildTradingIntelligenceReport, evaluateSetupReview } from "../src/index.js";
import type { EvidenceQuality, MarketContext, SetupReview } from "@traderframe/contracts";

describe("decision authority boundary", () => {
  it("keeps a complete intelligence report descriptive and disposition-free", () => {
    const report = buildTradingIntelligenceReport({
      reportId: "report-001",
      setupReviewId: "setup-001",
      instrument: "EUR/USD",
      generatedAt: "2026-08-15T10:00:00.000Z",
      contributions: [
        {
          contributionId: "trend-001",
          dimension: "trend",
          label: "Trend",
          evidenceIds: ["evidence-001"],
          direction: "supporting",
          points: 25,
          rationale: "Local structure is aligned.",
          limitation: "A local snapshot cannot establish future price direction."
        },
        {
          contributionId: "structure-001",
          dimension: "market_structure",
          label: "Structure",
          evidenceIds: ["evidence-002"],
          direction: "supporting",
          points: 25,
          rationale: "The reviewed structure remains intact.",
          limitation: "The observed structure may change after the snapshot."
        }
      ],
      bullCase: {
        title: "Bull",
        summary: "Support exists.",
        evidenceIds: ["evidence-001"],
        limitations: ["Not predictive."]
      },
      bearCase: {
        title: "Bear",
        summary: "Invalidation remains possible.",
        evidenceIds: ["evidence-002"],
        limitations: ["Not predictive."]
      },
      neutralCase: {
        title: "Neutral",
        summary: "Manual review remains required.",
        evidenceIds: [],
        limitations: ["No authority is created."]
      },
      timeline: [],
      invalidationSummary: "Invalidate on a confirmed structure break.",
      downgradeReasons: []
    });

    expect(report).toMatchObject({
      evidenceScore: 100,
      evidenceStatus: "reviewable",
      reviewUrgency: "low"
    });
    expect(report).not.toHaveProperty("recommendation");
    expect(report).not.toHaveProperty("confidence");
  });

  it("keeps a favorable setup assessment disposition-free", () => {
    const review = setupReviewFixture();
    const assessment = evaluateSetupReview({
      assessmentId: "assessment-001",
      review,
      marketContext: marketContextFixture(),
      evidenceQuality: evidenceQualityFixture(),
      evaluatedAt: "2026-08-15T10:00:00.000Z"
    });

    expect(assessment).toMatchObject({ evidenceStatus: "reviewable", reviewUrgency: "low" });
    expect(assessment).not.toHaveProperty("recommendation");
    expect(assessment).not.toHaveProperty("confidence");
  });
});

function setupReviewFixture(): SetupReview {
  return {
    schemaVersion: 1,
    setupReviewId: "setup-001",
    researchCaseId: "case-001",
    instrument: "EUR/USD",
    strategyFamily: "fixture",
    gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    status: "reviewed",
    thesis: "Fixture thesis.",
    supportingEvidence: [
      {
        id: "evidence-001",
        type: "technical_structure",
        source: "local",
        observedAt: "2026-08-15T09:00:00.000Z",
        summary: "Support",
        limitation: "Local only."
      }
    ],
    contradictingEvidence: [],
    backtestEvidenceId: "backtest-001",
    invalidation: {
      description: "Break invalidates.",
      observable: "Close",
      threshold: "below local level",
      action: "reject_or_exit_paper_setup"
    },
    riskPlan: {
      accountCurrency: "USD",
      accountEquity: 10000,
      maximumRiskPct: 1,
      maximumRiskAmount: 50,
      plannedEntry: 1.1,
      plannedStop: 1.09,
      plannedTarget: 1.12,
      quantity: 1000,
      estimatedFees: 1,
      estimatedSlippage: 1,
      portfolioExposurePctAfterEntry: 10,
      correlationWarning: false
    },
    decision: "WATCH",
    decisionReasons: ["Manual disposition remains required."],
    limitations: ["Fixture only."],
    operatorRequired: true,
    riskReviewRequired: true,
    riskReviewId: "risk-001",
    externalAccess: false,
    executionPath: false,
    automatedAction: false,
    approvalClaim: false,
    performanceClaim: false,
    createdAt: "2026-08-15T09:00:00.000Z",
    updatedAt: "2026-08-15T09:00:00.000Z"
  };
}

function marketContextFixture(): MarketContext {
  return {
    marketContextId: "context-001",
    instrument: "EUR/USD",
    session: "london",
    volatilityRegime: "normal",
    liquidityCondition: "deep",
    broadBias: "bullish",
    timeframes: [
      {
        timeframe: "1D",
        trend: "bullish",
        structure: "expansion",
        momentum: "stable",
        evidenceIds: ["evidence-001"]
      },
      {
        timeframe: "4H",
        trend: "bullish",
        structure: "pullback",
        momentum: "stable",
        evidenceIds: ["evidence-001"]
      }
    ],
    macroEventRisk: "low",
    correlationRisk: "low",
    observedAt: "2026-08-15T09:00:00.000Z",
    validUntil: "2026-08-15T11:00:00.000Z",
    limitations: ["Local only."]
  };
}

function evidenceQualityFixture(): EvidenceQuality[] {
  return [
    {
      evidenceId: "evidence-001",
      freshness: "current",
      provenance: "verified",
      sampleSufficiency: "sufficient",
      regimeRelevance: "matched",
      independence: "independent",
      qualityScore: 90,
      limitations: ["Fixture only."]
    }
  ];
}
