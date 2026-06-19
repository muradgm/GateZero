import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ZodType } from "zod";
import {
  Gate1BacktestResultContractSchema,
  Gate1BacktestAssumptionRiskRegisterContractSchema,
  Gate1BacktestOperatorDecisionEventContractSchema,
  Gate1BacktestRunAssemblyContractSchema,
  Gate1CandleTimingIntegrityContractSchema,
  Gate1DirectionalPnlContractSchema,
  Gate1FeesAndSlippageAssumptionContractSchema,
  Gate1HistoricalDataSnapshotContractSchema,
  Gate1ImmutableBacktestRecordContractSchema,
  Gate1LookaheadBiasBlockerContractSchema,
  Gate1MetricReportEvidenceContractSchema,
  Gate1PnlEvidenceBundleContractSchema,
  Gate1PnlEvidenceReferenceContractSchema,
  Gate1ReproducibilityCheckContractSchema,
  Gate1SameCandleAmbiguityContractSchema,
  Gate1SpreadBidAskAlignmentContractSchema,
  Gate1StrategyVersionContractSchema
} from "../packages/contracts/src/index.js";
import {
  gate1BacktestAssumptionRiskRegisterFixture,
  gate1BacktestOperatorDecisionEventFixture,
  gate1BacktestRunAssemblyFixture,
  gate1BacktestResultFixture,
  gate1BadAssumptionRiskRegisterFixture,
  gate1BidAskHistoricalDataSnapshotFixture,
  gate1CandleTimingIntegrityFixture,
  gate1CrossCurrencyDirectionalPnlFixture,
  gate1FeesAndSlippageAssumptionFixture,
  gate1HistoricalDataSnapshotFixture,
  gate1ImmutableBacktestRecordFixture,
  gate1JpyPrecisionDirectionalPnlFixture,
  gate1LookaheadBiasBlockerFixture,
  gate1MetricReportEvidenceFixture,
  gate1LongDirectionalPnlFixture,
  gate1PnlEvidenceBundleFixture,
  gate1PnlEvidenceReferenceFixture,
  gate1ReproducibilityCheckFixture,
  gate1ReproducibilityMismatchFixture,
  gate1SameCandleAmbiguityFixture,
  gate1ShortDirectionalPnlFixture,
  gate1SpreadBidAskAlignmentFixture,
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
  readonly bidAskHistoricalDataSnapshot: unknown;
  readonly strategyVersion: unknown;
  readonly feesAndSlippageAssumption: unknown;
  readonly immutableBacktestRecord: unknown;
  readonly backtestResult: unknown;
  readonly longDirectionalPnl: unknown;
  readonly shortDirectionalPnl: unknown;
  readonly crossCurrencyDirectionalPnl: unknown;
  readonly jpyPrecisionDirectionalPnl: unknown;
  readonly pnlEvidenceReference: unknown;
  readonly pnlEvidenceBundle: unknown;
  readonly spreadBidAskAlignment: unknown;
  readonly candleTimingIntegrity: unknown;
  readonly lookaheadBiasBlocker: unknown;
  readonly sameCandleAmbiguity: unknown;
  readonly backtestAssumptionRiskRegister: unknown;
  readonly badAssumptionRiskRegister: unknown;
  readonly backtestRunAssembly: unknown;
  readonly metricReportEvidence: unknown;
  readonly backtestOperatorDecisionEvent: unknown;
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
  "docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT.md",
  "docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT_TESTS.md",
  "docs/operations/GATE1_BACKTEST_ASSUMPTION_RISK_REGISTER.md",
  "docs/operations/GATE1_BACKTEST_ASSUMPTION_RISK_REGISTER_NEGATIVE_CASES.md",
  "docs/operations/GATE1_RISK_REGISTER_GUARD_INDEXING_HARDENING.md",
  "docs/operations/GATE1_BAD_ASSUMPTION_FIXTURE_CASES.md",
  "docs/operations/GATE1_BACKTEST_RUN_ASSEMBLY_CONTRACT.md",
  "docs/operations/GATE1_METRIC_REPORT_EVIDENCE_ONLY_CONTRACT.md",
  "docs/operations/GATE1_REPRODUCIBILITY_COMPARISON_HARDENING.md",
  "docs/operations/GATE1_OPERATOR_DECISION_EVENT_CONTRACT.md",
  "docs/operations/GATE1_COMPLETION_CRITERIA_DRAFT.md",
  "docs/operations/GATE2_BLOCKER_AUDIT.md",
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
  "Gate1DirectionalPnlContractSchema",
  "Gate1PnlEvidenceReferenceContractSchema",
  "Gate1PnlEvidenceBundleContractSchema",
  "Gate1SpreadBidAskAlignmentContractSchema",
  "Gate1CandleTimingIntegrityContractSchema",
  "Gate1LookaheadBiasBlockerContractSchema",
  "Gate1SameCandleAmbiguityContractSchema",
  "Gate1BacktestAssumptionRiskRegisterContractSchema",
  "Gate1BacktestRunAssemblyContractSchema",
  "Gate1MetricReportEvidenceContractSchema",
  "Gate1BacktestOperatorDecisionEventContractSchema",
  "Gate1ReproducibilityCheckContractSchema"
] as const;

