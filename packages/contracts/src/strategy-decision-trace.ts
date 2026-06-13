import { z } from "zod";
import { FinancialGateSchema } from "./gate.js";
import { IdentifierSchema, IsoDateTimeSchema, NonEmptyStringSchema } from "./schemas.js";

export const StrategyDecisionTraceEventTypeSchema = z.enum([
  "strategy_idea",
  "data_snapshot",
  "backtest",
  "metric_report",
  "risk_review",
  "operator_decision",
  "outcome_logged",
  "learning_event"
]);

export const STRATEGY_DECISION_TRACE_EVENT_ORDER = [
  "strategy_idea",
  "data_snapshot",
  "backtest",
  "metric_report",
  "risk_review",
  "operator_decision",
  "outcome_logged",
  "learning_event"
] as const;

export const StrategyDecisionTraceEventSchema = z
  .object({
    trace_event_id: IdentifierSchema,
    trace_id: IdentifierSchema,
    sequence: z.number().int().positive(),
    event_type: StrategyDecisionTraceEventTypeSchema,
    artifact_ref: z
      .object({
        id: IdentifierSchema,
        kind: StrategyDecisionTraceEventTypeSchema,
        version: NonEmptyStringSchema.optional()
      })
      .strict(),
    previous_event_hash: NonEmptyStringSchema.nullable(),
    event_hash: NonEmptyStringSchema,
    recorded_at: IsoDateTimeSchema
  })
  .strict();

export const StrategyDecisionTraceSchema = z
  .object({
    trace_id: IdentifierSchema,
    strategy_id: IdentifierSchema,
    strategy_version: NonEmptyStringSchema,
    financial_gate: FinancialGateSchema,
    append_only: z.literal(true),
    events: z
      .array(StrategyDecisionTraceEventSchema)
      .length(STRATEGY_DECISION_TRACE_EVENT_ORDER.length),
    created_at: IsoDateTimeSchema,
    sealed_at: IsoDateTimeSchema.optional()
  })
  .strict()
  .superRefine((trace, context) => {
    trace.events.forEach((event, index) => {
      const expectedSequence = index + 1;
      const expectedEventType = STRATEGY_DECISION_TRACE_EVENT_ORDER[index];
      const previousEvent = trace.events[index - 1];

      if (event.trace_id !== trace.trace_id) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "trace event must reference the parent trace id",
          path: ["events", index, "trace_id"]
        });
      }

      if (event.sequence !== expectedSequence) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `trace event sequence must be ${expectedSequence}`,
          path: ["events", index, "sequence"]
        });
      }

      if (event.event_type !== expectedEventType) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `trace event type must be ${expectedEventType}`,
          path: ["events", index, "event_type"]
        });
      }

      if (event.artifact_ref.kind !== event.event_type) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "artifact kind must match trace event type",
          path: ["events", index, "artifact_ref", "kind"]
        });
      }

      if (index === 0 && event.previous_event_hash !== null) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "first trace event must not have a previous hash",
          path: ["events", index, "previous_event_hash"]
        });
      }

      if (index > 0 && previousEvent && event.previous_event_hash !== previousEvent.event_hash) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "trace event previous hash must match prior event hash",
          path: ["events", index, "previous_event_hash"]
        });
      }
    });

    if (trace.sealed_at && trace.sealed_at < trace.created_at) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "sealed_at must be after created_at",
        path: ["sealed_at"]
      });
    }
  });

export type StrategyDecisionTraceEventType = z.infer<typeof StrategyDecisionTraceEventTypeSchema>;
export type StrategyDecisionTraceEvent = z.infer<typeof StrategyDecisionTraceEventSchema>;
export type StrategyDecisionTrace = z.infer<typeof StrategyDecisionTraceSchema>;
