import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface Gate0EvidenceIndexFile {
  readonly relativePath: string;
  readonly content: string;
}

export interface Gate0EvidenceIndexDriftInput {
  readonly docsReadme: string;
  readonly tracklist: string;
  readonly artifactMap: string;
  readonly commandIndex: string;
  readonly validationAudit: string;
  readonly packageJson: string;
  readonly files: readonly Gate0EvidenceIndexFile[];
}

export interface Gate0EvidenceIndexDriftResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly checkedArtifactCount: number;
}

const requiredDocs = [
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
] as const;

const requiredSourceArtifacts = [
  "packages/contracts/src/research-loop-evidence-index.ts",
  "packages/fixtures/src/gate0-research-loop-evidence-index.ts",
  "packages/contracts/tests/research-loop-evidence-index.test.ts",
  "packages/fixtures/tests/gate0-research-loop-evidence-index.test.ts",
  "scripts/check-gate0-evidence-index-drift.ts",
  "packages/fixtures/tests/gate0-evidence-index-drift-check.test.ts"
] as const;

const guardCommand = "pnpm check:gate0-evidence-index";
const packageScriptName = '"check:gate0-evidence-index"';

export async function loadGate0EvidenceIndexDriftInput(
  rootDir: string
): Promise<Gate0EvidenceIndexDriftInput> {
  const filePaths = [...requiredDocs, ...requiredSourceArtifacts];

  return {
    docsReadme: await readFile(path.join(rootDir, "docs", "README.md"), "utf8"),
    tracklist: await readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8"),
    artifactMap: await readFile(
      path.join(rootDir, "docs", "operations", "GATE0_ERGONOMICS_ARTIFACT_MAP.md"),
      "utf8"
    ),
    commandIndex: await readFile(
      path.join(rootDir, "docs", "operations", "GATE0_OPERATOR_COMMAND_INDEX.md"),
      "utf8"
    ),
    validationAudit: await readFile(
      path.join(rootDir, "docs", "operations", "GATE0_VALIDATION_COMMAND_AUDIT.md"),
      "utf8"
    ),
    packageJson: await readFile(path.join(rootDir, "package.json"), "utf8"),
    files: await Promise.all(
      filePaths.map(async (relativePath) => ({
        relativePath,
        content: await readFile(path.join(rootDir, relativePath), "utf8")
      }))
    )
  };
}

export function checkGate0EvidenceIndexDrift(
  input: Gate0EvidenceIndexDriftInput
): Gate0EvidenceIndexDriftResult {
  const findings: string[] = [];
  const filesByPath = new Map(input.files.map((file) => [file.relativePath, file.content]));

  for (const docPath of requiredDocs) {
    const content = filesByPath.get(docPath);
    const docsReadmePath = docPath.replace("docs/", "");

    if (!content) {
      findings.push(`Missing evidence-index document: ${docPath}`);
      continue;
    }

    if (!input.docsReadme.includes(`\`${docsReadmePath}\``)) {
      findings.push(`Missing docs index entry: ${docsReadmePath}`);
    }

    if (!input.tracklist.includes(docPath)) {
      findings.push(`Missing tracklist source link: ${docPath}`);
    }

    if (!content.includes("## Source Links")) {
      findings.push(`Missing source links section: ${docPath}`);
    }

    const sourcePacket = content.match(/Source packet: `ops\/assignments\/(TRD-\d+)_/)?.[1];

    if (sourcePacket) {
      for (const suffix of ["QA_SECURITY_REVIEW", "RISK_REVIEW", "ORCHESTRATOR_ACCEPTANCE"]) {
        const expectedReview = `ops/runtime/reviews/${sourcePacket}_${suffix}.md`;

        if (!content.includes(expectedReview)) {
          findings.push(`Missing review reference: ${docPath} -> ${expectedReview}`);
        }
      }
    }
  }

  for (const artifactPath of requiredSourceArtifacts) {
    if (!filesByPath.has(artifactPath)) {
      findings.push(`Missing evidence-index source artifact: ${artifactPath}`);
    }

    if (!input.artifactMap.includes(artifactPath)) {
      findings.push(`Missing artifact map entry: ${artifactPath}`);
    }

    if (!input.tracklist.includes(artifactPath)) {
      findings.push(`Missing tracklist source link: ${artifactPath}`);
    }
  }

  if (!input.packageJson.includes(packageScriptName)) {
    findings.push(`Missing package script: ${packageScriptName}`);
  }

  for (const [surfaceName, content] of [
    ["operator command index", input.commandIndex],
    ["validation command audit", input.validationAudit],
    ["tracklist", input.tracklist]
  ] as const) {
    if (!content.includes(guardCommand)) {
      findings.push(`Missing guard command in ${surfaceName}: ${guardCommand}`);
    }
  }

  return {
    ok: findings.length === 0,
    findings,
    checkedArtifactCount: requiredDocs.length + requiredSourceArtifacts.length
  };
}

export function renderGate0EvidenceIndexDriftResult(result: Gate0EvidenceIndexDriftResult): string {
  if (result.ok) {
    return [
      "Gate 0 evidence-index drift check passed.",
      `Checked artifacts: ${result.checkedArtifactCount}`
    ].join("\n");
  }

  return ["Gate 0 evidence-index drift check failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate0EvidenceIndexDriftInput(process.cwd());
  const result = checkGate0EvidenceIndexDrift(input);
  const output = renderGate0EvidenceIndexDriftResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
