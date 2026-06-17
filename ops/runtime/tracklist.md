# GateZero Project Tracklist

## Control Header

| Field                      | Value                                                          |
| -------------------------- | -------------------------------------------------------------- |
| Project                    | GateZero                                                       |
| Operating gate             | `G0_RESEARCH`                                                  |
| Operating scope            | `research_only`                                                |
| Core wedge                 | No trade without evidence. No execution without risk approval. |
| Tracklist status           | Active living tracker                                          |
| Last updated               | 2026-06-17                                                     |
| Latest accepted packet     | `TRD-225`                                                      |
| Latest accepted validation | 65 test files, 328 tests passed                                |

## Boundary

GateZero is currently a local research, evidence, risk-control, and execution-support foundation.

The project remains at Gate 0. The system must not add live trading, broker integration, autonomous
execution, AI buy/sell prediction, real or paper order placement, broker API key handling, strategy
profitability claims, readiness claims, approval scoring, report publishing, external execution
paths, or risk-gate loosening.

## Status Legend

| Status             | Meaning                                                                              |
| ------------------ | ------------------------------------------------------------------------------------ |
| `accepted`         | Packet completed, reviewed, and accepted by ORCHESTRATOR after QA/RISK review.       |
| `complete`         | Workstream has enough accepted packets to satisfy its current Gate 0 purpose.        |
| `active`           | Workstream is still useful for further bounded Gate 0 hardening.                     |
| `queued`           | Packet is identified as a good next task but not implemented.                        |
| `blocked`          | Packet cannot proceed under current gates or requires a future authorization packet. |
| `rejected_for_now` | Explicitly out of scope while Gate 0 remains Research Only.                          |

## Current Validation Commands

```powershell
pnpm inspect:gate0-dry-run
pnpm inspect:gate0-dry-run -- --help
pnpm inspect:gate0-dry-run -- -h
pnpm inspect:gate0-dry-run -- --scenario friction
pnpm inspect:gate0-dry-run -- --scenario other
pnpm snapshot:gate0-progress
pnpm check:gate0-evidence-index
pnpm check:gate0-ci-evidence
pnpm check:gate0-command-center
pnpm check:gate0-command-center-render
pnpm check:gate0-skills
pnpm check:gate0-skill-routing
pnpm check:gate0-agents
pnpm check:repo-hygiene
pnpm check:gate1-contracts
pnpm check:gate0-name
pnpm check:gate0-docs-coverage
pnpm check:gate0-snapshot
pnpm check:gate0-tracklist
pnpm check:gate0-reviews
pnpm check:gate0
pnpm verify:gate0
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
pnpm preview:web
```

Latest accepted result:

- `pnpm inspect:gate0-dry-run`: passed.
- `pnpm inspect:gate0-dry-run -- --help`: passed.
- `pnpm inspect:gate0-dry-run -- -h`: passed.
- `pnpm inspect:gate0-dry-run -- --scenario friction`: passed.
- `pnpm inspect:gate0-dry-run -- --scenario other`: expected nonzero exit with bounded local usage
  text and no stack trace.
- `pnpm snapshot:gate0-progress`: passed.
- `pnpm check:gate0-evidence-index`: passed.
- `pnpm check:gate0-ci-evidence`: passed.
- `pnpm check:gate0-command-center`: passed.
- `pnpm check:gate0-command-center-render`: passed.
- `pnpm check:gate0-skills`: passed.
- `pnpm check:gate0-skill-routing`: passed.
- `pnpm check:gate0-agents`: passed.
- `pnpm check:repo-hygiene`: passed.
- `pnpm check:gate1-contracts`: passed.
- `pnpm check:gate0-name`: passed.
- `pnpm check:gate0-docs-coverage`: passed.
- `pnpm check:gate0-snapshot`: passed.
- `pnpm check:gate0-tracklist`: passed.
- `pnpm check:gate0-reviews`: passed.
- `pnpm check:gate0`: passed.
- `pnpm verify:gate0`: passed.
- `pnpm lint`: passed.
- `pnpm format:check`: passed.
- `pnpm typecheck`: passed.
- `pnpm test`: 65 test files passed, 328 tests passed.
- `pnpm validate:gate0`: passed.
- `pnpm preview:web`: local host static preview available for visual QA.

## Phase Map

### Phase 0 Foundation

- Status: `complete`
- Accepted packets: `TRD-001` to `TRD-012`
- Scope: repo, contracts, validation, local protected-loop foundation.

### Phase 0 Local Evidence Operations

- Status: `complete`
- Accepted packets: `TRD-013` to `TRD-017`
- Scope: local storage, queries, summaries, redaction.

### Phase 0 Operator Review State

- Status: `complete`
- Accepted packets: `TRD-018` to `TRD-024`
- Scope: checklists, scoring, inventory, diagnostics.

### Phase 0 Trust Hardening

- Status: `complete`
- Accepted packets: `TRD-025` to `TRD-036`
- Scope: thresholds, issue registers, assemblies, integrity, lifecycle.

### Phase 0 Dry-Run Chain

- Status: `complete`
- Accepted packets: `TRD-037` to `TRD-042`
- Scope: synthetic dry-run loop, summary, friction, recommendation, audit.

### Phase 0 Baseline Freeze

- Status: `complete`
- Accepted packets: `TRD-043`
- Scope: baseline release note and current operating boundary.

### Phase 0 Operator Ergonomics And Foundation Closeout

- Status: `complete`
- Accepted packets: `TRD-044` to `TRD-225`
- Scope:
  - Inspect command, walkthrough, blocked fixture, selector, invalid input handling, help text,
    output tests, runbook, and checklist.
  - Command index, artifact map, documentation cross-link audit, validation command audit, and
    coverage checks.
  - Docs coverage drift guard, tests, indexing, completion audit, freeze note, compliance check, and
    operator boundary review.
  - Evidence-index proposal, assignment, source-link check, local schema, synthetic fixture, tests,
    documentation, coverage, validation, completion audit, and freeze note.
  - Evidence-index drift guard proposal, assignment, guard, tests, indexing, completion audit,
    validation recheck, freeze compliance, source-link recheck, boundary review, and guard-chain
    freeze note.
  - Progress snapshot, snapshot freshness check, project-name check, tracklist consistency check,
    command contract notes, and completion audit.
  - Foundation boundary review, tracklist finalization, foundation freeze note, blocker audit, and
    closeout packet.
  - Closeout validation recheck, source-link recheck, freeze compliance, post-closeout change
    control, and operator handoff.
  - Final line-width audit, documentation index audit, review-record audit, maintenance boundary
    note, and operator status snapshot.
  - Final validation recheck, source-link drift recheck, progress snapshot recheck, change-control
    compliance, and operator closure note.
  - Maintenance gap intake, archive readiness blocker note, no-expansion recheck, maintenance
    backlog cleanup, and operator pause recommendation.
  - Review coverage drift guard and tests.
  - Guard suite command consolidation.
  - Quality suite command consolidation.
  - Final operator verification runbook.
  - Verification failure triage template, maintenance intake checklist, operator pause confirmation,
    control-plane index final recheck, and final maintenance handoff snapshot.
  - Gate 0 baseline freeze confirmation, Gate 1 entry criteria definition, and Gate 1 planning
    packet draft.
  - Gate 1 historical backtest contract assignment packet, historical data snapshot contract plan,
    strategy version contract plan, fees and slippage assumption plan, and immutable backtest record
    plan.
  - Gate 1 backtest result schema plan, reproducibility check plan, fixture boundary plan, contract
    validation guard plan, and implementation readiness blocker audit.
  - Gate 1 contract-only implementation assignment, historical data snapshot contract, strategy
    version contract, fees and slippage assumption contract, and immutable backtest record contract.
  - Gate 1 backtest result contract, reproducibility check contract, synthetic fixtures, contract
    validation guard, and guard indexing.
  - Phase-aware project skill governance, explicit invocation metadata, and governed skill library
    intake policy.
  - Remote CI evidence refresh and command-center CI run display alignment after skill intake.
  - Orchestrator reviewer skill intake for assignment sequencing and acceptance review.
  - Risk governance reviewer skill intake for risk gates, autonomy gates, and approval-language
    blockers.
  - QA/security reviewer skill intake for validation integrity, scanner coverage, and secrets
    posture.
  - Docs control-plane, product strategy, UI command-center, and quant backtest reviewer skills.
  - Skill routing matrix and guard for matching important decisions to the right skill lens.

