import { describe, expect, it } from "vitest";
import {
  checkGate0EvidenceIndexDrift,
  renderGate0EvidenceIndexDriftResult,
  type Gate0EvidenceIndexDriftInput
} from "../../../scripts/check-gate0-evidence-index-drift.js";

const requiredDocPaths = [
  "docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_PROPOSAL.md",
  "docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_ASSIGNMENT.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_SOURCE_LINK_CHECK.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_IMPLEMENTATION_PACKET.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_SCHEMA.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_FIXTURE.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_TESTS.md",
  "docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_COVERAGE_CHECK.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_VALIDATION_RECHECK.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_COMPLETION_AUDIT.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_FREEZE_NOTE.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_PROPOSAL.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_ASSIGNMENT.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_TESTS.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_INDEXING.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_COMPLETION_AUDIT.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_VALIDATION_RECHECK.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_GUARD_FREEZE_COMPLIANCE_CHECK.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_GUARD_SOURCE_LINK_RECHECK.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_GUARD_BOUNDARY_REVIEW.md",
  "docs/operations/GATE0_EVIDENCE_INDEX_GUARD_CHAIN_FREEZE_NOTE.md"
];

const requiredSourcePaths = [
  "packages/contracts/src/research-loop-evidence-index.ts",
  "packages/fixtures/src/gate0-research-loop-evidence-index.ts",
  "packages/contracts/tests/research-loop-evidence-index.test.ts",
  "packages/fixtures/tests/gate0-research-loop-evidence-index.test.ts",
  "scripts/check-gate0-evidence-index-drift.ts",
  "packages/fixtures/tests/gate0-evidence-index-drift-check.test.ts"
];

const completeInput: Gate0EvidenceIndexDriftInput = {
  docsReadme: requiredDocPaths.map((path) => `- \`${path.replace("docs/", "")}\``).join("\n"),
  tracklist: [...requiredDocPaths, ...requiredSourcePaths, "pnpm check:gate0-evidence-index"].join(
    "\n"
  ),
  artifactMap: requiredSourcePaths
    .map(
      (path) => `| \`TRD-100\` | Evidence index artifact | \`${path}\` | Local guard coverage. |`
    )
    .join("\n"),
  commandIndex: "| `pnpm check:gate0-evidence-index` | Check evidence-index drift. | Pass |",
  validationAudit:
    "| `pnpm check:gate0-evidence-index` | `scripts/check-gate0-evidence-index-drift.ts` | Pass |",
  packageJson: '{ "scripts": { "check:gate0-evidence-index": "tsx script.ts" } }',
  files: [
    ...requiredDocPaths.map((relativePath) => ({
      relativePath,
      content: [
        "# Gate 0 Evidence Index Sample",
        "",
        "## Source Links",
        "",
        "- Source packet: `ops/assignments/TRD-100_GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md`",
        "- Reviews: `ops/runtime/reviews/TRD-100_QA_SECURITY_REVIEW.md`,",
        "  `ops/runtime/reviews/TRD-100_RISK_REVIEW.md`,",
        "  `ops/runtime/reviews/TRD-100_ORCHESTRATOR_ACCEPTANCE.md`"
      ].join("\n")
    })),
    ...requiredSourcePaths.map((relativePath) => ({
      relativePath,
      content: "local source"
    }))
  ]
};

describe("Gate 0 evidence-index drift guard", () => {
  it("passes when evidence-index docs, sources, command, and tracker records align", () => {
    const result = checkGate0EvidenceIndexDrift(completeInput);

    expect(result).toEqual({
      ok: true,
      findings: [],
      checkedArtifactCount: 29
    });
    expect(renderGate0EvidenceIndexDriftResult(result)).toContain(
      "Gate 0 evidence-index drift check passed."
    );
  });

  it("fails with bounded findings when evidence-index records drift", () => {
    const result = checkGate0EvidenceIndexDrift({
      ...completeInput,
      docsReadme: "",
      tracklist: "",
      artifactMap: "",
      commandIndex: "",
      validationAudit: "",
      packageJson: "{}",
      files: completeInput.files.filter(
        (file) => file.relativePath !== "docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md"
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing evidence-index document: docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md"
    );
    expect(result.findings).toContain(
      "Missing docs index entry: operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_PROPOSAL.md"
    );
    expect(result.findings).toContain(
      "Missing artifact map entry: packages/contracts/src/research-loop-evidence-index.ts"
    );
    expect(result.findings).toContain('Missing package script: "check:gate0-evidence-index"');
    expect(result.findings).toContain(
      "Missing guard command in operator command index: pnpm check:gate0-evidence-index"
    );
  });

  it("fails when packet-backed docs omit review references", () => {
    const result = checkGate0EvidenceIndexDrift({
      ...completeInput,
      files: completeInput.files.map((file) =>
        file.relativePath === "docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md"
          ? {
              ...file,
              content: file.content.replace("`ops/runtime/reviews/TRD-100_RISK_REVIEW.md`,", "")
            }
          : file
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing review reference: docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md -> ops/runtime/reviews/TRD-100_RISK_REVIEW.md"
    );
  });
});
