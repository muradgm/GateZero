import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ZodType } from "zod";
import {
  Gate1BacktestResultContractSchema,
  Gate1FeesAndSlippageAssumptionContractSchema,
  Gate1HistoricalDataSnapshotContractSchema,
  Gate1ImmutableBacktestRecordContractSchema,
  Gate1ReproducibilityCheckContractSchema,
  Gate1StrategyVersionContractSchema
} from "../packages/contracts/src/index.js";
import {
  gate1BacktestResultFixture,
  gate1FeesAndSlippageAssumptionFixture,
  gate1HistoricalDataSnapshotFixture,
  gate1ImmutableBacktestRecordFixture,
  gate1ReproducibilityCheckFixture,
  gate1ReproducibilityMismatchFixture,
  gate1StrategyVersionFixture
} from "../packages/fixtures/src/index.js";

export interface Gate1ContractGuardFile {
  readonly relativePath: string;
  readonly content: string;
}

export interface Gate1ContractGuardInput {
  readonly docsReadme: string;
  readonly tracklist: string;
  readonly artifactMap: string;
  readonly packageJson: string;
  readonly files: readonly Gate1ContractGuardFile[];
  readonly fixtureSet?: Gate1ContractFixtureSet;
}

export interface Gate1ContractGuardResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly checkedArtifactCount: number;
}

export interface Gate1ContractFixtureSet {
  readonly historicalDataSnapshot: unknown;
  readonly strategyVersion: unknown;
  readonly feesAndSlippageAssumption: unknown;
  readonly immutableBacktestRecord: unknown;
  readonly backtestResult: unknown;
  readonly reproducibilityCheck: unknown;
  readonly reproducibilityMismatch: unknown;
}

const requiredDocPaths = [
  "docs/operations/GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md",
  "docs/operations/GATE1_HISTORICAL_DATA_SNAPSHOT_CONTRACT.md",
  "docs/operations/GATE1_STRATEGY_VERSION_CONTRACT.md",
  "docs/operations/GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_CONTRACT.md",
  "docs/operations/GATE1_IMMUTABLE_BACKTEST_RECORD_CONTRACT.md",
  "docs/operations/GATE1_BACKTEST_RESULT_CONTRACT.md",
  "docs/operations/GATE1_REPRODUCIBILITY_CHECK_CONTRACT.md",
  "docs/operations/GATE1_HISTORICAL_BACKTEST_FIXTURES.md",
  "docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md",
  "docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_INDEXING.md"
] as const;

const requiredSourcePaths = [
  "packages/contracts/src/gate1-historical-backtest-contracts.ts",
  "packages/contracts/tests/gate1-historical-backtest-contracts.test.ts",
  "packages/fixtures/src/gate1-historical-backtest-fixtures.ts",
  "packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts",
  "scripts/check-gate1-contracts.ts",
  "packages/fixtures/tests/gate1-contract-guard.test.ts"
] as const;

const requiredSchemaNames = [
  "Gate1HistoricalDataSnapshotContractSchema",
  "Gate1StrategyVersionContractSchema",
  "Gate1FeesAndSlippageAssumptionContractSchema",
  "Gate1ImmutableBacktestRecordContractSchema",
  "Gate1BacktestResultContractSchema",
  "Gate1ReproducibilityCheckContractSchema"
] as const;

const requiredFixtureNames = [
  "gate1HistoricalDataSnapshotFixture",
  "gate1StrategyVersionFixture",
  "gate1FeesAndSlippageAssumptionFixture",
  "gate1ImmutableBacktestRecordFixture",
  "gate1BacktestResultFixture",
  "gate1ReproducibilityCheckFixture",
  "gate1ReproducibilityMismatchFixture"
] as const;

const guardCommand = "pnpm check:gate1-contracts";

export async function loadGate1ContractGuardInput(
  rootDir: string
): Promise<Gate1ContractGuardInput> {
  const filePaths = [...requiredDocPaths, ...requiredSourcePaths];

  return {
    docsReadme: await readFile(path.join(rootDir, "docs", "README.md"), "utf8"),
    tracklist: await readFile(path.join(rootDir, "ops", "runtime", "tracklist.md"), "utf8"),
    artifactMap: await readFile(
      path.join(rootDir, "docs", "operations", "GATE0_ERGONOMICS_ARTIFACT_MAP.md"),
      "utf8"
    ),
    packageJson: await readFile(path.join(rootDir, "package.json"), "utf8"),
    files: await Promise.all(
      filePaths.map(async (relativePath) => ({
        relativePath,
        content: await readFile(path.join(rootDir, relativePath), "utf8")
      }))
    ),
    fixtureSet: createDefaultGate1ContractFixtureSet()
  };
}