const requiredFixtureNames = [
  "gate1HistoricalDataSnapshotFixture",
  "gate1BidAskHistoricalDataSnapshotFixture",
  "gate1StrategyVersionFixture",
  "gate1FeesAndSlippageAssumptionFixture",
  "gate1ImmutableBacktestRecordFixture",
  "gate1BacktestResultFixture",
  "gate1LongDirectionalPnlFixture",
  "gate1ShortDirectionalPnlFixture",
  "gate1CrossCurrencyDirectionalPnlFixture",
  "gate1JpyPrecisionDirectionalPnlFixture",
  "gate1PnlEvidenceReferenceFixture",
  "gate1PnlEvidenceBundleFixture",
  "gate1SpreadBidAskAlignmentFixture",
  "gate1CandleTimingIntegrityFixture",
  "gate1LookaheadBiasBlockerFixture",
  "gate1SameCandleAmbiguityFixture",
  "gate1BacktestAssumptionRiskRegisterFixture",
  "gate1BadAssumptionRiskRegisterFixture",
  "gate1BacktestRunAssemblyFixture",
  "gate1MetricReportEvidenceFixture",
  "gate1BacktestOperatorDecisionEventFixture",
  "gate1ReproducibilityCheckFixture",
  "gate1ReproducibilityMismatchFixture"
] as const;

