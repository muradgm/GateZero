import { findLocalCase, Gate2CaseIntakeError } from "../packages/core/src/index.js";
import {
  buildCheckedInLocalCaseIntake,
  readCheckedInLocalCaseRevisions
} from "./build-local-case-catalog.js";

export interface InspectLocalCasesResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

export function runInspectLocalCasesCli(args: readonly string[]): InspectLocalCasesResult {
  try {
    const intake = buildCheckedInLocalCaseIntake();
    const catalog = intake.catalog;
    if (args.includes("--help") || args.includes("-h")) return result(0, help(), "");
    if (args.includes("--diagnostics")) {
      return result(0, JSON.stringify(intake.diagnostics, null, 2), "");
    }
    const revisionIndex = args.indexOf("--revisions");
    if (revisionIndex !== -1) {
      const caseId = args[revisionIndex + 1];
      if (!caseId) throw new Gate2CaseIntakeError("case_not_found", "A local case id is required.");
      findLocalCase(catalog, caseId);
      const revisions = readCheckedInLocalCaseRevisions()
        .filter((revision) => revision.case_id === caseId)
        .map(
          ({
            revision_id,
            revision_number,
            parent_revision_id,
            changed_fields,
            revision_reason,
            base_content_hash,
            revised_content_hash,
            created_at
          }) => ({
            revision_id,
            revision_number,
            parent_revision_id,
            changed_fields,
            revision_reason,
            base_content_hash,
            revised_content_hash,
            created_at,
            freshness_status: "unverified",
            status: "blocked",
            operator_review_required: true
          })
        );
      return result(
        0,
        JSON.stringify(
          {
            case_id: caseId,
            revision_count: revisions.length,
            revisions,
            local_only: true,
            read_only: true,
            action_route_created: false
          },
          null,
          2
        ),
        ""
      );
    }
    const caseIndex = args.indexOf("--case");
    if (caseIndex === -1) {
      return result(
        0,
        JSON.stringify(
          catalog.items.map(
            ({
              case_id,
              title,
              status,
              freshness_status,
              revision_id,
              revision_number,
              revision_pending_review
            }) => ({
              case_id,
              title,
              status,
              freshness_status,
              revision_id,
              revision_number,
              revision_pending_review
            })
          ),
          null,
          2
        ),
        ""
      );
    }
    const caseId = args[caseIndex + 1];
    if (!caseId) throw new Gate2CaseIntakeError("case_not_found", "A local case id is required.");
    return result(0, JSON.stringify(findLocalCase(catalog, caseId), null, 2), "");
  } catch (error) {
    const code = error instanceof Gate2CaseIntakeError ? error.code : "invalid_contract";
    const message = error instanceof Error ? error.message : "Local case inspection failed.";
    return result(1, "", `Local case inspection error [${code}]: ${message}\n${help()}`);
  }
}

function result(exitCode: number, stdout: string, stderr: string): InspectLocalCasesResult {
  return { exitCode, stdout, stderr };
}

function help(): string {
  return [
    "Local research-case inspection",
    "Usage: pnpm inspect:local-cases",
    "       pnpm inspect:local-cases -- --case <case-id>",
    "       pnpm inspect:local-cases -- --revisions <case-id>",
    "       pnpm inspect:local-cases -- --diagnostics",
    "Revision inspection shows immutable local lineage; it does not verify, approve, or promote a case.",
    "Boundary: checked-in, read-only, operator-review-required Gate 2 evidence only."
  ].join("\n");
}
