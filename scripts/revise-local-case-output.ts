import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  createLocalCaseRevision,
  type LocalResearchCaseRevisionChanges
} from "../packages/core/src/index.js";
import {
  buildCheckedInLocalCaseIntake,
  localCaseRevisionDirectory
} from "./build-local-case-catalog.js";

export interface ReviseLocalCaseCliResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

export interface ReviseLocalCaseOptions {
  readonly rootDir?: string;
  readonly timestamp?: string;
}

const editableFlags = {
  "--title": "title",
  "--strategy-idea-ref": "strategy_idea_ref",
  "--evidence-ref": "evidence_refs",
  "--risk-review-ref": "risk_review_ref",
  "--provenance-ref": "provenance_refs",
  "--limitation-note": "limitation_notes"
} as const;

export async function runReviseLocalCaseCli(
  args: readonly string[],
  options: ReviseLocalCaseOptions = {}
): Promise<ReviseLocalCaseCliResult> {
  try {
    if (args.includes("--help") || args.includes("-h")) return result(0, help(), "");
    rejectUnknownFlags(args);
    const caseId = readSingleFlag(args, "--case-id");
    const reason = readSingleFlag(args, "--reason");
    const rootDir = options.rootDir ?? process.cwd();
    const intake = buildCheckedInLocalCaseIntake(rootDir);
    const baseDraft = intake.resolvedDrafts.find((draft) => draft.case_id === caseId);
    if (!baseDraft) throw new Error(`Local case not found: ${caseId}`);
    const previous = intake.latestRevisionByCaseId.get(caseId);
    const changes = readChanges(args);
    const revision = createLocalCaseRevision({
      baseDraft,
      revisionNumber: (previous?.revision_number ?? 0) + 1,
      parentRevisionId: previous?.revision_id ?? null,
      reason,
      timestamp: options.timestamp ?? new Date().toISOString(),
      changes
    });
    const directory = path.join(rootDir, ...localCaseRevisionDirectory.split("/"));
    const localPath = `${localCaseRevisionDirectory}/${revision.revision_id}.json`;
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, `${revision.revision_id}.json`),
      `${JSON.stringify(revision, null, 2)}\n`,
      { encoding: "utf8", flag: "wx" }
    );
    return result(
      0,
      JSON.stringify(
        {
          status: "local_revision_created",
          case_id: revision.case_id,
          revision_id: revision.revision_id,
          local_path: localPath,
          freshness_status: "unverified",
          catalog_status: "blocked",
          operator_review_required: true,
          catalog_refresh_required: true
        },
        null,
        2
      ),
      ""
    );
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;
    const message =
      fileError.code === "EEXIST"
        ? "This immutable local revision already exists."
        : error instanceof Error
          ? error.message
          : "Local case revision failed.";
    return result(1, "", `Local case revision error: ${message}\n${help()}`);
  }
}

function readChanges(args: readonly string[]): LocalResearchCaseRevisionChanges {
  const title = readOptionalSingleFlag(args, "--title");
  const strategyIdeaRef = readOptionalSingleFlag(args, "--strategy-idea-ref");
  const evidenceRefs = readRepeatedFlag(args, "--evidence-ref");
  const riskReviewRef = readOptionalSingleFlag(args, "--risk-review-ref");
  const provenanceRefs = readRepeatedFlag(args, "--provenance-ref");
  const limitationNotes = readRepeatedFlag(args, "--limitation-note");
  return {
    ...(title ? { title } : {}),
    ...(strategyIdeaRef ? { strategy_idea_ref: strategyIdeaRef } : {}),
    ...(evidenceRefs.length > 0 ? { evidence_refs: evidenceRefs } : {}),
    ...(riskReviewRef ? { risk_review_ref: riskReviewRef } : {}),
    ...(provenanceRefs.length > 0 ? { provenance_refs: provenanceRefs } : {}),
    ...(limitationNotes.length > 0 ? { limitation_notes: limitationNotes } : {})
  };
}

function readOptionalSingleFlag(args: readonly string[], flag: string): string | undefined {
  const values = readRepeatedFlag(args, flag);
  if (values.length > 1) throw new Error(`${flag} may be supplied only once.`);
  return values[0];
}

function rejectUnknownFlags(args: readonly string[]): void {
  const allowed = new Set(["--case-id", "--reason", ...Object.keys(editableFlags)]);
  const unknown = args.find((value) => value.startsWith("--") && !allowed.has(value));
  if (unknown) throw new Error(`Unsupported revision field: ${unknown}`);
}

function readSingleFlag(args: readonly string[], flag: string): string {
  const values = readRepeatedFlag(args, flag);
  if (values.length !== 1) throw new Error(`Exactly one ${flag} value is required.`);
  return values[0]!;
}

function readRepeatedFlag(args: readonly string[], flag: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== flag) continue;
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing required ${flag} value.`);
    }
    values.push(value);
  }
  return values;
}

function result(exitCode: number, stdout: string, stderr: string): ReviseLocalCaseCliResult {
  return { exitCode, stdout, stderr };
}

function help(): string {
  return [
    "Immutable local research-case revision",
    "Usage: pnpm revise:local-case -- --case-id <id> --reason <reason> [allowlisted field flags]",
    "Editable fields: --title, --strategy-idea-ref, --evidence-ref, --risk-review-ref, --provenance-ref, --limitation-note.",
    "Repeat list flags to supply multiple values.",
    "Creates a checked-in revision artifact; the original is never overwritten.",
    "Every revision becomes unverified, blocked, and operator-review-required.",
    "No upload, external storage, account, credential, approval, or action route is available."
  ].join("\n");
}
