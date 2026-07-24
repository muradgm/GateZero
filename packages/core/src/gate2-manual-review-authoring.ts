import {
  Gate2ManualReviewAuthoringRecordSchema,
  Gate2ManualReviewRecoveryResultSchema,
  type Gate2BriefManualRiskReview,
  type Gate2BriefOperatorDecision,
  type Gate2ManualReviewAuthoringRecord,
  type Gate2ManualReviewRecoveryResult
} from "../../contracts/src/index.js";

const boundary = {
  financial_gate: "G2_PAPER_TRADING" as const,
  scope: "paper_simulation_planning_only" as const,
  local_only: true as const,
  read_only: true as const,
  evidence_only: true as const,
  operator_required: true as const,
  risk_review_required: true as const,
  external_access: false as const,
  execution_path: false as const,
  action_route_created: false as const,
  recommendation_final: false as const,
  approval_claim: false as const,
  performance_claim: false as const
};

export interface Gate2ManualReviewStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function createGate2ManualReviewAuthoringRecord(input: {
  authoringRecordId: string;
  linkedResearchCaseId: string;
  briefId: string;
  briefContentSha256: string;
  riskReview: Gate2BriefManualRiskReview;
  operatorDecision: Gate2BriefOperatorDecision;
  revision: number;
  createdAt: string;
  updatedAt: string;
}): Gate2ManualReviewAuthoringRecord {
  return Gate2ManualReviewAuthoringRecordSchema.parse({
    ...boundary,
    authoring_record_id: input.authoringRecordId,
    schema_version: 1,
    linked_research_case_id: input.linkedResearchCaseId,
    brief_id: input.briefId,
    brief_content_sha256: input.briefContentSha256,
    authoring_mode: "manual_local",
    record_status: "validated_local_record",
    revision: input.revision,
    risk_review: input.riskReview,
    operator_decision: input.operatorDecision,
    created_at: input.createdAt,
    updated_at: input.updatedAt,
    execution_authorized: false,
    external_dispatch: false
  });
}

export function persistGate2ManualReview(
  storage: Gate2ManualReviewStorage,
  key: string,
  record: Gate2ManualReviewAuthoringRecord
): void {
  storage.setItem(key, JSON.stringify(Gate2ManualReviewAuthoringRecordSchema.parse(record)));
}

export function recoverGate2ManualReview(input: {
  storage: Gate2ManualReviewStorage;
  key: string;
  expectedBriefId: string;
  expectedBriefHash: string;
  minimumRevision?: number;
}): Gate2ManualReviewRecoveryResult {
  const raw = input.storage.getItem(input.key);
  if (raw === null) {
    return Gate2ManualReviewRecoveryResultSchema.parse({
      status: "empty",
      message: "No local manual review record is stored."
    });
  }

  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
  } catch {
    return Gate2ManualReviewRecoveryResultSchema.parse({
      status: "blocked",
      reason: "invalid_json",
      message: "Stored review data is not valid JSON and was not loaded."
    });
  }

  const parsed = Gate2ManualReviewAuthoringRecordSchema.safeParse(decoded);
  if (!parsed.success) {
    return Gate2ManualReviewRecoveryResultSchema.parse({
      status: "blocked",
      reason: "invalid_contract",
      message: "Stored review data does not satisfy the local authoring contract."
    });
  }
  if (
    parsed.data.brief_id !== input.expectedBriefId ||
    parsed.data.brief_content_sha256 !== input.expectedBriefHash
  ) {
    return Gate2ManualReviewRecoveryResultSchema.parse({
      status: "blocked",
      reason: "stale_brief",
      message: "Stored review data references a different frozen brief."
    });
  }
  if (input.minimumRevision !== undefined && parsed.data.revision < input.minimumRevision) {
    return Gate2ManualReviewRecoveryResultSchema.parse({
      status: "blocked",
      reason: "revision_conflict",
      message: "Stored review data is older than the active local revision."
    });
  }

  return Gate2ManualReviewRecoveryResultSchema.parse({
    status: "recovered",
    message: "Validated local manual review record recovered.",
    record: parsed.data
  });
}
