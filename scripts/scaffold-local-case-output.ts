import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createLocalResearchCaseDraftTemplate } from "../packages/core/src/index.js";
import { localCaseIntakeDirectory } from "./build-local-case-catalog.js";

export interface ScaffoldLocalCaseCliResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

export interface ScaffoldLocalCaseOptions {
  readonly rootDir?: string;
  readonly timestamp?: string;
}

export async function runScaffoldLocalCaseCli(
  args: readonly string[],
  options: ScaffoldLocalCaseOptions = {}
): Promise<ScaffoldLocalCaseCliResult> {
  try {
    if (args.includes("--help") || args.includes("-h")) return result(0, help(), "");
    const caseId = readFlag(args, "--case-id");
    const title = readFlag(args, "--title");
    const timestamp = options.timestamp ?? new Date().toISOString();
    const draft = createLocalResearchCaseDraftTemplate({ caseId, title, timestamp });
    const rootDir = options.rootDir ?? process.cwd();
    const directory = path.join(rootDir, ...localCaseIntakeDirectory.split("/"));
    const outputPath = path.join(directory, `${draft.case_id}.json`);
    await mkdir(directory, { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(draft, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx"
    });
    return result(
      0,
      JSON.stringify(
        {
          status: "local_draft_created",
          case_id: draft.case_id,
          local_path: `${localCaseIntakeDirectory}/${draft.case_id}.json`,
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
        ? "A local case file with this id already exists."
        : error instanceof Error
          ? error.message
          : "Local case draft creation failed.";
    return result(1, "", `Local case scaffold error: ${message}\n${help()}`);
  }
}

function readFlag(args: readonly string[], flag: string): string {
  const index = args.indexOf(flag);
  const value = index === -1 ? undefined : args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing required ${flag} value.`);
  }
  return value;
}

function result(exitCode: number, stdout: string, stderr: string): ScaffoldLocalCaseCliResult {
  return { exitCode, stdout, stderr };
}

function help(): string {
  return [
    "Local research-case draft scaffold",
    "Usage: pnpm scaffold:local-case -- --case-id <id> --title <title>",
    "Creates one checked-in local draft with explicit evidence, provenance, risk, and limitation placeholders.",
    "No overwrite, upload, external storage, account, or action route is available."
  ].join("\n");
}
