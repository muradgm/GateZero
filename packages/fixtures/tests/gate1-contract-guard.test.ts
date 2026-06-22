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
  "docs/operations/GATE1_SOURCE_LINK_AND_GUARD_COVERAGE_RECHECK.md",
  "docs/operations/GATE1_BACKTEST_RUN_ASSEMBLY_NEGATIVE_CASES.md",
  "docs/operations/GATE1_METRIC_REPORT_EVIDENCE_NEGATIVE_CASES.md",
  "docs/operations/GATE1_OPERATOR_DECISION_EVENT_NEGATIVE_CASES.md",
  "docs/operations/GATE1_COMPLETION_CRITERIA_SOURCE_LINK_HARDENING.md",
  "docs/operations/GATE2_BLOCKER_GUARD_COVERAGE.md",
  "docs/operations/GATE1_MISSING_CANDLE_BAD_DATA_FIXTURE_PLAN.md",
  "docs/operations/GATE1_STALE_DATA_BLOCKER_CONTRACT_PLAN.md",
  "docs/operations/GATE1_DUPLICATE_SIGNAL_BLOCKER_PLANNING_RECORD.md",
  "docs/operations/GATE1_STRATEGY_PARAMETER_IMMUTABILITY_GUARD_PLAN.md",
  "docs/operations/GATE1_EVIDENCE_BUNDLE_ASSEMBLY_REVIEW.md",
  "docs/operations/GATE1_BACKTEST_ASSEMBLY_GUARD_INDEX_RECHECK.md",
  "docs/operations/GATE1_METRIC_REPORT_GUARD_INDEX_RECHECK.md",
  "docs/operations/GATE1_OPERATOR_DECISION_GUARD_INDEX_RECHECK.md",
  "docs/operations/GATE1_MISSING_CANDLE_FIXTURE_CONTRACT.md",
  "docs/operations/GATE1_STALE_DATA_BLOCKER_CONTRACT.md",
  "docs/operations/GATE1_DUPLICATE_SIGNAL_BLOCKER_CONTRACT.md",
  "docs/operations/GATE1_PARAMETER_IMMUTABILITY_GUARD_CONTRACT.md",
  "docs/operations/GATE1_EVIDENCE_BUNDLE_SUMMARY_CONTRACT.md",
  "docs/operations/GATE1_COMPLETION_BLOCKER_RECHECK.md",
  "docs/operations/GATE1_CONTROL_PLANE_CHECKPOINT.md",
  "docs/operations/GATE1_REPRODUCIBILITY_CHECK_CONTRACT.md",
  "docs/operations/GATE1_HISTORICAL_BACKTEST_FIXTURES.md",
  "docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md",
  "docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_INDEXING.md",
  "docs/operations/GATE1_COMMAND_NAMING_MIGRATION_PLAN.md",
  "docs/operations/GATE1_BLOCKED_EVIDENCE_DOCS_COVERAGE_RECHECK.md",
  "docs/operations/GATE1_EVIDENCE_BLOCKER_AGGREGATE_GUARD.md",
  "docs/operations/GATE1_FIXTURE_MUTATION_NEGATIVE_CASES.md",
  "docs/operations/GATE1_SNAPSHOT_COLUMN_COMPLETENESS_GUARD.md",
  "docs/operations/GATE1_STALE_DATA_THRESHOLD_POLICY.md",
  "docs/operations/GATE1_PARAMETER_HASH_PROVENANCE_RECORD.md",
  "docs/operations/GATE1_DUPLICATE_SIGNAL_FINGERPRINT_CONTRACT.md",
  "docs/operations/GATE1_REAL_HISTORICAL_DATA_ADAPTER_BLOCKERS.md",
  "docs/operations/GATE1_SKILL_EVAL_PHASE_ALIGNMENT_RECHECK.md",
  "docs/operations/GATE1_COMMAND_ALIAS_COMPATIBILITY_PLAN.md",
  "docs/operations/GATE1_SKILL_GUARD_NAMING_RECHECK.md",
  "docs/operations/GATE1_BLOCKER_AGGREGATE_NEGATIVE_FIXTURE_SET.md",
  "docs/operations/GATE1_OHLC_MID_PRICE_LIMITATION_RECORD.md",
  "docs/operations/GATE1_HISTORICAL_DATA_ADAPTER_BOUNDARY.md",
  "docs/operations/GATE1_DATA_PROVIDER_PROVENANCE_FIELDS.md",
  "docs/operations/GATE1_STALE_DATA_POLICY_SOURCE_LINK_RECHECK.md",
  "docs/operations/GATE1_PARAMETER_HASH_CANONICALIZATION_PLAN.md",
  "docs/operations/GATE1_DUPLICATE_SIGNAL_FINGERPRINT_NEGATIVE_CASES.md",
  "docs/operations/GATE1_BLOCKER_EXPANSION_CHECKPOINT.md",
  "docs/operations/GATE1_ADAPTER_AUTHORIZATION_BLOCKER_INVENTORY.md",
  "docs/operations/GATE1_ADAPTER_FIXTURE_IMPORT_CONTRACT_PLAN.md",
  "docs/operations/GATE1_DUPLICATE_SIGNAL_SOURCE_LINK_RECHECK.md",
  "docs/operations/GATE1_PARAMETER_HASH_NEGATIVE_CASES_PLAN.md",
  "docs/operations/GATE1_PROVIDER_LICENSE_REVIEW_CHECKLIST.md",
  "docs/operations/GATE1_COMMAND_ALIAS_DOCS_COVERAGE_RECHECK.md",
  "docs/operations/GATE1_SKILL_METADATA_GUARD_INDEX_RECORD.md",
  "docs/operations/GATE1_IMPORTED_SNAPSHOT_QUARANTINE_POLICY.md",
  "docs/operations/GATE1_BLOCKER_CHECKPOINT_COVERAGE_RECHECK.md",
  "docs/operations/GATE1_ADAPTER_READINESS_BLOCKER_CHECKPOINT.md",
  "docs/operations/GATE1_ADAPTER_BLOCKER_SOURCE_LINK_RECHECK.md",
  "docs/operations/GATE1_IMPORTED_SNAPSHOT_SCHEMA_AUTHORITY.md",
  "docs/operations/GATE1_PROVIDER_CREDENTIAL_EXCLUSION_POLICY.md",
  "docs/operations/GATE1_QUARANTINE_POLICY_COVERAGE_RECHECK.md",
  "docs/operations/GATE1_ADAPTER_FIXTURE_NEGATIVE_CASES_PLAN.md",
  "docs/operations/GATE1_DATA_RETENTION_LIMITATION_RECORD.md",
  "docs/operations/GATE1_PROVIDER_LICENSE_CHECKLIST_COVERAGE_RECHECK.md",
  "docs/operations/GATE1_ADAPTER_AUDIT_LOG_BOUNDARY.md",
  "docs/operations/GATE1_ADAPTER_BLOCKER_CHECKPOINT_RECHECK.md",
  "docs/operations/GATE1_ADAPTER_PLANNING_FREEZE_CHECKPOINT.md",
  "docs/operations/GATE1_POST_ADAPTER_FREEZE_LANE_SELECTION.md",
  "docs/operations/GATE1_GUARD_COMMAND_DOC_ALIGNMENT_RECHECK.md",
  "docs/operations/GATE1_CONTRACT_GUARD_SCHEMA_VALIDATION_HARDENING_RECHECK.md",
  "docs/operations/GATE1_READINESS_BLOCKER_LANGUAGE_RECHECK.md",
  "docs/operations/GATE1_COMMAND_CENTER_WORDING_AUDIT.md",
  "docs/operations/GATE1_REVIEW_ARTIFACT_AGING_POLICY_DRAFT.md",
  "docs/operations/GATE1_SOURCE_LINK_MAP_CONSISTENCY_RECHECK.md",
  "docs/operations/GATE1_BLOCKED_SCOPE_SCANNER_REVIEW.md",
  "docs/operations/GATE1_OPERATOR_HANDOFF_FRESHNESS_REVIEW.md",
  "docs/operations/GATE1_MAINTENANCE_CHECKPOINT.md",
  "docs/operations/GATE1_MAINTENANCE_GAP_INTAKE.md",
  "docs/operations/GATE1_TRACKLIST_QUEUE_DISCIPLINE_RECHECK.md",
  "docs/operations/GATE1_COMMAND_CENTER_NEXT_ACTION_PAUSE_WORDING.md",
  "docs/operations/GATE1_REVIEW_AGING_POLICY_SOURCE_LINK_RECHECK.md",
  "docs/operations/GATE1_SCANNER_BLOCKED_TERM_SAMPLE_AUDIT.md",
  "docs/operations/GATE1_DOCS_STALE_REFERENCE_SWEEP.md",
  "docs/operations/GATE1_MAINTENANCE_STOP_CONDITION_CHECKPOINT.md",
  "docs/operations/GATE1_EVIDENCE_FRESHNESS_CHURN_GUARD_REVIEW.md",
  "docs/operations/GATE1_BRAND_HANDOFF_ISOLATION_REVIEW.md",
  "docs/operations/GATE1_MAINTENANCE_CLOSEOUT_CHECKPOINT.md",
  "docs/operations/GATE1_CLOSEOUT_EVIDENCE_REVIEW.md",
  "docs/operations/GATE1_ACCEPTANCE_CRITERIA_AUDIT.md",
  "docs/operations/GATE2_READINESS_ASSESSMENT_PACKET.md",
  "docs/operations/GATE2_BLOCKER_INVENTORY.md",
  "docs/operations/GATE2_AUTONOMY_GATE_DELTA_REVIEW.md",
  "docs/operations/GATE2_FINANCIAL_RISK_GATE_DELTA_REVIEW.md",
  "docs/operations/GATE2_CREDENTIAL_BOUNDARY_ASSESSMENT.md",
  "docs/operations/GATE2_EXECUTION_SCOPE_PROHIBITION_REVIEW.md",
  "docs/operations/GATE2_ASSESSMENT_QA_SECURITY_REVIEW.md",
  "docs/operations/GATE1_CLOSEOUT_RECOMMENDATION.md",
  "docs/operations/GATE1_CLOSEOUT_SIGNOFF_PACKET.md",
  "docs/operations/GATE2_AUTHORIZATION_CRITERIA_DRAFT.md",
  "docs/operations/GATE2_RISK_OWNER_AUTHORIZATION_CHECKLIST.md",
  "docs/operations/GATE2_AUTONOMY_OWNER_AUTHORIZATION_CHECKLIST.md",
  "docs/operations/GATE2_QA_SECURITY_AUTHORIZATION_CHECKLIST.md",
  "docs/operations/GATE2_IMPLEMENTATION_PROHIBITION_NOTE.md",
  "docs/operations/GATE2_OPERATOR_DECISION_AUTHORITY_REVIEW.md",
  "docs/operations/GATE1_FINAL_VERIFICATION_RECORD.md",
  "docs/operations/GATE_MOVEMENT_DECISION_PACKET_DRAFT.md",
  "docs/operations/GATE1_SIGNOFF_RECOMMENDATION.md",
  "docs/operations/GATE2_OPERATOR_GATE_DECISION_INTAKE.md",
  "docs/operations/GATE1_PAUSE_EXIT_PACKET.md",
  "docs/operations/GATE1_MATERIAL_GAP_INTAKE_RESULT.md",
  "docs/operations/GATE2_BRAND_HANDOFF_WORKSTREAM_DECISION.md",
  "docs/operations/GATE2_MOVEMENT_REQUEST_INTAKE.md",
  "docs/operations/GATE2_MOVEMENT_APPROVAL_ROUTING.md",
  "docs/operations/GATE2_MOVEMENT_DRY_RUN_CHECKLIST.md",
  "docs/operations/GATE2_PLANNING_HOLD_NOTE.md",
  "docs/operations/GATE2_COMMAND_CENTER_PLANNING_SYNC.md",
  "docs/operations/GATE2_OPERATOR_NEXT_DECISION_CHECKPOINT.md",
  "docs/operations/GATE2_SIMULATED_ORDER_RECORD_PLAN.md",
  "docs/operations/GATE2_SIMULATION_STATE_BOUNDARY_PLAN.md",
  "docs/operations/GATE2_NO_EXTERNAL_ACCOUNT_GUARD_PLAN.md",
  "docs/operations/GATE2_CREDENTIAL_EXCLUSION_GUARD_PLAN.md",
  "docs/operations/GATE2_SIMULATED_FILL_ASSUMPTION_PLAN.md",
  "docs/operations/GATE2_RISK_REVIEW_EVENT_PLAN.md",
  "docs/operations/GATE2_OPERATOR_ACTION_LOG_PLAN.md",
  "docs/operations/GATE2_NEGATIVE_FIXTURE_PLAN.md",
  "docs/operations/GATE2_COMMAND_CENTER_PLANNING_EXTENSION.md",
  "docs/operations/GATE2_IMPLEMENTATION_READINESS_REVIEW.md",
  "docs/operations/GATE2_CONTRACT_IMPLEMENTATION_PACKET.md",
  "docs/operations/GATE2_SIMULATED_ORDER_RECORD_CONTRACT.md",
  "docs/operations/GATE2_SIMULATION_STATE_CONTRACT.md",
  "docs/operations/GATE2_RISK_REVIEW_EVENT_CONTRACT.md",
  "docs/operations/GATE2_OPERATOR_ACTION_LOG_CONTRACT.md",
  "docs/operations/GATE2_SIMULATED_FILL_ASSUMPTION_CONTRACT.md",
  "docs/operations/GATE2_SYNTHETIC_FIXTURE_SET.md",
  "docs/operations/GATE2_NEGATIVE_CONTRACT_TESTS.md",
  "docs/operations/GATE2_CONTRACT_GUARD_INDEXING_UPDATE.md",
  "docs/operations/GATE2_CONTRACT_CHECKPOINT.md",
  "docs/operations/GATE2_MECHANICS_PLANNING_PACKET.md",
  "docs/operations/GATE2_LOCAL_SIMULATION_ENGINE_BOUNDARY_PLAN.md",
  "docs/operations/GATE2_SIMULATION_INPUT_ASSEMBLY_PLAN.md",
  "docs/operations/GATE2_SIMULATION_OUTPUT_ARTIFACT_PLAN.md",
  "docs/operations/GATE2_SIMULATION_REPLAY_DETERMINISM_PLAN.md",
  "docs/operations/GATE2_SIMULATION_FAILURE_MODE_PLAN.md",
  "docs/operations/GATE2_COMMAND_CENTER_MECHANICS_PLANNING_COPY.md",
  "docs/operations/GATE2_MECHANICS_IMPLEMENTATION_BLOCKER_REVIEW.md",
  "docs/operations/GATE2_CONTRACT_SOURCE_LINK_RECHECK.md",
  "docs/operations/GATE2_MECHANICS_PLANNING_CHECKPOINT.md",
  "docs/operations/GATE2_MECHANICS_IMPLEMENTATION_PACKET.md",
  "docs/operations/GATE2_LOCAL_SIMULATION_ENGINE_PURE_FUNCTION.md",
  "docs/operations/GATE2_SIMULATION_INPUT_ASSEMBLER.md",
  "docs/operations/GATE2_SIMULATION_OUTPUT_ARTIFACT_BUILDER.md",
  "docs/operations/GATE2_REPLAY_DETERMINISM_GUARD.md",
  "docs/operations/GATE2_FAILURE_MODE_FIXTURES_AND_TESTS.md",
  "docs/operations/GATE2_COMMAND_CENTER_MECHANICS_EVIDENCE_VIEW.md",
  "docs/operations/GATE2_MECHANICS_SCANNER_BOUNDARY_UPDATE.md",
  "docs/operations/GATE2_MECHANICS_SOURCE_LINK_GUARD_RECHECK.md",
  "docs/operations/GATE2_MECHANICS_IMPLEMENTATION_CHECKPOINT.md",
  "docs/operations/GATE2_POST_MECHANICS_BLOCKER_REVIEW.md",
  "docs/operations/GATE2_MECHANICS_OPERATOR_HANDOFF_NOTE.md",
  "docs/operations/GATE2_MECHANICS_CLOSURE_AUDIT.md"
];

