import {
  ResearchLoopEvidenceIndexSchema,
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  type ResearchLoopEvidenceIndex
} from "../../contracts/src/index.js";
import { gate0DryRunScenarioFixture } from "./gate0-dry-run-scenario.js";

const generatedAt = "2026-01-01T00:00:00.000Z";

export const gate0ResearchLoopEvidenceIndexFixture: ResearchLoopEvidenceIndex =
  ResearchLoopEvidenceIndexSchema.parse({
    evidence_index_id: "evidence-index-gate0-dry-run-001",
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    index_kind: "local_research_loop_evidence_index",
    strategy_review_bundle_id: gate0DryRunScenarioFixture.bundle.strategy_review_bundle_id,
    strategy_id: gate0DryRunScenarioFixture.bundle.strategy_idea.strategy_id,
    strategy_version: gate0DryRunScenarioFixture.bundle.backtest_result.strategy_version,
    entries: STRATEGY_DECISION_TRACE_EVENT_ORDER.map((artifactKind, index) => {
      const event = gate0DryRunScenarioFixture.bundle.trace.events[index];

      if (!event) {
        throw new Error(`Missing trace event for evidence index entry ${index + 1}`);
      }

      return {
        sequence: index + 1,
        artifact_kind: artifactKind,
        artifact_id: event.artifact_ref.id,
        label: `Synthetic ${artifactKind} evidence`,
        source_ref: `gate0-dry-run:${event.artifact_ref.id}`
      };
    }),
    external_access: false,
    execution_path: false,
    generated_at: generatedAt
  });
