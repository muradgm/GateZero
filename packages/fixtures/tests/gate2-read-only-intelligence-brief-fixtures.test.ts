import { describe, expect, it } from "vitest";
import { Gate2ReadOnlyIntelligenceBriefSchema } from "../../contracts/src/index.js";
import { gate2ReadOnlyIntelligenceBriefFixture } from "../src/index.js";

describe("Gate 2 read-only intelligence brief fixture", () => {
  it("is contract valid and local only", () => {
    const fixture = Gate2ReadOnlyIntelligenceBriefSchema.parse(
      gate2ReadOnlyIntelligenceBriefFixture
    );
    expect(fixture.local_only).toBe(true);
    expect(fixture.external_access).toBe(false);
    expect(fixture.execution_path).toBe(false);
  });

  it("shows every timeframe and conditional direction together", () => {
    expect(
      gate2ReadOnlyIntelligenceBriefFixture.evidence_assembly.timeframe_evidence.map(
        (evidence) => evidence.timeframe
      )
    ).toEqual(["hourly", "daily", "monthly"]);
    expect(
      gate2ReadOnlyIntelligenceBriefFixture.scenario_set.scenarios.map(
        (scenario) => scenario.direction
      )
    ).toEqual(["bullish", "bearish", "neutral"]);
  });

  it("keeps review authority outside the brief", () => {
    expect(gate2ReadOnlyIntelligenceBriefFixture.risk_review_status).toBe("required");
    expect(gate2ReadOnlyIntelligenceBriefFixture.operator_decision_status).toBe("required");
    expect(gate2ReadOnlyIntelligenceBriefFixture.recommendation_final).toBe(false);
    expect(gate2ReadOnlyIntelligenceBriefFixture.approval_claim).toBe(false);
    expect(gate2ReadOnlyIntelligenceBriefFixture.performance_claim).toBe(false);
  });
});