## Workstream Summary

### Governance And Gates

- Status: `complete`
- Current capability: Gate 0 scanner, risk boundary, accepted reviews.
- Next useful hardening: keep scanner updated as new files appear.

### Contracts

- Status: `complete`
- Current capability: runtime-validated protected-loop artifacts.
- Next useful hardening: add only when new Gate 0 artifact types are approved.

### Trace Integrity

- Status: `complete`
- Current capability: immutable traces and canonical hashes.
- Next useful hardening: add regression cases only when trace shape changes.

### Audit And Review Storage

- Status: `complete`
- Current capability: local append-style records, summaries, redaction.
- Next useful hardening: keep all outputs local and redacted.

### Evidence Quality

- Status: `complete`
- Current capability: data quality, metric utilities, consistency checks.
- Next useful hardening: add new checks only as research-loop requirements tighten.

### Operator Review State

- Status: `complete`
- Current capability: checklist, score, inventory, diagnostics, thresholds, issue registers.
- Next useful hardening: avoid approval/readiness semantics.

### Gate 0 State Packages

- Status: `complete`
- Current capability: snapshot, assembly, summary, integrity, lifecycle manifest.
- Next useful hardening: use for local state review only.

### Dry-Run Chain

- Status: `complete`
- Current capability: fixture through checklist, summary, friction, recommendation.
- Next useful hardening: keep scenarios synthetic and deterministic.

### Operator Ergonomics

- Status: `complete`
- Current capability:
  - Local inspect command and bounded operator command behavior.
  - Local documentation, source-link, artifact-map, and validation coverage records.
  - Docs coverage drift guard and evidence-index drift guard.
  - Evidence-index schema, fixture, tests, docs, coverage, guard, and freeze records.
  - Progress snapshot, freshness, project-name, and tracklist consistency checks.
- Next useful hardening: pause broad foundation expansion unless a bounded local control gap
  appears.

### Foundation Closeout

- Status: `complete`
- Current capability:
  - Boundary review, final tracklist shape, freeze note, blocker audit, and closeout packet.
  - Source-linked records showing Gate 0 remains Research Only after closeout.
  - Closeout validation, source-link, freeze compliance, change-control, and handoff records.
  - Final audit and status records for tracker readability, docs indexing, review coverage, and
    maintenance boundaries.
  - Final validation, source-link, progress snapshot, change-control, and closure records.
  - Maintenance intake, archive blocker, no-expansion, backlog cleanup, and pause records.
  - Review coverage drift guard for assignment and review-record alignment.
  - Consolidated Gate 0 guard-suite command for operator ergonomics.
  - Consolidated Gate 0 verification command for acceptance checks.
  - Final operator runbook for pass/fail use of `pnpm verify:gate0`.
  - Final maintenance triage, intake, pause, index, and handoff records.
  - Non-authorizing Gate 1 criteria and planning records while active operation remains Gate 0.
  - Gate 1 contract planning records without implementation, execution, prediction, or strategy
    claims.
  - Gate 1 result, reproducibility, fixture-boundary, validation-guard, and blocker-audit planning
    records without implementation authority.
  - Schema-only Gate 1 historical backtest contracts with synthetic tests and no execution path.
  - Gate 1 contract validation guard for local docs, source, test, fixture, and tracker alignment.
  - GitHub CI workflow, private repo handoff, agent manifest guard, repo hygiene guard, CI evidence,
    action runtime review, runtime hardening, remote verification runbook, and CI failure triage
    guardrail.
  - GitHub Actions annotation watch, CI evidence freshness proposal and guard, remote verification
    evidence index, and maintenance pause reconfirmation.
  - Read-only Gate 0 command center scope, data contract, static prototype, guardrails, and QA/RISK
    acceptance.
  - Command center visual QA, accessibility baseline, local-only data-source plan, preview command,
    and evidence freshness guard.
  - Command center CI evidence refresh, CI-run freshness check, navigation contract coverage,
    accessibility contract coverage, and preview-script contract coverage.
  - Command center post-guard CI evidence refresh, rendered-evidence contract coverage, mobile
    evidence table UX, source-link grouping, and operator handoff notes.
  - Phase-aware project skill governance, explicit skill invocation metadata, and local skill
    boundary guard coverage.
- Next useful hardening: stop broad foundation expansion and proceed only for concrete Gate 0
  maintenance gaps.

## Accepted Packet Ledger

