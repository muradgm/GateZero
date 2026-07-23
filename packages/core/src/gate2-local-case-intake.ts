import {
  Gate2LocalCaseCatalogSchema,
  Gate2LocalResearchCaseDraftSchema,
  type Gate2CaseIntakeErrorCode,
  type Gate2LocalCaseCatalog,
  type Gate2LocalCaseCatalogItem,
  type Gate2LocalResearchCaseDraft
} from "../../contracts/src/index.js";

export class Gate2CaseIntakeError extends Error {
  public constructor(
    public readonly code: Gate2CaseIntakeErrorCode,
    message: string
  ) {
    super(message);
    this.name = "Gate2CaseIntakeError";
  }
}

export function parseLocalResearchCaseDraft(input: string): Gate2LocalResearchCaseDraft {
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    throw new Gate2CaseIntakeError("invalid_json", "The local case file is not valid JSON.");
  }

  if (containsUnsafeContent(value)) {
    throw new Gate2CaseIntakeError(
      "unsafe_content",
      "The local case file contains a credential marker, URL, or external path."
    );
  }

  const result = Gate2LocalResearchCaseDraftSchema.safeParse(value);
  if (!result.success) {
    const missingRiskReview = result.error.issues.some(
      (issue) => issue.path[0] === "risk_review_ref"
    );
    throw new Gate2CaseIntakeError(
      missingRiskReview ? "missing_risk_review" : "invalid_contract",
      missingRiskReview
        ? "A checked-in local risk review reference is required."
        : "The local case file does not satisfy the intake contract."
    );
  }
  return result.data;
}

export function assembleLocalCaseCatalogItem(
  draft: Gate2LocalResearchCaseDraft
): Gate2LocalCaseCatalogItem {
  return {
    case_id: draft.case_id,
    title: draft.title,
    status: draft.freshness_status === "fresh" ? "review_required" : "blocked",
    freshness_status: draft.freshness_status,
    evidence_count: draft.evidence_refs.length,
    source_refs: [
      ...new Set([draft.strategy_idea_ref, ...draft.evidence_refs, ...draft.provenance_refs])
    ].sort(),
    risk_review_ref: draft.risk_review_ref,
    limitation_notes: draft.limitation_notes,
    operator_review_required: true,
    local_only: true,
    read_only: true,
    action_route_created: false,
    verified_at: draft.verified_at
  };
}

export function buildLocalCaseCatalog(
  drafts: readonly Gate2LocalResearchCaseDraft[]
): Gate2LocalCaseCatalog {
  const ids = drafts.map((draft) => draft.case_id);
  if (new Set(ids).size !== ids.length) {
    throw new Gate2CaseIntakeError("duplicate_case_id", "Local case ids must be unique.");
  }
  if (drafts.length === 0) {
    throw new Gate2CaseIntakeError("invalid_contract", "At least one local case is required.");
  }

  return Gate2LocalCaseCatalogSchema.parse({
    catalog_id: "gate2-local-case-catalog-001",
    generated_at: drafts
      .map((draft) => draft.verified_at)
      .sort()
      .at(-1),
    items: drafts
      .map(assembleLocalCaseCatalogItem)
      .sort((a, b) => a.case_id.localeCompare(b.case_id)),
    local_only: true,
    read_only: true,
    operator_review_required: true,
    action_route_created: false
  });
}

export function findLocalCase(
  catalog: Gate2LocalCaseCatalog,
  caseId: string
): Gate2LocalCaseCatalogItem {
  const item = catalog.items.find((candidate) => candidate.case_id === caseId);
  if (!item) {
    throw new Gate2CaseIntakeError("case_not_found", `Local case not found: ${caseId}`);
  }
  return item;
}

export interface LocalResearchCaseDraftTemplateInput {
  readonly caseId: string;
  readonly title: string;
  readonly timestamp: string;
}

export function createLocalResearchCaseDraftTemplate(
  input: LocalResearchCaseDraftTemplateInput
): Gate2LocalResearchCaseDraft {
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(input.caseId)) {
    throw new Gate2CaseIntakeError(
      "invalid_contract",
      "Case id must match lowercase letters, numbers, and hyphens only."
    );
  }

  return Gate2LocalResearchCaseDraftSchema.parse({
    case_id: input.caseId,
    title: input.title,
    strategy_idea_ref: "ops/truth/PROJECT_TRUTH.md",
    evidence_refs: ["ops/truth/PRODUCT_WEDGE.md"],
    risk_review_ref: "ops/truth/RISK_RULES.md",
    freshness_status: "fresh",
    provenance_refs: ["ops/truth/PROJECT_TRUTH.md"],
    limitation_notes: ["Local operator draft; evidence and risk references require manual review."],
    operator_review_required: true,
    local_only: true,
    read_only: true,
    action_route_created: false,
    created_at: input.timestamp,
    verified_at: input.timestamp
  });
}

function containsUnsafeContent(value: unknown): boolean {
  const serialized = JSON.stringify(value).toLowerCase();
  return (
    /https?:\/\//.test(serialized) ||
    /[a-z]:\\/.test(serialized) ||
    /(?:api[_-]?key|secret|password|token|credential)/.test(serialized)
  );
}