const requiredSourcePaths = [
  "packages/contracts/src/gate1-historical-backtest-contracts.ts",
  "packages/contracts/tests/gate1-historical-backtest-contracts.test.ts",
  "packages/fixtures/src/gate1-historical-backtest-fixtures.ts",
  "packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts",
  "packages/contracts/src/gate2-paper-simulation-contracts.ts",
  "packages/contracts/tests/gate2-paper-simulation-contracts.test.ts",
  "packages/fixtures/src/gate2-paper-simulation-fixtures.ts",
  "packages/fixtures/tests/gate2-paper-simulation-fixtures.test.ts",
  "packages/core/src/gate2-local-simulation-engine.ts",
  "packages/core/tests/gate2-local-simulation-engine.test.ts",
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
  "Gate1BacktestRunAssemblyContractSchema",
  "Gate1MetricReportEvidenceContractSchema",
  "Gate1BacktestOperatorDecisionEventContractSchema",
  "Gate1ReproducibilityCheckContractSchema",
  "Gate1MissingCandleBadDataFixtureContractSchema",
  "Gate1StaleDataBlockerContractSchema",
  "Gate1DuplicateSignalBlockerContractSchema",
  "Gate1StrategyParameterImmutabilityGuardContractSchema",
  "Gate1EvidenceBundleSummaryContractSchema",
  'financial_gate: z.literal("G1_BACKTESTING")',
  "scope: Gate1ContractScopeSchema",
  "external_access: z.literal(false)",
  "execution_path: z.literal(false)"
].join("\n");