| Packet    | Status   | Workstream       | Primary outcome                                        |
| --------- | -------- | ---------------- | ------------------------------------------------------ |
| `TRD-001` | accepted | Foundation       | Initialized Gate 0 Research monorepo.                  |
| `TRD-002` | accepted | Governance       | Tightened Gate 0 scanner allowlist.                    |
| `TRD-003` | accepted | Trace integrity  | Added immutable strategy decision trace.               |
| `TRD-004` | accepted | Trace integrity  | Added canonical trace hashing.                         |
| `TRD-005` | accepted | Audit            | Added local audit log storage.                         |
| `TRD-006` | accepted | Audit            | Hardened audit-log safety behavior.                    |
| `TRD-007` | accepted | Fixtures         | Added benchmark fixtures.                              |
| `TRD-008` | accepted | Metrics          | Added deterministic metric utilities.                  |
| `TRD-009` | accepted | Metrics          | Added backtest result consistency checks.              |
| `TRD-010` | accepted | Data quality     | Added data snapshot quality checks.                    |
| `TRD-011` | accepted | Data quality     | Expanded data snapshot metadata.                       |
| `TRD-012` | accepted | Review bundle    | Added strategy review bundle assembly.                 |
| `TRD-013` | accepted | Review bundle    | Added persisted local review bundle storage.           |
| `TRD-014` | accepted | Review bundle    | Added local review bundle query utilities.             |
| `TRD-015` | accepted | Review bundle    | Added local review bundle summaries.                   |
| `TRD-016` | accepted | Redaction        | Added local summary redaction policy checks.           |
| `TRD-017` | accepted | Redaction        | Verified redacted summary shape.                       |
| `TRD-018` | accepted | Operator review  | Added local operator review checklist.                 |
| `TRD-019` | accepted | Operator review  | Added checklist completeness scoring.                  |
| `TRD-020` | accepted | Operator review  | Added local review artifact inventory.                 |
| `TRD-021` | accepted | Diagnostics      | Added local protected-loop diagnostics.                |
| `TRD-022` | accepted | Diagnostics      | Added local diagnostic aggregation.                    |
| `TRD-023` | accepted | Review state     | Added local Gate 0 review-state snapshot.              |
| `TRD-024` | accepted | Review state     | Added local snapshot change comparison.                |
| `TRD-025` | accepted | Thresholds       | Added local evidence completeness thresholds.          |
| `TRD-026` | accepted | Thresholds       | Added threshold result comparison.                     |
| `TRD-027` | accepted | Issue register   | Added local protected-loop issue register.             |
| `TRD-028` | accepted | Issue register   | Added local issue register comparison.                 |
| `TRD-029` | accepted | State package    | Added local Gate 0 review-state assembly.              |
| `TRD-030` | accepted | State package    | Added local Gate 0 assembly summary.                   |
| `TRD-031` | accepted | State package    | Added assembly summary comparison.                     |
| `TRD-032` | accepted | Integrity        | Added local Gate 0 state package integrity checks.     |
| `TRD-033` | accepted | Integrity        | Added package integrity history aggregate.             |
| `TRD-034` | accepted | Lifecycle        | Added state package lifecycle manifest.                |
| `TRD-035` | accepted | Lifecycle        | Added lifecycle manifest comparison.                   |
| `TRD-036` | accepted | Audit            | Added Gate 0 Research completion audit.                |
| `TRD-037` | accepted | Dry-run chain    | Added Gate 0 dry-run scenario fixture.                 |
| `TRD-038` | accepted | Dry-run chain    | Added Gate 0 dry-run operator checklist.               |
| `TRD-039` | accepted | Dry-run chain    | Added dry-run checklist summary.                       |
| `TRD-040` | accepted | Dry-run chain    | Added dry-run friction report.                         |
| `TRD-041` | accepted | Dry-run chain    | Added dry-run iteration recommendation.                |
| `TRD-042` | accepted | Audit            | Added dry-run chain completion audit.                  |
| `TRD-043` | accepted | Baseline         | Added Gate 0 baseline release note.                    |
| `TRD-044` | accepted | Ergonomics       | Added operator ergonomics brief.                       |
| `TRD-045` | accepted | Ergonomics       | Added local dry-run inspect command.                   |
| `TRD-046` | accepted | Ergonomics       | Added dry-run walkthrough.                             |
| `TRD-047` | accepted | Ergonomics       | Added blocked-friction dry-run scenario.               |
| `TRD-048` | accepted | Ergonomics       | Added dry-run inspect scenario selector.               |
| `TRD-049` | accepted | Ergonomics       | Added bounded invalid scenario handling.               |
| `TRD-050` | accepted | Ergonomics       | Added local inspect command help text.                 |
| `TRD-051` | accepted | Ergonomics       | Added inspect output shape tests.                      |
| `TRD-052` | accepted | Ergonomics       | Added Gate 0 operator review runbook.                  |
| `TRD-053` | accepted | Ergonomics       | Added local progress snapshot generator.               |
| `TRD-054` | accepted | Ergonomics       | Added local tracklist consistency check.               |
| `TRD-055` | accepted | Ergonomics       | Added local inspect command contract notes.            |
| `TRD-056` | accepted | Audit            | Added operator ergonomics completion audit.            |
| `TRD-057` | accepted | Ergonomics       | Added local operator checklist.                        |
| `TRD-058` | accepted | Ergonomics       | Added local progress snapshot freshness check.         |
| `TRD-059` | accepted | Ergonomics       | Renamed app identity to GateZero and added name check. |
| `TRD-060` | accepted | Ergonomics       | Added local operator command index.                    |
| `TRD-061` | accepted | Ergonomics       | Added local ergonomics artifact map.                   |
| `TRD-062` | accepted | Ergonomics       | Added local documentation cross-link audit.            |
| `TRD-063` | accepted | Ergonomics       | Added local validation command audit.                  |
| `TRD-064` | accepted | Ergonomics       | Added local name-check coverage audit.                 |
| `TRD-065` | accepted | Ergonomics       | Added local command-index coverage check.              |
| `TRD-066` | accepted | Ergonomics       | Added local artifact-map coverage check.               |
| `TRD-067` | accepted | Ergonomics       | Added local cross-link coverage check.                 |
| `TRD-068` | accepted | Ergonomics       | Added local validation-audit coverage check.           |
| `TRD-069` | accepted | Ergonomics       | Added local name-check coverage check.                 |
| `TRD-070` | accepted | Ergonomics       | Added local command-index coverage recheck.            |
| `TRD-071` | accepted | Ergonomics       | Added local artifact-map coverage recheck.             |
| `TRD-072` | accepted | Ergonomics       | Added local cross-link coverage recheck.               |
| `TRD-073` | accepted | Ergonomics       | Added local operator docs index coverage check.        |
| `TRD-074` | accepted | Ergonomics       | Added local review-record naming check.                |
| `TRD-075` | accepted | Ergonomics       | Added local source-link coverage check.                |
| `TRD-076` | accepted | Ergonomics       | Added local coverage-chain completion audit.           |
| `TRD-077` | accepted | Ergonomics       | Added local coverage drift guard proposal.             |
| `TRD-078` | accepted | Ergonomics       | Added local docs coverage drift guard.                 |
| `TRD-079` | accepted | Ergonomics       | Added docs coverage drift guard tests.                 |
| `TRD-080` | accepted | Ergonomics       | Indexed docs coverage drift guard references.          |
| `TRD-081` | accepted | Ergonomics       | Added coverage guard completion audit.                 |
| `TRD-082` | accepted | Ergonomics       | Added operator ergonomics freeze note.                 |
| `TRD-083` | accepted | Ergonomics       | Added ergonomics freeze compliance check.              |
| `TRD-084` | accepted | Ergonomics       | Added validation command coverage recheck.             |
| `TRD-085` | accepted | Ergonomics       | Added operator boundary review.                        |
| `TRD-086` | accepted | Ergonomics       | Added research loop evidence index proposal.           |
| `TRD-087` | accepted | Ergonomics       | Added research loop evidence index assignment note.    |
| `TRD-088` | accepted | Ergonomics       | Added evidence-index source-link check.                |
| `TRD-089` | accepted | Ergonomics       | Added evidence-index implementation packet.            |
| `TRD-090` | accepted | Ergonomics       | Added local evidence-index schema.                     |
| `TRD-091` | accepted | Ergonomics       | Added synthetic evidence-index fixture.                |
| `TRD-092` | accepted | Ergonomics       | Added evidence-index tests.                            |
| `TRD-093` | accepted | Ergonomics       | Added evidence-index documentation.                    |
| `TRD-094` | accepted | Ergonomics       | Added evidence-index coverage check.                   |
| `TRD-095` | accepted | Ergonomics       | Added evidence-index validation recheck.               |
| `TRD-096` | accepted | Ergonomics       | Added evidence-index completion audit.                 |
| `TRD-097` | accepted | Ergonomics       | Added evidence-index freeze note.                      |
| `TRD-098` | accepted | Ergonomics       | Added evidence-index drift guard proposal.             |
| `TRD-099` | accepted | Ergonomics       | Added evidence-index drift guard assignment.           |
| `TRD-100` | accepted | Ergonomics       | Added local evidence-index drift guard.                |
| `TRD-101` | accepted | Ergonomics       | Added evidence-index drift guard tests.                |
| `TRD-102` | accepted | Ergonomics       | Indexed evidence-index drift guard records.            |
| `TRD-103` | accepted | Ergonomics       | Added evidence-index drift guard completion audit.     |
| `TRD-104` | accepted | Ergonomics       | Added evidence-index guard validation recheck.         |
| `TRD-105` | accepted | Ergonomics       | Added evidence-index guard freeze compliance check.    |
| `TRD-106` | accepted | Ergonomics       | Added evidence-index guard source-link recheck.        |
| `TRD-107` | accepted | Ergonomics       | Added evidence-index guard boundary review.            |
| `TRD-108` | accepted | Ergonomics       | Added evidence-index guard chain freeze note.          |
| `TRD-109` | accepted | Foundation       | Added research foundation boundary review.             |
| `TRD-110` | accepted | Ergonomics       | Finalized project tracklist structure.                 |
| `TRD-111` | accepted | Foundation       | Added foundation freeze note.                          |
| `TRD-112` | accepted | Foundation       | Added next-phase blocker audit.                        |
| `TRD-113` | accepted | Foundation       | Added foundation closeout packet.                      |
| `TRD-114` | accepted | Foundation       | Added closeout validation recheck.                     |
| `TRD-115` | accepted | Foundation       | Added closeout source-link recheck.                    |
| `TRD-116` | accepted | Foundation       | Added closeout freeze compliance check.                |
| `TRD-117` | accepted | Foundation       | Added post-closeout change-control rule.               |
| `TRD-118` | accepted | Foundation       | Added operator handoff packet.                         |
| `TRD-119` | accepted | Foundation       | Added final tracklist line-width audit.                |
| `TRD-120` | accepted | Foundation       | Added final documentation index audit.                 |
| `TRD-121` | accepted | Foundation       | Added final review-record audit.                       |
| `TRD-122` | accepted | Foundation       | Added final maintenance boundary note.                 |
| `TRD-123` | accepted | Foundation       | Added final operator status snapshot.                  |
| `TRD-124` | accepted | Foundation       | Added final validation recheck.                        |
| `TRD-125` | accepted | Foundation       | Added final source-link drift recheck.                 |
| `TRD-126` | accepted | Foundation       | Added final progress snapshot recheck.                 |
| `TRD-127` | accepted | Foundation       | Added final change-control compliance check.           |
| `TRD-128` | accepted | Foundation       | Added final operator closure note.                     |
| `TRD-129` | accepted | Foundation       | Added maintenance gap intake review.                   |
| `TRD-130` | accepted | Foundation       | Added archive readiness blocker note.                  |
| `TRD-131` | accepted | Foundation       | Added final no-expansion recheck.                      |
| `TRD-132` | accepted | Foundation       | Added maintenance backlog cleanup.                     |
| `TRD-133` | accepted | Foundation       | Added operator pause recommendation.                   |
| `TRD-134` | accepted | Foundation       | Added review coverage drift guard.                     |
| `TRD-135` | accepted | Foundation       | Added guard suite command consolidation.               |
| `TRD-136` | accepted | Foundation       | Added quality suite command consolidation.             |
| `TRD-137` | accepted | Foundation       | Added final operator verification runbook.             |
| `TRD-138` | accepted | Foundation       | Added verification failure triage template.            |
| `TRD-139` | accepted | Foundation       | Added maintenance intake checklist.                    |
| `TRD-140` | accepted | Foundation       | Added operator pause confirmation note.                |
| `TRD-141` | accepted | Foundation       | Added control plane index final recheck.               |
| `TRD-142` | accepted | Foundation       | Added final maintenance handoff snapshot.              |
| `TRD-143` | accepted | Foundation       | Added Gate 0 baseline freeze confirmation.             |
| `TRD-144` | accepted | Planning         | Added Gate 1 entry criteria definition.                |
| `TRD-145` | accepted | Planning         | Added Gate 1 planning packet draft.                    |
| `TRD-146` | accepted | Planning         | Added historical backtest contract assignment packet.  |
| `TRD-147` | accepted | Planning         | Added historical data snapshot contract plan.          |
| `TRD-148` | accepted | Planning         | Added strategy version contract plan.                  |
| `TRD-149` | accepted | Planning         | Added fees and slippage assumption plan.               |
| `TRD-150` | accepted | Planning         | Added immutable backtest record plan.                  |
| `TRD-151` | accepted | Planning         | Added backtest result schema plan.                     |
| `TRD-152` | accepted | Planning         | Added reproducibility check plan.                      |
| `TRD-153` | accepted | Planning         | Added fixture boundary plan.                           |
| `TRD-154` | accepted | Planning         | Added contract validation guard plan.                  |
| `TRD-155` | accepted | Planning         | Added implementation readiness blocker audit.          |
| `TRD-156` | accepted | Planning         | Added contract-only implementation assignment packet.  |
| `TRD-157` | accepted | Contracts        | Added historical data snapshot contract.               |
| `TRD-158` | accepted | Contracts        | Added strategy version contract.                       |
| `TRD-159` | accepted | Contracts        | Added fees and slippage assumption contract.           |
| `TRD-160` | accepted | Contracts        | Added immutable backtest record contract.              |
| `TRD-161` | accepted | Contracts        | Added backtest result contract.                        |
| `TRD-162` | accepted | Contracts        | Added reproducibility check contract.                  |
| `TRD-163` | accepted | Fixtures         | Added synthetic Gate 1 historical backtest fixtures.   |
| `TRD-164` | accepted | Validation       | Added Gate 1 contract validation guard.                |
| `TRD-165` | accepted | Validation       | Indexed Gate 1 contract validation guard.              |
| `TRD-166` | accepted | Validation       | Aligned Gate 1 guard command docs.                     |
| `TRD-167` | accepted | Validation       | Added docs and ops to format check coverage.           |
| `TRD-168` | accepted | Foundation       | Added progress snapshot generated-date policy.         |
| `TRD-169` | accepted | Validation       | Hardened Gate 1 guard with schema and fixture parsing. |
| `TRD-170` | accepted | Risk             | Blocked active paper-candidate Phase 0 semantics.      |
| `TRD-171` | accepted | Foundation       | Added canonical repo hygiene and agent alignment.      |
| `TRD-172` | accepted | Validation       | Added GitHub Gate 0 CI verification workflow.          |
| `TRD-173` | accepted | Foundation       | Added GitHub repo handoff and clone runbook.           |
| `TRD-174` | accepted | Validation       | Added agent manifest drift guard.                      |
| `TRD-175` | accepted | Validation       | Added repository hygiene guard.                        |
| `TRD-176` | accepted | Release          | Added GitHub baseline release note.                    |
| `TRD-177` | accepted | Validation       | Recorded successful pushed GitHub CI run evidence.     |
| `TRD-178` | accepted | Validation       | Reviewed GitHub Actions Node runtime deprecation.      |
| `TRD-179` | accepted | Validation       | Hardened GitHub CI action runtime setting.             |
| `TRD-180` | accepted | Validation       | Recorded post-hardening GitHub CI evidence.            |
| `TRD-181` | accepted | Operations       | Added remote verification runbook.                     |
| `TRD-182` | accepted | Operations       | Added CI failure triage guardrail.                     |
| `TRD-183` | accepted | Validation       | Added GitHub Actions annotation follow-up watch.       |
| `TRD-184` | accepted | Validation       | Proposed CI evidence freshness guard rules.            |
| `TRD-185` | accepted | Validation       | Added standalone CI evidence freshness guard.          |
| `TRD-186` | accepted | Operations       | Added remote verification evidence index.              |
| `TRD-187` | accepted | Operations       | Reconfirmed Gate 0 maintenance pause posture.          |
| `TRD-188` | accepted | UI boundary      | Defined Gate 0 command center scope and boundary.      |
| `TRD-189` | accepted | UI contract      | Added command center static data contract.             |
| `TRD-190` | accepted | UI prototype     | Added static local Gate 0 command center prototype.    |
| `TRD-191` | accepted | UI guardrails    | Added command center no-execution guardrails.          |
| `TRD-192` | accepted | UI acceptance    | Accepted command center as control-plane only.         |
| `TRD-193` | accepted | UI QA            | Recorded command center visual QA pass.                |
| `TRD-194` | accepted | UI access        | Added command center accessibility baseline.           |
| `TRD-195` | accepted | UI data plan     | Planned local-only command center data sources.        |
| `TRD-196` | accepted | UI preview       | Added local host command center preview command.       |
| `TRD-197` | accepted | UI guard         | Added command center evidence freshness guard.         |
| `TRD-198` | accepted | UI evidence      | Refreshed command center CI evidence.                  |
| `TRD-199` | accepted | UI guard         | Added command center CI-run freshness guard.           |
| `TRD-200` | accepted | UI contract      | Added command center navigation contract checks.       |
| `TRD-201` | accepted | UI access        | Added command center accessibility contract checks.    |
| `TRD-202` | accepted | UI preview       | Added command center preview script contract checks.   |
| `TRD-203` | accepted | UI evidence      | Refreshed post-guard command center CI evidence.       |
| `TRD-204` | accepted | UI contract      | Added command center rendered evidence contract.       |
| `TRD-205` | accepted | UI access        | Added mobile evidence table labels and behavior.       |
| `TRD-206` | accepted | UI source links  | Grouped command center source links by purpose.        |
| `TRD-207` | accepted | UI handoff       | Added command center operator handoff note.            |
| `TRD-208` | accepted | Skill governance | Added phase-aware project skill governance.            |
| `TRD-209` | accepted | Skill governance | Added governed skill library intake policy.            |
| `TRD-210` | accepted | CI evidence      | Refreshed remote CI evidence after skill intake.       |
| `TRD-211` | accepted | UI evidence      | Refreshed command center CI run display.               |
| `TRD-212` | accepted | Skill governance | Added orchestrator reviewer skill intake.              |
| `TRD-213` | accepted | Skill governance | Added risk governance reviewer skill intake.           |
| `TRD-214` | accepted | Skill governance | Added QA security reviewer skill intake.               |
| `TRD-215` | accepted | Skill governance | Added docs control-plane reviewer skill intake.        |
| `TRD-216` | accepted | Skill governance | Added product strategy reviewer skill intake.          |
| `TRD-217` | accepted | Skill governance | Added UI command-center reviewer skill intake.         |
| `TRD-218` | accepted | Skill governance | Added quant backtest reviewer skill intake.            |
| `TRD-219` | accepted | Skill governance | Added Gate 0 skill routing matrix.                     |
| `TRD-220` | accepted | Skill governance | Added Gate 0 skill routing guard.                      |
| `TRD-221` | accepted | CI evidence      | Refreshed remote CI evidence after skill routing.      |
| `TRD-222` | accepted | UI evidence      | Refreshed command center CI run after skill routing.   |
| `TRD-223` | accepted | Skill governance | Added Gate 0 skill library closeout review.            |
| `TRD-224` | accepted | Skill governance | Added Gate 0 skill usage handoff note.                 |
| `TRD-225` | accepted | Scope control    | Added next scope recommendation after skill library.   |

