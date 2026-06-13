import { z } from "zod";
import { FinancialGateSchema } from "./gate.js";
import { IdentifierSchema, IsoDateTimeSchema, NonEmptyStringSchema } from "./schemas.js";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  StrategyDecisionTraceEventTypeSchema
} from "./strategy-decision-trace.js";

export const ResearchLoopEvidenceIndexEntrySchema = z
  .object({
    sequence: z.number().int().positive(),
    artifact_kind: StrategyDecisionTraceEventTypeSchema,
    artifact_id: IdentifierSchema,
    label: NonEmptyStringSchema,
    source_ref: NonEmptyStringSchema
  })
  .strict();

export const ResearchLoopEvidenceIndexSchema = z
  .object({
    evidence_index_id: IdentifierSchema,
    financial_gate: FinancialGateSchema,
    scope: z.literal("research_only"),
    index_kind: z.literal("local_research_loop_evidence_index"),
    strategy_review_bundle_id: IdentifierSchema,
    strategy_id: IdentifierSchema,
    strategy_version: NonEmptyStringSchema,
    entries: z
      .array(ResearchLoopEvidenceIndexEntrySchema)
      .length(STRATEGY_DECISION_TRACE_EVENT_ORDER.length),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    generated_at: IsoDateTimeSchema
  })
  .strict()
  .superRefine((index, context) => {
    index.entries.forEach((entry, indexPosition) => {
      const expectedSequence = indexPosition + 1;
      const expectedKind = STRATEGY_DECISION_TRACE_EVENT_ORDER[indexPosition];

      if (entry.sequence !== expectedSequence) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `entry sequence must be ${expectedSequence}`,
          path: ["entries", indexPosition, "sequence"]
        });
      }

      if (entry.artifact_kind !== expectedKind) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `entry artifact kind must be ${expectedKind}`,
          path: ["entries", indexPosition, "artifact_kind"]
        });
      }
    });
  });

export type ResearchLoopEvidenceIndexEntry = z.infer<typeof ResearchLoopEvidenceIndexEntrySchema>;
export type ResearchLoopEvidenceIndex = z.infer<typeof ResearchLoopEvidenceIndexSchema>;
