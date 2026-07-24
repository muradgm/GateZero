import { describe, expect, it } from "vitest";
import { ContractValidationError } from "@traderframe/contracts";
import {
  blockDecisionPipelineStage,
  completeDecisionPipelineStage,
  createDecisionPipeline
} from "../src/index.js";

const now = "2026-07-24T22:00:00.000Z";

function completeCurrent(pipeline: ReturnType<typeof createDecisionPipeline>, recordId: string) {
  return completeDecisionPipelineStage(pipeline, {
    stage: pipeline.currentStage,
    recordId,
    evidenceIds: [recordId],
    completedAt: now
  });
}

describe("decision pipeline", () => {
  it("creates a non-executing pipeline with research completed", () => {
    const pipeline = createDecisionPipeline({
      pipelineId: "pipeline-eurusd-001",
      researchCaseId: "case-eurusd-001",
      researchCaseRecordId: "case-record-eurusd-001",
      instrument: "EUR/USD",
      now
    });

    expect(pipeline.currentStage).toBe("market_context");
    expect(pipeline.stages.find((stage) => stage.stage === "research_case")?.status).toBe(
      "completed"
    );
    expect(pipeline.executionPath).toBe(false);
  });

  it("advances stages in legal order and skips simulation after WATCH", () => {
    let pipeline = createDecisionPipeline({
      pipelineId: "pipeline-eurusd-002",
      researchCaseId: "case-eurusd-002",
      researchCaseRecordId: "case-record-eurusd-002",
      instrument: "EUR/USD",
      now
    });

    for (const recordId of ["context", "assessment", "setup", "intelligence", "risk"]) {
      pipeline = completeCurrent(pipeline, recordId);
    }

    pipeline = completeDecisionPipelineStage(pipeline, {
      stage: "operator_decision",
      recordId: "decision-watch",
      evidenceIds: ["intelligence", "risk"],
      recommendation: "WATCH",
      completedAt: now
    });

    expect(pipeline.currentStage).toBe("outcome");
    expect(pipeline.recommendation).toBe("WATCH");
    expect(pipeline.stages.find((stage) => stage.stage === "paper_simulation")?.status).toBe(
      "not_applicable"
    );
  });

  it("blocks illegal stage completion and records blockers", () => {
    const pipeline = createDecisionPipeline({
      pipelineId: "pipeline-eurusd-003",
      researchCaseId: "case-eurusd-003",
      researchCaseRecordId: "case-record-eurusd-003",
      instrument: "EUR/USD",
      now
    });

    expect(() =>
      completeDecisionPipelineStage(pipeline, {
        stage: "setup_review",
        recordId: "setup",
        evidenceIds: ["setup"],
        completedAt: now
      })
    ).toThrow(ContractValidationError);

    const blocked = blockDecisionPipelineStage(pipeline, ["Market context is stale."], now);
    expect(blocked.stages.find((stage) => stage.stage === "market_context")?.status).toBe(
      "blocked"
    );
  });
});