export function checkGate1Contracts(input: Gate1ContractGuardInput): Gate1ContractGuardResult {
  const findings: string[] = [];
  const filesByPath = new Map(input.files.map((file) => [file.relativePath, file.content]));
  const contractSource = filesByPath.get(
    "packages/contracts/src/gate1-historical-backtest-contracts.ts"
  );
  const fixtureSource = filesByPath.get(
    "packages/fixtures/src/gate1-historical-backtest-fixtures.ts"
  );

  for (const docPath of requiredDocPaths) {
    const content = filesByPath.get(docPath);
    const docsReadmePath = docPath.replace("docs/", "");

    if (!content) {
      findings.push(`Missing Gate 1 contract document: ${docPath}`);
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

  for (const sourcePath of requiredSourcePaths) {
    if (!filesByPath.has(sourcePath)) {
      findings.push(`Missing Gate 1 contract source: ${sourcePath}`);
    }

    if (!input.tracklist.includes(sourcePath)) {
      findings.push(`Missing tracklist source link: ${sourcePath}`);
    }

    if (!input.artifactMap.includes(sourcePath)) {
      findings.push(`Missing artifact map entry: ${sourcePath}`);
    }
  }

  if (!input.packageJson.includes('"check:gate1-contracts"')) {
    findings.push('Missing package script: "check:gate1-contracts"');
  }

  if (!input.tracklist.includes(guardCommand)) {
    findings.push(`Missing guard command in tracklist: ${guardCommand}`);
  }

  if (contractSource) {
    for (const schemaName of requiredSchemaNames) {
      if (!contractSource.includes(schemaName)) {
        findings.push(`Missing contract schema: ${schemaName}`);
      }
    }

    for (const requiredLiteral of [
      'financial_gate: z.literal("G0_RESEARCH")',
      "scope: Gate1ContractScopeSchema",
      "external_access: z.literal(false)",
      "execution_path: z.literal(false)"
    ]) {
      if (!contractSource.includes(requiredLiteral)) {
        findings.push(`Missing contract boundary literal: ${requiredLiteral}`);
      }
    }
  }

  if (fixtureSource) {
    for (const fixtureName of requiredFixtureNames) {
      if (!fixtureSource.includes(fixtureName)) {
        findings.push(`Missing synthetic fixture: ${fixtureName}`);
      }
    }

    if (!fixtureSource.includes('financial_gate: "G0_RESEARCH"')) {
      findings.push("Gate 1 fixtures must remain tied to G0_RESEARCH");
    }

    if (!fixtureSource.includes('scope: "research_only"')) {
      findings.push("Gate 1 fixtures must remain research_only");
    }
  }

  findings.push(
    ...validateGate1ContractFixtureSet(input.fixtureSet ?? createDefaultGate1ContractFixtureSet())
  );

  return {
    ok: findings.length === 0,
    findings,
    checkedArtifactCount: requiredDocPaths.length + requiredSourcePaths.length
  };
}

export function createDefaultGate1ContractFixtureSet(): Gate1ContractFixtureSet {
  return {
    historicalDataSnapshot: gate1HistoricalDataSnapshotFixture,
    strategyVersion: gate1StrategyVersionFixture,
    feesAndSlippageAssumption: gate1FeesAndSlippageAssumptionFixture,
    immutableBacktestRecord: gate1ImmutableBacktestRecordFixture,
    backtestResult: gate1BacktestResultFixture,
    reproducibilityCheck: gate1ReproducibilityCheckFixture,
    reproducibilityMismatch: gate1ReproducibilityMismatchFixture
  };
}

export function validateGate1ContractFixtureSet(
  fixtureSet: Gate1ContractFixtureSet
): readonly string[] {
  const findings: string[] = [];

  validateFixture(
    findings,
    "gate1HistoricalDataSnapshotFixture",
    Gate1HistoricalDataSnapshotContractSchema,
    fixtureSet.historicalDataSnapshot
  );
  validateFixture(
    findings,
    "gate1StrategyVersionFixture",
    Gate1StrategyVersionContractSchema,
    fixtureSet.strategyVersion
  );
  validateFixture(
    findings,
    "gate1FeesAndSlippageAssumptionFixture",
    Gate1FeesAndSlippageAssumptionContractSchema,
    fixtureSet.feesAndSlippageAssumption
  );
  validateFixture(
    findings,
    "gate1ImmutableBacktestRecordFixture",
    Gate1ImmutableBacktestRecordContractSchema,
    fixtureSet.immutableBacktestRecord
  );
  validateFixture(
    findings,
    "gate1BacktestResultFixture",
    Gate1BacktestResultContractSchema,
    fixtureSet.backtestResult
  );
  validateFixture(
    findings,
    "gate1ReproducibilityCheckFixture",
    Gate1ReproducibilityCheckContractSchema,
    fixtureSet.reproducibilityCheck
  );
  validateFixture(
    findings,
    "gate1ReproducibilityMismatchFixture",
    Gate1ReproducibilityCheckContractSchema,
    fixtureSet.reproducibilityMismatch
  );

  const mismatch = Gate1ReproducibilityCheckContractSchema.safeParse(
    fixtureSet.reproducibilityMismatch
  );

  if (mismatch.success && mismatch.data.evidence_usable) {
    findings.push("Gate 1 reproducibility mismatch fixture must not be evidence usable");
  }

  return findings;
}

function validateFixture(
  findings: string[],
  fixtureName: string,
  schema: ZodType,
  fixture: unknown
): void {
  const result = schema.safeParse(fixture);

  if (!result.success) {
    findings.push(`Gate 1 fixture failed schema validation: ${fixtureName}`);
  }
}

export function renderGate1ContractGuardResult(result: Gate1ContractGuardResult): string {
  if (result.ok) {
    return [
      "Gate 1 contract guard passed.",
      `Checked artifacts: ${result.checkedArtifactCount}`
    ].join("\n");
  }

  return ["Gate 1 contract guard failed.", ...result.findings].join("\n");
}

async function main(): Promise<void> {
  const input = await loadGate1ContractGuardInput(process.cwd());
  const result = checkGate1Contracts(input);
  const output = renderGate1ContractGuardResult(result);

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