const requiredRiskRegisterNegativeTestSnippets = [
  "rejects backtest assumption risk registers without risk entries",
  "rejects backtest assumption risk registers with invalid severity or disposition",
  "rejects backtest assumption risk registers that leave Gate 1 historical scope",
  "keeps backtest assumption risk registers evidence-only without execution or claims"
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
  const contractTestSource = filesByPath.get(
    "packages/contracts/tests/gate1-historical-backtest-contracts.test.ts"
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
      'financial_gate: z.literal("G1_BACKTESTING")',
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

    if (!fixtureSource.includes('financial_gate: "G1_BACKTESTING"')) {
      findings.push("Gate 1 fixtures must remain tied to G1_BACKTESTING");
    }

    if (!fixtureSource.includes('scope: "historical_backtesting_only"')) {
      findings.push("Gate 1 fixtures must remain historical_backtesting_only");
    }
  }

  if (contractTestSource) {
    for (const snippet of requiredRiskRegisterNegativeTestSnippets) {
      if (!contractTestSource.includes(snippet)) {
        findings.push(`Missing risk-register negative contract test: ${snippet}`);
      }
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
    bidAskHistoricalDataSnapshot: gate1BidAskHistoricalDataSnapshotFixture,
    strategyVersion: gate1StrategyVersionFixture,
    feesAndSlippageAssumption: gate1FeesAndSlippageAssumptionFixture,
    immutableBacktestRecord: gate1ImmutableBacktestRecordFixture,
    backtestResult: gate1BacktestResultFixture,
    longDirectionalPnl: gate1LongDirectionalPnlFixture,
    shortDirectionalPnl: gate1ShortDirectionalPnlFixture,
    crossCurrencyDirectionalPnl: gate1CrossCurrencyDirectionalPnlFixture,
    jpyPrecisionDirectionalPnl: gate1JpyPrecisionDirectionalPnlFixture,
    pnlEvidenceReference: gate1PnlEvidenceReferenceFixture,
    pnlEvidenceBundle: gate1PnlEvidenceBundleFixture,
    spreadBidAskAlignment: gate1SpreadBidAskAlignmentFixture,
    candleTimingIntegrity: gate1CandleTimingIntegrityFixture,
    lookaheadBiasBlocker: gate1LookaheadBiasBlockerFixture,
    sameCandleAmbiguity: gate1SameCandleAmbiguityFixture,
    backtestAssumptionRiskRegister: gate1BacktestAssumptionRiskRegisterFixture,
    badAssumptionRiskRegister: gate1BadAssumptionRiskRegisterFixture,
    backtestRunAssembly: gate1BacktestRunAssemblyFixture,
    metricReportEvidence: gate1MetricReportEvidenceFixture,
    backtestOperatorDecisionEvent: gate1BacktestOperatorDecisionEventFixture,
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
    "gate1BidAskHistoricalDataSnapshotFixture",
    Gate1HistoricalDataSnapshotContractSchema,
    fixtureSet.bidAskHistoricalDataSnapshot
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
    "gate1LongDirectionalPnlFixture",
    Gate1DirectionalPnlContractSchema,
    fixtureSet.longDirectionalPnl
  );
  validateFixture(
    findings,
    "gate1ShortDirectionalPnlFixture",
    Gate1DirectionalPnlContractSchema,
    fixtureSet.shortDirectionalPnl
  );
  validateFixture(
    findings,
    "gate1CrossCurrencyDirectionalPnlFixture",
    Gate1DirectionalPnlContractSchema,
    fixtureSet.crossCurrencyDirectionalPnl
  );
  validateFixture(
    findings,
    "gate1JpyPrecisionDirectionalPnlFixture",
    Gate1DirectionalPnlContractSchema,
    fixtureSet.jpyPrecisionDirectionalPnl
  );
  validateFixture(
    findings,
    "gate1PnlEvidenceReferenceFixture",
    Gate1PnlEvidenceReferenceContractSchema,
    fixtureSet.pnlEvidenceReference
  );
  validateFixture(
    findings,
    "gate1PnlEvidenceBundleFixture",
    Gate1PnlEvidenceBundleContractSchema,
    fixtureSet.pnlEvidenceBundle
  );
  validateFixture(
    findings,
    "gate1SpreadBidAskAlignmentFixture",
    Gate1SpreadBidAskAlignmentContractSchema,
    fixtureSet.spreadBidAskAlignment
  );
  validateFixture(
    findings,
    "gate1CandleTimingIntegrityFixture",
    Gate1CandleTimingIntegrityContractSchema,
    fixtureSet.candleTimingIntegrity
  );
  validateFixture(
    findings,
    "gate1LookaheadBiasBlockerFixture",
    Gate1LookaheadBiasBlockerContractSchema,
    fixtureSet.lookaheadBiasBlocker
  );
  validateFixture(
    findings,
    "gate1SameCandleAmbiguityFixture",
    Gate1SameCandleAmbiguityContractSchema,
    fixtureSet.sameCandleAmbiguity
  );
  validateFixture(
    findings,
    "gate1BacktestAssumptionRiskRegisterFixture",
    Gate1BacktestAssumptionRiskRegisterContractSchema,
    fixtureSet.backtestAssumptionRiskRegister
  );
  validateFixture(
    findings,
    "gate1BadAssumptionRiskRegisterFixture",
    Gate1BacktestAssumptionRiskRegisterContractSchema,
    fixtureSet.badAssumptionRiskRegister
  );
  validateFixture(
    findings,
    "gate1BacktestRunAssemblyFixture",
    Gate1BacktestRunAssemblyContractSchema,
    fixtureSet.backtestRunAssembly
  );
  validateFixture(
    findings,
    "gate1MetricReportEvidenceFixture",
    Gate1MetricReportEvidenceContractSchema,
    fixtureSet.metricReportEvidence
  );
  validateFixture(
    findings,
    "gate1BacktestOperatorDecisionEventFixture",
    Gate1BacktestOperatorDecisionEventContractSchema,
    fixtureSet.backtestOperatorDecisionEvent
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
