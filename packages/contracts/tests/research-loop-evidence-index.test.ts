import { describe, expect, it } from "vitest";
import {
  ResearchLoopEvidenceIndexSchema,
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  type ResearchLoopEvidenceIndex
} from "../src/index.js";

const generatedAt = "2026-01-01T00:00:00.000Z";

function createIndex(
  overrides: Partial<ResearchLoopEvidenceIndex> = {}
): ResearchLoopEvidenceIndex {
  return {
    evidence_index_id: "evidence-index-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    index_kind: "local_research_loop_evidence_index",
    strategy_review_bundle_id: "bundle-001",
    strategy_id: "strategy-001",
    strategy_version: "v0.1.0",
    entries: STRATEGY_DECISION_TRACE_EVENT_ORDER.map((artifactKind, index) => ({
      sequence: index + 1,
      artifact_kind: artifactKind,
      artifact_id: `${artifactKind}-001`,
      label: `Synthetic ${artifactKind}`,
      source_ref: `synthetic/${artifactKind}-001`
    })),
    external_access: false,
    execution_path: false,
    generated_at: generatedAt,
    ...overrides
  };
}

describe("research loop evidence index contract", () => {
  it("accepts a local Gate 0 research-only evidence index", () => {
    const index = ResearchLoopEvidenceIndexSchema.parse(createIndex());

    expect(index.financial_gate).toBe("G0_RESEARCH");
    expect(index.scope).toBe("research_only");
    expect(index.external_access).toBe(false);
    expect(index.execution_path).toBe(false);
  });

  it("requires the protected-loop artifact order", () => {
    const index = createIndex();
    const entries = [...index.entries];
    const first = entries[0];
    const second = entries[1];

    if (!first || !second) {
      throw new Error("fixture must include ordered entries");
    }

    entries[0] = { ...first, artifact_kind: second.artifact_kind };

    expect(() => ResearchLoopEvidenceIndexSchema.parse({ ...index, entries })).toThrow();
  });

  it("rejects external access and execution path flags", () => {
    expect(() =>
      ResearchLoopEvidenceIndexSchema.parse({
        ...createIndex(),
        external_access: true
      })
    ).toThrow();

    expect(() =>
      ResearchLoopEvidenceIndexSchema.parse({
        ...createIndex(),
        execution_path: true
      })
    ).toThrow();
  });
});
