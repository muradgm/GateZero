import { describe, expect, it } from "vitest";
import {
  ResearchLoopEvidenceIndexSchema,
  STRATEGY_DECISION_TRACE_EVENT_ORDER
} from "../../contracts/src/index.js";
import { gate0DryRunScenarioFixture, gate0ResearchLoopEvidenceIndexFixture } from "../src/index.js";

describe("Gate 0 research loop evidence index fixture", () => {
  it("validates as a local Gate 0 evidence index", () => {
    const index = ResearchLoopEvidenceIndexSchema.parse(gate0ResearchLoopEvidenceIndexFixture);

    expect(index.financial_gate).toBe("G0_RESEARCH");
    expect(index.scope).toBe("research_only");
    expect(index.external_access).toBe(false);
    expect(index.execution_path).toBe(false);
  });

  it("indexes the protected-loop artifacts in canonical order", () => {
    expect(
      gate0ResearchLoopEvidenceIndexFixture.entries.map((entry) => entry.artifact_kind)
    ).toEqual(STRATEGY_DECISION_TRACE_EVENT_ORDER);
    expect(gate0ResearchLoopEvidenceIndexFixture.entries.map((entry) => entry.artifact_id)).toEqual(
      gate0DryRunScenarioFixture.bundle.trace.events.map((event) => event.artifact_ref.id)
    );
  });

  it("is deterministic across repeated reads", () => {
    expect(JSON.stringify(gate0ResearchLoopEvidenceIndexFixture)).toBe(
      JSON.stringify(gate0ResearchLoopEvidenceIndexFixture)
    );
  });
});