## Current Operator Commands

| Command                                             | Purpose                                                 | Expected Gate 0 result                                         |
| --------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| `pnpm inspect:gate0-dry-run`                        | Inspect default clear dry-run scenario.                 | Redacted JSON with `inspect_status: clear`.                    |
| `pnpm inspect:gate0-dry-run -- --help`              | Print local inspect command help.                       | Usage text with static scenario keys and Gate 0 boundary.      |
| `pnpm inspect:gate0-dry-run -- -h`                  | Print local inspect command help.                       | Usage text with static scenario keys and Gate 0 boundary.      |
| `pnpm inspect:gate0-dry-run -- --scenario friction` | Inspect blocked-friction dry-run scenario.              | Redacted JSON with `inspect_status: friction_found`.           |
| `pnpm inspect:gate0-dry-run -- --scenario other`    | Verify invalid scenario handling.                       | Nonzero exit with bounded local usage text and no stack trace. |
| `pnpm snapshot:gate0-progress`                      | Write local progress snapshot.                          | Markdown snapshot under `ops/runtime/progress/`.               |
| `pnpm check:gate0-evidence-index`                   | Check evidence-index drift.                             | Local evidence-index drift check passes.                       |
| `pnpm check:gate1-contracts`                        | Check Gate 1 contract control records.                  | Local Gate 1 contract guard passes.                            |
| `pnpm check:gate0-name`                             | Check GateZero project-name consistency.                | Local project-name check passes.                               |
| `pnpm check:gate0-docs-coverage`                    | Check operator docs coverage drift.                     | Local docs coverage check passes.                              |
| `pnpm check:gate0-snapshot`                         | Check generated progress snapshot freshness.            | Local freshness check passes.                                  |
| `pnpm check:gate0-tracklist`                        | Check accepted packet ledger alignment.                 | Local consistency check passes.                                |
| `pnpm check:gate0-reviews`                          | Check assignment and review-record coverage.            | Local review coverage check passes.                            |
| `pnpm check:gate0-agents`                           | Check agent manifest and reference drift.               | Local agent manifest guard passes.                             |
| `pnpm check:repo-hygiene`                           | Check repository hygiene drift.                         | Local repository hygiene guard passes.                         |
| `pnpm check:gate0-ci-evidence`                      | Check remote CI evidence freshness.                     | Manual CI evidence freshness guard passes.                     |
| `pnpm check:gate0-command-center`                   | Check command center evidence freshness.                | Local command center freshness guard passes.                   |
| `pnpm check:gate0-command-center-render`            | Check command center static render contract.            | Local command center render contract passes.                   |
| `pnpm check:gate0-skills`                           | Check project skill governance and intake.              | Local skill governance guard passes.                           |
| `pnpm check:gate0-skill-routing`                    | Check project skill routing matrix.                     | Local skill routing guard passes.                              |
| `pnpm check:gate0`                                  | Refresh snapshot and run the local Gate 0 guard suite.  | Local guard suite passes.                                      |
| `pnpm verify:gate0`                                 | Run Gate 0 guards and quality checks.                   | Full local verification passes.                                |
| `pnpm validate:gate0`                               | Scan for blocked scope terms outside allowlisted paths. | `Gate 0 validation passed.`                                    |
| `pnpm preview:web`                                  | Serve the static command center locally.                | Local host preview serves `apps/web`.                          |

