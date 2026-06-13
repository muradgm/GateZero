import { describe, expect, it } from "vitest";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  type StrategyDecisionTrace
} from "../../contracts/src/index.js";
import {
  assertCanonicalStrategyDecisionTraceHashes,
  buildCanonicalStrategyDecisionTrace,
  canonicalSerialize,
  computeTraceEventHash,
  hashCanonicalValue,
  type StrategyDecisionTraceDraft
} from "../src/index.js";

const recordedAt = "2026-01-01T00:00:00.000Z";

function createDraft(): StrategyDecisionTraceDraft {
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
        recorded_at: recordedAt
      };
    }),
    created_at: recordedAt
  };
}

describe("trace hashing", () => {
  it("serializes objects deterministically across key order", () => {
    const left = canonicalSerialize({
      b: "second",
      a: {
        d: 4,
        c: 3
      }
    });
    const right = canonicalSerialize({
      a: {
        c: 3,
        d: 4
      },
      b: "second"
    });

    expect(left).toBe(right);
  });

  it("hashes canonical values deterministically", () => {
    const left = hashCanonicalValue({ b: true, a: "first" });
    const right = hashCanonicalValue({ a: "first", b: true });

    expect(left).toBe(right);
    expect(left).toMatch(/^[a-f0-9]{64}$/);
  });

  it("computes the same event hash for the same canonical payload", () => {
    const draft = createDraft();
    const event = draft.events[0];

    if (!event) {
      throw new Error("fixture must include the first event");
    }

    const eventWithoutHash = {
      ...event,
      previous_event_hash: null
    };

    expect(computeTraceEventHash(eventWithoutHash)).toBe(computeTraceEventHash(eventWithoutHash));
  });

  it("builds a hash-linked immutable trace from a draft", () => {
    const trace = buildCanonicalStrategyDecisionTrace(createDraft());

    expect(trace.events[0]?.previous_event_hash).toBeNull();
    expect(trace.events[1]?.previous_event_hash).toBe(trace.events[0]?.event_hash);
    expect(Object.isFrozen(trace)).toBe(true);
    expect(Object.isFrozen(trace.events[0])).toBe(true);
    expect(() => assertCanonicalStrategyDecisionTraceHashes(trace)).not.toThrow();
  });

  it("detects event payload tampering", () => {
    const trace = buildCanonicalStrategyDecisionTrace(createDraft());
    const mutableTrace = structuredClone(trace) as StrategyDecisionTrace;
    const event = mutableTrace.events[2];

    if (!event) {
      throw new Error("fixture must include the third event");
    }

    mutableTrace.events[2] = {
      ...event,
      artifact_ref: {
        ...event.artifact_ref,
        id: "tampered-artifact"
      }
    };

    expect(() => assertCanonicalStrategyDecisionTraceHashes(mutableTrace)).toThrow(
      "trace event hash does not match canonical payload"
    );
  });

  it("detects previous hash tampering", () => {
    const trace = buildCanonicalStrategyDecisionTrace(createDraft());
    const mutableTrace = structuredClone(trace) as StrategyDecisionTrace;
    const event = mutableTrace.events[4];

    if (!event) {
      throw new Error("fixture must include the fifth event");
    }

    mutableTrace.events[4] = {
      ...event,
      previous_event_hash: "0".repeat(64)
    };

    expect(() => assertCanonicalStrategyDecisionTraceHashes(mutableTrace)).toThrow();
  });

  it("rejects non-Gate-0 trace drafts", () => {
    const draft = {
      ...createDraft(),
      financial_gate: "G1_BACKTESTING"
    };

    expect(() =>
      buildCanonicalStrategyDecisionTrace(draft as StrategyDecisionTraceDraft)
    ).toThrow();
  });
});
