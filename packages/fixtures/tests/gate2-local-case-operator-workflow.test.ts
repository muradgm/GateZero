import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  hashLocalResearchCaseDraft,
  parseLocalCaseRevision,
  parseLocalResearchCaseDraft
} from "../../core/src/index.js";
import { buildCheckedInLocalCaseIntake } from "../../../scripts/build-local-case-catalog.js";
import { runInspectLocalCasesCli } from "../../../scripts/inspect-local-cases-output.js";

const caseId = "operator-workflow-case-001";
const basePath = path.join(
  process.cwd(),
  "packages/fixtures/data/research-cases/operator-workflow-case-001.json"
);
const revisionPath = path.join(
  process.cwd(),
  "packages/fixtures/data/research-case-revisions/operator-workflow-case-001-r1.json"
);

describe("Gate 2 checked-in operator workflow", () => {
  it("preserves the scaffolded original as an unverified local draft", () => {
    expect(parseLocalResearchCaseDraft(readFileSync(basePath, "utf8"))).toMatchObject({
      case_id: caseId,
      freshness_status: "unverified",
      verified_at: null,
      operator_review_required: true,
      local_only: true,
      action_route_created: false
    });
  });

  it("records one immutable hash-linked revision", () => {
    const base = parseLocalResearchCaseDraft(readFileSync(basePath, "utf8"));
    const revision = parseLocalCaseRevision(readFileSync(revisionPath, "utf8"));
    expect(revision).toMatchObject({
      revision_id: `${caseId}-r1`,
      case_id: caseId,
      revision_number: 1,
      parent_revision_id: null,
      base_content_hash: hashLocalResearchCaseDraft(base),
      operator_review_required: true
    });
    expect(revision.revised_draft).toMatchObject({
      freshness_status: "unverified",
      verified_at: null
    });
  });

  it("keeps workflow evidence and limitations explicit in the revision", () => {
    const revision = parseLocalCaseRevision(readFileSync(revisionPath, "utf8"));
    expect(revision.revised_draft.evidence_refs).toEqual([
      "docs/operations/LOCAL_CASE_AUTHORING_USABILITY_REVIEW.md",
      "docs/operations/LOCAL_CASE_REVISION_CHECKPOINT.md"
    ]);
    expect(revision.revised_draft.limitation_notes.join(" ")).toMatch(
      /not a strategy, market recommendation, approval, or execution route/i
    );
  });

  it("projects the revised case as blocked pending review", () => {
    const item = buildCheckedInLocalCaseIntake().catalog.items.find(
      (candidate) => candidate.case_id === caseId
    );
    expect(item).toMatchObject({
      status: "blocked",
      freshness_status: "unverified",
      revision_id: `${caseId}-r1`,
      revision_number: 1,
      revision_pending_review: true,
      operator_review_required: true,
      action_route_created: false
    });
  });

  it("shows revision state in list inspection", () => {
    const result = runInspectLocalCasesCli([]);
    const item = (JSON.parse(result.stdout) as { case_id: string }[]).find(
      (candidate) => candidate.case_id === caseId
    );
    expect(item).toMatchObject({
      revision_id: `${caseId}-r1`,
      revision_number: 1,
      revision_pending_review: true
    });
  });

  it("inspects immutable lineage without returning an action route", () => {
    const result = runInspectLocalCasesCli(["--revisions", caseId]);
    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      case_id: caseId,
      revision_count: 1,
      revisions: [
        {
          revision_id: `${caseId}-r1`,
          status: "blocked",
          freshness_status: "unverified",
          operator_review_required: true
        }
      ],
      local_only: true,
      read_only: true,
      action_route_created: false
    });
  });

  it("returns bounded revision inspection help and missing-case errors", () => {
    expect(runInspectLocalCasesCli(["--help"]).stdout).toContain("--revisions <case-id>");
    const missing = runInspectLocalCasesCli(["--revisions", "missing"]);
    expect(missing.exitCode).toBe(1);
    expect(missing.stderr).toContain("case_not_found");
    expect(missing.stderr).not.toContain(" at ");
  });

  it("keeps blocked revision, sources, and limitations adjacent in the workspace", () => {
    const source = readFileSync(
      path.join(process.cwd(), "apps/web/src/simulator-workspace.js"),
      "utf8"
    );
    const catalog = source.slice(
      source.indexOf('<section class="catalog-band"'),
      source.indexOf('<section class="intake-diagnostics"')
    );
    expect(catalog).toContain("blocked pending review");
    expect(catalog).toContain("Operator review");
    expect(catalog).toContain("Checked-in sources");
    expect(catalog).toContain("limitation_notes");
    expect(catalog).not.toMatch(/<form|<input|<textarea|upload/i);
  });

  it("includes the revised case in generated simulator workspace data", () => {
    const workspace = JSON.parse(
      readFileSync(path.join(process.cwd(), "apps/web/src/simulator-workspace-data.json"), "utf8")
    ) as { caseCatalog: { items: { case_id: string; revision_id: string | null }[] } };
    expect(workspace.caseCatalog.items).toContainEqual(
      expect.objectContaining({
        case_id: caseId,
        revision_id: `${caseId}-r1`
      })
    );
  });
});