## Next Queue

| Rank | Packet | Status | Goal                                        | Acceptance focus              |
| ---- | ------ | ------ | ------------------------------------------- | ----------------------------- |
| 1    | None   | paused | Wait for a concrete Gate 0 maintenance gap. | Do not queue broad expansion. |

## Rejected For Now

| Area                                | Status           | Reason                                                                             |
| ----------------------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| UI expansion                        | rejected_for_now | Product breadth must not outrun trust in the core decision loop.                   |
| Broker integration                  | rejected_for_now | Gate 0 is Research Only.                                                           |
| Live execution                      | rejected_for_now | No execution path is allowed at Gate 0.                                            |
| Paper execution mechanics           | rejected_for_now | Still an execution-support expansion beyond current local review trust.            |
| AI buy/sell prediction              | rejected_for_now | The system validates evidence and risk review; it does not make prediction claims. |
| Report export or publishing         | rejected_for_now | Current artifacts remain local and operational.                                    |
| Approval scoring                    | rejected_for_now | Local scores must not become approval semantics.                                   |
| Readiness scoring                   | rejected_for_now | Readiness implies later-phase eligibility, which is not authorized.                |
| Performance or profitability claims | rejected_for_now | Strategy claims are outside Gate 0 foundation work.                                |
| Risk-gate loosening                 | rejected_for_now | Risk gates can only be tightened or preserved under current scope.                 |

## Maintenance Rules

Update this tracklist after every accepted packet.

Each update must include:

- Latest accepted packet.
- Latest validation result.
- Test file and test count.
- Any new operator command.
- Any new accepted capability.
- Any new queued next packet.
- Any rejected or blocked scope discovered during the work.

Do not mark a packet accepted until:

- QA_SECURITY review exists.
- RISK review exists.
- ORCHESTRATOR acceptance exists.
- Required validation commands pass.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.

## Source Of Truth Links

- Assignments: `ops/assignments/`
- Reviews: `ops/runtime/reviews/`
- Baseline release: `ops/runtime/releases/G0_BASELINE_RELEASE_NOTE.md`
- Dry-run walkthrough: `docs/operations/GATE0_DRY_RUN_WALKTHROUGH.md`
- Operator review runbook: `docs/operations/GATE0_OPERATOR_REVIEW_RUNBOOK.md`
- Operator checklist: `docs/operations/GATE0_OPERATOR_CHECKLIST.md`
- Operator command index: `docs/operations/GATE0_OPERATOR_COMMAND_INDEX.md`
- Command index coverage check: `docs/operations/GATE0_COMMAND_INDEX_COVERAGE_CHECK.md`
- Ergonomics artifact map: `docs/operations/GATE0_ERGONOMICS_ARTIFACT_MAP.md`
- Artifact map coverage check: `docs/operations/GATE0_ARTIFACT_MAP_COVERAGE_CHECK.md`
- Documentation cross-link audit: `docs/operations/GATE0_DOCUMENTATION_CROSS_LINK_AUDIT.md`
- Cross-link coverage check: `docs/operations/GATE0_CROSS_LINK_COVERAGE_CHECK.md`
- Validation command audit: `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`
- Validation command coverage recheck:
  `docs/operations/GATE0_VALIDATION_COMMAND_COVERAGE_RECHECK.md`
