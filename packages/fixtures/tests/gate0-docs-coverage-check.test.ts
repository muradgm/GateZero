import { describe, expect, it } from "vitest";
import {
  checkGate0DocsCoverage,
  renderGate0DocsCoverageResult
} from "../../../scripts/check-gate0-docs-coverage.js";

const completeCoverageDoc = {
  relativePath: "docs/operations/GATE0_SAMPLE_COVERAGE_CHECK.md",
  content: [
    "# Gate 0 Sample Coverage Check",
    "",
    "## Source Links",
    "",
    "- Source packet: `ops/assignments/TRD-078_GATE0_DOCS_COVERAGE_DRIFT_GUARD.md`",
    "- Reviews: `ops/runtime/reviews/TRD-078_QA_SECURITY_REVIEW.md`,",
    "  `ops/runtime/reviews/TRD-078_RISK_REVIEW.md`,",
    "  `ops/runtime/reviews/TRD-078_ORCHESTRATOR_ACCEPTANCE.md`"
  ].join("\n")
};

const completeInput = {
  docsReadme: "- `operations/GATE0_SAMPLE_COVERAGE_CHECK.md`",
  tracklist: "- Sample: `docs/operations/GATE0_SAMPLE_COVERAGE_CHECK.md`",
  artifactMap:
    "| `TRD-078` | Sample | `docs/operations/GATE0_SAMPLE_COVERAGE_CHECK.md` | Purpose |",
  operationsDocs: [completeCoverageDoc]
};

describe("Gate 0 docs coverage drift guard", () => {
  it("passes when docs index, source links, map, tracker, and reviews align", () => {
    const result = checkGate0DocsCoverage(completeInput);

    expect(result).toEqual({
      ok: true,
      findings: [],
      checkedDocumentCount: 1
    });
    expect(renderGate0DocsCoverageResult(result)).toContain("Gate 0 docs coverage check passed.");
  });

  it("fails with bounded findings when coverage references drift", () => {
    const result = checkGate0DocsCoverage({
      docsReadme: "",
      tracklist: "",
      artifactMap: "",
      operationsDocs: [
        {
          relativePath: "docs/operations/GATE0_SAMPLE_COVERAGE_CHECK.md",
          content: "# Gate 0 Sample Coverage Check"
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing docs index entry: operations/GATE0_SAMPLE_COVERAGE_CHECK.md"
    );
    expect(result.findings).toContain(
      "Missing source links section: docs/operations/GATE0_SAMPLE_COVERAGE_CHECK.md"
    );
    expect(result.findings).toContain(
      "Missing tracklist source link: docs/operations/GATE0_SAMPLE_COVERAGE_CHECK.md"
    );
    expect(result.findings).toContain(
      "Missing artifact map entry: docs/operations/GATE0_SAMPLE_COVERAGE_CHECK.md"
    );
  });

  it("fails when a packet-backed document omits a matching review reference", () => {
    const result = checkGate0DocsCoverage({
      ...completeInput,
      operationsDocs: [
        {
          ...completeCoverageDoc,
          content: completeCoverageDoc.content.replace(
            "`ops/runtime/reviews/TRD-078_RISK_REVIEW.md`,",
            ""
          )
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing review reference: docs/operations/GATE0_SAMPLE_COVERAGE_CHECK.md -> ops/runtime/reviews/TRD-078_RISK_REVIEW.md"
    );
  });
});
