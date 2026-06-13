import { describe, expect, it } from "vitest";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  type StrategyDecisionTrace
} from "../../contracts/src/index.js";
import { createImmutableStrategyDecisionTrace } from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

function createTrace(): StrategyDecisionTrace {
  const eventHashes = STRATEGY_DECISION_TRACE_EVENT_ORDER.map((eventType, index) => {
    return `hash-${index + 1}-${eventType}`;
  });

  return {
    trace_id: "trace-001",
    strategy_id: "strat-001",
    strategy_version: "v0.1.0",
    financial_gate: "G0_RESEARCH",
    append_only: true,
    events: STRATEGY_DECISION_TRACE_EVENT_ORDER.map((eventType, index) => {
      return {
        trace_event_id: `trace-event-${index + 1}`,
        trace_id: "trace-001",
        sequence: index + 1,
        event_type: eventType,
        artifact_ref: {
          id: `${eventType}-artifact-001`,
          kind: eventType,
          version: "v0.1.0"
        },
        previous_event_hash: index === 0 ? null : requireHash(eventHashes[index - 1]),
        event_hash: requireHash(eventHashes[index]),
        recorded_at: recordedAt
      };
    }),
    created_at: recordedAt
  };
}

function requireHash(hash: string | undefined): string {
  if (!hash) {
    throw new Error("fixture hash must exist");
  }

  return hash;
}

describe("createImmutableStrategyDecisionTrace", () => {
  it("validates and deeply freezes trace data", () => {
    const immutableTrace = createImmutableStrategyDecisionTrace(createTrace());

    expect(Object.isFrozen(immutableTrace)).toBe(true);
    expect(Object.isFrozen(immutableTrace.events)).toBe(true);
    expect(Object.isFrozen(immutableTrace.events[0])).toBe(true);
    expect(Object.isFrozen(immutableTrace.events[0]?.artifact_ref)).toBe(true);
  });

  it("rejects invalid traces before freezing", () => {
    const trace = createTrace();
    const event = trace.events[2];

    if (!event) {
      throw new Error("fixture must include the third event");
    }

    trace.events[2] = {
      ...event,
      sequence: 99
    };

    expect(() => createImmutableStrategyDecisionTrace(trace)).toThrow();
  });
});