- Validation audit coverage check: `docs/operations/GATE0_VALIDATION_AUDIT_COVERAGE_CHECK.md`
- Name check coverage audit: `docs/operations/GATE0_NAME_CHECK_COVERAGE_AUDIT.md`
- Name check coverage check: `docs/operations/GATE0_NAME_CHECK_COVERAGE_CHECK.md`
- Command index coverage recheck: `docs/operations/GATE0_COMMAND_INDEX_COVERAGE_RECHECK.md`
- Artifact map coverage recheck: `docs/operations/GATE0_ARTIFACT_MAP_COVERAGE_RECHECK.md`
- Cross-link coverage recheck: `docs/operations/GATE0_CROSS_LINK_COVERAGE_RECHECK.md`
- Operator docs index coverage check: `docs/operations/GATE0_OPERATOR_DOCS_INDEX_COVERAGE_CHECK.md`
- Review record naming check: `docs/operations/GATE0_REVIEW_RECORD_NAMING_CHECK.md`
- Source links coverage check: `docs/operations/GATE0_SOURCE_LINKS_COVERAGE_CHECK.md`
- Coverage chain completion audit: `docs/operations/GATE0_COVERAGE_CHAIN_COMPLETION_AUDIT.md`
- Coverage drift guard proposal: `docs/operations/GATE0_COVERAGE_DRIFT_GUARD_PROPOSAL.md`
- Docs coverage drift guard: `docs/operations/GATE0_DOCS_COVERAGE_DRIFT_GUARD.md`
- Docs coverage drift guard tests: `docs/operations/GATE0_DOCS_COVERAGE_DRIFT_GUARD_TESTS.md`
- Docs coverage drift guard indexing: `docs/operations/GATE0_DOCS_COVERAGE_DRIFT_GUARD_INDEXING.md`
- Coverage guard completion audit: `docs/operations/GATE0_COVERAGE_GUARD_COMPLETION_AUDIT.md`
- Operator ergonomics freeze note: `docs/operations/GATE0_OPERATOR_ERGONOMICS_FREEZE_NOTE.md`
- Ergonomics freeze compliance check: `docs/operations/GATE0_ERGONOMICS_FREEZE_COMPLIANCE_CHECK.md`
- Operator boundary review: `docs/operations/GATE0_OPERATOR_BOUNDARY_REVIEW.md`
- Research loop evidence index proposal:
  `docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_PROPOSAL.md`
- Research loop evidence index assignment:
  `docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_ASSIGNMENT.md`
- Evidence index source-link check: `docs/operations/GATE0_EVIDENCE_INDEX_SOURCE_LINK_CHECK.md`
- Evidence index implementation packet:
  `docs/operations/GATE0_EVIDENCE_INDEX_IMPLEMENTATION_PACKET.md`
- Evidence index schema: `docs/operations/GATE0_EVIDENCE_INDEX_SCHEMA.md`
- Evidence index fixture: `docs/operations/GATE0_EVIDENCE_INDEX_FIXTURE.md`
- Evidence index tests: `docs/operations/GATE0_EVIDENCE_INDEX_TESTS.md`
- Research loop evidence index: `docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX.md`
- Evidence index coverage check: `docs/operations/GATE0_EVIDENCE_INDEX_COVERAGE_CHECK.md`
- Evidence index validation recheck: `docs/operations/GATE0_EVIDENCE_INDEX_VALIDATION_RECHECK.md`
- Evidence index completion audit: `docs/operations/GATE0_EVIDENCE_INDEX_COMPLETION_AUDIT.md`
- Evidence index freeze note: `docs/operations/GATE0_EVIDENCE_INDEX_FREEZE_NOTE.md`
- Evidence index drift guard proposal:
  `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_PROPOSAL.md`
- Evidence index drift guard assignment:
  `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_ASSIGNMENT.md`
- Evidence index drift guard: `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md`
- Evidence index drift guard tests: `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_TESTS.md`
- Evidence index drift guard indexing:
  `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_INDEXING.md`
- Evidence index drift guard completion audit:
  `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_COMPLETION_AUDIT.md`
- Evidence index drift guard validation recheck:
  `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_VALIDATION_RECHECK.md`
- Evidence index guard freeze compliance check:
  `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_FREEZE_COMPLIANCE_CHECK.md`
- Evidence index guard source-link recheck:
  `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_SOURCE_LINK_RECHECK.md`
- Evidence index guard boundary review:
  `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_BOUNDARY_REVIEW.md`
- Evidence index guard chain freeze note:
  `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_CHAIN_FREEZE_NOTE.md`
- Research foundation boundary review:
  `docs/operations/GATE0_RESEARCH_FOUNDATION_BOUNDARY_REVIEW.md`
- Project tracklist finalization pass:
  `docs/operations/GATE0_PROJECT_TRACKLIST_FINALIZATION_PASS.md`
- Foundation freeze note: `docs/operations/GATE0_FOUNDATION_FREEZE_NOTE.md`
- Next-phase blocker audit: `docs/operations/GATE0_NEXT_PHASE_READINESS_BLOCKER_AUDIT.md`
- Foundation closeout packet: `docs/operations/GATE0_FOUNDATION_CLOSEOUT_PACKET.md`
- Closeout validation recheck: `docs/operations/GATE0_CLOSEOUT_VALIDATION_RECHECK.md`
- Closeout source-link recheck: `docs/operations/GATE0_CLOSEOUT_SOURCE_LINK_RECHECK.md`
- Closeout freeze compliance: `docs/operations/GATE0_CLOSEOUT_FREEZE_COMPLIANCE.md`
- Post-closeout change control: `docs/operations/GATE0_POST_CLOSEOUT_CHANGE_CONTROL.md`
- Operator handoff packet: `docs/operations/GATE0_OPERATOR_HANDOFF_PACKET.md`
- Final tracklist line-width audit: `docs/operations/GATE0_FINAL_TRACKLIST_LINE_WIDTH_AUDIT.md`
- Final documentation index audit: `docs/operations/GATE0_FINAL_DOCUMENTATION_INDEX_AUDIT.md`
- Final review-record audit: `docs/operations/GATE0_FINAL_REVIEW_RECORD_AUDIT.md`
- Final maintenance boundary note: `docs/operations/GATE0_FINAL_MAINTENANCE_BOUNDARY_NOTE.md`
- Final operator status snapshot: `docs/operations/GATE0_FINAL_OPERATOR_STATUS_SNAPSHOT.md`
- Final validation recheck: `docs/operations/GATE0_FINAL_VALIDATION_RECHECK.md`
- Final source-link drift recheck: `docs/operations/GATE0_FINAL_SOURCE_LINK_DRIFT_RECHECK.md`
- Final progress snapshot recheck: `docs/operations/GATE0_FINAL_PROGRESS_SNAPSHOT_RECHECK.md`
- Final change-control compliance: `docs/operations/GATE0_FINAL_CHANGE_CONTROL_COMPLIANCE.md`
- Final operator closure note: `docs/operations/GATE0_FINAL_OPERATOR_CLOSURE_NOTE.md`
- Maintenance gap intake review: `docs/operations/GATE0_MAINTENANCE_GAP_INTAKE_REVIEW.md`
- Archive readiness blocker note: `docs/operations/GATE0_ARCHIVE_READINESS_BLOCKER_NOTE.md`
- Final no-expansion recheck: `docs/operations/GATE0_FINAL_NO_EXPANSION_RECHECK.md`
- Maintenance backlog cleanup: `docs/operations/GATE0_MAINTENANCE_BACKLOG_CLEANUP.md`
- Operator pause recommendation: `docs/operations/GATE0_OPERATOR_PAUSE_RECOMMENDATION.md`
- Review coverage drift guard: `docs/operations/GATE0_REVIEW_COVERAGE_DRIFT_GUARD.md`
- Guard suite command consolidation: `docs/operations/GATE0_GUARD_SUITE_COMMAND_CONSOLIDATION.md`
- Quality suite command consolidation:
  `docs/operations/GATE0_QUALITY_SUITE_COMMAND_CONSOLIDATION.md`
