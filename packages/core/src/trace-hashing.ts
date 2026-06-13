import { createHash } from "node:crypto";
import {
  StrategyDecisionTraceSchema,
  type StrategyDecisionTrace,
  type StrategyDecisionTraceEvent
} from "../../contracts/src/index.js";
import { ContractValidationError } from "../../contracts/src/index.js";
import {
  createImmutableStrategyDecisionTrace,
  type DeepReadonly
} from "./strategy-decision-trace.js";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | readonly JsonValue[] | { readonly [key: string]: JsonValue };

export type StrategyDecisionTraceEventDraft = Omit<
  StrategyDecisionTraceEvent,
  "previous_event_hash" | "event_hash"
>;

export type StrategyDecisionTraceDraft = Omit<StrategyDecisionTrace, "events"> & {
  readonly events: readonly StrategyDecisionTraceEventDraft[];
};

export function canonicalSerialize(value: JsonValue): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalSerialize(item)).join(",")}]`;
  }

  const entries = Object.entries(value).sort(([leftKey], [rightKey]) =>
    leftKey.localeCompare(rightKey)
  );

  return `{${entries
    .map(([key, nestedValue]) => {
      return `${JSON.stringify(key)}:${canonicalSerialize(nestedValue)}`;
    })
    .join(",")}}`;
}

export function hashCanonicalValue(value: JsonValue): string {
  return createHash("sha256").update(canonicalSerialize(value), "utf8").digest("hex");
}

export function computeTraceEventHash(
  event: Omit<StrategyDecisionTraceEvent, "event_hash">
): string {
  return hashCanonicalValue(event as unknown as JsonValue);
}

export function buildCanonicalStrategyDecisionTrace(
  draft: StrategyDecisionTraceDraft
): DeepReadonly<StrategyDecisionTrace> {
  const events: StrategyDecisionTraceEvent[] = [];

  draft.events.forEach((eventDraft, index) => {
    const previousEvent = events[index - 1];
    const eventWithoutHash = {
      ...eventDraft,
      previous_event_hash: previousEvent?.event_hash ?? null
    };
    const event_hash = computeTraceEventHash(eventWithoutHash);

    events.push({
      ...eventWithoutHash,
      event_hash
    });
  });

  return createImmutableStrategyDecisionTrace({
    ...draft,
    events
  });
}

export function assertCanonicalStrategyDecisionTraceHashes(trace: unknown): void {
  const parsedTrace = StrategyDecisionTraceSchema.parse(trace);

  parsedTrace.events.forEach((event, index) => {
    const previousEvent = parsedTrace.events[index - 1];
    const expectedPreviousHash = previousEvent?.event_hash ?? null;

    if (event.previous_event_hash !== expectedPreviousHash) {
      throw new ContractValidationError("trace previous hash does not match prior event");
    }

    const eventWithoutHash = omitEventHash(event);
    const expectedEventHash = computeTraceEventHash(eventWithoutHash);

    if (event.event_hash !== expectedEventHash) {
      throw new ContractValidationError("trace event hash does not match canonical payload");
    }
  });
}

function omitEventHash(
  event: StrategyDecisionTraceEvent
): Omit<StrategyDecisionTraceEvent, "event_hash"> {
  return {
    trace_event_id: event.trace_event_id,
    trace_id: event.trace_id,
    sequence: event.sequence,
    event_type: event.event_type,
    artifact_ref: event.artifact_ref,
    previous_event_hash: event.previous_event_hash,
    recorded_at: event.recorded_at
  };
}