const contractTestSource = [
  "rejects backtest assumption risk registers without risk entries",
  "rejects backtest assumption risk registers with invalid severity or disposition",
  "rejects backtest assumption risk registers that leave Gate 1 historical scope",
  "keeps backtest assumption risk registers evidence-only without execution or claims",
  "rejects missing-candle fixtures that try to become evidence usable",
  "rejects stale-data blockers that imply usable evidence",
  "rejects duplicate-signal blockers without duplicate evidence or blocked status",
  "rejects parameter immutability guards with inconsistent drift state",
  "rejects Gate 1 evidence bundle summaries that imply completion or approval",
  "keeps the Gate 1 blocker aggregate complete and referenced",
  "rejects boundary mutations on blocked evidence fixtures",
  "keeps bid/ask snapshot columns complete for OHLC evidence",
  "rejects duplicate signal fingerprint blockers with weak duplicate evidence"
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
  "gate1BadAssumptionRiskRegisterFixture",
  "gate1BacktestRunAssemblyFixture",
  "gate1MetricReportEvidenceFixture",
  "gate1BacktestOperatorDecisionEventFixture",
  "gate1ReproducibilityCheckFixture",
  "gate1ReproducibilityMismatchFixture",
  "gate1MissingCandleBadDataFixture",
  "gate1StaleDataBlockerFixture",
  "gate1DuplicateSignalBlockerFixture",
  "gate1StrategyParameterImmutabilityGuardFixture",
  "gate1EvidenceBundleSummaryFixture",
  'financial_gate: "G1_BACKTESTING"',
  'scope: "historical_backtesting_only"'
].join("\n");