- Final operator verification runbook:
  `docs/operations/GATE0_FINAL_OPERATOR_VERIFICATION_RUNBOOK.md`
- Verification failure triage template:
  `docs/operations/GATE0_VERIFICATION_FAILURE_TRIAGE_TEMPLATE.md`
- Maintenance intake checklist: `docs/operations/GATE0_MAINTENANCE_INTAKE_CHECKLIST.md`
- Operator pause confirmation note: `docs/operations/GATE0_OPERATOR_PAUSE_CONFIRMATION_NOTE.md`
- Control plane index final recheck: `docs/operations/GATE0_CONTROL_PLANE_INDEX_FINAL_RECHECK.md`
- Final maintenance handoff snapshot: `docs/operations/GATE0_FINAL_MAINTENANCE_HANDOFF_SNAPSHOT.md`
- Gate 0 baseline freeze confirmation: `docs/operations/GATE0_BASELINE_FREEZE_CONFIRMATION.md`
- Gate 1 entry criteria definition: `docs/operations/GATE1_ENTRY_CRITERIA_DEFINITION.md`
- Gate 1 planning packet draft: `docs/operations/GATE1_PLANNING_PACKET_DRAFT.md`
- Gate 1 historical backtest contract assignment packet:
  `docs/operations/GATE1_HISTORICAL_BACKTEST_CONTRACT_ASSIGNMENT_PACKET.md`
- Gate 1 historical data snapshot contract plan:
  `docs/operations/GATE1_HISTORICAL_DATA_SNAPSHOT_CONTRACT_PLAN.md`
- Gate 1 strategy version contract plan: `docs/operations/GATE1_STRATEGY_VERSION_CONTRACT_PLAN.md`
- Gate 1 fees and slippage assumption plan:
  `docs/operations/GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_PLAN.md`
- Gate 1 immutable backtest record plan: `docs/operations/GATE1_IMMUTABLE_BACKTEST_RECORD_PLAN.md`
- Gate 1 backtest result schema plan: `docs/operations/GATE1_BACKTEST_RESULT_SCHEMA_PLAN.md`
- Gate 1 reproducibility check plan: `docs/operations/GATE1_REPRODUCIBILITY_CHECK_PLAN.md`
- Gate 1 fixture boundary plan: `docs/operations/GATE1_FIXTURE_BOUNDARY_PLAN.md`
- Gate 1 contract validation guard plan: `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_PLAN.md`
- Gate 1 implementation readiness blocker audit:
  `docs/operations/GATE1_IMPLEMENTATION_READINESS_BLOCKER_AUDIT.md`
- Gate 1 contract-only implementation assignment packet:
  `docs/operations/GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md`
- Gate 1 historical data snapshot contract:
  `docs/operations/GATE1_HISTORICAL_DATA_SNAPSHOT_CONTRACT.md`
- Gate 1 strategy version contract: `docs/operations/GATE1_STRATEGY_VERSION_CONTRACT.md`
- Gate 1 fees and slippage assumption contract:
  `docs/operations/GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_CONTRACT.md`
- Gate 1 immutable backtest record contract:
  `docs/operations/GATE1_IMMUTABLE_BACKTEST_RECORD_CONTRACT.md`
- Gate 1 backtest result contract: `docs/operations/GATE1_BACKTEST_RESULT_CONTRACT.md`
- Gate 1 reproducibility check contract: `docs/operations/GATE1_REPRODUCIBILITY_CHECK_CONTRACT.md`
- Gate 1 historical backtest fixtures: `docs/operations/GATE1_HISTORICAL_BACKTEST_FIXTURES.md`
- Gate 1 contract validation guard: `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md`
- Gate 1 contract validation guard indexing:
  `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_INDEXING.md`
- Gate 1 guard command doc alignment: `docs/operations/GATE1_GUARD_COMMAND_DOC_ALIGNMENT.md`
- Format check control-plane coverage:
  `docs/operations/GATE0_FORMAT_CHECK_CONTROL_PLANE_COVERAGE.md`
- Progress snapshot generated-date policy:
  `docs/operations/GATE0_PROGRESS_SNAPSHOT_GENERATED_DATE_POLICY.md`
- Gate 1 contract guard schema validation hardening:
  `docs/operations/GATE1_CONTRACT_GUARD_SCHEMA_VALIDATION_HARDENING.md`
- Paper candidate semantic block: `docs/operations/GATE0_PAPER_CANDIDATE_SEMANTIC_BLOCK.md`
- Canonical repo hygiene and agent alignment:
  `docs/operations/GATE0_CANONICAL_REPO_HYGIENE_AND_AGENT_ALIGNMENT.md`
- GitHub CI verification workflow: `docs/operations/GATE0_GITHUB_CI_VERIFICATION_WORKFLOW.md`
- GitHub repo handoff and clone runbook:
  `docs/operations/GATE0_GITHUB_REPO_HANDOFF_AND_CLONE_RUNBOOK.md`
- Agent manifest drift guard: `docs/operations/GATE0_AGENT_MANIFEST_DRIFT_GUARD.md`
- Repo hygiene guard: `docs/operations/GATE0_REPO_HYGIENE_GUARD.md`
- GitHub baseline release note: `docs/operations/GATE0_GITHUB_BASELINE_RELEASE_NOTE.md`
- GitHub CI post-push evidence: `docs/operations/GATE0_GITHUB_CI_POST_PUSH_EVIDENCE.md`
- GitHub Actions Node runtime deprecation review:
  `docs/operations/GATE0_GITHUB_ACTIONS_NODE_RUNTIME_DEPRECATION_REVIEW.md`
- GitHub CI workflow runtime hardening:
  `docs/operations/GATE0_GITHUB_CI_WORKFLOW_RUNTIME_HARDENING.md`
- GitHub CI evidence refresh after runtime hardening:
  `docs/operations/GATE0_GITHUB_CI_EVIDENCE_REFRESH_AFTER_RUNTIME_HARDENING.md`
- Remote verification runbook: `docs/operations/GATE0_REMOTE_VERIFICATION_RUNBOOK.md`
- CI failure triage guardrail: `docs/operations/GATE0_CI_FAILURE_TRIAGE_GUARDRAIL.md`
- GitHub Actions annotation follow-up watch:
  `docs/operations/GATE0_GITHUB_ACTIONS_ANNOTATION_FOLLOW_UP_WATCH.md`
- CI evidence freshness guard proposal:
  `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_GUARD_PROPOSAL.md`
- CI evidence freshness guard implementation:
  `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_GUARD_IMPLEMENTATION.md`
- Remote verification evidence index: `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`
- Maintenance pause reconfirmation: `docs/operations/GATE0_MAINTENANCE_PAUSE_RECONFIRMATION.md`
- Command center scope and boundary: `docs/operations/GATE0_COMMAND_CENTER_SCOPE_AND_BOUNDARY.md`
- Command center data contract: `docs/operations/GATE0_COMMAND_CENTER_DATA_CONTRACT.md`
- Static local command center prototype:
  `docs/operations/GATE0_STATIC_LOCAL_COMMAND_CENTER_PROTOTYPE.md`
- Command center no-execution guardrails:
  `docs/operations/GATE0_COMMAND_CENTER_NO_EXECUTION_GUARDRAILS.md`
