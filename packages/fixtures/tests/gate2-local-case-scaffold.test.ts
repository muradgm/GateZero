import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildLocalCaseCatalog,
  createLocalResearchCaseDraftTemplate,
  parseLocalResearchCaseDraft
} from "../../core/src/index.js";
import { localCaseIntakeDirectory } from "../../../scripts/build-local-case-catalog.js";
import { runScaffoldLocalCaseCli } from "../../../scripts/scaffold-local-case-output.js";

const temporaryRoots: string[] = [];
const timestamp = "2026-07-23T00:00:00.000Z";

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe("Gate 2 local case draft scaffold", () => {
  it("builds a complete contract-valid template", () => {
    const draft = createLocalResearchCaseDraftTemplate({
      caseId: "operator-case-001",
      title: "Operator review case",
      timestamp
    });
    expect(draft).toMatchObject({
      case_id: "operator-case-001",
      risk_review_ref: "ops/truth/RISK_RULES.md",
      operator_review_required: true,
      local_only: true,
      read_only: true,
      action_route_created: false
    });
  });

  it("keeps evidence, provenance, risk, and limitations explicit", () => {
    const draft = createLocalResearchCaseDraftTemplate({
      caseId: "operator-case-002",
      title: "Evidence review",
      timestamp
    });
    expect(draft.evidence_refs).toHaveLength(1);
    expect(draft.provenance_refs).toHaveLength(1);
    expect(draft.risk_review_ref).toBeTruthy();
    expect(draft.limitation_notes).toHaveLength(1);
  });

  it("rejects an unsafe case id before writing", async () => {
    const rootDir = await temporaryRoot();
    const result = await runScaffoldLocalCaseCli(
      ["--case-id", "../outside", "--title", "Unsafe path"],
      { rootDir, timestamp }
    );
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("must match");
  });

  it("returns bounded guidance for missing fields", async () => {
    const result = await runScaffoldLocalCaseCli([], { rootDir: await temporaryRoot(), timestamp });
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Missing required --case-id value.");
    expect(result.stderr).not.toContain(" at ");
  });

  it("creates a draft only inside the bounded intake directory", async () => {
    const rootDir = await temporaryRoot();
    const result = await runScaffoldLocalCaseCli(
      ["--case-id", "operator-case-003", "--title", "Bounded draft"],
      { rootDir, timestamp }
    );
    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout) as { local_path: string };
    expect(output.local_path).toBe(`${localCaseIntakeDirectory}/operator-case-003.json`);
  });

  it("writes a draft accepted by the existing parser", async () => {
    const rootDir = await temporaryRoot();
    await runScaffoldLocalCaseCli(
      ["--case-id", "operator-case-004", "--title", "Parser compatible"],
      { rootDir, timestamp }
    );
    const content = await readDraft(rootDir, "operator-case-004");
    expect(parseLocalResearchCaseDraft(content).title).toBe("Parser compatible");
  });

  it("refuses to overwrite an existing local case file", async () => {
    const rootDir = await temporaryRoot();
    const args = ["--case-id", "operator-case-005", "--title", "No overwrite"];
    expect((await runScaffoldLocalCaseCli(args, { rootDir, timestamp })).exitCode).toBe(0);
    const second = await runScaffoldLocalCaseCli(args, { rootDir, timestamp });
    expect(second.exitCode).toBe(1);
    expect(second.stderr).toContain("already exists");
  });

  it("produces deterministic content for a fixed timestamp", async () => {
    const firstRoot = await temporaryRoot();
    const secondRoot = await temporaryRoot();
    const args = ["--case-id", "operator-case-006", "--title", "Deterministic draft"];
    await runScaffoldLocalCaseCli(args, { rootDir: firstRoot, timestamp });
    await runScaffoldLocalCaseCli(args, { rootDir: secondRoot, timestamp });
    expect(await readDraft(firstRoot, "operator-case-006")).toBe(
      await readDraft(secondRoot, "operator-case-006")
    );
  });

  it("feeds a scaffolded draft into the local catalog contract", async () => {
    const rootDir = await temporaryRoot();
    await runScaffoldLocalCaseCli(["--case-id", "operator-case-007", "--title", "Catalog case"], {
      rootDir,
      timestamp
    });
    const draft = parseLocalResearchCaseDraft(await readDraft(rootDir, "operator-case-007"));
    expect(buildLocalCaseCatalog([draft]).items[0]).toMatchObject({
      case_id: "operator-case-007",
      status: "review_required"
    });
  });

  it("documents evidence requirements and blocked capabilities in help", async () => {
    const result = await runScaffoldLocalCaseCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/evidence, provenance, risk, and limitation/i);
    expect(result.stdout).toMatch(
      /no overwrite, upload, external storage, account, or action route/i
    );
  });
});

async function temporaryRoot(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "traderframe-case-scaffold-"));
  temporaryRoots.push(root);
  return root;
}

async function readDraft(rootDir: string, caseId: string): Promise<string> {
  return readFile(
    path.join(rootDir, ...localCaseIntakeDirectory.split("/"), `${caseId}.json`),
    "utf8"
  );
}
