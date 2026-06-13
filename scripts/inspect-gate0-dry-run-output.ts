import { createGate0DryRunInspectResult } from "../packages/core/src/index.js";
import {
  listGate0DryRunScenarioKeys,
  parseGate0DryRunScenarioKey,
  selectGate0DryRunScenarioFixture
} from "../packages/fixtures/src/index.js";

export interface InspectGate0DryRunCliResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

export function runInspectGate0DryRunCli(args: readonly string[]): InspectGate0DryRunCliResult {
  try {
    if (shouldPrintHelp(args)) {
      return {
        exitCode: 0,
        stdout: formatInspectHelp(),
        stderr: ""
      };
    }

    const scenarioKey = parseScenarioKey(args);
    const result = createGate0DryRunInspectResult(selectGate0DryRunScenarioFixture(scenarioKey));

    return {
      exitCode: 0,
      stdout: JSON.stringify(result, null, 2),
      stderr: ""
    };
  } catch (error) {
    return {
      exitCode: 1,
      stdout: "",
      stderr: formatInspectError(error)
    };
  }
}

function shouldPrintHelp(args: readonly string[]): boolean {
  return args.includes("--help") || args.includes("-h");
}

function parseScenarioKey(args: readonly string[]): ReturnType<typeof parseGate0DryRunScenarioKey> {
  const scenarioFlagIndex = args.indexOf("--scenario");

  if (scenarioFlagIndex === -1) {
    return parseGate0DryRunScenarioKey("clear");
  }

  const scenarioKey = args[scenarioFlagIndex + 1];

  if (!scenarioKey) {
    throw new Error(
      `Missing --scenario value. Use one of: ${listGate0DryRunScenarioKeys().join(", ")}`
    );
  }

  return parseGate0DryRunScenarioKey(scenarioKey);
}

function formatInspectError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown Gate 0 dry-run inspect error.";
  const scenarioKeys = listGate0DryRunScenarioKeys().join("|");

  return [
    `Gate 0 dry-run inspect error: ${message}`,
    `Usage: pnpm inspect:gate0-dry-run -- --scenario <${scenarioKeys}>`
  ].join("\n");
}

function formatInspectHelp(): string {
  const scenarioKeys = listGate0DryRunScenarioKeys();

  return [
    "Gate 0 dry-run inspect",
    "",
    "Usage:",
    "  pnpm inspect:gate0-dry-run",
    `  pnpm inspect:gate0-dry-run -- --scenario <${scenarioKeys.join("|")}>`,
    "",
    "Scenario keys:",
    ...scenarioKeys.map((scenarioKey) => `  - ${scenarioKey}`),
    "",
    "Output:",
    "  Redacted JSON with checklist summary, friction report, and iteration recommendation.",
    "",
    "Boundary:",
    "  financial_gate: G0_RESEARCH",
    "  scope: research_only",
    "  local_only: true"
  ].join("\n");
}
