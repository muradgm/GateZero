import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  Gate2LocalCaseIntakeDiagnosticsSchema,
  type Gate2LocalCaseIntakeDiagnostic,
  type Gate2LocalCaseRevision,
  type Gate2LocalResearchCaseDraft
} from "../packages/contracts/src/index.js";
import {
  buildLocalCaseCatalog,
  Gate2CaseIntakeError,
  hashLocalResearchCaseDraft,
  parseLocalCaseRevision,
  parseLocalResearchCaseDraft
} from "../packages/core/src/index.js";

export const localCaseIntakeDirectory = "packages/fixtures/data/research-cases" as const;
export const localCaseRevisionDirectory = "packages/fixtures/data/research-case-revisions" as const;

export function buildCheckedInLocalCaseIntake(rootDir = process.cwd()) {
  const directory = path.join(rootDir, ...localCaseIntakeDirectory.split("/"));
  const files = readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .sort((left, right) => left.localeCompare(right));
  const drafts: Gate2LocalResearchCaseDraft[] = [];
  const diagnostics: Gate2LocalCaseIntakeDiagnostic[] = [];
  const caseIds = new Set<string>();

  for (const file of files) {
    const sourceFile = `${localCaseIntakeDirectory}/${file}`;
    try {
      const draft = parseLocalResearchCaseDraft(readFileSync(path.join(directory, file), "utf8"));
      if (caseIds.has(draft.case_id)) {
        throw new Gate2CaseIntakeError(
          "duplicate_case_id",
          "A duplicate local case id was rejected."
        );
      }
      caseIds.add(draft.case_id);
      drafts.push(draft);
      diagnostics.push({
        source_file: sourceFile,
        status: "accepted",
        case_id: draft.case_id,
        error_code: null,
        message:
          draft.freshness_status === "fresh"
            ? "Accepted for local operator review."
            : `Accepted as blocked ${draft.freshness_status} evidence.`
      });
    } catch (error) {
      diagnostics.push({
        source_file: sourceFile,
        status: "rejected",
        case_id: null,
        error_code: error instanceof Gate2CaseIntakeError ? error.code : "invalid_contract",
        message: "Rejected by the bounded local intake contract."
      });
    }
  }

  const resolved = resolveLocalCaseRevisions(drafts, readCheckedInLocalCaseRevisions(rootDir));

  return {
    catalog: buildLocalCaseCatalog(resolved.drafts, resolved.latestRevisionByCaseId),
    resolvedDrafts: resolved.drafts,
    latestRevisionByCaseId: resolved.latestRevisionByCaseId,
    diagnostics: Gate2LocalCaseIntakeDiagnosticsSchema.parse({
      intake_directory: localCaseIntakeDirectory,
      files: diagnostics,
      accepted_count: diagnostics.filter((file) => file.status === "accepted").length,
      rejected_count: diagnostics.filter((file) => file.status === "rejected").length,
      local_only: true,
      read_only: true,
      action_route_created: false
    })
  };
}

export function buildCheckedInLocalCaseCatalog() {
  return buildCheckedInLocalCaseIntake().catalog;
}

export function readCheckedInLocalCaseRevisions(rootDir = process.cwd()): Gate2LocalCaseRevision[] {
  const directory = path.join(rootDir, ...localCaseRevisionDirectory.split("/"));
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .sort((left, right) => left.localeCompare(right))
    .map((file) => parseLocalCaseRevision(readFileSync(path.join(directory, file), "utf8")));
}

export function resolveLocalCaseRevisions(
  baseDrafts: readonly Gate2LocalResearchCaseDraft[],
  revisions: readonly Gate2LocalCaseRevision[]
): {
  drafts: Gate2LocalResearchCaseDraft[];
  latestRevisionByCaseId: Map<string, Gate2LocalCaseRevision>;
} {
  const currentByCaseId = new Map(baseDrafts.map((draft) => [draft.case_id, draft]));
  const latestRevisionByCaseId = new Map<string, Gate2LocalCaseRevision>();
  const revisionIds = new Set<string>();

  for (const revision of [...revisions].sort(
    (left, right) =>
      left.case_id.localeCompare(right.case_id) || left.revision_number - right.revision_number
  )) {
    if (revisionIds.has(revision.revision_id)) {
      throw new Gate2CaseIntakeError("invalid_contract", "Revision ids must be unique.");
    }
    revisionIds.add(revision.revision_id);
    const current = currentByCaseId.get(revision.case_id);
    if (!current) {
      throw new Gate2CaseIntakeError(
        "case_not_found",
        `Revision references an unknown local case: ${revision.case_id}`
      );
    }
    const previous = latestRevisionByCaseId.get(revision.case_id);
    const expectedNumber = (previous?.revision_number ?? 0) + 1;
    const expectedParent = previous?.revision_id ?? null;
    if (
      revision.revision_number !== expectedNumber ||
      revision.parent_revision_id !== expectedParent
    ) {
      throw new Gate2CaseIntakeError(
        "invalid_contract",
        `Revision chain is not contiguous for case: ${revision.case_id}`
      );
    }
    if (
      revision.base_content_hash !== hashLocalResearchCaseDraft(current) ||
      revision.revised_content_hash !== hashLocalResearchCaseDraft(revision.revised_draft)
    ) {
      throw new Gate2CaseIntakeError(
        "invalid_contract",
        `Revision hash does not match local content for case: ${revision.case_id}`
      );
    }
    currentByCaseId.set(revision.case_id, revision.revised_draft);
    latestRevisionByCaseId.set(revision.case_id, revision);
  }

  return {
    drafts: [...currentByCaseId.values()],
    latestRevisionByCaseId
  };
}
