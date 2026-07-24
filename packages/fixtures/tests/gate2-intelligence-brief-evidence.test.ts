import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildIntelligenceBriefEvidence } from "../../../scripts/build-intelligence-brief-evidence.js";

const rootDir = process.cwd();

describe("Gate 2 intelligence brief browser evidence", () => {
  it("builds a balanced evidence-only view", () => {
    const view = buildIntelligenceBriefEvidence();
    expect(view.timeframes.map((item) => item.timeframe)).toEqual(["hourly", "daily", "monthly"]);
    expect(view.scenarios.map((item) => item.direction)).toEqual(["bullish", "bearish", "neutral"]);
    expect(view.riskReviewStatus).toBe("required");
    expect(view.operatorDecisionStatus).toBe("required");
  });

  it("renders the brief without an action control", () => {
    const main = readFileSync(path.join(rootDir, "apps", "web", "src", "main.js"), "utf8");
    expect(main).toContain("Read-Only Intelligence Brief");
    expect(main).toContain("Risk review required");
    expect(main).toContain("Operator decision required");
    expect(main).not.toContain("brief-action");
  });

  it("includes selectable fail-closed cases and linked workflow records", () => {
    const view = buildIntelligenceBriefEvidence();
    expect(view.caseSelection.options.map((option) => option.status)).toEqual([
      "available",
      "blocked",
      "unavailable"
    ]);
    expect(view.backtestLink.evidencePermission).toBe(false);
    expect(view.invalidationEvaluation.invocation).toBe("explicit_operator_request");
    expect(view.manualRiskReview.approvalGranted).toBe(false);
    expect(view.operatorDecision.decision).toBe("keep_research_only");
    expect(view.operatorDecision.simulationAuthorized).toBe(false);
    expect(view.workflowCheckpoint.status).toBe("research_only_recorded");
  });
});
