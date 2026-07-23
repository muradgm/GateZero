import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  createLocalCaseRevision,
  hashLocalResearchCaseDraft,
  parseLocalCaseRevision,
  parseLocalResearchCaseDraft
} from "../../core/src/index.js";
import {
  buildCheckedInLocalCaseIntake,
  localCaseIntakeDirectory,
  localCaseRevisionDirectory,
  resolveLocalCaseRevisions
} from "../../../scripts/build-local-case-catalog.js";
import { runReviseLocalCaseCli } from "../../../scripts/revise-local-case-output.js";

const temporaryRoots: string[] = [];
const createdAt = "2026-07-20T00:00:00.000Z";
const revisionAt = "2026-07-23T00:00:00.000Z";

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe("Gate 2 immutable local case revision", () => {
  it("creates an immutable revision without changing the original", async () => {
    const rootDir = await caseRoot();
    const original = await readBase(rootDir);
    const result = await revise(rootDir, ["--title", "Revised operator case"]);

    expect(result.exitCode).toBe(0);
    expect(await readBase(rootDir)).toBe(original);
    expect(await readRevision(rootDir, "operator-case-001-r1")).toMatchObject({
      revision_id: "operator-case-001-r1",
      changed_fields: ["title"],
      operator_review_required: true
    });
  });

  it("resets every revision to unverified and blocked", async () => {
    const rootDir = await caseRoot();
    const result = await revise(rootDir, ["--title", "Review again"]);
    expect(JSON.parse(result.stdout)).toMatchObject({
      freshness_status: "unverified",
      catalog_status: "blocked",
      operator_review_required: true
    });
    expect(buildCheckedInLocalCaseIntake(rootDir).catalog.items[0]).toMatchObject({
      status: "blocked",
      freshness_status: "unverified",
      revision_pending_review: true,
      verified_at: null
    });
  });

  it("accepts only allowlisted evidence and limitation fields", async () => {
    const rootDir = await caseRoot();
    const result = await revise(rootDir, [
      "--evidence-ref",
      "docs/engineering/TESTING_STRATEGY.md",
      "--evidence-ref",
      "ops/truth/PRODUCT_WEDGE.md",
      "--limitation-note",
      "Operator must re-check the changed evidence."
    ]);
    expect(result.exitCode).toBe(0);
    const revision = await readRevision(rootDir, "operator-case-001-r1");
    expect(revision.changed_fields).toEqual(["evidence_refs", "limitation_notes"]);
    expect(revision.revised_draft.evidence_refs).toHaveLength(2);
  });

  it("requires an explicit revision reason and an actual change", async () => {
    const rootDir = await caseRoot();
    const missingReason = await runReviseLocalCaseCli(
      ["--case-id", "operator-case-001", "--title", "Changed"],
      { rootDir, timestamp: revisionAt }
    );
    expect(missingReason.exitCode).toBe(1);
    expect(missingReason.stderr).toContain("Exactly one --reason");
    const noChange = await revise(rootDir, ["--title", "Operator case"]);
    expect(noChange.exitCode).toBe(1);
    expect(noChange.stderr).toContain("At least one allowlisted draft field must change.");
  });

  it("rejects unsupported fields and unsafe source paths with bounded feedback", async () => {
    const rootDir = await caseRoot();
    const unsupported = await revise(rootDir, ["--status", "approved"]);
    expect(unsupported.exitCode).toBe(1);
    expect(unsupported.stderr).toContain("Unsupported revision field: --status");
    const unsafe = await revise(rootDir, ["--evidence-ref", "https://example.com/evidence"]);
    expect(unsafe.exitCode).toBe(1);
    expect(unsafe.stderr).toContain("Revision field evidence_refs");
    expect(unsafe.stderr).not.toContain(" at ");
  });

  it("builds a contiguous parent-linked revision chain", async () => {
    const rootDir = await caseRoot();
    expect((await revise(rootDir, ["--title", "Revision one"])).exitCode).toBe(0);
    expect(
      (
        await revise(rootDir, [
          "--limitation-note",
          "Revision two requires another operator review."
        ])
      ).exitCode
    ).toBe(0);
    const second = await readRevision(rootDir, "operator-case-001-r2");
    expect(second).toMatchObject({
      revision_number: 2,
      parent_revision_id: "operator-case-001-r1"
    });
  });

  it("rejects broken parent chains and content hashes", async () => {
    const base = parseLocalResearchCaseDraft(baseDraftText());
    const revision = createLocalCaseRevision({
      baseDraft: base,
      revisionNumber: 1,
      parentRevisionId: null,
      reason: "Create a valid baseline revision.",
      timestamp: revisionAt,
      changes: { title: "Changed title" }
    });
    expect(() =>
      resolveLocalCaseRevisions([base], [{ ...revision, parent_revision_id: "missing-r0" }])
    ).toThrow(/not contiguous/);
    expect(() =>
      resolveLocalCaseRevisions([base], [{ ...revision, base_content_hash: "a".repeat(64) }])
    ).toThrow(/hash does not match/);
    expect(revision.base_content_hash).toBe(hashLocalResearchCaseDraft(base));
  });

  it("exposes revision lineage in the read-only catalog", async () => {
    const rootDir = await caseRoot();
    await revise(rootDir, ["--title", "Catalog-visible revision"]);
    expect(buildCheckedInLocalCaseIntake(rootDir).catalog.items[0]).toMatchObject({
      revision_id: "operator-case-001-r1",
      revision_number: 1,
      revision_pending_review: true,
      status: "blocked",
      operator_review_required: true,
      read_only: true,
      action_route_created: false
    });
  });

  it("uses atomic create-only writes under a concurrent revision attempt", async () => {
    const rootDir = await caseRoot();
    const results = await Promise.all([
      revise(rootDir, ["--title", "Concurrent A"]),
      revise(rootDir, ["--title", "Concurrent B"])
    ]);
    expect(results.map((result) => result.exitCode).sort()).toEqual([0, 1]);
    expect(results.find((result) => result.exitCode === 1)?.stderr).toContain(
      "immutable local revision already exists"
    );
  });

  it("documents the immutable, local, non-action boundary", async () => {
    const result = await runReviseLocalCaseCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/original is never overwritten/i);
    expect(result.stdout).toMatch(/unverified, blocked, and operator-review-required/i);
    expect(result.stdout).toMatch(/no upload, external storage, account, credential, approval/i);
  });
});

