import {
  type LocalReviewBundleSummary,
  type SummarizeLocalReviewBundleQueryInput,
  type SummarizeLocalReviewBundleQueryWithGuardInput,
  summarizeLocalReviewBundleQuery,
  summarizeLocalReviewBundleQueryWithGuard
} from "./local-review-bundle-summary.js";

export type RedactionReviewContext = "local_operator_review" | "outside_local_review";

export type RedactionReasonCode =
  | "internal_identifier"
  | "integrity_metadata"
  | "raw_review_text"
  | "risk_review_detail"
  | "source_handling_detail";

export interface LocalReviewBundleRedactionPolicyEntry {
  readonly field_path: string;
  readonly reason_code: RedactionReasonCode;
  readonly classification: "local_only";
}

export interface LocalReviewBundleRedactionFinding extends LocalReviewBundleRedactionPolicyEntry {
  readonly strategy_review_bundle_id: string;
  readonly trace_id: string;
  readonly required_action: "omit_outside_local_review";
}

export interface LocalReviewBundleRedactionCheck {
  readonly strategy_review_bundle_id: string;
  readonly trace_id: string;
  readonly context: RedactionReviewContext;
  readonly finding_count: number;
  readonly findings: readonly LocalReviewBundleRedactionFinding[];
}

export interface CheckLocalReviewBundleRedactionQueryInput extends SummarizeLocalReviewBundleQueryInput {
  readonly context: RedactionReviewContext;
}

export interface CheckLocalReviewBundleRedactionQueryWithGuardInput extends SummarizeLocalReviewBundleQueryWithGuardInput {
  readonly context: RedactionReviewContext;
}

export const LOCAL_REVIEW_BUNDLE_REDACTION_POLICY: readonly LocalReviewBundleRedactionPolicyEntry[] =
  [
    {
      field_path: "strategy_review_bundle_id",
      reason_code: "internal_identifier",
      classification: "local_only"
    },
    {
      field_path: "trace_id",
      reason_code: "internal_identifier",
      classification: "local_only"
    },
    {
      field_path: "artifact_ids",
      reason_code: "internal_identifier",
      classification: "local_only"
    },
    {
      field_path: "hashes",
      reason_code: "integrity_metadata",
      classification: "local_only"
    },
    {
      field_path: "warning_text",
      reason_code: "raw_review_text",
      classification: "local_only"
    },
    {
      field_path: "blocking_findings",
      reason_code: "risk_review_detail",
      classification: "local_only"
    },
    {
      field_path: "required_controls",
      reason_code: "risk_review_detail",
      classification: "local_only"
    },
    {
      field_path: "data_context.source_version",
      reason_code: "source_handling_detail",
      classification: "local_only"
    },
    {
      field_path: "data_context.missing_data_behavior",
      reason_code: "source_handling_detail",
      classification: "local_only"
    },
    {
      field_path: "data_context.corporate_action_policy",
      reason_code: "source_handling_detail",
      classification: "local_only"
    }
  ];

export function getLocalReviewBundleRedactionPolicy(): readonly LocalReviewBundleRedactionPolicyEntry[] {
  return LOCAL_REVIEW_BUNDLE_REDACTION_POLICY;
}

export function checkLocalReviewBundleSummaryRedaction(
  summary: LocalReviewBundleSummary,
  context: RedactionReviewContext
): LocalReviewBundleRedactionCheck {
  const findings =
    context === "local_operator_review"
      ? []
      : LOCAL_REVIEW_BUNDLE_REDACTION_POLICY.map((entry) => {
          return createRedactionFinding(summary, entry);
        });

  return {
    strategy_review_bundle_id: summary.strategy_review_bundle_id,
    trace_id: summary.trace_id,
    context,
    finding_count: findings.length,
    findings
  };
}

export function checkLocalReviewBundleSummaryRedactions(
  summaries: readonly LocalReviewBundleSummary[],
  context: RedactionReviewContext
): readonly LocalReviewBundleRedactionCheck[] {
  return summaries.map((summary) => checkLocalReviewBundleSummaryRedaction(summary, context));
}

export async function checkLocalReviewBundleRedactionQuery(
  input: CheckLocalReviewBundleRedactionQueryInput
): Promise<readonly LocalReviewBundleRedactionCheck[]> {
  const summaries = await summarizeLocalReviewBundleQuery(input);

  return checkLocalReviewBundleSummaryRedactions(summaries, input.context);
}

export async function checkLocalReviewBundleRedactionQueryWithGuard(
  input: CheckLocalReviewBundleRedactionQueryWithGuardInput
): Promise<readonly LocalReviewBundleRedactionCheck[]> {
  const summaries = await summarizeLocalReviewBundleQueryWithGuard(input);

  return checkLocalReviewBundleSummaryRedactions(summaries, input.context);
}

function createRedactionFinding(
  summary: LocalReviewBundleSummary,
  entry: LocalReviewBundleRedactionPolicyEntry
): LocalReviewBundleRedactionFinding {
  return {
    strategy_review_bundle_id: summary.strategy_review_bundle_id,
    trace_id: summary.trace_id,
    field_path: entry.field_path,
    reason_code: entry.reason_code,
    classification: entry.classification,
    required_action: "omit_outside_local_review"
  };
}
