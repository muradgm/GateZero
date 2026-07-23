import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { Gate2LocalCaseIntakeDiagnosticsSchema } from "../../contracts/src/index.js";
import {
  buildCheckedInLocalCaseIntake,
  localCaseIntakeDirectory
} from "../../../scripts/build-local-case-catalog.js";
import { runInspectLocalCasesCli } from "../../../scripts/inspect-local-cases-output.js";

describe("Gate 2 multi-file local case intake", () => {
  it("locks discovery to one checked-in directory", () => {
    expect(localCaseIntakeDirectory).toBe("packages/fixtures/data/research-cases");
  });

  it("discovers fixture files in deterministic lexical order", () => {
    const { diagnostics } = buildCheckedInLocalCaseIntake();
    const files = diagnostics.files.map((file) => file.source_file);
    expect(files).toEqual([...files].sort((left, right) => left.localeCompare(right)));
  });

  it("accepts valid files while isolating an invalid file", () => {
    const { catalog, diagnostics } = buildCheckedInLocalCaseIntake();
    expect(catalog.items).toHaveLength(3);
    expect(diagnostics).toMatchObject({ accepted_count: 3, rejected_count: 1 });
  });

  it("keeps the stale case blocked", () => {
    const stale = buildCheckedInLocalCaseIntake().catalog.items.find(
      (item) => item.case_id === "gate2-research-case-fixture-004"
    );
    expect(stale).toMatchObject({ freshness_status: "stale", status: "blocked" });
  });

  it("reports the incomplete file without exposing its payload", () => {
    const rejected = buildCheckedInLocalCaseIntake().diagnostics.files.find(
      (file) => file.status === "rejected"
    );
    expect(rejected).toMatchObject({
      case_id: null,
      error_code: "missing_risk_review",
      message: "Rejected by the bounded local intake contract."
    });
    expect(JSON.stringify(rejected)).not.toContain("Incomplete local evidence case");
  });

  it("validates diagnostic counts against file outcomes", () => {
    const diagnostics = buildCheckedInLocalCaseIntake().diagnostics;
    expect(Gate2LocalCaseIntakeDiagnosticsSchema.parse(diagnostics)).toEqual(diagnostics);
    expect(() =>
      Gate2LocalCaseIntakeDiagnosticsSchema.parse({ ...diagnostics, accepted_count: 4 })
    ).toThrow();
  });

  it("rejects inconsistent accepted diagnostics", () => {
    const diagnostics = buildCheckedInLocalCaseIntake().diagnostics;
    expect(() =>
      Gate2LocalCaseIntakeDiagnosticsSchema.parse({
        ...diagnostics,
        files: diagnostics.files.map((file, index) =>
          index === 0 ? { ...file, error_code: "invalid_contract" } : file
        )
      })
    ).toThrow();
  });

  it("exposes bounded diagnostics through the CLI", () => {
    const result = runInspectLocalCasesCli(["--diagnostics"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('"accepted_count": 3');
    expect(result.stdout).toContain('"rejected_count": 1');
    expect(result.stdout).not.toMatch(/stack|execute|broker/i);
  });

  it("lists all accepted local cases", () => {
    const result = runInspectLocalCasesCli([]);
    expect(result.stdout).toContain("gate2-research-case-fixture-003");
    expect(result.stdout).toContain("gate2-research-case-fixture-004");
    expect(result.stdout).toContain("operator-workflow-case-001");
    expect(result.stdout).not.toContain("gate2-research-case-fixture-005");
  });

  it("renders neutral diagnostics without an authoring surface", () => {
    const main = readFileSync(
      path.join(process.cwd(), "apps/web/src/simulator-workspace.js"),
      "utf8"
    );
    expect(main).toContain("Intake diagnostics");
    expect(main).toContain("is the only scanned directory");
    expect(main).not.toMatch(/<form|<input|<textarea|upload|edit case/i);
  });
});
