import { z } from "zod";
import { IdentifierSchema, IsoDateTimeSchema, NonEmptyStringSchema } from "./schemas.js";

const LocalSourcePathSchema = NonEmptyStringSchema.refine(
  (value) =>
    (value.startsWith("ops/") || value.startsWith("docs/") || value.startsWith("packages/")) &&
    !value.includes("..") &&
    !value.includes("://") &&
    !value.startsWith("/") &&
    !/^[a-z]:/i.test(value),
  "Source references must be checked-in local paths."
);

export const Gate2CaseIntakeFreshnessSchema = z.enum(["unverified", "fresh", "stale"]);
export const Gate2CaseIntakeErrorCodeSchema = z.enum([
  "invalid_json",
  "invalid_contract",
  "unsafe_content",
  "duplicate_case_id",
  "stale_evidence",
  "missing_risk_review",
  "case_not_found"
]);

export const Gate2LocalResearchCaseDraftSchema = z
  .object({
    case_id: IdentifierSchema,
    title: NonEmptyStringSchema,
    strategy_idea_ref: LocalSourcePathSchema,
    evidence_refs: z.array(LocalSourcePathSchema).min(1),
    risk_review_ref: LocalSourcePathSchema,
    freshness_status: Gate2CaseIntakeFreshnessSchema,
    provenance_refs: z.array(LocalSourcePathSchema).min(1),
    limitation_notes: z.array(NonEmptyStringSchema).min(1),
    operator_review_required: z.literal(true),
    local_only: z.literal(true),
    read_only: z.literal(true),
    action_route_created: z.literal(false),
    created_at: IsoDateTimeSchema,
    verified_at: IsoDateTimeSchema.nullable()
  })
  .strict()
  .superRefine((value, context) => {
    if (value.verified_at !== null && value.verified_at < value.created_at) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["verified_at"],
        message: "Verification cannot predate creation."
      });
    }
    if (value.freshness_status === "unverified" && value.verified_at !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["verified_at"],
        message: "Unverified evidence cannot carry a verification timestamp."
      });
    }
    if (value.freshness_status === "fresh" && value.verified_at === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["verified_at"],
        message: "Fresh evidence requires a verification timestamp."
      });
    }
  });

export const Gate2LocalCaseRevisionSchema = z
  .object({
    revision_id: IdentifierSchema,
    case_id: IdentifierSchema,
    revision_number: z.number().int().positive(),
    parent_revision_id: IdentifierSchema.nullable(),
    base_content_hash: z.string().regex(/^[a-f0-9]{64}$/),
    revised_content_hash: z.string().regex(/^[a-f0-9]{64}$/),
    changed_fields: z
      .array(
        z.enum([
          "title",
          "strategy_idea_ref",
          "evidence_refs",
          "risk_review_ref",
          "provenance_refs",
          "limitation_notes"
        ])
      )
      .min(1),
    revision_reason: NonEmptyStringSchema,
    created_at: IsoDateTimeSchema,
    revised_draft: Gate2LocalResearchCaseDraftSchema,
    operator_review_required: z.literal(true),
    local_only: z.literal(true),
    read_only: z.literal(true),
    action_route_created: z.literal(false)
  })
  .strict()
  .superRefine((value, context) => {
    if (value.revised_draft.case_id !== value.case_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["revised_draft", "case_id"],
        message: "Revision and draft case ids must match."
      });
    }
    if (value.revised_draft.freshness_status !== "unverified") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["revised_draft", "freshness_status"],
        message: "A revised draft must return to unverified evidence."
      });
    }
  });

export const Gate2LocalCaseCatalogItemSchema = z
  .object({
    case_id: IdentifierSchema,
    title: NonEmptyStringSchema,
    status: z.enum(["review_required", "blocked"]),
    freshness_status: Gate2CaseIntakeFreshnessSchema,
    evidence_count: z.number().int().positive(),
    source_refs: z.array(LocalSourcePathSchema).min(1),
    risk_review_ref: LocalSourcePathSchema,
    limitation_notes: z.array(NonEmptyStringSchema).min(1),
    operator_review_required: z.literal(true),
    local_only: z.literal(true),
    read_only: z.literal(true),
    action_route_created: z.literal(false),
    verified_at: IsoDateTimeSchema.nullable(),
    revision_id: IdentifierSchema.nullable(),
    revision_number: z.number().int().nonnegative(),
    revision_pending_review: z.boolean()
  })
  .strict();

export const Gate2LocalCaseCatalogSchema = z
  .object({
    catalog_id: IdentifierSchema,
    generated_at: IsoDateTimeSchema,
    items: z.array(Gate2LocalCaseCatalogItemSchema).min(1),
    local_only: z.literal(true),
    read_only: z.literal(true),
    operator_review_required: z.literal(true),
    action_route_created: z.literal(false)
  })
  .strict()
  .superRefine((value, context) => {
    const ids = value.items.map((item) => item.case_id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["items"],
        message: "Catalog case ids must be unique."
      });
    }
  });

export const Gate2LocalCaseIntakeDiagnosticSchema = z
  .object({
    source_file: LocalSourcePathSchema,
    status: z.enum(["accepted", "rejected"]),
    case_id: IdentifierSchema.nullable(),
    error_code: Gate2CaseIntakeErrorCodeSchema.nullable(),
    message: NonEmptyStringSchema
  })
  .strict()
  .superRefine((value, context) => {
    if (value.status === "accepted" && value.error_code !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["error_code"],
        message: "Accepted files cannot carry an error code."
      });
    }
    if (value.status === "rejected" && value.error_code === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["error_code"],
        message: "Rejected files require an error code."
      });
    }
  });

export const Gate2LocalCaseIntakeDiagnosticsSchema = z
  .object({
    intake_directory: z.literal("packages/fixtures/data/research-cases"),
    files: z.array(Gate2LocalCaseIntakeDiagnosticSchema).min(1),
    accepted_count: z.number().int().nonnegative(),
    rejected_count: z.number().int().nonnegative(),
    local_only: z.literal(true),
    read_only: z.literal(true),
    action_route_created: z.literal(false)
  })
  .strict()
  .superRefine((value, context) => {
    const accepted = value.files.filter((file) => file.status === "accepted").length;
    const rejected = value.files.length - accepted;
    if (accepted !== value.accepted_count || rejected !== value.rejected_count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["files"],
        message: "Diagnostic counts must match file outcomes."
      });
    }
  });

export type Gate2LocalResearchCaseDraft = z.infer<typeof Gate2LocalResearchCaseDraftSchema>;
export type Gate2LocalCaseRevision = z.infer<typeof Gate2LocalCaseRevisionSchema>;
export type Gate2LocalCaseCatalogItem = z.infer<typeof Gate2LocalCaseCatalogItemSchema>;
export type Gate2LocalCaseCatalog = z.infer<typeof Gate2LocalCaseCatalogSchema>;
export type Gate2CaseIntakeErrorCode = z.infer<typeof Gate2CaseIntakeErrorCodeSchema>;
export type Gate2LocalCaseIntakeDiagnostic = z.infer<typeof Gate2LocalCaseIntakeDiagnosticSchema>;
export type Gate2LocalCaseIntakeDiagnostics = z.infer<typeof Gate2LocalCaseIntakeDiagnosticsSchema>;
