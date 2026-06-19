import { describe, expect, it } from "vitest";
import {
  checkGate1Contracts,
  createDefaultGate1ContractFixtureSet,
  renderGate1ContractGuardResult,
  validateGate1ContractFixtureSet,
  type Gate1ContractGuardInput
} from "../../../scripts/check-gate1-contracts.js";

const requiredDocPaths = [
  "docs/operations/GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md",
  "docs/operations/GATE1_HISTORICAL_DATA_SNAPSHOT_CONTRACT.md",
  "docs/operations/GATE1_STRATEGY_VERSION_CONTRACT.md",
  "docs/operations/GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_CONTRACT.md",
  "docs/operations/GATE1_IMMUTABLE_BACKTEST_RECORD_CONTRACT.md",
  "docs/operations/GATE1_BACKTEST_RESULT_CONTRACT.md",
  "docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT.md",
  "docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT_TESTS.md",
  "docs/operations/GATE1_REPRODUCIBILITY_CHECK_CONTRACT.md",
  "docs/operations/GATE1_HISTORICAL_BACKTEST_FIXTURES.md",
  "docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md",
  "docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_INDEXING.md"
];

const requiredSourcePaths = [
  "packages/contracts/src/gate1-historical-backtest-contracts.ts",
  "packages/contracts/tests/gate1-historical-backtest-contracts.test.ts",
  "packages/fixtures/src/gate1-historical-backtest-fixtures.ts",
  "packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts",
  "scripts/check-gate1-contracts.ts",
  "packages/fixtures/tests/gate1-contract-guard.test.ts"
];

const contractSource = [
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
  "Gate1ReproducibilityCheckContractSchema",
  'financial_gate: z.literal("G1_BACKTESTING")',
  "scope: Gate1ContractScopeSchema",
  "external_access: z.literal(false)",
  "execution_path: z.literal(false)"
].join("\n");

const fixtureSource = [
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
  "gate1ReproducibilityCheckFixture",
  "gate1ReproducibilityMismatchFixture",
  'financial_gate: "G1_BACKTESTING"',
  'scope: "historical_backtesting_only"'
].join("\n");

const completeInput: Gate1ContractGuardInput = {
  docsReadme: requiredDocPaths.map((path) => `- \`${path.replace("docs/", "")}\``).join("\n"),
  tracklist: [...requiredDocPaths, ...requiredSourcePaths, "pnpm check:gate1-contracts"].join("\n"),
  artifactMap: requiredSourcePaths
    .map((path) => `| \`TRD-164\` | Gate 1 contract artifact | \`${path}\` | Local guard. |`)
    .join("\n"),
  packageJson: '{ "scripts": { "check:gate1-contracts": "tsx script.ts" } }',
  files: [
    ...requiredDocPaths.map((relativePath) => ({
      relativePath,
      content: [
        "# Gate 1 Contract Sample",
        "",
        "## Source Links",
        "",
        "- Source packet: `ops/assignments/TRD-164_GATE1_CONTRACT_VALIDATION_GUARD.md`",
        "- Reviews: `ops/runtime/reviews/TRD-164_QA_SECURITY_REVIEW.md`,",
        "  `ops/runtime/reviews/TRD-164_RISK_REVIEW.md`,",
        "  `ops/runtime/reviews/TRD-164_ORCHESTRATOR_ACCEPTANCE.md`"
      ].join("\n")
    })),
    ...requiredSourcePaths.map((relativePath) => ({
      relativePath,
      content:
        relativePath === "packages/contracts/src/gate1-historical-backtest-contracts.ts"
          ? contractSource
          : relativePath === "packages/fixtures/src/gate1-historical-backtest-fixtures.ts"
            ? fixtureSource
            : "local source"
    }))
  ]
};

describe("Gate 1 contract guard", () => {
  it("passes when docs, sources, fixtures, command, and tracker records align", () => {
    const result = checkGate1Contracts(completeInput);

    expect(result).toEqual({
      ok: true,
      findings: [],
      checkedArtifactCount: 18
    });
    expect(renderGate1ContractGuardResult(result)).toContain("Gate 1 contract guard passed.");
  });

  it("fails with bounded findings when Gate 1 contract records drift", () => {
    const result = checkGate1Contracts({
      ...completeInput,
      docsReadme: "",
      tracklist: "",
      artifactMap: "",
      packageJson: "{}",
      files: completeInput.files.filter(
        (file) => file.relativePath !== "docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md"
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing Gate 1 contract document: docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md"
    );
    expect(result.findings).toContain(
      "Missing docs index entry: operations/GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md"
    );
    expect(result.findings).toContain(
      "Missing artifact map entry: packages/contracts/src/gate1-historical-backtest-contracts.ts"
    );
    expect(result.findings).toContain('Missing package script: "check:gate1-contracts"');
    expect(result.findings).toContain(
      "Missing guard command in tracklist: pnpm check:gate1-contracts"
    );
  });

  it("fails when a packet-backed Gate 1 contract doc omits review references", () => {
    const result = checkGate1Contracts({
      ...completeInput,
      files: completeInput.files.map((file) =>
        file.relativePath === "docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md"
          ? {
              ...file,
              content: file.content.replace("`ops/runtime/reviews/TRD-164_RISK_REVIEW.md`,", "")
            }
          : file
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing review reference: docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md -> ops/runtime/reviews/TRD-164_RISK_REVIEW.md"
    );
  });

  it("fails when source text exists but parsed Gate 1 fixtures violate contract boundaries", () => {
    const fixtureSet = createDefaultGate1ContractFixtureSet();
    const result = checkGate1Contracts({
      ...completeInput,
      fixtureSet: {
        ...fixtureSet,
        historicalDataSnapshot: {
          ...asRecord(fixtureSet.historicalDataSnapshot),
          financial_gate: "G0_RESEARCH"
        },
        reproducibilityMismatch: {
          ...asRecord(fixtureSet.reproducibilityMismatch),
          evidence_usable: true
        }
      }
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Gate 1 fixture failed schema validation: gate1HistoricalDataSnapshotFixture"
    );
    expect(result.findings).toContain(
      "Gate 1 fixture failed schema validation: gate1ReproducibilityMismatchFixture"
    );
  });

  it("validates the default parsed Gate 1 fixture set", () => {
    expect(validateGate1ContractFixtureSet(createDefaultGate1ContractFixtureSet())).toEqual([]);
  });
});

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    throw new Error("fixture must be an object");
  }

  return value as Record<string, unknown>;
}
