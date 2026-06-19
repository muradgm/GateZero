import { describe, expect, it } from "vitest";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  StrategyDecisionTraceSchema,
  type StrategyDecisionTrace
} from "../src/index.js";

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
    created_at: recordedAt,
    sealed_at: "2026-01-01T00:01:00.000Z"
  };
}

function requireHash(hash: string | undefined): string {
  if (!hash) {
    throw new Error("fixture hash must exist");
  }

  return hash;
}

describe("StrategyDecisionTraceSchema", () => {
  it("validates an ordered Gate 0 append-only decision trace", () => {
    const trace = StrategyDecisionTraceSchema.parse(createTrace());

    expect(trace.financial_gate).toBe("G0_RESEARCH");
    expect(trace.events).toHaveLength(STRATEGY_DECISION_TRACE_EVENT_ORDER.length);
  });

  it("rejects reordered trace events", () => {
    const trace = createTrace();
    const swappedEvent = trace.events[1];

    if (!swappedEvent) {
      throw new Error("fixture must include the second event");
    }

    trace.events[1] = {
      ...swappedEvent,
      event_type: "risk_review",
      artifact_ref: {
        ...swappedEvent.artifact_ref,
        kind: "risk_review"
      }
    };

    expect(() => StrategyDecisionTraceSchema.parse(trace)).toThrow();
  });

  it("rejects broken hash chains", () => {
    const trace = createTrace();
    const event = trace.events[3];

    if (!event) {
      throw new Error("fixture must include the fourth event");
    }

    trace.events[3] = {
      ...event,
      previous_event_hash: "unexpected-hash"
    };

    expect(() => StrategyDecisionTraceSchema.parse(trace)).toThrow();
  });

  it("rejects skipped sequence numbers", () => {
    const trace = createTrace();
    const event = trace.events[4];

    if (!event) {
      throw new Error("fixture must include the fifth event");
    }

    trace.events[4] = {
      ...event,
      sequence: 99
    };

    expect(() => StrategyDecisionTraceSchema.parse(trace)).toThrow();
  });

  it("rejects unsupported future financial gates", () => {
    const trace = {
      ...createTrace(),
      financial_gate: "G2_EXECUTION"
    };

    expect(() => StrategyDecisionTraceSchema.parse(trace)).toThrow();
  });

  it("rejects non-append-only traces", () => {
    const trace = {
      ...createTrace(),
      append_only: false
    };

    expect(() => StrategyDecisionTraceSchema.parse(trace)).toThrow();
  });
});
