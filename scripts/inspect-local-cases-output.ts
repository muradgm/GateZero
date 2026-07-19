import { findLocalCase, Gate2CaseIntakeError } from "../packages/core/src/index.js";
import { buildCheckedInLocalCaseCatalog } from "./build-local-case-catalog.js";

export interface InspectLocalCasesResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

export function runInspectLocalCasesCli(args: readonly string[]): InspectLocalCasesResult {
  try {
    const catalog = buildCheckedInLocalCaseCatalog();
    if (args.includes("--help") || args.includes("-h")) return result(0, help(), "");
    const caseIndex = args.indexOf("--case");
    if (caseIndex === -1) {
      return result(
        0,
        JSON.stringify(
          catalog.items.map(({ case_id, title, status, freshness_status }) => ({
            case_id,
            title,
            status,
            freshness_status
          })),
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
    "Boundary: checked-in, read-only, operator-reviewed Gate 2 evidence only."
  ].join("\n");
}