async function caseRoot(): Promise<string> {
  const rootDir = await mkdtemp(path.join(tmpdir(), "traderframe-case-revision-"));
  temporaryRoots.push(rootDir);
  const directory = path.join(rootDir, ...localCaseIntakeDirectory.split("/"));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "operator-case-001.json"), baseDraftText(), "utf8");
  return rootDir;
}

function baseDraftText(): string {
  return `${JSON.stringify(
    {
      case_id: "operator-case-001",
      title: "Operator case",
      strategy_idea_ref: "ops/truth/PROJECT_TRUTH.md",
      evidence_refs: ["ops/truth/PRODUCT_WEDGE.md"],
      risk_review_ref: "ops/truth/RISK_RULES.md",
      freshness_status: "fresh",
      provenance_refs: ["ops/truth/PROJECT_TRUTH.md"],
      limitation_notes: ["Local operator evidence only."],
      operator_review_required: true,
      local_only: true,
      read_only: true,
      action_route_created: false,
      created_at: createdAt,
      verified_at: createdAt
    },
    null,
    2
  )}\n`;
}

async function revise(rootDir: string, fieldArgs: readonly string[]) {
  return runReviseLocalCaseCli(
    [
      "--case-id",
      "operator-case-001",
      "--reason",
      "Operator evidence requires a bounded revision.",
      ...fieldArgs
    ],
    { rootDir, timestamp: revisionAt }
  );
}

async function readBase(rootDir: string): Promise<string> {
  return readFile(
    path.join(rootDir, ...localCaseIntakeDirectory.split("/"), "operator-case-001.json"),
    "utf8"
  );
}

async function readRevision(rootDir: string, revisionId: string) {
  return parseLocalCaseRevision(
    await readFile(
      path.join(rootDir, ...localCaseRevisionDirectory.split("/"), `${revisionId}.json`),
      "utf8"
    )
  );
}
