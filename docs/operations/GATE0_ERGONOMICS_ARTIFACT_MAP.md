# Gate 0 Ergonomics Artifact Map

## Purpose

This map connects accepted Gate 0 operator ergonomics artifacts to their source packets.

It is an audit aid only. It does not change strategy state, risk state, maturity state, operator
decisions, gate status, or product scope.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this map only to locate local Gate 0 command, documentation, test, and review artifacts. Do not
use it as strategy approval, readiness review, performance evidence, profitability evidence,
deployment approval, or future-phase eligibility.

## Artifact Map

| Packet    | Accepted artifact or record              | Path                                                                                         | Purpose                                                          |
| --------- | ---------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `TRD-044` | Operator ergonomics brief                | `ops/runtime/reviews/G0_OPERATOR_ERGONOMICS_BRIEF.md`                                        | Defines the local ergonomics workstream.                         |
| `TRD-045` | Local dry-run inspect command            | `scripts/inspect-gate0-dry-run.ts`                                                           | Runs the local dry-run inspect entrypoint.                       |
| `TRD-045` | Inspect command output helper            | `scripts/inspect-gate0-dry-run-output.ts`                                                    | Formats inspect command stdout, stderr, and exit behavior.       |
| `TRD-046` | Dry-run walkthrough                      | `docs/operations/GATE0_DRY_RUN_WALKTHROUGH.md`                                               | Explains the local dry-run inspect routine.                      |
| `TRD-047` | Blocked-friction dry-run fixture         | `packages/fixtures/src/gate0-dry-run-scenario.ts`                                            | Provides clear and friction synthetic local scenarios.           |
| `TRD-048` | Scenario selector                        | `packages/fixtures/src/gate0-dry-run-scenario.ts`                                            | Selects static local dry-run scenarios.                          |
| `TRD-049` | Invalid scenario handling                | `scripts/inspect-gate0-dry-run-output.ts`                                                    | Keeps unsupported scenario input bounded.                        |
| `TRD-050` | Inspect command help text                | `scripts/inspect-gate0-dry-run-output.ts`                                                    | Documents command usage and Gate 0 boundary in help output.      |
| `TRD-051` | Inspect output shape tests               | `packages/fixtures/tests/gate0-dry-run-inspect-cli-output.test.ts`                           | Verifies help, clear, friction, and invalid input behavior.      |
| `TRD-052` | Operator review runbook                  | `docs/operations/GATE0_OPERATOR_REVIEW_RUNBOOK.md`                                           | Defines the local operator review routine.                       |
| `TRD-053` | Progress snapshot generator              | `scripts/generate-gate0-progress-snapshot.ts`                                                | Writes the local progress snapshot.                              |
| `TRD-053` | Progress snapshot generator tests        | `packages/fixtures/tests/gate0-progress-snapshot-generator.test.ts`                          | Verifies deterministic snapshot rendering.                       |
| `TRD-054` | Tracklist consistency check              | `scripts/check-gate0-tracklist-consistency.ts`                                               | Checks accepted records against tracklist ledger rows.           |
| `TRD-054` | Tracklist consistency tests              | `packages/fixtures/tests/gate0-tracklist-consistency.test.ts`                                | Verifies passing and failing tracklist states.                   |
| `TRD-055` | Inspect command contract                 | `docs/operations/GATE0_INSPECT_COMMAND_CONTRACT.md`                                          | Defines inspect command inputs, outputs, and boundaries.         |
| `TRD-056` | Operator ergonomics completion audit     | `ops/runtime/reviews/G0_OPERATOR_ERGONOMICS_COMPLETION_AUDIT.md`                             | Closes the current ergonomics chain for Gate 0.                  |
| `TRD-057` | Operator checklist                       | `docs/operations/GATE0_OPERATOR_CHECKLIST.md`                                                | Extracts a short local checklist from the runbook.               |
| `TRD-058` | Progress snapshot freshness check        | `scripts/check-gate0-progress-snapshot-freshness.ts`                                         | Checks the generated snapshot against current local records.     |
| `TRD-058` | Progress snapshot freshness tests        | `packages/fixtures/tests/gate0-progress-snapshot-freshness.test.ts`                          | Verifies passing and failing freshness states.                   |
| `TRD-059` | Project-name check                       | `scripts/check-gate0-project-name.ts`                                                        | Checks GateZero naming across local repo-relative surfaces.      |
| `TRD-059` | Project-name check tests                 | `packages/fixtures/tests/gate0-project-name-check.test.ts`                                   | Verifies passing and failing name states.                        |
| `TRD-060` | Operator command index                   | `docs/operations/GATE0_OPERATOR_COMMAND_INDEX.md`                                            | Lists current local operator commands.                           |
| `TRD-061` | Ergonomics artifact map                  | `docs/operations/GATE0_ERGONOMICS_ARTIFACT_MAP.md`                                           | Maps local ergonomics artifacts to accepted packets.             |
| `TRD-062` | Documentation cross-link audit           | `docs/operations/GATE0_DOCUMENTATION_CROSS_LINK_AUDIT.md`                                    | Verifies operator docs link to local source references.          |
| `TRD-063` | Validation command audit                 | `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`                                          | Maps validation commands to accepted local checks.               |
| `TRD-064` | Name check coverage audit                | `docs/operations/GATE0_NAME_CHECK_COVERAGE_AUDIT.md`                                         | Documents GateZero project-name check coverage.                  |
| `TRD-065` | Command index coverage check             | `docs/operations/GATE0_COMMAND_INDEX_COVERAGE_CHECK.md`                                      | Verifies command index coverage against local commands.          |
| `TRD-066` | Artifact map coverage check              | `docs/operations/GATE0_ARTIFACT_MAP_COVERAGE_CHECK.md`                                       | Verifies artifact-map paths and accepted source packets.         |
| `TRD-067` | Cross-link coverage check                | `docs/operations/GATE0_CROSS_LINK_COVERAGE_CHECK.md`                                         | Verifies cross-link audit entries remain present and local.      |
| `TRD-068` | Validation audit coverage check          | `docs/operations/GATE0_VALIDATION_AUDIT_COVERAGE_CHECK.md`                                   | Verifies validation audit entries match package scripts.         |
| `TRD-069` | Name check coverage check                | `docs/operations/GATE0_NAME_CHECK_COVERAGE_CHECK.md`                                         | Verifies name-check audit entries match script coverage.         |
| `TRD-070` | Command index coverage recheck           | `docs/operations/GATE0_COMMAND_INDEX_COVERAGE_RECHECK.md`                                    | Rechecks command-index coverage alignment.                       |
| `TRD-071` | Artifact map coverage recheck            | `docs/operations/GATE0_ARTIFACT_MAP_COVERAGE_RECHECK.md`                                     | Rechecks artifact-map coverage alignment.                        |
| `TRD-072` | Cross-link coverage recheck              | `docs/operations/GATE0_CROSS_LINK_COVERAGE_RECHECK.md`                                       | Rechecks cross-link coverage alignment.                          |
| `TRD-073` | Operator docs index coverage check       | `docs/operations/GATE0_OPERATOR_DOCS_INDEX_COVERAGE_CHECK.md`                                | Verifies docs-index coverage for operator documents.             |
| `TRD-074` | Review record naming check               | `docs/operations/GATE0_REVIEW_RECORD_NAMING_CHECK.md`                                        | Verifies assignment and review record naming alignment.          |
| `TRD-075` | Source links coverage check              | `docs/operations/GATE0_SOURCE_LINKS_COVERAGE_CHECK.md`                                       | Verifies operator documents keep local source links.             |
| `TRD-076` | Coverage chain completion audit          | `docs/operations/GATE0_COVERAGE_CHAIN_COMPLETION_AUDIT.md`                                   | Summarizes the current local coverage-hardening chain.           |
| `TRD-077` | Coverage drift guard proposal            | `docs/operations/GATE0_COVERAGE_DRIFT_GUARD_PROPOSAL.md`                                     | Proposes a future non-authorizing local coverage guard.          |
| `TRD-078` | Docs coverage drift guard                | `scripts/check-gate0-docs-coverage.ts`                                                       | Checks local operator docs coverage drift.                       |
| `TRD-078` | Docs coverage drift guard document       | `docs/operations/GATE0_DOCS_COVERAGE_DRIFT_GUARD.md`                                         | Documents the local docs coverage drift guard.                   |
| `TRD-079` | Docs coverage drift guard tests          | `packages/fixtures/tests/gate0-docs-coverage-check.test.ts`                                  | Tests pass and bounded failure paths for the guard.              |
| `TRD-079` | Docs coverage drift guard test note      | `docs/operations/GATE0_DOCS_COVERAGE_DRIFT_GUARD_TESTS.md`                                   | Documents the guard test coverage.                               |
| `TRD-080` | Docs coverage drift guard indexing       | `docs/operations/GATE0_DOCS_COVERAGE_DRIFT_GUARD_INDEXING.md`                                | Records command, validation, tracker, and index wiring.          |
| `TRD-081` | Coverage guard completion audit          | `docs/operations/GATE0_COVERAGE_GUARD_COMPLETION_AUDIT.md`                                   | Summarizes the implemented docs coverage guard chain.            |
| `TRD-082` | Operator ergonomics freeze note          | `docs/operations/GATE0_OPERATOR_ERGONOMICS_FREEZE_NOTE.md`                                   | Freezes the current Gate 0 ergonomics boundary.                  |
| `TRD-083` | Ergonomics freeze compliance check       | `docs/operations/GATE0_ERGONOMICS_FREEZE_COMPLIANCE_CHECK.md`                                | Verifies freeze-note representation in local docs and tracker.   |
| `TRD-084` | Validation command coverage recheck      | `docs/operations/GATE0_VALIDATION_COMMAND_COVERAGE_RECHECK.md`                               | Rechecks validation-command coverage after recent guard docs.    |
| `TRD-085` | Operator boundary review                 | `docs/operations/GATE0_OPERATOR_BOUNDARY_REVIEW.md`                                          | Reviews whether broad ergonomics work should pause.              |
| `TRD-086` | Research loop evidence index proposal    | `docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_PROPOSAL.md`                             | Proposes a local evidence-index shape without implementation.    |
| `TRD-087` | Research loop evidence index assignment  | `docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_ASSIGNMENT.md`                           | Bounds a future evidence-index assignment.                       |
| `TRD-088` | Evidence index source-link check         | `docs/operations/GATE0_EVIDENCE_INDEX_SOURCE_LINK_CHECK.md`                                  | Verifies evidence-index planning docs keep source links.         |
| `TRD-089` | Evidence index implementation packet     | `docs/operations/GATE0_EVIDENCE_INDEX_IMPLEMENTATION_PACKET.md`                              | Records the local evidence-index implementation bounds.          |
| `TRD-090` | Evidence index schema                    | `packages/contracts/src/research-loop-evidence-index.ts`                                     | Defines the local evidence-index contract.                       |
| `TRD-090` | Evidence index schema documentation      | `docs/operations/GATE0_EVIDENCE_INDEX_SCHEMA.md`                                             | Documents the local evidence-index schema boundary.              |
| `TRD-091` | Evidence index fixture                   | `packages/fixtures/src/gate0-research-loop-evidence-index.ts`                                | Adds a synthetic evidence-index fixture.                         |
| `TRD-091` | Evidence index fixture documentation     | `docs/operations/GATE0_EVIDENCE_INDEX_FIXTURE.md`                                            | Documents the synthetic fixture boundary.                        |
| `TRD-092` | Evidence index contract tests            | `packages/contracts/tests/research-loop-evidence-index.test.ts`                              | Tests schema pass and bounded failure behavior.                  |
| `TRD-092` | Evidence index fixture tests             | `packages/fixtures/tests/gate0-research-loop-evidence-index.test.ts`                         | Tests fixture validity and deterministic reads.                  |
| `TRD-092` | Evidence index test documentation        | `docs/operations/GATE0_EVIDENCE_INDEX_TESTS.md`                                              | Documents local test coverage.                                   |
| `TRD-093` | Research loop evidence index docs        | `docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX.md`                                      | Documents the local evidence index and boundary.                 |
| `TRD-094` | Evidence index coverage check            | `docs/operations/GATE0_EVIDENCE_INDEX_COVERAGE_CHECK.md`                                     | Verifies evidence-index artifacts are mapped.                    |
| `TRD-095` | Evidence index validation recheck        | `docs/operations/GATE0_EVIDENCE_INDEX_VALIDATION_RECHECK.md`                                 | Rechecks validation after the evidence-index chain.              |
| `TRD-096` | Evidence index completion audit          | `docs/operations/GATE0_EVIDENCE_INDEX_COMPLETION_AUDIT.md`                                   | Summarizes evidence-index chain completion.                      |
| `TRD-097` | Evidence index freeze note               | `docs/operations/GATE0_EVIDENCE_INDEX_FREEZE_NOTE.md`                                        | Freezes the current local evidence-index surface.                |
| `TRD-098` | Evidence index drift guard proposal      | `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_PROPOSAL.md`                               | Proposes a future local evidence-index drift guard.              |
| `TRD-099` | Evidence index drift guard assignment    | `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_ASSIGNMENT.md`                             | Bounds local guard implementation.                               |
| `TRD-100` | Evidence index drift guard               | `scripts/check-gate0-evidence-index-drift.ts`                                                | Checks local evidence-index drift.                               |
| `TRD-100` | Evidence index drift guard docs          | `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md`                                        | Documents the local drift guard.                                 |
| `TRD-101` | Evidence index drift guard tests         | `packages/fixtures/tests/gate0-evidence-index-drift-check.test.ts`                           | Tests pass and bounded failure paths for the guard.              |
| `TRD-101` | Evidence index drift guard test docs     | `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_TESTS.md`                                  | Documents local guard test coverage.                             |
| `TRD-102` | Evidence index drift guard indexing      | `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_INDEXING.md`                               | Records command, validation, tracker, and index wiring.          |
| `TRD-103` | Evidence index drift guard audit         | `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_COMPLETION_AUDIT.md`                       | Summarizes the drift guard chain.                                |
| `TRD-104` | Evidence index guard validation recheck  | `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_VALIDATION_RECHECK.md`                     | Rechecks validation after guard implementation.                  |
| `TRD-105` | Evidence index guard freeze compliance   | `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_FREEZE_COMPLIANCE_CHECK.md`                      | Verifies guard compliance with the freeze boundary.              |
| `TRD-106` | Evidence index guard source-link recheck | `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_SOURCE_LINK_RECHECK.md`                          | Rechecks guard source-link coverage.                             |
| `TRD-107` | Evidence index guard boundary review     | `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_BOUNDARY_REVIEW.md`                              | Reviews whether evidence-index hardening should pause.           |
| `TRD-108` | Evidence index guard chain freeze note   | `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_CHAIN_FREEZE_NOTE.md`                            | Freezes the completed guard chain.                               |
| `TRD-109` | Research foundation boundary review      | `docs/operations/GATE0_RESEARCH_FOUNDATION_BOUNDARY_REVIEW.md`                               | Reviews whether broad foundation hardening should pause.         |
| `TRD-110` | Project tracklist finalization pass      | `docs/operations/GATE0_PROJECT_TRACKLIST_FINALIZATION_PASS.md`                               | Finalizes current tracklist structure and readability.           |
| `TRD-111` | Foundation freeze note                   | `docs/operations/GATE0_FOUNDATION_FREEZE_NOTE.md`                                            | Freezes the current Gate 0 foundation control plane.             |
| `TRD-112` | Next-phase blocker audit                 | `docs/operations/GATE0_NEXT_PHASE_READINESS_BLOCKER_AUDIT.md`                                | Documents blockers without authorizing later-phase movement.     |
| `TRD-113` | Foundation closeout packet               | `docs/operations/GATE0_FOUNDATION_CLOSEOUT_PACKET.md`                                        | Summarizes the completed Gate 0 foundation workstream.           |
| `TRD-114` | Closeout validation recheck              | `docs/operations/GATE0_CLOSEOUT_VALIDATION_RECHECK.md`                                       | Records the local closeout validation guard set.                 |
| `TRD-115` | Closeout source-link recheck             | `docs/operations/GATE0_CLOSEOUT_SOURCE_LINK_RECHECK.md`                                      | Rechecks closeout source-link coverage.                          |
| `TRD-116` | Closeout freeze compliance               | `docs/operations/GATE0_CLOSEOUT_FREEZE_COMPLIANCE.md`                                        | Verifies maintenance remains inside the freeze boundary.         |
| `TRD-117` | Post-closeout change control             | `docs/operations/GATE0_POST_CLOSEOUT_CHANGE_CONTROL.md`                                      | Defines bounded future Gate 0 maintenance rules.                 |
| `TRD-118` | Operator handoff packet                  | `docs/operations/GATE0_OPERATOR_HANDOFF_PACKET.md`                                           | Gives the operator a local handoff view.                         |
| `TRD-119` | Final tracklist line-width audit         | `docs/operations/GATE0_FINAL_TRACKLIST_LINE_WIDTH_AUDIT.md`                                  | Records final tracklist editor-readability expectations.         |
| `TRD-120` | Final documentation index audit          | `docs/operations/GATE0_FINAL_DOCUMENTATION_INDEX_AUDIT.md`                                   | Records final docs-index coverage expectations.                  |
| `TRD-121` | Final review-record audit                | `docs/operations/GATE0_FINAL_REVIEW_RECORD_AUDIT.md`                                         | Records final accepted-review coverage expectations.             |
| `TRD-122` | Final maintenance boundary note          | `docs/operations/GATE0_FINAL_MAINTENANCE_BOUNDARY_NOTE.md`                                   | Restates final post-closeout maintenance boundaries.             |
| `TRD-123` | Final operator status snapshot           | `docs/operations/GATE0_FINAL_OPERATOR_STATUS_SNAPSHOT.md`                                    | Summarizes current local operator status.                        |
| `TRD-124` | Final validation recheck                 | `docs/operations/GATE0_FINAL_VALIDATION_RECHECK.md`                                          | Records final local validation posture.                          |
| `TRD-125` | Final source-link drift recheck          | `docs/operations/GATE0_FINAL_SOURCE_LINK_DRIFT_RECHECK.md`                                   | Records final source-link drift expectations.                    |
| `TRD-126` | Final progress snapshot recheck          | `docs/operations/GATE0_FINAL_PROGRESS_SNAPSHOT_RECHECK.md`                                   | Records final progress snapshot expectations.                    |
| `TRD-127` | Final change-control compliance          | `docs/operations/GATE0_FINAL_CHANGE_CONTROL_COMPLIANCE.md`                                   | Confirms final change-control expansion blocks.                  |
| `TRD-128` | Final operator closure note              | `docs/operations/GATE0_FINAL_OPERATOR_CLOSURE_NOTE.md`                                       | Closes the current operator handoff chain.                       |
| `TRD-129` | Maintenance gap intake review            | `docs/operations/GATE0_MAINTENANCE_GAP_INTAKE_REVIEW.md`                                     | Reviews whether concrete maintenance gaps remain.                |
| `TRD-130` | Archive readiness blocker note           | `docs/operations/GATE0_ARCHIVE_READINESS_BLOCKER_NOTE.md`                                    | Blocks archive-like or later-phase readiness assumptions.        |
| `TRD-131` | Final no-expansion recheck               | `docs/operations/GATE0_FINAL_NO_EXPANSION_RECHECK.md`                                        | Rechecks that blocked expansion scope remains blocked.           |
| `TRD-132` | Maintenance backlog cleanup              | `docs/operations/GATE0_MAINTENANCE_BACKLOG_CLEANUP.md`                                       | Keeps only concrete local maintenance candidates.                |
| `TRD-133` | Operator pause recommendation            | `docs/operations/GATE0_OPERATOR_PAUSE_RECOMMENDATION.md`                                     | Recommends pausing broad work until a real gap appears.          |
| `TRD-134` | Review coverage drift guard              | `scripts/check-gate0-review-coverage.ts`                                                     | Checks assignment and review-record coverage alignment.          |
| `TRD-134` | Review coverage drift guard docs         | `docs/operations/GATE0_REVIEW_COVERAGE_DRIFT_GUARD.md`                                       | Documents the local review coverage guard.                       |
| `TRD-135` | Guard suite command consolidation        | `package.json`                                                                               | Adds a consolidated local Gate 0 guard-suite command.            |
| `TRD-135` | Guard suite command docs                 | `docs/operations/GATE0_GUARD_SUITE_COMMAND_CONSOLIDATION.md`                                 | Documents the consolidated local Gate 0 guard command.           |
| `TRD-136` | Quality suite command consolidation      | `package.json`                                                                               | Adds a consolidated local Gate 0 verification command.           |
| `TRD-136` | Quality suite command docs               | `docs/operations/GATE0_QUALITY_SUITE_COMMAND_CONSOLIDATION.md`                               | Documents the consolidated local verification command.           |
| `TRD-137` | Final operator verification runbook      | `docs/operations/GATE0_FINAL_OPERATOR_VERIFICATION_RUNBOOK.md`                               | Documents operator use of the consolidated verification command. |
| `TRD-138` | Verification failure triage template     | `docs/operations/GATE0_VERIFICATION_FAILURE_TRIAGE_TEMPLATE.md`                              | Templates bounded triage for failed verification.                |
| `TRD-139` | Maintenance intake checklist             | `docs/operations/GATE0_MAINTENANCE_INTAKE_CHECKLIST.md`                                      | Checks whether an issue qualifies as local maintenance.          |
| `TRD-140` | Operator pause confirmation note         | `docs/operations/GATE0_OPERATOR_PAUSE_CONFIRMATION_NOTE.md`                                  | Confirms broad work remains paused without a concrete gap.       |
| `TRD-141` | Control plane index final recheck        | `docs/operations/GATE0_CONTROL_PLANE_INDEX_FINAL_RECHECK.md`                                 | Rechecks final control-plane index coverage.                     |
| `TRD-142` | Final maintenance handoff snapshot       | `docs/operations/GATE0_FINAL_MAINTENANCE_HANDOFF_SNAPSHOT.md`                                | Summarizes final maintenance handoff pointers.                   |
| `TRD-143` | Gate 0 baseline freeze confirmation      | `docs/operations/GATE0_BASELINE_FREEZE_CONFIRMATION.md`                                      | Confirms current Gate 0 baseline remains frozen.                 |
| `TRD-144` | Gate 1 entry criteria definition         | `docs/operations/GATE1_ENTRY_CRITERIA_DEFINITION.md`                                         | Defines non-authorizing Gate 1 entry criteria.                   |
| `TRD-145` | Gate 1 planning packet draft             | `docs/operations/GATE1_PLANNING_PACKET_DRAFT.md`                                             | Drafts future Gate 1 planning without implementation authority.  |
| `TRD-146` | Historical backtest contract assignment  | `docs/operations/GATE1_HISTORICAL_BACKTEST_CONTRACT_ASSIGNMENT_PACKET.md`                    | Bounds future Gate 1 contract implementation.                    |
| `TRD-147` | Historical data snapshot contract plan   | `docs/operations/GATE1_HISTORICAL_DATA_SNAPSHOT_CONTRACT_PLAN.md`                            | Plans reproducible historical data snapshot requirements.        |
| `TRD-148` | Strategy version contract plan           | `docs/operations/GATE1_STRATEGY_VERSION_CONTRACT_PLAN.md`                                    | Plans deterministic strategy version requirements.               |
| `TRD-149` | Fees and slippage assumption plan        | `docs/operations/GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_PLAN.md`                                 | Plans explicit future cost assumptions.                          |
| `TRD-150` | Immutable backtest record plan           | `docs/operations/GATE1_IMMUTABLE_BACKTEST_RECORD_PLAN.md`                                    | Plans immutable future backtest record requirements.             |
| `TRD-151` | Backtest result schema plan              | `docs/operations/GATE1_BACKTEST_RESULT_SCHEMA_PLAN.md`                                       | Plans future backtest result fields and claim boundaries.        |
| `TRD-152` | Reproducibility check plan               | `docs/operations/GATE1_REPRODUCIBILITY_CHECK_PLAN.md`                                        | Plans future rerun and hash-check expectations.                  |
| `TRD-153` | Fixture boundary plan                    | `docs/operations/GATE1_FIXTURE_BOUNDARY_PLAN.md`                                             | Plans future synthetic and source-labeled fixture boundaries.    |
| `TRD-154` | Contract validation guard plan           | `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_PLAN.md`                                    | Plans a future non-authorizing contract validation guard.        |
| `TRD-155` | Implementation readiness blocker audit   | `docs/operations/GATE1_IMPLEMENTATION_READINESS_BLOCKER_AUDIT.md`                            | Audits remaining blockers before future Gate 1 implementation.   |
| `TRD-156` | Contract-only implementation assignment  | `docs/operations/GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md`                    | Authorizes bounded schema-only implementation.                   |
| `TRD-157` | Historical data snapshot contract        | `docs/operations/GATE1_HISTORICAL_DATA_SNAPSHOT_CONTRACT.md`                                 | Records schema-only historical data snapshot contract.           |
| `TRD-158` | Strategy version contract                | `docs/operations/GATE1_STRATEGY_VERSION_CONTRACT.md`                                         | Records schema-only strategy version contract.                   |
| `TRD-159` | Fees and slippage assumption contract    | `docs/operations/GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_CONTRACT.md`                             | Records schema-only cost assumption contract.                    |
| `TRD-160` | Immutable backtest record contract       | `docs/operations/GATE1_IMMUTABLE_BACKTEST_RECORD_CONTRACT.md`                                | Records schema-only immutable backtest record contract.          |
| `TRD-157` | Gate 1 contract source                   | `packages/contracts/src/gate1-historical-backtest-contracts.ts`                              | Defines local Gate 1 historical backtest schemas.                |
| `TRD-157` | Gate 1 contract tests                    | `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`                       | Tests schema-only Gate 1 contract boundaries.                    |
| `TRD-161` | Backtest result contract                 | `docs/operations/GATE1_BACKTEST_RESULT_CONTRACT.md`                                          | Records schema-only backtest result contract.                    |
| `TRD-162` | Reproducibility check contract           | `docs/operations/GATE1_REPRODUCIBILITY_CHECK_CONTRACT.md`                                    | Records schema-only reproducibility check contract.              |
| `TRD-163` | Historical backtest fixtures             | `docs/operations/GATE1_HISTORICAL_BACKTEST_FIXTURES.md`                                      | Records synthetic local Gate 1 fixtures.                         |
| `TRD-163` | Gate 1 fixture source                    | `packages/fixtures/src/gate1-historical-backtest-fixtures.ts`                                | Defines synthetic Gate 1 historical backtest fixtures.           |
| `TRD-163` | Gate 1 fixture tests                     | `packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts`                         | Tests synthetic fixture boundaries.                              |
| `TRD-164` | Gate 1 contract validation guard         | `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md`                                         | Records local Gate 1 contract guard command.                     |
| `TRD-164` | Gate 1 contract guard script             | `scripts/check-gate1-contracts.ts`                                                           | Checks local Gate 1 contract docs, sources, tests, and fixtures. |
| `TRD-164` | Gate 1 contract guard tests              | `packages/fixtures/tests/gate1-contract-guard.test.ts`                                       | Tests pass and bounded failure paths for the guard.              |
| `TRD-165` | Gate 1 contract guard indexing           | `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_INDEXING.md`                                | Records guard command and artifact indexing.                     |
| `TRD-166` | Gate 1 guard command doc alignment       | `docs/operations/GATE1_GUARD_COMMAND_DOC_ALIGNMENT.md`                                       | Aligns command index and validation audit entries.               |
| `TRD-167` | Format check control-plane coverage      | `docs/operations/GATE0_FORMAT_CHECK_CONTROL_PLANE_COVERAGE.md`                               | Records docs and ops format-check coverage.                      |
| `TRD-168` | Progress snapshot generated date policy  | `docs/operations/GATE0_PROGRESS_SNAPSHOT_GENERATED_DATE_POLICY.md`                           | Records explicit generated-date policy for snapshots.            |
| `TRD-169` | Gate 1 guard schema validation hardening | `docs/operations/GATE1_CONTRACT_GUARD_SCHEMA_VALIDATION_HARDENING.md`                        | Records parsed schema and fixture validation in the guard.       |
| `TRD-170` | Paper candidate semantic block           | `docs/operations/GATE0_PAPER_CANDIDATE_SEMANTIC_BLOCK.md`                                    | Blocks active paper-candidate validation states in Phase 0.      |
| `TRD-171` | Canonical repo hygiene and agent align   | `docs/operations/GATE0_CANONICAL_REPO_HYGIENE_AND_AGENT_ALIGNMENT.md`                        | Records git hygiene and agent manifest alignment.                |
| `TRD-172` | GitHub CI verification workflow          | `.github/workflows/gate0-verify.yml`                                                         | Runs Gate 0 verification in private GitHub CI.                   |
| `TRD-172` | GitHub CI workflow docs                  | `docs/operations/GATE0_GITHUB_CI_VERIFICATION_WORKFLOW.md`                                   | Documents the CI boundary and command.                           |
| `TRD-173` | GitHub repo handoff runbook              | `docs/operations/GATE0_GITHUB_REPO_HANDOFF_AND_CLONE_RUNBOOK.md`                             | Documents clone, install, verify, and triage steps.              |
| `TRD-174` | Agent manifest drift guard               | `scripts/check-gate0-agent-manifest.ts`                                                      | Checks local agent manifest and reference alignment.             |
| `TRD-174` | Agent manifest drift guard tests         | `packages/fixtures/tests/gate0-agent-manifest-check.test.ts`                                 | Tests pass and bounded failure paths for the guard.              |
| `TRD-174` | Agent manifest drift guard docs          | `docs/operations/GATE0_AGENT_MANIFEST_DRIFT_GUARD.md`                                        | Documents the local agent guard.                                 |
| `TRD-175` | Repo hygiene guard                       | `scripts/check-repo-hygiene.ts`                                                              | Checks `.gitignore` and tracked-file hygiene.                    |
| `TRD-175` | Repo hygiene guard tests                 | `packages/fixtures/tests/repo-hygiene-check.test.ts`                                         | Tests pass and bounded failure paths for the guard.              |
| `TRD-175` | Repo hygiene guard docs                  | `docs/operations/GATE0_REPO_HYGIENE_GUARD.md`                                                | Documents the local repo hygiene guard.                          |
| `TRD-176` | GitHub baseline release note             | `docs/operations/GATE0_GITHUB_BASELINE_RELEASE_NOTE.md`                                      | Records the private GitHub baseline boundary.                    |
| `TRD-177` | GitHub CI post-push evidence             | `docs/operations/GATE0_GITHUB_CI_POST_PUSH_EVIDENCE.md`                                      | Records the first successful pushed CI run.                      |
| `TRD-178` | GitHub Actions runtime review            | `docs/operations/GATE0_GITHUB_ACTIONS_NODE_RUNTIME_DEPRECATION_REVIEW.md`                    | Records the Node runtime deprecation warning.                    |
| `TRD-179` | GitHub CI runtime hardening              | `docs/operations/GATE0_GITHUB_CI_WORKFLOW_RUNTIME_HARDENING.md`                              | Records the workflow runtime mitigation.                         |
| `TRD-180` | GitHub CI evidence refresh               | `docs/operations/GATE0_GITHUB_CI_EVIDENCE_REFRESH_AFTER_RUNTIME_HARDENING.md`                | Records the passing post-hardening CI run.                       |
| `TRD-181` | Remote verification runbook              | `docs/operations/GATE0_REMOTE_VERIFICATION_RUNBOOK.md`                                       | Documents read-only GitHub Actions inspection commands.          |
| `TRD-182` | CI failure triage guardrail              | `docs/operations/GATE0_CI_FAILURE_TRIAGE_GUARDRAIL.md`                                       | Documents bounded CI failure triage rules.                       |
| `TRD-183` | GitHub Actions annotation watch          | `docs/operations/GATE0_GITHUB_ACTIONS_ANNOTATION_FOLLOW_UP_WATCH.md`                         | Records the current action runtime annotation posture.           |
| `TRD-184` | CI evidence freshness proposal           | `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_GUARD_PROPOSAL.md`                              | Defines standalone CI evidence freshness rules.                  |
| `TRD-185` | CI evidence freshness guard              | `scripts/check-gate0-ci-evidence-freshness.ts`                                               | Checks remote CI evidence freshness manually.                    |
| `TRD-185` | CI evidence freshness tests              | `packages/fixtures/tests/gate0-ci-evidence-freshness-check.test.ts`                          | Tests pass and bounded failure paths for the guard.              |
| `TRD-185` | CI evidence freshness docs               | `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_GUARD_IMPLEMENTATION.md`                        | Documents the standalone freshness guard.                        |
| `TRD-186` | Remote verification evidence index       | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes remote CI evidence records.                              |
| `TRD-187` | Maintenance pause reconfirmation         | `docs/operations/GATE0_MAINTENANCE_PAUSE_RECONFIRMATION.md`                                  | Reconfirms broad Gate 0 expansion is paused.                     |
| `TRD-188` | Command center scope and boundary        | `docs/operations/GATE0_COMMAND_CENTER_SCOPE_AND_BOUNDARY.md`                                 | Defines the read-only command center boundary.                   |
| `TRD-189` | Command center data contract             | `docs/operations/GATE0_COMMAND_CENTER_DATA_CONTRACT.md`                                      | Defines the static local display data shape.                     |
| `TRD-189` | Command center data source               | `apps/web/src/command-center-data.js`                                                        | Provides local display-only command center data.                 |
| `TRD-190` | Static command center prototype          | `apps/web/index.html`                                                                        | Mounts the local static command center.                          |
| `TRD-190` | Command center renderer                  | `apps/web/src/main.js`                                                                       | Renders the static command center UI.                            |
| `TRD-190` | Command center styles                    | `apps/web/src/styles.css`                                                                    | Styles the local command center surface.                         |
| `TRD-190` | Command center prototype docs            | `docs/operations/GATE0_STATIC_LOCAL_COMMAND_CENTER_PROTOTYPE.md`                             | Documents the static local prototype.                            |
| `TRD-191` | Command center guardrail tests           | `packages/fixtures/tests/gate0-command-center-data.test.ts`                                  | Tests Gate 0 scope and blocked app-data language.                |
| `TRD-191` | Command center guardrail docs            | `docs/operations/GATE0_COMMAND_CENTER_NO_EXECUTION_GUARDRAILS.md`                            | Documents no-execution command center guardrails.                |
| `TRD-192` | Command center QA/RISK acceptance        | `docs/operations/GATE0_COMMAND_CENTER_QA_RISK_ACCEPTANCE.md`                                 | Accepts the command center as control-plane only.                |
| `TRD-193` | Command center visual QA pass            | `docs/operations/GATE0_COMMAND_CENTER_VISUAL_QA_PASS.md`                                     | Records restrained operational visual QA.                        |
| `TRD-194` | Command center accessibility baseline    | `docs/operations/GATE0_COMMAND_CENTER_ACCESSIBILITY_BASELINE.md`                             | Records keyboard and semantic baseline controls.                 |
| `TRD-195` | Command center data source plan          | `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_DATA_SOURCE_PLAN.md`                           | Plans future local-only artifact inputs.                         |
| `TRD-196` | Command center local preview script      | `scripts/preview-web.ts`                                                                     | Serves the static command center on local host only.             |
| `TRD-196` | Command center local preview docs        | `docs/operations/GATE0_COMMAND_CENTER_LOCAL_PREVIEW_SCRIPT.md`                               | Documents `pnpm preview:web`.                                    |
| `TRD-197` | Command center freshness guard           | `scripts/check-gate0-command-center-freshness.ts`                                            | Checks static dashboard evidence against local records.          |
| `TRD-197` | Command center freshness guard tests     | `packages/fixtures/tests/gate0-command-center-freshness-check.test.ts`                       | Tests pass and stale-evidence failure paths.                     |
| `TRD-197` | Command center freshness guard docs      | `docs/operations/GATE0_COMMAND_CENTER_EVIDENCE_FRESHNESS_GUARD.md`                           | Documents `pnpm check:gate0-command-center`.                     |
| `TRD-198` | Command center CI evidence refresh       | `docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH.md`                                | Records latest pushed command-center CI evidence.                |
| `TRD-199` | Command center CI run freshness guard    | `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_FRESHNESS_GUARD.md`                             | Documents CI run display freshness checks.                       |
| `TRD-200` | Command center navigation contract check | `docs/operations/GATE0_COMMAND_CENTER_NAVIGATION_CONTRACT_CHECK.md`                          | Documents navigation-to-section contract coverage.               |
| `TRD-201` | Command center accessibility check       | `docs/operations/GATE0_COMMAND_CENTER_ACCESSIBILITY_CONTRACT_CHECK.md`                       | Documents accessibility baseline contract coverage.              |
| `TRD-202` | Command center preview contract check    | `docs/operations/GATE0_COMMAND_CENTER_PREVIEW_SCRIPT_CONTRACT_CHECK.md`                      | Documents preview script contract coverage.                      |
| `TRD-202` | Command center preview tests             | `packages/fixtures/tests/gate0-command-center-preview-script.test.ts`                        | Tests local preview host, ports, paths, and traversal blocking.  |
| `TRD-203` | Command center CI evidence refresh       | `docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_POST_GUARD_REFRESH.md`                     | Records latest post-guard pushed CI evidence.                    |
| `TRD-204` | Command center render contract check     | `docs/operations/GATE0_COMMAND_CENTER_RENDERED_EVIDENCE_CONTRACT.md`                         | Documents static render contract coverage.                       |
| `TRD-204` | Command center render contract script    | `scripts/check-gate0-command-center-render-contract.ts`                                      | Checks static render, grouped links, labels, and blocked copy.   |
| `TRD-204` | Command center render contract tests     | `packages/fixtures/tests/gate0-command-center-render-contract.test.ts`                       | Tests pass and bounded failure paths for the render contract.    |
| `TRD-205` | Command center mobile evidence UX        | `docs/operations/GATE0_COMMAND_CENTER_MOBILE_EVIDENCE_TABLE_UX.md`                           | Documents small-screen evidence table behavior.                  |
| `TRD-206` | Command center source link grouping      | `docs/operations/GATE0_COMMAND_CENTER_SOURCE_LINK_GROUPING.md`                               | Documents grouped source-link structure.                         |
| `TRD-207` | Command center operator handoff note     | `docs/operations/GATE0_COMMAND_CENTER_OPERATOR_HANDOFF_NOTE.md`                              | Documents bounded local command-center handoff use.              |
| `TRD-208` | Skill governance review                  | `docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md`                                           | Documents phase-aware project skill adoption.                    |
| `TRD-208` | Skill governance guard                   | `scripts/check-gate0-skill-governance.ts`                                                    | Checks project skill boundary and metadata controls.             |
| `TRD-208` | Skill governance tests                   | `packages/fixtures/tests/gate0-skill-governance.test.ts`                                     | Tests pass and bounded failure paths for project skills.         |
| `TRD-209` | Skill library intake policy              | `docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md`                                              | Defines governed future project skill intake rules.              |
| `TRD-209` | Skill governance guard update            | `scripts/check-gate0-skill-governance.ts`                                                    | Checks the project skill intake policy exists and stays bounded. |
| `TRD-209` | Skill intake guard tests                 | `packages/fixtures/tests/gate0-skill-governance.test.ts`                                     | Tests missing-policy failure coverage for project skill intake.  |
| `TRD-210` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_INTAKE.md`                     | Records latest passing CI evidence after skill intake.           |
| `TRD-210` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-211` | Command center CI run refresh            | `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_INTAKE.md`           | Records command-center CI run display alignment.                 |
| `TRD-211` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static dashboard at the latest CI evidence.           |
| `TRD-212` | Orchestrator reviewer skill              | `skills/gatezero-orchestrator-reviewer/SKILL.md`                                             | Adds assignment sequencing and acceptance review lens.           |
| `TRD-212` | Orchestrator reviewer metadata           | `skills/gatezero-orchestrator-reviewer/agents/openai.yaml`                                   | Requires explicit invocation for the project skill.              |
| `TRD-212` | Orchestrator reviewer evals              | `skills/gatezero-orchestrator-reviewer/evals/evals.json`                                     | Captures phase-aware orchestration behavior examples.            |
| `TRD-212` | Orchestrator reviewer intake record      | `docs/operations/GATE0_ORCHESTRATOR_REVIEWER_SKILL_INTAKE.md`                                | Documents governed intake of the orchestrator skill.             |
| `TRD-213` | Risk governance reviewer skill           | `skills/gatezero-risk-governance-reviewer/SKILL.md`                                          | Adds risk and autonomy gate review lens.                         |
| `TRD-213` | Risk governance reviewer metadata        | `skills/gatezero-risk-governance-reviewer/agents/openai.yaml`                                | Requires explicit invocation for the project skill.              |
| `TRD-213` | Risk governance reviewer evals           | `skills/gatezero-risk-governance-reviewer/evals/evals.json`                                  | Captures phase-aware risk governance behavior examples.          |
| `TRD-213` | Risk governance reviewer intake record   | `docs/operations/GATE0_RISK_GOVERNANCE_REVIEWER_SKILL_INTAKE.md`                             | Documents governed intake of the risk governance skill.          |
| `TRD-214` | QA security reviewer skill               | `skills/gatezero-qa-security-reviewer/SKILL.md`                                              | Adds validation, scanner, and secrets review lens.               |
| `TRD-214` | QA security reviewer metadata            | `skills/gatezero-qa-security-reviewer/agents/openai.yaml`                                    | Requires explicit invocation for the project skill.              |
| `TRD-214` | QA security reviewer evals               | `skills/gatezero-qa-security-reviewer/evals/evals.json`                                      | Captures phase-aware QA/security behavior examples.              |
| `TRD-214` | QA security reviewer intake record       | `docs/operations/GATE0_QA_SECURITY_REVIEWER_SKILL_INTAKE.md`                                 | Documents governed intake of the QA/security skill.              |
| `TRD-215` | Docs control-plane reviewer skill        | `skills/gatezero-docs-control-plane-reviewer/SKILL.md`                                       | Adds docs, tracker, source-link, and handoff review lens.        |
| `TRD-216` | Product strategy reviewer skill          | `skills/gatezero-product-strategy-reviewer/SKILL.md`                                         | Adds wedge, scope, and trust-before-breadth review lens.         |
| `TRD-217` | UI command-center reviewer skill         | `skills/gatezero-ui-command-center-reviewer/SKILL.md`                                        | Adds static command-center UI review lens.                       |
| `TRD-218` | Quant backtest reviewer skill            | `skills/gatezero-quant-backtest-reviewer/SKILL.md`                                           | Adds backtest contract and metric claim-safety review lens.      |
| `TRD-219` | Skill routing matrix                     | `docs/operations/GATE0_SKILL_ROUTING_MATRIX.md`                                              | Routes important decisions to the right skill lens.              |
| `TRD-220` | Skill routing guard                      | `scripts/check-gate0-skill-routing.ts`                                                       | Checks the skill routing matrix stays complete.                  |
| `TRD-220` | Skill routing guard tests                | `packages/fixtures/tests/gate0-skill-routing.test.ts`                                        | Tests pass and missing-route failure paths.                      |
| `TRD-220` | Skill routing guard record               | `docs/operations/GATE0_SKILL_ROUTING_GUARD.md`                                               | Documents the local routing guard.                               |
| `TRD-221` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_ROUTING.md`                    | Records latest passing CI evidence after skill routing.          |
| `TRD-221` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-222` | Command center CI run refresh            | `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_ROUTING.md`          | Records command-center CI run display alignment.                 |
| `TRD-222` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static dashboard at the latest CI evidence.           |
| `TRD-223` | Skill library closeout review            | `docs/operations/GATE0_SKILL_LIBRARY_CLOSEOUT_REVIEW.md`                                     | Closes out the accepted Gate 0 reviewer skill library.           |
| `TRD-224` | Skill usage handoff note                 | `docs/operations/GATE0_SKILL_USAGE_HANDOFF_NOTE.md`                                          | Gives future operators skill-lens selection guidance.            |
| `TRD-225` | Next scope recommendation                | `docs/operations/GATE0_NEXT_SCOPE_RECOMMENDATION_AFTER_SKILL_LIBRARY.md`                     | Recommends selective maintenance over product breadth.           |
| `TRD-226` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_LIBRARY_CLOSEOUT.md`           | Records latest passing CI evidence after skill library closeout. |
| `TRD-226` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-227` | Command center CI run refresh            | `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_LIBRARY_CLOSEOUT.md` | Records command-center CI run display alignment.                 |
| `TRD-227` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static dashboard at the latest CI evidence.           |
| `TRD-228` | Command center hash navigation state     | `apps/web/src/main.js`                                                                       | Aligns active sidebar state with direct hash navigation.         |
| `TRD-228` | Hash navigation render contract          | `scripts/check-gate0-command-center-render-contract.ts`                                      | Guards hash-aware navigation markers and updater logic.          |
| `TRD-228` | Hash navigation state record             | `docs/operations/GATE0_COMMAND_CENTER_HASH_NAVIGATION_STATE.md`                              | Documents the local UI orientation fix.                          |
| `TRD-229` | GitHub Actions Node 24 action upgrade    | `.github/workflows/gate0-verify.yml`                                                         | Uses Node 24-compatible official action majors.                  |
| `TRD-229` | GitHub Actions runtime guard             | `scripts/check-gate0-github-actions-runtime.ts`                                              | Guards action majors and project runtime posture.                |
| `TRD-229` | GitHub Actions runtime guard tests       | `packages/fixtures/tests/gate0-github-actions-runtime.test.ts`                               | Tests pass and bounded failure paths for workflow posture.       |
| `TRD-229` | GitHub Actions runtime upgrade record    | `docs/operations/GATE0_GITHUB_ACTIONS_NODE24_ACTION_UPGRADE.md`                              | Documents the bounded CI action-major upgrade.                   |
| `TRD-230` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md`            | Records latest passing CI evidence after action upgrade.         |
| `TRD-230` | CI evidence freshness guard coverage     | `scripts/check-gate0-ci-evidence-freshness.ts`                                               | Includes remote CI evidence refresh records in freshness checks. |
| `TRD-230` | Agent manifest guard reliability         | `scripts/check-gate0-agent-manifest.ts`                                                      | Avoids repeated support-doc scans during recursive traversal.    |
| `TRD-230` | Command center CI run refresh            | `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md`  | Records command-center CI run display alignment.                 |
| `TRD-230` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static dashboard at the latest CI evidence.           |
| `TRD-230` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-231` | Command center CI evidence refresh       | `docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH_AFTER_TRD230_PUSH.md`              | Records latest passing CI evidence after TRD-230 push.           |
| `TRD-231` | CI evidence freshness guard coverage     | `scripts/check-gate0-ci-evidence-freshness.ts`                                               | Includes command-center CI evidence records in freshness checks. |
| `TRD-231` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static dashboard at the latest pushed CI evidence.    |
| `TRD-231` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-232` | Latest-push evidence confirmation        | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX_LATEST_PUSH_CONFIRMATION.md`       | Confirms the evidence index remains aligned to latest push.      |
| `TRD-233` | CI evidence count expectation            | `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_COUNT_EXPECTATIONS.md`                          | Documents CI evidence record-family count coverage.              |
| `TRD-233` | CI evidence freshness tests              | `packages/fixtures/tests/gate0-ci-evidence-freshness-check.test.ts`                          | Adds three-record-family focused coverage.                       |
| `TRD-234` | Command center verified commit           | `docs/operations/GATE0_COMMAND_CENTER_LAST_VERIFIED_COMMIT.md`                               | Documents the static last verified commit field.                 |
| `TRD-234` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Displays last verified commit as repository evidence.            |
| `TRD-235` | Source-link duplicate guard              | `scripts/check-gate0-source-link-duplicates.ts`                                              | Checks duplicate tracklist source links.                         |
| `TRD-235` | Source-link duplicate guard tests        | `packages/fixtures/tests/gate0-source-link-duplicates.test.ts`                               | Tests pass and duplicate failure paths.                          |
| `TRD-236` | Tracklist section length guard           | `scripts/check-gate0-tracklist-section-length.ts`                                            | Checks tracklist section sizes.                                  |
| `TRD-236` | Tracklist section length tests           | `packages/fixtures/tests/gate0-tracklist-section-length.test.ts`                             | Tests pass and oversized-section failure paths.                  |
| `TRD-237` | Tracklist source-link index cleanup      | `docs/operations/GATE0_TRACKLIST_SOURCE_LINK_INDEX.md`                                       | Documents source-link dedupe and split-index posture.            |
| `TRD-238` | Command center visual recheck            | `docs/operations/GATE0_COMMAND_CENTER_VISUAL_RECHECK_AFTER_TRD231.md`                        | Records bounded static command-center visual recheck.            |
| `TRD-239` | Maintenance backlog re-rank              | `docs/operations/GATE0_MAINTENANCE_BACKLOG_RERANK.md`                                        | Keeps the next queue maintenance-first.                          |
| `TRD-240` | Gate 1 blocker recheck                   | `docs/operations/GATE1_READINESS_BLOCKER_RECHECK.md`                                         | Confirms future Gate 1 remains blocked.                          |
| `TRD-241` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD240_PUSH.md`                      | Records latest passing CI evidence after TRD-240 push.           |
| `TRD-241` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-242` | Command center CI metadata refresh       | `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD241.md`                   | Records command-center static metadata alignment.                |
| `TRD-242` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static dashboard at the latest CI evidence.           |
| `TRD-243` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD242_PUSH.md`                      | Records latest passing CI evidence after TRD-242 push.           |
| `TRD-243` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-244` | Command center CI metadata refresh       | `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD243.md`                   | Records command-center static metadata alignment.                |
| `TRD-244` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static dashboard at the latest CI evidence.           |
| `TRD-245` | Command center runtime snapshot builder  | `scripts/build-command-center-runtime-data.ts`                                               | Builds local command-center runtime data from repo records.      |
| `TRD-245` | Command center runtime snapshot tests    | `packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`                          | Tests local runtime snapshot values.                             |
| `TRD-245` | Command center runtime snapshot record   | `docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SNAPSHOT.md`                             | Documents the local runtime endpoint boundary.                   |
| `TRD-246` | Command center local auto-refresh        | `apps/web/src/main.js`                                                                       | Fetches same-origin local runtime data and re-renders.           |
| `TRD-246` | Command center local auto-refresh record | `docs/operations/GATE0_COMMAND_CENTER_LOCAL_AUTO_REFRESH.md`                                 | Documents local browser refresh behavior.                        |
| `TRD-246` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Preserves static fallback metadata.                              |
| `TRD-247` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD246_PUSH.md`                      | Records latest passing CI evidence after TRD-246 push.           |
| `TRD-247` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-248` | Command center CI metadata refresh       | `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD247.md`                   | Records command-center metadata alignment.                       |
| `TRD-248` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static fallback at the latest CI evidence.            |
| `TRD-249` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD248_PUSH.md`                      | Records latest passing CI evidence after TRD-248 push.           |
| `TRD-249` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-250` | Command center CI metadata refresh       | `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD249.md`                   | Records command-center metadata alignment.                       |
| `TRD-250` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static fallback at the latest CI evidence.            |
| `TRD-251` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD250_PUSH.md`                      | Records latest passing CI evidence after TRD-250 push.           |
| `TRD-251` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-252` | Command center CI metadata refresh       | `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD251.md`                   | Records command-center metadata alignment.                       |
| `TRD-252` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static fallback at the latest CI evidence.            |
| `TRD-253` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD252_PUSH.md`                      | Records latest passing CI evidence after TRD-252 push.           |
| `TRD-253` | Remote evidence index update             | `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`                                | Indexes the latest passing CI evidence record.                   |
| `TRD-254` | Command center CI metadata refresh       | `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD253.md`                   | Records command-center metadata alignment.                       |
| `TRD-254` | Command center data update               | `apps/web/src/command-center-data.js`                                                        | Points the static fallback at the latest CI evidence.            |
| `TRD-255` | Command center runtime schema            | `packages/contracts/src/command-center-runtime-data.ts`                                      | Validates local runtime data shape.                              |
| `TRD-255` | Runtime schema contract tests            | `packages/contracts/tests/command-center-runtime-data.test.ts`                               | Tests pass and bounded failure paths for runtime data.           |
| `TRD-255` | Runtime builder schema integration       | `scripts/build-command-center-runtime-data.ts`                                               | Parses generated runtime data before serving it locally.         |
| `TRD-255` | Runtime schema contract record           | `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_SCHEMA_CONTRACT.md`                            | Documents the local runtime schema boundary.                     |
| `TRD-256` | Runtime endpoint response contract       | `packages/fixtures/tests/gate0-command-center-preview-script.test.ts`                        | Tests local endpoint response status, headers, and schema.       |
| `TRD-256` | Runtime endpoint response record         | `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_ENDPOINT_RESPONSE_CONTRACT.md`                 | Documents local endpoint response contract coverage.             |
| `TRD-257` | Runtime endpoint security boundary       | `docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SECURITY_BOUNDARY.md`                    | Documents the local-only runtime endpoint security boundary.     |
| `TRD-258` | CI evidence refresh helper               | `scripts/refresh-gate0-ci-evidence.ts`                                                       | Refreshes local CI evidence records from an explicit run id.     |
| `TRD-258` | CI evidence refresh helper tests         | `packages/fixtures/tests/gate0-ci-evidence-refresh.test.ts`                                  | Tests accepted and blocked helper behavior.                      |
| `TRD-258` | CI evidence refresh helper record        | `docs/operations/GATE0_CI_EVIDENCE_REFRESH_HELPER.md`                                        | Documents helper usage and boundaries.                           |
| `TRD-258` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD257_PUSH.md`                      | Records latest passing CI evidence after TRD-257 push.           |
| `TRD-259` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD258_PUSH.md`                      | Records latest passing CI evidence after TRD-258 push.           |
| `TRD-260` | Remote CI evidence refresh               | `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD259_PUSH.md`                      | Records latest passing CI evidence after TRD-259 push.           |
| `TRD-261` | CI evidence refresh loop pause           | `docs/operations/GATE0_CI_EVIDENCE_REFRESH_LOOP_PAUSE.md`                                    | Prevents evidence-only CI refresh churn.                         |

## Review Records

Each ergonomics or foundation-control packet from `TRD-044` through `TRD-261` has:

- An assignment packet under `ops/assignments/`.
- A QA_SECURITY review under `ops/runtime/reviews/`.
- A RISK review under `ops/runtime/reviews/`.
- An ORCHESTRATOR acceptance record under `ops/runtime/reviews/`.

## Maintenance Rule

Update this map when a later Gate 0 packet adds, renames, or retires an operator ergonomics
artifact. Do not use this map to authorize execution, UI expansion, external publishing, or
later-phase operation.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-061_GATE0_ERGONOMICS_ARTIFACT_MAP.md`
- Reviews: `ops/runtime/reviews/TRD-061_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-061_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-061_ORCHESTRATOR_ACCEPTANCE.md`
