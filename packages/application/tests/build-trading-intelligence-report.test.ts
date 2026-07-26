import { describe, expect, it } from "vitest";
import type { EvidenceContribution } from "@traderframe/contracts";
import {
  buildTradingIntelligenceReport,
  rankTradingIntelligenceReports,
  type BuildTradingIntelligenceReportCommand
} from "../src/index.js";

const common: Omit<BuildTradingIntelligenceReportCommand, "contributions" | "downgradeReasons"> = {
  reportId: "intelligence-eurusd-001",
  setupReviewId: "setup-review-eurusd-001",
  instrument: "EUR/USD",
  generatedAt: "2026-07-24T21:00:00.000Z",
  bullCase: {
    title: "Bull case",
    summary: "Higher-timeframe trend remains aligned.",
    evidenceIds: ["trend-1"],
    limitations: ["Historical local snapshot only."]
  },
  bearCase: {
    title: "Bear case",
    summary: "Event risk can invalidate the setup.",
    evidenceIds: ["macro-1"],
    limitations: ["Event impact is not predicted."]
  },
  neutralCase: {
    title: "Neutral case",
    summary: "No action without trigger confirmation.",
    evidenceIds: [],
    limitations: ["Neutrality depends on current structure."]
  },
  timeline: [],
  invalidationSummary: "Reject the setup below the one-hour structure low."
};

function contribution(
  id: string,
  points: number,
  direction: "supporting" | "contradicting"
): EvidenceContribution {
  return {
    contributionId: id,
    dimension: direction === "supporting" ? "trend" : "event_risk",
    label: id,
    evidenceIds: [id],
    direction,
    points,
    rationale: "Traceable evidence contribution.",
    limitation: "The contribution is bounded and local-only."
  };
}

describe("buildTradingIntelligenceReport", () => {
  it("builds an explainable high-confidence paper-simulation candidate", () => {
    const report = buildTradingIntelligenceReport({
      ...common,
      contributions: [
        contribution("trend", 20, "supporting"),
        contribution("structure", 15, "supporting")
      ],
      downgradeReasons: []
    });

    expect(report.evidenceScore).toBe(85);
    expect(report.confidence).toBe("high");
    expect(report.recommendation).toBe("PAPER_SIMULATE");
    expect(report.executionPath).toBe(false);
  });

  it("downgrades a strong score when unresolved risks remain", () => {
    const report = buildTradingIntelligenceReport({
      ...common,
      contributions: [
        contribution("trend", 20, "supporting"),
        contribution("structure", 15, "supporting")
      ],
      downgradeReasons: ["High-impact macro event remains unresolved."]
    });

    expect(report.confidence).toBe("moderate");
    expect(report.recommendation).toBe("WATCH");
  });

  it("ranks bounded recommendations before raw score", () => {
    const paper = buildTradingIntelligenceReport({
      ...common,
      contributions: [
        contribution("trend", 20, "supporting"),
        contribution("structure", 15, "supporting")
      ],
      downgradeReasons: []
    });
    const watch = buildTradingIntelligenceReport({
      ...common,
      reportId: "intelligence-gbpusd-001",
      setupReviewId: "setup-review-gbpusd-001",
      instrument: "GBP/USD",
      contributions: [
        contribution("trend", 20, "supporting"),
        contribution("structure", 20, "supporting")
      ],
      downgradeReasons: ["Correlation concentration remains unresolved."]
    });

    expect(rankTradingIntelligenceReports([watch, paper])[0]?.reportId).toBe(paper.reportId);
  });
});
