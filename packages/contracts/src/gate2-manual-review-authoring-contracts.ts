import { z } from "zod";
import {
  Gate2BriefManualRiskReviewSchema,
  Gate2BriefOperatorDecisionSchema
} from "./gate2-intelligence-brief-workflow-contracts.js";
import { Gate2MarketIntelligenceBoundarySchema } from "./gate2-market-intelligence-foundation-contracts.js";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9][a-z0-9-]*$/);
const IsoDateTimeSchema = z.string().datetime({ offset: true });
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);

export const Gate2ManualReviewAuthoringRecordSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  authoring_record_id: IdentifierSchema,
  schema_version: z.literal(1),
  linked_research_case_id: IdentifierSchema,
  brief_id: IdentifierSchema,
  brief_content_sha256: Sha256Schema,
  authoring_mode: z.literal("manual_local"),
  record_status: z.literal("validated_local_record"),
  revision: z.number().int().positive(),
  risk_review: Gate2BriefManualRiskReviewSchema,
  operator_decision: Gate2BriefOperatorDecisionSchema,
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  execution_authorized: z.literal(false),
  external_dispatch: z.literal(false)
})
  .strict()
  .superRefine((record, context) => {
    if (
      record.risk_review.brief_id !== record.brief_id ||
      record.operator_decision.brief_id !== record.brief_id ||
      record.operator_decision.risk_review_id !== record.risk_review.risk_review_id ||
      record.risk_review.brief_content_sha256 !== record.brief_content_sha256
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "manual review authoring references must align to one frozen brief"
      });
    }
    if (Date.parse(record.updated_at) < Date.parse(record.created_at)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "updated timestamp cannot precede created timestamp"
      });
    }
  });

export const Gate2ManualReviewRecoveryResultSchema = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("empty"),
      message: z.string().min(1)
    })
    .strict(),
  z
    .object({
      status: z.literal("recovered"),
      message: z.string().min(1),
      record: Gate2ManualReviewAuthoringRecordSchema
    })
    .strict(),
  z
    .object({
      status: z.literal("blocked"),
      reason: z.enum(["invalid_json", "invalid_contract", "stale_brief", "revision_conflict"]),
      message: z.string().min(1)
    })
    .strict()
]);

export type Gate2ManualReviewAuthoringRecord = z.infer<
  typeof Gate2ManualReviewAuthoringRecordSchema
>;
export type Gate2ManualReviewRecoveryResult = z.infer<typeof Gate2ManualReviewRecoveryResultSchema>;