- Command center QA/RISK acceptance: `docs/operations/GATE0_COMMAND_CENTER_QA_RISK_ACCEPTANCE.md`
- Command center visual QA pass: `docs/operations/GATE0_COMMAND_CENTER_VISUAL_QA_PASS.md`
- Command center accessibility baseline:
  `docs/operations/GATE0_COMMAND_CENTER_ACCESSIBILITY_BASELINE.md`
- Command center runtime data source plan:
  `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_DATA_SOURCE_PLAN.md`
- Command center local preview script:
  `docs/operations/GATE0_COMMAND_CENTER_LOCAL_PREVIEW_SCRIPT.md`
- Command center evidence freshness guard:
  `docs/operations/GATE0_COMMAND_CENTER_EVIDENCE_FRESHNESS_GUARD.md`
- Command center CI evidence refresh: `docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH.md`
- Command center CI run freshness guard:
  `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_FRESHNESS_GUARD.md`
- Command center navigation contract check:
  `docs/operations/GATE0_COMMAND_CENTER_NAVIGATION_CONTRACT_CHECK.md`
- Command center accessibility contract check:
  `docs/operations/GATE0_COMMAND_CENTER_ACCESSIBILITY_CONTRACT_CHECK.md`
- Command center preview script contract check:
  `docs/operations/GATE0_COMMAND_CENTER_PREVIEW_SCRIPT_CONTRACT_CHECK.md`
- Command center CI evidence post-guard refresh:
  `docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_POST_GUARD_REFRESH.md`
- Command center rendered evidence contract:
  `docs/operations/GATE0_COMMAND_CENTER_RENDERED_EVIDENCE_CONTRACT.md`
- Command center mobile evidence table UX:
  `docs/operations/GATE0_COMMAND_CENTER_MOBILE_EVIDENCE_TABLE_UX.md`
- Command center source link grouping:
  `docs/operations/GATE0_COMMAND_CENTER_SOURCE_LINK_GROUPING.md`
- Command center operator handoff note:
  `docs/operations/GATE0_COMMAND_CENTER_OPERATOR_HANDOFF_NOTE.md`
- Skill governance review: `docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md`
- Skill library intake policy: `docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md`
- Orchestrator reviewer skill intake: `docs/operations/GATE0_ORCHESTRATOR_REVIEWER_SKILL_INTAKE.md`
- Orchestrator reviewer skill: `skills/gatezero-orchestrator-reviewer/SKILL.md`
- QA security reviewer skill intake: `docs/operations/GATE0_QA_SECURITY_REVIEWER_SKILL_INTAKE.md`
- QA security reviewer skill: `skills/gatezero-qa-security-reviewer/SKILL.md`
- Docs control-plane reviewer skill intake:
  `docs/operations/GATE0_DOCS_CONTROL_PLANE_REVIEWER_SKILL_INTAKE.md`
- Product strategy reviewer skill intake:
  `docs/operations/GATE0_PRODUCT_STRATEGY_REVIEWER_SKILL_INTAKE.md`
- UI command-center reviewer skill intake:
  `docs/operations/GATE0_UI_COMMAND_CENTER_REVIEWER_SKILL_INTAKE.md`
- Quant backtest reviewer skill intake:
  `docs/operations/GATE0_QUANT_BACKTEST_REVIEWER_SKILL_INTAKE.md`
- Skill routing matrix: `docs/operations/GATE0_SKILL_ROUTING_MATRIX.md`
- Skill routing guard: `docs/operations/GATE0_SKILL_ROUTING_GUARD.md`
- Risk governance reviewer skill intake:
  `docs/operations/GATE0_RISK_GOVERNANCE_REVIEWER_SKILL_INTAKE.md`
- Risk governance reviewer skill: `skills/gatezero-risk-governance-reviewer/SKILL.md`
- Remote CI evidence refresh after skill intake:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_INTAKE.md`
- Command center CI run record refresh after skill intake:
  `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_INTAKE.md`
- Remote CI evidence refresh after skill routing:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_ROUTING.md`
- Command center CI run record refresh after skill routing:
  `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_ROUTING.md`
- Skill library closeout review: `docs/operations/GATE0_SKILL_LIBRARY_CLOSEOUT_REVIEW.md`
- Skill usage handoff note: `docs/operations/GATE0_SKILL_USAGE_HANDOFF_NOTE.md`
- Next scope recommendation after skill library:
  `docs/operations/GATE0_NEXT_SCOPE_RECOMMENDATION_AFTER_SKILL_LIBRARY.md`
- Command center app: `apps/web/index.html`, `apps/web/src/main.js`,
  `apps/web/src/command-center-data.js`, `apps/web/src/styles.css`
- Command center guardrail tests: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Command center preview script: `scripts/preview-web.ts`
- Command center preview script tests:
  `packages/fixtures/tests/gate0-command-center-preview-script.test.ts`
- Command center freshness guard script: `scripts/check-gate0-command-center-freshness.ts`
- Command center freshness guard tests:
  `packages/fixtures/tests/gate0-command-center-freshness-check.test.ts`
- Command center render contract script: `scripts/check-gate0-command-center-render-contract.ts`
- Command center render contract tests:
  `packages/fixtures/tests/gate0-command-center-render-contract.test.ts`
- Skill governance guard script: `scripts/check-gate0-skill-governance.ts`
- Skill governance guard tests: `packages/fixtures/tests/gate0-skill-governance.test.ts`
- Trader product reviewer skill: `skills/trader-product-reviewer/SKILL.md`
- Trading forex domain expert skill: `skills/trading-forex-domain-expert/SKILL.md`
- CI evidence freshness guard script: `scripts/check-gate0-ci-evidence-freshness.ts`
- CI evidence freshness guard tests:
  `packages/fixtures/tests/gate0-ci-evidence-freshness-check.test.ts`
- GitHub CI workflow source: `.github/workflows/gate0-verify.yml`
- Agent manifest drift guard script: `scripts/check-gate0-agent-manifest.ts`
- Agent manifest drift guard tests: `packages/fixtures/tests/gate0-agent-manifest-check.test.ts`
- Repo hygiene guard script: `scripts/check-repo-hygiene.ts`
- Repo hygiene guard tests: `packages/fixtures/tests/repo-hygiene-check.test.ts`
- Gate 1 historical backtest contract source:
  `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- Gate 1 historical backtest contract tests:
  `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- Gate 1 historical backtest fixture source:
  `packages/fixtures/src/gate1-historical-backtest-fixtures.ts`
- Gate 1 historical backtest fixture tests:
  `packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts`
- Gate 1 contract guard script: `scripts/check-gate1-contracts.ts`
- Gate 1 contract guard tests: `packages/fixtures/tests/gate1-contract-guard.test.ts`
- Evidence index schema source: `packages/contracts/src/research-loop-evidence-index.ts`
- Evidence index fixture source: `packages/fixtures/src/gate0-research-loop-evidence-index.ts`
- Evidence index contract test source:
  `packages/contracts/tests/research-loop-evidence-index.test.ts`
- Evidence index fixture test source:
  `packages/fixtures/tests/gate0-research-loop-evidence-index.test.ts`
- Evidence index drift guard script: `scripts/check-gate0-evidence-index-drift.ts`
- Evidence index drift guard test source:
  `packages/fixtures/tests/gate0-evidence-index-drift-check.test.ts`
- Review coverage drift guard script: `scripts/check-gate0-review-coverage.ts`
- Review coverage drift guard test source:
  `packages/fixtures/tests/gate0-review-coverage-check.test.ts`
- Guard suite command source: `package.json`
- Quality suite command source: `package.json`
- Inspect command contract: `docs/operations/GATE0_INSPECT_COMMAND_CONTRACT.md`
- Docs coverage drift guard script: `scripts/check-gate0-docs-coverage.ts`
- Gate scanner: `scripts/validate-gate0.ts`