const gate2ContractSource = [
  "Gate2SimulatedOrderRecordContractSchema",
  "Gate2SimulationStateContractSchema",
  "Gate2RiskReviewEventContractSchema",
  "Gate2OperatorActionLogContractSchema",
  "Gate2SimulatedFillAssumptionContractSchema",
  "Gate2NegativeBoundaryFixtureContractSchema",
  "financial_gate: Gate2FinancialGateSchema",
  "scope: Gate2ContractScopeSchema",
  "external_access: z.literal(false)",
  "execution_path: z.literal(false)",
  "credentials_required: z.literal(false)",
  "live_route: z.literal(false)",
  "automated_action: z.literal(false)"
].join("\n");

const gate2ContractTestSource = [
  "rejects simulated-order records with external, credential, live, automated, or claim paths",
  "rejects automated or incoherent state transitions",
  "rejects blocked risk review events without blocking issues or with claims",
  "rejects operator action logs with automation or sensitive payload storage",
  "rejects fill assumptions without limitations or with performance claims",
  "rejects negative fixtures with real account data, secrets, or non-blocked outcomes"
].join("\n");

const gate2FixtureSource = [
  "gate2SimulatedOrderRecordFixture",
  "gate2SimulationStateFixture",
  "gate2RiskReviewEventFixture",
  "gate2OperatorActionLogFixture",
  "gate2SimulatedFillAssumptionFixture",
  "gate2NegativeBoundaryFixtures",
  'financial_gate: "G2_PAPER_TRADING"',
  'scope: "paper_simulation_planning_only"'
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
          : relativePath === "packages/contracts/tests/gate1-historical-backtest-contracts.test.ts"
            ? contractTestSource
            : relativePath === "packages/fixtures/src/gate1-historical-backtest-fixtures.ts"
              ? fixtureSource
              : relativePath === "packages/contracts/src/gate2-paper-simulation-contracts.ts"
                ? gate2ContractSource
                : relativePath ===
                    "packages/contracts/tests/gate2-paper-simulation-contracts.test.ts"
                  ? gate2ContractTestSource
                  : relativePath === "packages/fixtures/src/gate2-paper-simulation-fixtures.ts"
                    ? gate2FixtureSource
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
      checkedArtifactCount: 188
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

  it("fails when risk-register negative contract tests are not indexed", () => {
    const result = checkGate1Contracts({
      ...completeInput,
      files: completeInput.files.map((file) =>
        file.relativePath === "packages/contracts/tests/gate1-historical-backtest-contracts.test.ts"
          ? {
              ...file,
              content: contractTestSource.replace(
                "rejects backtest assumption risk registers without risk entries",
                ""
              )
            }
          : file
      )
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing risk-register negative contract test: rejects backtest assumption risk registers without risk entries"
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

  it("fails when the Gate 1 blocker aggregate drops a required blocker reference", () => {
    const fixtureSet = createDefaultGate1ContractFixtureSet();
    const summary = asRecord(fixtureSet.evidenceBundleSummary);

    expect(
      validateGate1ContractFixtureSet({
        ...fixtureSet,
        evidenceBundleSummary: {
          ...summary,
          blocker_reference_ids: (summary.blocker_reference_ids as string[]).slice(1)
        }
      })
    ).toContain(
      "Gate 1 evidence blocker aggregate is missing blocker reference: gate1-missing-candle-fixture-001"
    );
  });

  it("fails when the Gate 1 bid/ask snapshot omits a required OHLC column", () => {
    const fixtureSet = createDefaultGate1ContractFixtureSet();
    const snapshot = asRecord(fixtureSet.bidAskHistoricalDataSnapshot);

    expect(
      validateGate1ContractFixtureSet({
        ...fixtureSet,
        bidAskHistoricalDataSnapshot: {
          ...snapshot,
          column_schema: (snapshot.column_schema as Record<string, unknown>[]).filter(
            (column) => column.name !== "open_bid"
          )
        }
      })
    ).toContain("Gate 1 bid/ask snapshot missing required column: open_bid");
  });

  it("fails when the Gate 1 blocker aggregate duplicates or expands references", () => {
    const fixtureSet = createDefaultGate1ContractFixtureSet();
    const summary = asRecord(fixtureSet.evidenceBundleSummary);
    const blockerReferenceIds = summary.blocker_reference_ids as string[];

    const findings = validateGate1ContractFixtureSet({
      ...fixtureSet,
      evidenceBundleSummary: {
        ...summary,
        blocker_reference_ids: [...blockerReferenceIds, blockerReferenceIds[0]]
      }
    });

    expect(findings).toContain(
      "Gate 1 evidence blocker aggregate must not duplicate blocker references"
    );
    expect(findings).toContain(
      "Gate 1 evidence blocker aggregate must reference exactly the required blockers"
    );
  });

  it("fails when the Gate 1 bid/ask snapshot carries generic mid-price OHLC columns", () => {
    const fixtureSet = createDefaultGate1ContractFixtureSet();
    const snapshot = asRecord(fixtureSet.bidAskHistoricalDataSnapshot);

    expect(
      validateGate1ContractFixtureSet({
        ...fixtureSet,
        bidAskHistoricalDataSnapshot: {
          ...snapshot,
          column_schema: [
            ...(snapshot.column_schema as Record<string, unknown>[]),
            { name: "open", type: "number", required: true }
          ]
        }
      })
    ).toContain("Gate 1 bid/ask snapshot must not include mid-price OHLC column: open");
  });
});

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    throw new Error("fixture must be an object");
  }

  return value as Record<string, unknown>;
}
