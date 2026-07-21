import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  Gate2LocalCaseIntakeDiagnosticsSchema,
  type Gate2LocalCaseIntakeDiagnostic,
  type Gate2LocalResearchCaseDraft
} from "../packages/contracts/src/index.js";
import {
  buildLocalCaseCatalog,
  Gate2CaseIntakeError,
  parseLocalResearchCaseDraft
} from "../packages/core/src/index.js";

export const localCaseIntakeDirectory = "packages/fixtures/data/research-cases" as const;

export function buildCheckedInLocalCaseIntake() {
  const directory = path.join(process.cwd(), ...localCaseIntakeDirectory.split("/"));
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
          draft.freshness_status === "stale"
            ? "Accepted as blocked stale evidence."
            : "Accepted for local operator review."
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

  return {
    catalog: buildLocalCaseCatalog(drafts),
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
