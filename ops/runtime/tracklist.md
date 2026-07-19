# TraderFrame Project Tracklist

## Control Header

| Field                      | Value                                                          |
| -------------------------- | -------------------------------------------------------------- |
| Project                    | TraderFrame                                                    |
| Operating gate             | `G2_PAPER_TRADING`                                             |
| Operating scope            | `paper_simulation_planning_only`                               |
| Core wedge                 | No trade without evidence. No execution without risk approval. |
| Tracklist status           | Active living tracker                                          |
| Last updated               | 2026-07-19                                                     |
| Latest accepted packet     | `TRD-636`                                                      |
| Latest accepted validation | 79 test files, 548 tests passed                                |

## Boundary

TraderFrame is currently a local research, evidence, risk-control, and execution-support foundation.

The project is now at Gate 2 planning authorization for paper simulation only. The system must not
add live trading, external account connectivity, autonomous execution, AI buy/sell prediction, real
order placement, provider credential handling, strategy profitability claims, readiness claims,
approval scoring, report publishing, external execution paths, or risk-gate loosening. Local
simulation mechanics are bounded to deterministic paper-simulation evidence only.

## Status Legend

| Status             | Meaning                                                                              |
| ------------------ | ------------------------------------------------------------------------------------ |
| `accepted`         | Packet completed, reviewed, and accepted by ORCHESTRATOR after QA/RISK review.       |
| `complete`         | Workstream has enough accepted packets to satisfy its current gate purpose.          |
| `active`           | Workstream is still useful for further bounded gate hardening.                       |
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
pnpm check:market-workspace
pnpm check:gate0-skills
pnpm check:gate0-skill-routing
pnpm check:gate0-agents
pnpm check:gate0-actions-runtime
pnpm check:gate0-source-links
pnpm check:gate0-tracklist-sections
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
pnpm test:ci
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
- `pnpm check:gate0-actions-runtime`: passed.
- `pnpm check:gate0-source-links`: passed.
- `pnpm check:gate0-tracklist-sections`: passed.
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
- `pnpm check:market-workspace`: passed.
- `pnpm test:ci`: 75 test files passed, 528 tests passed.
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
- Accepted packets: `TRD-044` to `TRD-402`
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
  - GitHub Actions Node 24-compatible action upgrade and local runtime posture guard.
  - Remote CI evidence freshness coverage, agent-manifest guard reliability, evidence refresh, and
    command-center CI run display alignment after the action upgrade.
  - Command-center CI evidence refresh after the TRD-230 pushed verification run.
  - CI evidence freshness coverage for command-center CI evidence records.
  - Latest push evidence-index confirmation, CI evidence count expectations, command-center last
    verified commit, source-link duplicate guard, tracklist section length guard, source-link index
    cleanup, command-center visual recheck, maintenance backlog re-rank, and Gate 1 blocker recheck.
  - Remote CI evidence refresh after the TRD-240 push and static command-center CI metadata
    alignment to that evidence.
  - Remote CI evidence refresh after the TRD-242 push and static command-center CI metadata
    alignment to that evidence.
  - Local command-center runtime snapshot endpoint and same-origin browser auto-refresh.
  - Remote CI evidence refresh after the TRD-246 push and command-center metadata alignment to that
    evidence.
  - Remote CI evidence refresh after the TRD-248 push and command-center metadata alignment to that
    evidence.
  - Remote CI evidence refresh after the TRD-250 push and command-center metadata alignment to that
    evidence.
  - Remote CI evidence refresh after the TRD-252 push and command-center metadata alignment to that
    evidence.
  - Command-center runtime schema contract and builder validation.
  - Command-center runtime endpoint response contract.
  - CI evidence refresh helper and refresh-loop pause control.
  - Maintenance backlog alignment with the CI evidence refresh pause.
  - Gate 1 transition authorization for historical-data backtesting only.
  - TraderFrame brand alignment with GateZero retained as the internal gate/control-plane name.
  - Gate 1 operating gate model activation for historical-data backtesting only.
  - Stable single-worker CI test command for deterministic verification.
  - Dependency audit and upgrade plan for vulnerable test tooling.
  - Dependency upgrade execution for patched test tooling and clean audit posture.
  - Directional PnL schema-only contract and focused contract tests.
  - Reusable synthetic long and short directional PnL fixtures.
  - Directional PnL negative cases, guard indexing hardening, cross-currency and JPY precision
    fixtures, cost consistency, PnL evidence references, bundle fixtures, and integrity review.
  - PnL bundle negative cases, bid/ask historical data fixture, spread alignment, timing integrity,
    lookahead blocker, same-candle ambiguity, assumption risk register, risk-register negative
    cases, risk-register guard indexing hardening, bad-assumption fixtures, backtest run assembly,
    metric report evidence, reproducibility hardening, operator decision event, Gate 1 completion
    criteria draft, Gate 2 blocker audit, source-link/guard coverage recheck, negative cases for
    assemblies, metric reports, and operator decisions, completion/source-link hardening, Gate 2
    blocker guard coverage, and planning records for missing candles, stale data, duplicate signals,
    parameter immutability, and evidence-bundle assembly review.
  - Gate 1 assembly, metric report, and operator decision guard-index rechecks; missing-candle,
    stale-data, duplicate-signal, parameter-immutability, and evidence-bundle summary contracts;
    completion blocker recheck; and control-plane checkpoint.
  - Project-local skill default gate alignment with the current Gate 1 historical-backtesting-only
    operating state.
  - Gate command naming migration plan, blocked-evidence docs coverage recheck, evidence blocker
    aggregate guard, fixture mutation negative cases, snapshot column completeness guard, stale-data
    threshold policy, parameter hash provenance record, duplicate signal fingerprint contract, real
    historical data adapter blocker recheck, and skill eval phase alignment guard.
  - Gate command alias compatibility plan, skill guard naming recheck, blocker aggregate negative
    fixture set, OHLC mid-price limitation record, historical data adapter boundary, data-provider
    provenance fields, stale-data source-link recheck, parameter hash canonicalization plan,
    duplicate signal fingerprint negative cases, and blocker expansion checkpoint.
  - Adapter authorization blocker inventory, adapter fixture import contract plan, duplicate signal
    source-link recheck, parameter hash negative cases plan, provider license review checklist,
    command alias docs coverage recheck, skill metadata guard index record, imported snapshot
    quarantine policy, blocker checkpoint coverage recheck, and adapter-readiness blocker
    checkpoint.
  - Adapter blocker source-link recheck, imported snapshot schema authority, provider credential
    exclusion policy, quarantine policy coverage recheck, adapter fixture negative cases plan, data
    retention limitation record, provider license checklist coverage recheck, adapter audit-log
    boundary, adapter blocker checkpoint recheck, and adapter planning freeze checkpoint.
  - Post-adapter-freeze lane selection, guard command doc alignment recheck, contract guard schema
    validation hardening recheck, readiness blocker language recheck, command-center wording audit,
    review artifact aging policy draft, source-link map consistency recheck, blocked-scope scanner
    review, operator handoff freshness review, and Gate 1 maintenance checkpoint.
  - Maintenance gap intake, tracklist queue discipline recheck, command-center pause wording, review
    aging source-link recheck, scanner blocked-term sample audit, stale-reference sweep, maintenance
    stop-condition checkpoint, evidence freshness churn guard review, brand handoff isolation
    review, and Gate 1 maintenance closeout checkpoint.
  - Gate 1 closeout evidence review, acceptance criteria audit, Gate 2 readiness assessment packet,
    Gate 2 blocker inventory, autonomy gate delta review, financial risk gate delta review,
    credential boundary assessment, execution-scope prohibition review, Gate 2 assessment
    QA/security review, and Gate 1 closeout recommendation.
  - Gate 1 closeout signoff packet, Gate 2 authorization criteria draft, risk-owner authorization
    checklist, autonomy-owner authorization checklist, QA/security authorization checklist, Gate 2
    implementation prohibition note, operator decision authority review, Gate 1 final verification
    record, gate movement decision packet draft, and Gate 1 signoff recommendation.
  - Operator-approved Gate 2 planning authorization, Gate 1 pause exit, material gap intake, brand
    handoff isolation, movement request intake, approval routing, dry-run checklist, planning hold,
    command-center sync, and next-decision checkpoint.
  - Gate 2 simulated-order record planning, simulation state boundary planning, no-external-account
    guard planning, credential exclusion guard planning, simulated-fill assumption planning, risk
    review event planning, operator action log planning, negative fixture planning, command-center
    planning extension, and implementation readiness review.
  - Gate 2 contract-only implementation packet, simulated-order record contract, simulation state
    contract, risk review event contract, operator action log contract, simulated fill assumption
    contract, synthetic fixture set, negative contract tests, contract guard indexing, and contract
    checkpoint.
  - Gate 2 mechanics planning packet, local simulation engine boundary, simulation input assembly,
    simulation output artifacts, replay determinism, failure modes, command-center planning copy,
    mechanics implementation blocker review, contract source-link recheck, and mechanics planning
    checkpoint.
  - Gate 2 mechanics implementation packet for future local deterministic simulation work.
  - Gate 2 local simulation engine pure function with deterministic local output and blocked-state
    handling.
  - Gate 2 simulation input assembly, output artifacts, replay guard, failure fixtures,
    command-center evidence view, scanner boundary review, source-link recheck, implementation
    checkpoint, blocker review, and operator handoff.
  - Gate 2 mechanics closure audit confirming the local mechanics lane is complete and bounded.
  - Gate 2 next gap intake recording that the frontend remains a command-center baseline, not a
    complete read-only app shell.
  - Gate 2 command-center post-mechanics wording audit aligning visible copy with local
    paper-simulation evidence boundaries.
  - Gate 2 maintenance closeout records covering stale references, guard aging, limitations,
    operator workflow, no-expansion, brand isolation, maintenance decision, and read-only frontend
    planning requirements.
  - Gate 2 frontend planning records covering information architecture, route boundaries, panel
    contracts, no-action-control guard planning, accessibility, visual hierarchy, and readiness
    blockers.
  - TraderFrame frontend skill lenses for marketing strategy, copy, visual product design, and
    frontend engineering review under Gate 2 paper-simulation planning boundaries.
  - Read-only frontend implementation packet draft defining allowed build files, blocked UI
    affordances, local-data requirements, risk/copy constraints, accessibility checks, and
    validation requirements before any frontend code implementation proceeds.
  - Frontend no-action-control test plan defining blocked UI text classes, safe replacement copy
    families, negative fixture shape, and required checks before frontend implementation acceptance.
  - Frontend local data adapter, panel inventory, navigation shell, evidence panel, risk/limitation
    panel, workflow panel, accessibility verification, go/no-go checkpoint, shell build packet, and
    no-action-control guard implementation records.
  - Read-only frontend shell implementation with evidence, limitations, risk, manual workflow,
    docs/source-link rendering, responsive polish, accessibility verification, guard evidence
    recheck, and implementation checkpoint.
  - Frontend operator review, evidence-detail planning, limitation copy audit, source-link grouping
    polish, runtime refresh UX review, mobile and keyboard QA rechecks, blocked-copy regression
    hardening, handoff note, and lane closeout checkpoint.
  - Gate 2 frontend-to-simulation planning records covering UI gap intake, simulation evidence
    detail contracts, operator workflow evidence cards, risk-review panel data, local simulation
    artifact summaries, failure-mode evidence, source-link density, no-account-connector recheck,
    handoff, and next implementation checkpoint.
  - Gate 2 simulation evidence planning records covering schema draft, negative cases, workflow
    fixtures, risk fixtures, local artifact summaries, failure fixtures, source-link maps, frontend
    display packet gating, contract guard planning, and checkpointing.

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

| Packet    | Status   | Workstream      | Primary outcome                                        |
| --------- | -------- | --------------- | ------------------------------------------------------ |
| `TRD-001` | accepted | Foundation      | Initialized Gate 0 Research monorepo.                  |
| `TRD-002` | accepted | Governance      | Tightened Gate 0 scanner allowlist.                    |
| `TRD-003` | accepted | Trace integrity | Added immutable strategy decision trace.               |
| `TRD-004` | accepted | Trace integrity | Added canonical trace hashing.                         |
| `TRD-005` | accepted | Audit           | Added local audit log storage.                         |
| `TRD-006` | accepted | Audit           | Hardened audit-log safety behavior.                    |
| `TRD-007` | accepted | Fixtures        | Added benchmark fixtures.                              |
| `TRD-008` | accepted | Metrics         | Added deterministic metric utilities.                  |
| `TRD-009` | accepted | Metrics         | Added backtest result consistency checks.              |
| `TRD-010` | accepted | Data quality    | Added data snapshot quality checks.                    |
| `TRD-011` | accepted | Data quality    | Expanded data snapshot metadata.                       |
| `TRD-012` | accepted | Review bundle   | Added strategy review bundle assembly.                 |
| `TRD-013` | accepted | Review bundle   | Added persisted local review bundle storage.           |
| `TRD-014` | accepted | Review bundle   | Added local review bundle query utilities.             |
| `TRD-015` | accepted | Review bundle   | Added local review bundle summaries.                   |
| `TRD-016` | accepted | Redaction       | Added local summary redaction policy checks.           |
| `TRD-017` | accepted | Redaction       | Verified redacted summary shape.                       |
| `TRD-018` | accepted | Operator review | Added local operator review checklist.                 |
| `TRD-019` | accepted | Operator review | Added checklist completeness scoring.                  |
| `TRD-020` | accepted | Operator review | Added local review artifact inventory.                 |
| `TRD-021` | accepted | Diagnostics     | Added local protected-loop diagnostics.                |
| `TRD-022` | accepted | Diagnostics     | Added local diagnostic aggregation.                    |
| `TRD-023` | accepted | Review state    | Added local Gate 0 review-state snapshot.              |
| `TRD-024` | accepted | Review state    | Added local snapshot change comparison.                |
| `TRD-025` | accepted | Thresholds      | Added local evidence completeness thresholds.          |
| `TRD-026` | accepted | Thresholds      | Added threshold result comparison.                     |
| `TRD-027` | accepted | Issue register  | Added local protected-loop issue register.             |
| `TRD-028` | accepted | Issue register  | Added local issue register comparison.                 |
| `TRD-029` | accepted | State package   | Added local Gate 0 review-state assembly.              |
| `TRD-030` | accepted | State package   | Added local Gate 0 assembly summary.                   |
| `TRD-031` | accepted | State package   | Added assembly summary comparison.                     |
| `TRD-032` | accepted | Integrity       | Added local Gate 0 state package integrity checks.     |
| `TRD-033` | accepted | Integrity       | Added package integrity history aggregate.             |
| `TRD-034` | accepted | Lifecycle       | Added state package lifecycle manifest.                |
| `TRD-035` | accepted | Lifecycle       | Added lifecycle manifest comparison.                   |
| `TRD-036` | accepted | Audit           | Added Gate 0 Research completion audit.                |
| `TRD-037` | accepted | Dry-run chain   | Added Gate 0 dry-run scenario fixture.                 |
| `TRD-038` | accepted | Dry-run chain   | Added Gate 0 dry-run operator checklist.               |
| `TRD-039` | accepted | Dry-run chain   | Added dry-run checklist summary.                       |
| `TRD-040` | accepted | Dry-run chain   | Added dry-run friction report.                         |
| `TRD-041` | accepted | Dry-run chain   | Added dry-run iteration recommendation.                |
| `TRD-042` | accepted | Audit           | Added dry-run chain completion audit.                  |
| `TRD-043` | accepted | Baseline        | Added Gate 0 baseline release note.                    |
| `TRD-044` | accepted | Ergonomics      | Added operator ergonomics brief.                       |
| `TRD-045` | accepted | Ergonomics      | Added local dry-run inspect command.                   |
| `TRD-046` | accepted | Ergonomics      | Added dry-run walkthrough.                             |
| `TRD-047` | accepted | Ergonomics      | Added blocked-friction dry-run scenario.               |
| `TRD-048` | accepted | Ergonomics      | Added dry-run inspect scenario selector.               |
| `TRD-049` | accepted | Ergonomics      | Added bounded invalid scenario handling.               |
| `TRD-050` | accepted | Ergonomics      | Added local inspect command help text.                 |
| `TRD-051` | accepted | Ergonomics      | Added inspect output shape tests.                      |
| `TRD-052` | accepted | Ergonomics      | Added Gate 0 operator review runbook.                  |
| `TRD-053` | accepted | Ergonomics      | Added local progress snapshot generator.               |
| `TRD-054` | accepted | Ergonomics      | Added local tracklist consistency check.               |
| `TRD-055` | accepted | Ergonomics      | Added local inspect command contract notes.            |
| `TRD-056` | accepted | Audit           | Added operator ergonomics completion audit.            |
| `TRD-057` | accepted | Ergonomics      | Added local operator checklist.                        |
| `TRD-058` | accepted | Ergonomics      | Added local progress snapshot freshness check.         |
| `TRD-059` | accepted | Ergonomics      | Renamed app identity to GateZero and added name check. |
| `TRD-060` | accepted | Ergonomics      | Added local operator command index.                    |
| `TRD-061` | accepted | Ergonomics      | Added local ergonomics artifact map.                   |
| `TRD-062` | accepted | Ergonomics      | Added local documentation cross-link audit.            |
| `TRD-063` | accepted | Ergonomics      | Added local validation command audit.                  |
| `TRD-064` | accepted | Ergonomics      | Added local name-check coverage audit.                 |
| `TRD-065` | accepted | Ergonomics      | Added local command-index coverage check.              |
| `TRD-066` | accepted | Ergonomics      | Added local artifact-map coverage check.               |
| `TRD-067` | accepted | Ergonomics      | Added local cross-link coverage check.                 |
| `TRD-068` | accepted | Ergonomics      | Added local validation-audit coverage check.           |
| `TRD-069` | accepted | Ergonomics      | Added local name-check coverage check.                 |
| `TRD-070` | accepted | Ergonomics      | Added local command-index coverage recheck.            |
| `TRD-071` | accepted | Ergonomics      | Added local artifact-map coverage recheck.             |
| `TRD-072` | accepted | Ergonomics      | Added local cross-link coverage recheck.               |
| `TRD-073` | accepted | Ergonomics      | Added local operator docs index coverage check.        |
| `TRD-074` | accepted | Ergonomics      | Added local review-record naming check.                |
| `TRD-075` | accepted | Ergonomics      | Added local source-link coverage check.                |
| `TRD-076` | accepted | Ergonomics      | Added local coverage-chain completion audit.           |
| `TRD-077` | accepted | Ergonomics      | Added local coverage drift guard proposal.             |
| `TRD-078` | accepted | Ergonomics      | Added local docs coverage drift guard.                 |
| `TRD-079` | accepted | Ergonomics      | Added docs coverage drift guard tests.                 |
| `TRD-080` | accepted | Ergonomics      | Indexed docs coverage drift guard references.          |
| `TRD-081` | accepted | Ergonomics      | Added coverage guard completion audit.                 |
| `TRD-082` | accepted | Ergonomics      | Added operator ergonomics freeze note.                 |
| `TRD-083` | accepted | Ergonomics      | Added ergonomics freeze compliance check.              |
| `TRD-084` | accepted | Ergonomics      | Added validation command coverage recheck.             |
| `TRD-085` | accepted | Ergonomics      | Added operator boundary review.                        |
| `TRD-086` | accepted | Ergonomics      | Added research loop evidence index proposal.           |
| `TRD-087` | accepted | Ergonomics      | Added research loop evidence index assignment note.    |
| `TRD-088` | accepted | Ergonomics      | Added evidence-index source-link check.                |
| `TRD-089` | accepted | Ergonomics      | Added evidence-index implementation packet.            |
| `TRD-090` | accepted | Ergonomics      | Added local evidence-index schema.                     |
| `TRD-091` | accepted | Ergonomics      | Added synthetic evidence-index fixture.                |
| `TRD-092` | accepted | Ergonomics      | Added evidence-index tests.                            |
| `TRD-093` | accepted | Ergonomics      | Added evidence-index documentation.                    |
| `TRD-094` | accepted | Ergonomics      | Added evidence-index coverage check.                   |
| `TRD-095` | accepted | Ergonomics      | Added evidence-index validation recheck.               |
| `TRD-096` | accepted | Ergonomics      | Added evidence-index completion audit.                 |
| `TRD-097` | accepted | Ergonomics      | Added evidence-index freeze note.                      |
| `TRD-098` | accepted | Ergonomics      | Added evidence-index drift guard proposal.             |
| `TRD-099` | accepted | Ergonomics      | Added evidence-index drift guard assignment.           |
| `TRD-100` | accepted | Ergonomics      | Added local evidence-index drift guard.                |
| `TRD-101` | accepted | Ergonomics      | Added evidence-index drift guard tests.                |
| `TRD-102` | accepted | Ergonomics      | Indexed evidence-index drift guard records.            |
| `TRD-103` | accepted | Ergonomics      | Added evidence-index drift guard completion audit.     |
| `TRD-104` | accepted | Ergonomics      | Added evidence-index guard validation recheck.         |
| `TRD-105` | accepted | Ergonomics      | Added evidence-index guard freeze compliance check.    |
| `TRD-106` | accepted | Ergonomics      | Added evidence-index guard source-link recheck.        |
| `TRD-107` | accepted | Ergonomics      | Added evidence-index guard boundary review.            |
| `TRD-108` | accepted | Ergonomics      | Added evidence-index guard chain freeze note.          |
| `TRD-109` | accepted | Foundation      | Added research foundation boundary review.             |
| `TRD-110` | accepted | Ergonomics      | Finalized project tracklist structure.                 |
| `TRD-111` | accepted | Foundation      | Added foundation freeze note.                          |
| `TRD-112` | accepted | Foundation      | Added next-phase blocker audit.                        |
| `TRD-113` | accepted | Foundation      | Added foundation closeout packet.                      |
| `TRD-114` | accepted | Foundation      | Added closeout validation recheck.                     |
| `TRD-115` | accepted | Foundation      | Added closeout source-link recheck.                    |
| `TRD-116` | accepted | Foundation      | Added closeout freeze compliance check.                |
| `TRD-117` | accepted | Foundation      | Added post-closeout change-control rule.               |
| `TRD-118` | accepted | Foundation      | Added operator handoff packet.                         |
| `TRD-119` | accepted | Foundation      | Added final tracklist line-width audit.                |
| `TRD-120` | accepted | Foundation      | Added final documentation index audit.                 |
| `TRD-121` | accepted | Foundation      | Added final review-record audit.                       |
| `TRD-122` | accepted | Foundation      | Added final maintenance boundary note.                 |
| `TRD-123` | accepted | Foundation      | Added final operator status snapshot.                  |
| `TRD-124` | accepted | Foundation      | Added final validation recheck.                        |
| `TRD-125` | accepted | Foundation      | Added final source-link drift recheck.                 |
| `TRD-126` | accepted | Foundation      | Added final progress snapshot recheck.                 |
| `TRD-127` | accepted | Foundation      | Added final change-control compliance check.           |
| `TRD-128` | accepted | Foundation      | Added final operator closure note.                     |
| `TRD-129` | accepted | Foundation      | Added maintenance gap intake review.                   |
| `TRD-130` | accepted | Foundation      | Added archive readiness blocker note.                  |
| `TRD-131` | accepted | Foundation      | Added final no-expansion recheck.                      |
| `TRD-132` | accepted | Foundation      | Added maintenance backlog cleanup.                     |
| `TRD-133` | accepted | Foundation      | Added operator pause recommendation.                   |
| `TRD-134` | accepted | Foundation      | Added review coverage drift guard.                     |
| `TRD-135` | accepted | Foundation      | Added guard suite command consolidation.               |
| `TRD-136` | accepted | Foundation      | Added quality suite command consolidation.             |
| `TRD-137` | accepted | Foundation      | Added final operator verification runbook.             |
| `TRD-138` | accepted | Foundation      | Added verification failure triage template.            |
| `TRD-139` | accepted | Foundation      | Added maintenance intake checklist.                    |
| `TRD-140` | accepted | Foundation      | Added operator pause confirmation note.                |
| `TRD-141` | accepted | Foundation      | Added control plane index final recheck.               |
| `TRD-142` | accepted | Foundation      | Added final maintenance handoff snapshot.              |
| `TRD-143` | accepted | Foundation      | Added Gate 0 baseline freeze confirmation.             |
| `TRD-144` | accepted | Planning        | Added Gate 1 entry criteria definition.                |
| `TRD-145` | accepted | Planning        | Added Gate 1 planning packet draft.                    |
| `TRD-146` | accepted | Planning        | Added historical backtest contract assignment packet.  |
| `TRD-147` | accepted | Planning        | Added historical data snapshot contract plan.          |
| `TRD-148` | accepted | Planning        | Added strategy version contract plan.                  |
| `TRD-149` | accepted | Planning        | Added fees and slippage assumption plan.               |
| `TRD-150` | accepted | Planning        | Added immutable backtest record plan.                  |
| `TRD-151` | accepted | Planning        | Added backtest result schema plan.                     |
| `TRD-152` | accepted | Planning        | Added reproducibility check plan.                      |
| `TRD-153` | accepted | Planning        | Added fixture boundary plan.                           |
| `TRD-154` | accepted | Planning        | Added contract validation guard plan.                  |
| `TRD-155` | accepted | Planning        | Added implementation readiness blocker audit.          |
| `TRD-156` | accepted | Planning        | Added contract-only implementation assignment packet.  |
| `TRD-157` | accepted | Contracts       | Added historical data snapshot contract.               |
| `TRD-158` | accepted | Contracts       | Added strategy version contract.                       |
| `TRD-159` | accepted | Contracts       | Added fees and slippage assumption contract.           |
| `TRD-160` | accepted | Contracts       | Added immutable backtest record contract.              |
| `TRD-161` | accepted | Contracts       | Added backtest result contract.                        |
| `TRD-162` | accepted | Contracts       | Added reproducibility check contract.                  |
| `TRD-163` | accepted | Fixtures        | Added synthetic Gate 1 historical backtest fixtures.   |
| `TRD-164` | accepted | Validation      | Added Gate 1 contract validation guard.                |
| `TRD-165` | accepted | Validation      | Indexed Gate 1 contract validation guard.              |
| `TRD-166` | accepted | Validation      | Aligned Gate 1 guard command docs.                     |
| `TRD-167` | accepted | Validation      | Added docs and ops to format check coverage.           |
| `TRD-168` | accepted | Foundation      | Added progress snapshot generated-date policy.         |
| `TRD-169` | accepted | Validation      | Hardened Gate 1 guard with schema and fixture parsing. |
| `TRD-170` | accepted | Risk            | Blocked active paper-candidate Phase 0 semantics.      |
| `TRD-171` | accepted | Foundation      | Added canonical repo hygiene and agent alignment.      |
| `TRD-172` | accepted | Validation      | Added GitHub Gate 0 CI verification workflow.          |
| `TRD-173` | accepted | Foundation      | Added GitHub repo handoff and clone runbook.           |
| `TRD-174` | accepted | Validation      | Added agent manifest drift guard.                      |
| `TRD-175` | accepted | Validation      | Added repository hygiene guard.                        |
| `TRD-176` | accepted | Release         | Added GitHub baseline release note.                    |
| `TRD-177` | accepted | Validation      | Recorded successful pushed GitHub CI run evidence.     |
| `TRD-178` | accepted | Validation      | Reviewed GitHub Actions Node runtime deprecation.      |
| `TRD-179` | accepted | Validation      | Hardened GitHub CI action runtime setting.             |
| `TRD-180` | accepted | Validation      | Recorded post-hardening GitHub CI evidence.            |
| `TRD-181` | accepted | Operations      | Added remote verification runbook.                     |
| `TRD-182` | accepted | Operations      | Added CI failure triage guardrail.                     |
| `TRD-183` | accepted | Validation      | Added GitHub Actions annotation follow-up watch.       |
| `TRD-184` | accepted | Validation      | Proposed CI evidence freshness guard rules.            |
| `TRD-185` | accepted | Validation      | Added standalone CI evidence freshness guard.          |
| `TRD-186` | accepted | Operations      | Added remote verification evidence index.              |
| `TRD-187` | accepted | Operations      | Reconfirmed Gate 0 maintenance pause posture.          |
| `TRD-188` | accepted | UI boundary     | Defined Gate 0 command center scope and boundary.      |
| `TRD-189` | accepted | UI contract     | Added command center static data contract.             |
| `TRD-190` | accepted | UI prototype    | Added static local Gate 0 command center prototype.    |
| `TRD-191` | accepted | UI guardrails   | Added command center no-execution guardrails.          |
| `TRD-192` | accepted | UI acceptance   | Accepted command center as control-plane only.         |
| `TRD-193` | accepted | UI QA           | Recorded command center visual QA pass.                |
| `TRD-194` | accepted | UI access       | Added command center accessibility baseline.           |
| `TRD-195` | accepted | UI data plan    | Planned local-only command center data sources.        |
| `TRD-196` | accepted | UI preview      | Added local host command center preview command.       |
| `TRD-197` | accepted | UI guard        | Added command center evidence freshness guard.         |
| `TRD-198` | accepted | UI evidence     | Refreshed command center CI evidence.                  |
| `TRD-199` | accepted | UI guard        | Added command center CI-run freshness guard.           |
| `TRD-200` | accepted | UI contract     | Added command center navigation contract checks.       |

## Accepted Packet Ledger Continued

| Packet    | Status   | Workstream       | Primary outcome                                         |
| --------- | -------- | ---------------- | ------------------------------------------------------- |
| `TRD-201` | accepted | UI access        | Added command center accessibility contract checks.     |
| `TRD-202` | accepted | UI preview       | Added command center preview script contract checks.    |
| `TRD-203` | accepted | UI evidence      | Refreshed post-guard command center CI evidence.        |
| `TRD-204` | accepted | UI contract      | Added command center rendered evidence contract.        |
| `TRD-205` | accepted | UI access        | Added mobile evidence table labels and behavior.        |
| `TRD-206` | accepted | UI source links  | Grouped command center source links by purpose.         |
| `TRD-207` | accepted | UI handoff       | Added command center operator handoff note.             |
| `TRD-208` | accepted | Skill governance | Added phase-aware project skill governance.             |
| `TRD-209` | accepted | Skill governance | Added governed skill library intake policy.             |
| `TRD-210` | accepted | CI evidence      | Refreshed remote CI evidence after skill intake.        |
| `TRD-211` | accepted | UI evidence      | Refreshed command center CI run display.                |
| `TRD-212` | accepted | Skill governance | Added orchestrator reviewer skill intake.               |
| `TRD-213` | accepted | Skill governance | Added risk governance reviewer skill intake.            |
| `TRD-214` | accepted | Skill governance | Added QA security reviewer skill intake.                |
| `TRD-215` | accepted | Skill governance | Added docs control-plane reviewer skill intake.         |
| `TRD-216` | accepted | Skill governance | Added product strategy reviewer skill intake.           |
| `TRD-217` | accepted | Skill governance | Added UI command-center reviewer skill intake.          |
| `TRD-218` | accepted | Skill governance | Added quant backtest reviewer skill intake.             |
| `TRD-219` | accepted | Skill governance | Added Gate 0 skill routing matrix.                      |
| `TRD-220` | accepted | Skill governance | Added Gate 0 skill routing guard.                       |
| `TRD-221` | accepted | CI evidence      | Refreshed remote CI evidence after skill routing.       |
| `TRD-222` | accepted | UI evidence      | Refreshed command center CI run after skill routing.    |
| `TRD-223` | accepted | Skill governance | Added Gate 0 skill library closeout review.             |
| `TRD-224` | accepted | Skill governance | Added Gate 0 skill usage handoff note.                  |
| `TRD-225` | accepted | Scope control    | Added next scope recommendation after skill library.    |
| `TRD-226` | accepted | CI evidence      | Refreshed remote CI evidence after skill closeout.      |
| `TRD-227` | accepted | UI evidence      | Refreshed command center CI run after skill closeout.   |
| `TRD-228` | accepted | UI orientation   | Added hash-aware command center navigation state.       |
| `TRD-229` | accepted | CI runtime       | Upgraded GitHub Actions to Node 24-compatible majors.   |
| `TRD-230` | accepted | CI evidence      | Refreshed CI evidence after action runtime upgrade.     |
| `TRD-231` | accepted | UI evidence      | Refreshed command center CI run after TRD-230 push.     |
| `TRD-232` | accepted | CI evidence      | Confirmed latest-push evidence index alignment.         |
| `TRD-233` | accepted | Validation       | Added CI evidence count expectation coverage.           |
| `TRD-234` | accepted | UI evidence      | Added command center last verified commit field.        |
| `TRD-235` | accepted | Validation       | Added source-link duplicate guard.                      |
| `TRD-236` | accepted | Validation       | Added tracklist section length guard.                   |
| `TRD-237` | accepted | Control plane    | Cleaned tracklist source-link index.                    |
| `TRD-238` | accepted | UI QA            | Added command center visual recheck after TRD-231.      |
| `TRD-239` | accepted | Foundation       | Re-ranked maintenance backlog.                          |
| `TRD-240` | accepted | Planning         | Rechecked Gate 1 blockers.                              |
| `TRD-241` | accepted | CI evidence      | Refreshed remote CI evidence after TRD-240 push.        |
| `TRD-242` | accepted | UI evidence      | Refreshed command center CI metadata after TRD-241.     |
| `TRD-243` | accepted | CI evidence      | Refreshed remote CI evidence after TRD-242 push.        |
| `TRD-244` | accepted | UI evidence      | Refreshed command center CI metadata after TRD-243.     |
| `TRD-245` | accepted | UI runtime       | Added local command-center runtime snapshot endpoint.   |
| `TRD-246` | accepted | UI runtime       | Added local command-center auto-refresh.                |
| `TRD-247` | accepted | CI evidence      | Refreshed remote CI evidence after TRD-246 push.        |
| `TRD-248` | accepted | UI evidence      | Refreshed command center CI metadata after TRD-247.     |
| `TRD-249` | accepted | CI evidence      | Refreshed remote CI evidence after TRD-248 push.        |
| `TRD-250` | accepted | UI evidence      | Refreshed command center CI metadata after TRD-249.     |
| `TRD-251` | accepted | CI evidence      | Refreshed remote CI evidence after TRD-250 push.        |
| `TRD-252` | accepted | UI evidence      | Refreshed command center CI metadata after TRD-251.     |
| `TRD-253` | accepted | CI evidence      | Refreshed remote CI evidence after TRD-252 push.        |
| `TRD-254` | accepted | UI evidence      | Refreshed command center CI metadata after TRD-253.     |
| `TRD-255` | accepted | UI runtime       | Added command-center runtime schema contract.           |
| `TRD-256` | accepted | UI runtime       | Added runtime endpoint response contract.               |
| `TRD-257` | accepted | UI runtime       | Added runtime endpoint local security boundary.         |
| `TRD-258` | accepted | CI evidence      | Added local CI evidence refresh helper and record.      |
| `TRD-259` | accepted | CI evidence      | Refreshed remote CI evidence after TRD-258 push.        |
| `TRD-260` | accepted | CI evidence      | Refreshed remote CI evidence after TRD-259 push.        |
| `TRD-261` | accepted | CI evidence      | Added CI evidence refresh loop pause control.           |
| `TRD-262` | accepted | Operations       | Aligned maintenance backlog with CI refresh pause.      |
| `TRD-263` | accepted | Planning         | Authorized Gate 1 historical backtesting transition.    |
| `TRD-264` | accepted | Brand alignment  | Aligned product name to TraderFrame.                    |
| `TRD-265` | accepted | Gate activation  | Activated Gate 1 historical-backtesting-only state.     |
| `TRD-266` | accepted | Validation       | Added stable CI test command.                           |
| `TRD-267` | accepted | Security         | Recorded dependency audit and upgrade plan.             |
| `TRD-268` | accepted | Security         | Upgraded test tooling and cleared dependency audit.     |
| `TRD-269` | accepted | Contracts        | Added directional PnL correctness contract.             |
| `TRD-270` | accepted | Validation       | Added directional PnL contract tests.                   |
| `TRD-271` | accepted | Fixtures         | Added directional PnL long and short fixtures.          |
| `TRD-272` | accepted | Validation       | Added directional PnL negative cases.                   |
| `TRD-273` | accepted | Validation       | Hardened directional PnL guard indexing.                |
| `TRD-274` | accepted | Planning         | Planned cross-currency PnL evidence contract.           |
| `TRD-275` | accepted | Fixtures         | Added cross-currency PnL conversion fixture.            |
| `TRD-276` | accepted | Fixtures         | Added JPY-pair precision PnL fixture.                   |
| `TRD-277` | accepted | Validation       | Added PnL declared-cost consistency guard coverage.     |
| `TRD-278` | accepted | Contracts        | Added backtest-result to PnL evidence reference.        |
| `TRD-279` | accepted | Planning         | Planned PnL evidence bundle schema.                     |
| `TRD-280` | accepted | Fixtures         | Added PnL evidence reference and bundle fixtures.       |
| `TRD-281` | accepted | Review           | Reviewed Gate 1 backtest evidence integrity.            |
| `TRD-282` | accepted | Validation       | Added PnL evidence bundle negative cases.               |
| `TRD-283` | accepted | Validation       | Hardened PnL bundle guard indexing.                     |
| `TRD-284` | accepted | Documentation    | Added PnL bundle docs/source-link coverage.             |
| `TRD-285` | accepted | Planning         | Planned OHLC bid/ask historical data columns.           |
| `TRD-286` | accepted | Fixtures         | Added bid/ask historical data snapshot fixture.         |
| `TRD-287` | accepted | Validation       | Added spread assumption to bid/ask alignment.           |
| `TRD-288` | accepted | Planning         | Added candle timing and timezone integrity contract.    |
| `TRD-289` | accepted | Validation       | Added lookahead-bias blocker contract.                  |
| `TRD-290` | accepted | Planning         | Added same-candle stop/target ambiguity plan.           |
| `TRD-291` | accepted | Risk             | Added backtest assumption risk register.                |
| `TRD-292` | accepted | Validation       | Added assumption risk register negative cases.          |
| `TRD-293` | accepted | Validation       | Hardened risk-register guard indexing.                  |
| `TRD-294` | accepted | Fixtures         | Added bad-assumption fixture cases.                     |
| `TRD-295` | accepted | Contracts        | Added backtest run assembly contract.                   |
| `TRD-296` | accepted | Contracts        | Added metric report evidence-only contract.             |
| `TRD-297` | accepted | Validation       | Hardened reproducibility comparison failures.           |
| `TRD-298` | accepted | Contracts        | Added operator decision event contract.                 |
| `TRD-299` | accepted | Planning         | Drafted Gate 1 completion criteria.                     |
| `TRD-300` | accepted | Risk             | Recorded Gate 2 blocker audit.                          |
| `TRD-301` | accepted | Validation       | Rechecked Gate 1 source links and guard coverage.       |
| `TRD-302` | accepted | Validation       | Added backtest run assembly negative cases.             |
| `TRD-303` | accepted | Validation       | Added metric report evidence negative cases.            |
| `TRD-304` | accepted | Validation       | Added operator decision event negative cases.           |
| `TRD-305` | accepted | Documentation    | Hardened Gate 1 completion criteria source links.       |
| `TRD-306` | accepted | Risk             | Hardened Gate 2 blocker guard coverage.                 |
| `TRD-307` | accepted | Planning         | Planned missing-candle bad data fixtures.               |
| `TRD-308` | accepted | Planning         | Planned stale-data blocker contract.                    |
| `TRD-309` | accepted | Planning         | Recorded duplicate-signal blocker planning.             |
| `TRD-310` | accepted | Planning         | Planned strategy parameter immutability guard.          |
| `TRD-311` | accepted | Review           | Reviewed Gate 1 evidence bundle assembly.               |
| `TRD-312` | accepted | Validation       | Rechecked backtest assembly guard indexing.             |
| `TRD-313` | accepted | Validation       | Rechecked metric report guard indexing.                 |
| `TRD-314` | accepted | Validation       | Rechecked operator decision guard indexing.             |
| `TRD-315` | accepted | Contracts        | Added missing-candle bad-data fixture contract.         |
| `TRD-316` | accepted | Contracts        | Added stale-data blocker contract.                      |
| `TRD-317` | accepted | Contracts        | Added duplicate-signal blocker contract.                |
| `TRD-318` | accepted | Contracts        | Added parameter immutability guard contract.            |
| `TRD-319` | accepted | Contracts        | Added Gate 1 evidence bundle summary contract.          |
| `TRD-320` | accepted | Risk             | Rechecked Gate 1 completion blockers.                   |
| `TRD-321` | accepted | Checkpoint       | Checkpointed Gate 1 control-plane alignment.            |
| `TRD-322` | accepted | Skills           | Aligned skill defaults to Gate 1 current state.         |
| `TRD-323` | accepted | Planning         | Planned Gate command naming migration.                  |
| `TRD-324` | accepted | Documentation    | Rechecked blocked-evidence docs coverage.               |
| `TRD-325` | accepted | Validation       | Added evidence blocker aggregate guard.                 |
| `TRD-326` | accepted | Validation       | Added fixture mutation negative cases.                  |
| `TRD-327` | accepted | Validation       | Added snapshot column completeness guard.               |
| `TRD-328` | accepted | Policy           | Drafted stale-data threshold policy.                    |
| `TRD-329` | accepted | Provenance       | Recorded parameter hash provenance boundary.            |
| `TRD-330` | accepted | Contracts        | Drafted duplicate signal fingerprint contract.          |
| `TRD-331` | accepted | Risk             | Rechecked real historical data adapter blockers.        |
| `TRD-332` | accepted | Skills           | Rechecked skill eval fixture phase alignment.           |
| `TRD-333` | accepted | Planning         | Planned Gate command alias compatibility.               |
| `TRD-334` | accepted | Skills           | Rechecked Gate 1 skill guard naming.                    |
| `TRD-335` | accepted | Validation       | Added blocker aggregate negative fixture set.           |
| `TRD-336` | accepted | Data             | Recorded OHLC mid-price limitation.                     |
| `TRD-337` | accepted | Planning         | Drafted historical data adapter boundary.               |
| `TRD-338` | accepted | Data             | Drafted data-provider provenance fields.                |
| `TRD-339` | accepted | Documentation    | Rechecked stale-data policy source links.               |
| `TRD-340` | accepted | Provenance       | Planned parameter hash canonicalization.                |
| `TRD-341` | accepted | Validation       | Added duplicate signal fingerprint negative cases.      |
| `TRD-342` | accepted | Checkpoint       | Checkpointed Gate 1 blocker expansion.                  |
| `TRD-343` | accepted | Risk             | Inventoried adapter authorization blockers.             |
| `TRD-344` | accepted | Planning         | Planned adapter fixture import contract boundaries.     |
| `TRD-345` | accepted | Documentation    | Rechecked duplicate signal source links.                |
| `TRD-346` | accepted | Provenance       | Planned parameter hash negative cases.                  |
| `TRD-347` | accepted | Risk             | Drafted provider license review checklist.              |
| `TRD-348` | accepted | Documentation    | Rechecked command alias docs coverage.                  |
| `TRD-349` | accepted | Skills           | Indexed skill metadata guard record.                    |
| `TRD-350` | accepted | Policy           | Drafted imported snapshot quarantine policy.            |
| `TRD-351` | accepted | Documentation    | Rechecked Gate 1 blocker checkpoint coverage.           |
| `TRD-352` | accepted | Checkpoint       | Checkpointed Gate 1 adapter-readiness blockers.         |
| `TRD-353` | accepted | Documentation    | Rechecked adapter blocker source links.                 |
| `TRD-354` | accepted | Governance       | Drafted imported snapshot schema authority.             |
| `TRD-355` | accepted | Security         | Documented provider credential exclusion.               |
| `TRD-356` | accepted | Documentation    | Rechecked quarantine policy coverage.                   |
| `TRD-357` | accepted | Planning         | Planned adapter fixture negative cases.                 |
| `TRD-358` | accepted | Policy           | Recorded data-retention limitations.                    |
| `TRD-359` | accepted | Documentation    | Rechecked provider license checklist coverage.          |
| `TRD-360` | accepted | Security         | Drafted adapter audit-log boundary.                     |
| `TRD-361` | accepted | Checkpoint       | Rechecked Gate 1 adapter blocker checkpoint.            |
| `TRD-362` | accepted | Checkpoint       | Froze adapter planning pending concrete gap.            |
| `TRD-363` | accepted | Planning         | Selected post-adapter-freeze maintenance lane.          |
| `TRD-364` | accepted | Documentation    | Rechecked guard command docs alignment.                 |
| `TRD-365` | accepted | Validation       | Rechecked contract guard schema hardening.              |
| `TRD-366` | accepted | Risk             | Rechecked readiness blocker language.                   |
| `TRD-367` | accepted | Command center   | Audited Gate 1 command-center wording.                  |
| `TRD-368` | accepted | Policy           | Drafted review artifact aging policy.                   |
| `TRD-369` | accepted | Documentation    | Rechecked source-link map consistency.                  |
| `TRD-370` | accepted | Security         | Reviewed Gate 1 blocked-scope scanner posture.          |
| `TRD-371` | accepted | Handoff          | Reviewed operator handoff freshness.                    |
| `TRD-372` | accepted | Checkpoint       | Checkpointed Gate 1 maintenance lane.                   |
| `TRD-373` | accepted | Planning         | Intook remaining Gate 1 maintenance gaps.               |
| `TRD-374` | accepted | Documentation    | Rechecked tracklist queue discipline.                   |
| `TRD-375` | accepted | Command center   | Set command-center next-action pause wording.           |
| `TRD-376` | accepted | Documentation    | Rechecked review aging policy source links.             |
| `TRD-377` | accepted | Security         | Audited scanner blocked-term sample classes.            |
| `TRD-378` | accepted | Documentation    | Swept Gate 1 docs stale-reference classes.              |
| `TRD-379` | accepted | Checkpoint       | Defined Gate 1 maintenance stop conditions.             |
| `TRD-380` | accepted | Evidence         | Reviewed evidence freshness churn guard.                |
| `TRD-381` | accepted | Handoff          | Reviewed brand handoff isolation.                       |
| `TRD-382` | accepted | Checkpoint       | Closed out Gate 1 maintenance lane.                     |
| `TRD-383` | accepted | Evidence         | Reviewed Gate 1 closeout evidence.                      |
| `TRD-384` | accepted | Audit            | Audited Gate 1 acceptance criteria.                     |
| `TRD-385` | accepted | Assessment       | Drafted Gate 2 readiness assessment packet.             |
| `TRD-386` | accepted | Blockers         | Inventoried Gate 2 blockers.                            |
| `TRD-387` | accepted | Autonomy         | Reviewed autonomy gate deltas.                          |
| `TRD-388` | accepted | Risk             | Reviewed financial risk gate deltas.                    |
| `TRD-389` | accepted | Security         | Assessed credential boundary.                           |
| `TRD-390` | accepted | Risk             | Reviewed execution-scope prohibition.                   |
| `TRD-391` | accepted | Security         | Reviewed Gate 2 assessment QA/security posture.         |
| `TRD-392` | accepted | Recommendation   | Recommended Gate 1 closeout signoff lane.               |
| `TRD-393` | accepted | Signoff          | Prepared Gate 1 closeout signoff packet.                |
| `TRD-394` | accepted | Planning         | Drafted Gate 2 authorization criteria.                  |
| `TRD-395` | accepted | Risk             | Drafted risk-owner authorization checklist.             |
| `TRD-396` | accepted | Autonomy         | Drafted autonomy-owner authorization checklist.         |
| `TRD-397` | accepted | Security         | Drafted QA/security authorization checklist.            |
| `TRD-398` | accepted | Boundary         | Confirmed Gate 2 implementation prohibition.            |
| `TRD-399` | accepted | Governance       | Reviewed operator decision authority.                   |
| `TRD-400` | accepted | Verification     | Recorded Gate 1 final verification requirement.         |
| `TRD-401` | accepted | Planning         | Drafted gate movement decision packet shape.            |
| `TRD-402` | accepted | Recommendation   | Recommended Gate 1 signoff review and pause.            |
| `TRD-403` | accepted | Gate decision    | Recorded operator approval for Gate 2 planning.         |
| `TRD-404` | accepted | Gate transition  | Exited the Gate 1 signoff pause.                        |
| `TRD-405` | accepted | Gap intake       | Recorded no open material Gate 1 gap.                   |
| `TRD-406` | accepted | Handoff          | Kept brand handoff isolated from gate movement.         |
| `TRD-407` | accepted | Gate request     | Intook formal Gate 2 movement request.                  |
| `TRD-408` | accepted | Approval routing | Routed Gate 2 movement approvals.                       |
| `TRD-409` | accepted | Checklist        | Drafted Gate 2 movement dry-run checklist.              |
| `TRD-410` | accepted | Planning hold    | Held Gate 2 to planning authorization only.             |
| `TRD-411` | accepted | Command center   | Synced command center to Gate 2 planning.               |
| `TRD-412` | accepted | Checkpoint       | Defined next Gate 2 planning decision.                  |
| `TRD-413` | accepted | Planning         | Planned Gate 2 simulated-order record shape.            |
| `TRD-414` | accepted | Planning         | Planned Gate 2 simulation state boundaries.             |
| `TRD-415` | accepted | Security         | Planned no-external-account guard coverage.             |
| `TRD-416` | accepted | Security         | Planned credential exclusion guard coverage.            |
| `TRD-417` | accepted | Risk             | Planned simulated-fill assumption records.              |
| `TRD-418` | accepted | Risk             | Planned Gate 2 risk review event records.               |
| `TRD-419` | accepted | Governance       | Planned operator action log records.                    |
| `TRD-420` | accepted | Fixtures         | Planned Gate 2 negative fixture classes.                |
| `TRD-421` | accepted | Command center   | Planned Gate 2 command-center extension.                |
| `TRD-422` | accepted | Review           | Reviewed Gate 2 implementation readiness.               |
| `TRD-423` | accepted | Contracts        | Added Gate 2 contract implementation packet.            |
| `TRD-424` | accepted | Contracts        | Added simulated-order record contract schema.           |
| `TRD-425` | accepted | Contracts        | Added simulation state contract schema.                 |
| `TRD-426` | accepted | Contracts        | Added risk review event contract schema.                |
| `TRD-427` | accepted | Contracts        | Added operator action log contract schema.              |
| `TRD-428` | accepted | Contracts        | Added simulated fill assumption schema.                 |
| `TRD-429` | accepted | Fixtures         | Added Gate 2 synthetic fixture set.                     |
| `TRD-430` | accepted | Validation       | Added Gate 2 negative contract tests.                   |
| `TRD-431` | accepted | Validation       | Indexed Gate 2 contract guard coverage.                 |
| `TRD-432` | accepted | Checkpoint       | Checkpointed Gate 2 contract-only lane.                 |
| `TRD-433` | accepted | Planning         | Planned Gate 2 mechanics lane boundaries.               |
| `TRD-434` | accepted | Boundary         | Planned local simulation engine boundaries.             |
| `TRD-435` | accepted | Planning         | Planned simulation input assembly.                      |
| `TRD-436` | accepted | Planning         | Planned simulation output artifacts.                    |
| `TRD-437` | accepted | Determinism      | Planned replay determinism requirements.                |
| `TRD-438` | accepted | Failure modes    | Planned simulation failure modes.                       |
| `TRD-439` | accepted | Command center   | Planned command-center mechanics copy.                  |
| `TRD-440` | accepted | Review           | Reviewed mechanics implementation blockers.             |
| `TRD-441` | accepted | Source links     | Rechecked Gate 2 contract source links.                 |
| `TRD-442` | accepted | Checkpoint       | Checkpointed Gate 2 mechanics planning lane.            |
| `TRD-443` | accepted | Implementation   | Accepted local-only mechanics implementation packet.    |
| `TRD-444` | accepted | Simulation       | Added local simulation engine pure function.            |
| `TRD-445` | accepted | Simulation       | Added simulation input assembler.                       |
| `TRD-446` | accepted | Simulation       | Added simulation output artifact builder.               |
| `TRD-447` | accepted | Determinism      | Added replay determinism guard.                         |
| `TRD-448` | accepted | Fixtures         | Added failure-mode fixtures and tests.                  |
| `TRD-449` | accepted | Command center   | Added mechanics evidence view records.                  |
| `TRD-450` | accepted | Security         | Reviewed mechanics scanner boundary posture.            |
| `TRD-451` | accepted | Source links     | Rechecked mechanics source-link guard coverage.         |
| `TRD-452` | accepted | Checkpoint       | Checkpointed mechanics implementation lane.             |
| `TRD-453` | accepted | Blockers         | Reviewed post-mechanics blockers.                       |
| `TRD-454` | accepted | Handoff          | Added mechanics operator handoff note.                  |
| `TRD-455` | accepted | Audit            | Closed out Gate 2 mechanics lane.                       |
| `TRD-456` | accepted | Gap intake       | Identified next Gate 2 local evidence gaps.             |
| `TRD-457` | accepted | Wording          | Audited command-center post-mechanics copy.             |
| `TRD-458` | accepted | Docs             | Swept mechanics docs stale-reference posture.           |
| `TRD-459` | accepted | Guards           | Reviewed mechanics guard aging posture.                 |
| `TRD-460` | accepted | Limitations      | Registered paper-simulation limitations.                |
| `TRD-461` | accepted | Workflow         | Planned manual local operator workflow dry run.         |
| `TRD-462` | accepted | Boundary         | Reconfirmed Gate 2 no-expansion posture.                |
| `TRD-463` | accepted | Isolation        | Rechecked brand handoff isolation.                      |
| `TRD-464` | accepted | Checkpoint       | Checkpointed Gate 2 maintenance state.                  |
| `TRD-465` | accepted | Recommendation   | Recommended bounded read-only frontend planning.        |
| `TRD-466` | accepted | Frontend scope   | Assessed read-only frontend app-shell scope.            |
| `TRD-467` | accepted | Frontend panels  | Drafted read-only frontend evidence panel requirements. |
| `TRD-468` | accepted | Frontend IA      | Planned read-only frontend information architecture.    |
| `TRD-469` | accepted | Route map        | Mapped read-only frontend route boundaries.             |
| `TRD-470` | accepted | Data contract    | Planned local evidence panel data contracts.            |
| `TRD-471` | accepted | Limitations      | Contracted limitation panel copy.                       |
| `TRD-472` | accepted | Risk copy        | Contracted risk panel copy.                             |
| `TRD-473` | accepted | Workflow panel   | Contracted read-only operator workflow panel state.     |
| `TRD-474` | accepted | UI guard         | Planned frontend no-action-control guard coverage.      |
| `TRD-475` | accepted | Accessibility    | Planned frontend accessibility baseline.                |
| `TRD-476` | accepted | Hierarchy        | Directed frontend visual hierarchy.                     |
| `TRD-477` | accepted | Readiness        | Audited frontend implementation readiness blockers.     |
| `TRD-478` | accepted | Skill lenses     | Added governed TraderFrame frontend review skills.      |
| `TRD-479` | accepted | Frontend packet  | Drafted read-only frontend implementation packet.       |
| `TRD-480` | accepted | Frontend tests   | Planned no-action-control frontend test coverage.       |
| `TRD-481` | accepted | Frontend data    | Planned local-only frontend data adapter boundaries.    |
| `TRD-482` | accepted | Frontend panels  | Inventoried allowed read-only frontend panels.          |
| `TRD-483` | accepted | Navigation       | Drafted read-only navigation shell packet.              |
| `TRD-484` | accepted | Evidence UI      | Drafted read-only evidence panel packet.                |
| `TRD-485` | accepted | Risk UI          | Drafted risk and limitation panel packet.               |
| `TRD-486` | accepted | Workflow UI      | Drafted manual workflow panel packet.                   |
| `TRD-487` | accepted | Accessibility    | Defined frontend accessibility verification packet.     |
| `TRD-488` | accepted | Checkpoint       | Recorded frontend implementation go/no-go checkpoint.   |
| `TRD-489` | accepted | Frontend shell   | Drafted read-only frontend shell build packet.          |
| `TRD-490` | accepted | UI guard         | Implemented no-action-control render guard hardening.   |
| `TRD-491` | accepted | Frontend shell   | Implemented read-only frontend shell.                   |
| `TRD-492` | accepted | Visual QA        | Verified rendered shell layout.                         |
| `TRD-493` | accepted | Evidence UI      | Implemented read-only evidence panel.                   |
| `TRD-494` | accepted | Risk UI          | Implemented risk and limitation panels.                 |
| `TRD-495` | accepted | Workflow UI      | Implemented manual workflow panel.                      |
| `TRD-496` | accepted | Docs UI          | Implemented docs/source-link panel.                     |
| `TRD-497` | accepted | Responsive       | Polished responsive shell behavior.                     |
| `TRD-498` | accepted | Accessibility    | Verified frontend accessibility markers.                |
| `TRD-499` | accepted | Guard evidence   | Rechecked frontend guard evidence.                      |
| `TRD-500` | accepted | Checkpoint       | Checkpointed read-only frontend shell lane.             |

## Accepted Packet Ledger Continued 2

| Packet    | Status   | Area              | Result                                                     |
| --------- | -------- | ----------------- | ---------------------------------------------------------- |
| `TRD-501` | accepted | Operator review   | Reviewed frontend shell with operator lens.                |
| `TRD-502` | accepted | Evidence plan     | Planned evidence detail expansion boundaries.              |
| `TRD-503` | accepted | Copy audit        | Audited limitation copy for claim safety.                  |
| `TRD-504` | accepted | Source links      | Polished source-link group scanning.                       |
| `TRD-505` | accepted | Runtime UX        | Reviewed local runtime refresh UX.                         |
| `TRD-506` | accepted | Mobile QA         | Rechecked mobile visual layout.                            |
| `TRD-507` | accepted | Keyboard QA       | Rechecked keyboard and hash navigation.                    |
| `TRD-508` | accepted | Copy guard        | Expanded frontend blocked-copy regression coverage.        |
| `TRD-509` | accepted | Handoff           | Documented frontend shell handoff.                         |
| `TRD-510` | accepted | Closeout          | Closed current frontend QA lane.                           |
| `TRD-511` | accepted | Gap intake        | Selected local simulation evidence as next UI lane.        |
| `TRD-512` | accepted | Evidence plan     | Planned simulation evidence detail contract.               |
| `TRD-513` | accepted | Workflow card     | Planned manual workflow evidence card.                     |
| `TRD-514` | accepted | Risk data         | Planned risk-review panel data contract.                   |
| `TRD-515` | accepted | Artifact summary  | Planned local simulation artifact summaries.               |
| `TRD-516` | accepted | Failure modes     | Planned failure-mode evidence panel.                       |
| `TRD-517` | accepted | Source density    | Reviewed source-link density follow-up.                    |
| `TRD-518` | accepted | Connector check   | Rechecked frontend no-account-connector boundary.          |
| `TRD-519` | accepted | Handoff           | Routed frontend lane to simulation evidence planning.      |
| `TRD-520` | accepted | Checkpoint        | Checkpointed next Gate 2 implementation lane.              |
| `TRD-521` | accepted | Schema draft      | Drafted simulation evidence detail schema plan.            |
| `TRD-522` | accepted | Negative cases    | Planned blocked-field negative cases.                      |
| `TRD-523` | accepted | Workflow fixture  | Planned manual workflow evidence fixtures.                 |
| `TRD-524` | accepted | Risk fixture      | Planned risk-review panel fixtures.                        |
| `TRD-525` | accepted | Artifact fixture  | Planned local artifact summary fixtures.                   |
| `TRD-526` | accepted | Failure fixture   | Planned failure-mode evidence fixtures.                    |
| `TRD-527` | accepted | Source map        | Planned simulation evidence source-link map.               |
| `TRD-528` | accepted | Display packet    | Gated frontend evidence detail display work.               |
| `TRD-529` | accepted | Guard plan        | Planned evidence contract guard updates.                   |
| `TRD-530` | accepted | Checkpoint        | Checkpointed simulation evidence planning lane.            |
| `TRD-531` | accepted | Impl packet       | Prepared simulation evidence schema implementation.        |
| `TRD-532` | accepted | Schema source     | Added local simulation evidence detail schema.             |
| `TRD-533` | accepted | Schema tests      | Added required and blocked-field contract tests.           |
| `TRD-534` | accepted | Workflow fixture  | Added manual workflow evidence fixture references.         |
| `TRD-535` | accepted | Risk fixture      | Added risk-review fixture references.                      |
| `TRD-536` | accepted | Artifact refs     | Added local artifact summary fixture references.           |
| `TRD-537` | accepted | Failure refs      | Added failure-mode evidence fixture references.            |
| `TRD-538` | accepted | Source map refs   | Added evidence source-link map fixture references.         |
| `TRD-539` | accepted | Guard update      | Indexed evidence schema, fixture, tests, and docs.         |
| `TRD-540` | accepted | Checkpoint        | Checkpointed simulation evidence detail implementation.    |
| `TRD-541` | accepted | Display packet    | Prepared read-only evidence detail display lane.           |
| `TRD-542` | accepted | Local data        | Added local evidence detail display data.                  |
| `TRD-543` | accepted | Detail panel      | Rendered evidence detail panel without controls.           |
| `TRD-544` | accepted | Risk adjacency    | Kept limitations and reproducibility near evidence.        |
| `TRD-545` | accepted | Control tests     | Added no-action-control frontend tests.                    |
| `TRD-546` | accepted | Source links      | Rendered local source-link references.                     |
| `TRD-547` | accepted | Mobile QA         | Added responsive evidence detail layout support.           |
| `TRD-548` | accepted | Keyboard QA       | Preserved semantic and keyboard accessibility posture.     |
| `TRD-549` | accepted | Metadata sync     | Synced Command Center and tracker metadata.                |
| `TRD-550` | accepted | Checkpoint        | Checkpointed read-only evidence detail display lane.       |
| `TRD-551` | accepted | Runtime merge     | Preserved evidence detail through runtime refresh.         |
| `TRD-552` | accepted | Data shape        | Added required display-field regression coverage.          |
| `TRD-553` | accepted | Empty state       | Added neutral fallback behavior for missing arrays.        |
| `TRD-554` | accepted | Reference polish  | Hardened long local reference wrapping.                    |
| `TRD-555` | accepted | Screen reader     | Added explicit labels for evidence detail cards.           |
| `TRD-556` | accepted | Visual QA         | Recorded desktop and mobile visual QA requirements.        |
| `TRD-557` | accepted | Source density    | Kept source-link detail local, bounded, and readable.      |
| `TRD-558` | accepted | Copy guard        | Rechecked blocked frontend wording coverage.               |
| `TRD-559` | accepted | Handoff           | Documented operator posture for hardened detail lane.      |
| `TRD-560` | accepted | Checkpoint        | Checkpointed evidence detail hardening lane.               |
| `TRD-561` | accepted | Source map        | Mapped evidence detail to runtime snapshot sources.        |
| `TRD-562` | accepted | Fixture drift     | Added local fixture drift regression coverage.             |
| `TRD-563` | accepted | Review aging      | Added non-actionable review aging policy copy.             |
| `TRD-564` | accepted | Docs sweep        | Kept evidence-detail source links local and bounded.       |
| `TRD-565` | accepted | Operator scan     | Added manual inspection checklist language.                |
| `TRD-566` | accepted | Retention         | Added local simulation artifact retention limits.          |
| `TRD-567` | accepted | Failure taxonomy  | Added evidence-only failure taxonomy labels.               |
| `TRD-568` | accepted | Performance       | Added source-list performance smoke checks.                |
| `TRD-569` | accepted | Export boundary   | Recorded print/export prohibition policy.                  |
| `TRD-570` | accepted | Checkpoint        | Checkpointed evidence detail control lane.                 |
| `TRD-571` | accepted | Visual density    | Added compact evidence-control display checks.             |
| `TRD-572` | accepted | Accessibility     | Rechecked labels and evidence-control reading order.       |
| `TRD-573` | accepted | Copy minimization | Added compact copy rules with risk context preserved.      |
| `TRD-574` | accepted | Source freshness  | Planned local source freshness without automation.         |
| `TRD-575` | accepted | Inventory plan    | Planned local simulation artifact inventory boundaries.    |
| `TRD-576` | accepted | Note model        | Planned manual operator notes without decisions.           |
| `TRD-577` | accepted | Limitations       | Rechecked limitation prominence near evidence.             |
| `TRD-578` | accepted | Source compaction | Planned long source-list grouping boundaries.              |
| `TRD-579` | accepted | Output boundary   | Rechecked no report, export, share, or print channel.      |
| `TRD-580` | accepted | Checkpoint        | Checkpointed evidence-control hardening lane.              |
| `TRD-581` | accepted | Security          | Resolved low-severity Vite/esbuild audit warning.          |
| `TRD-582` | accepted | Source links      | Reviewed source-link overflow for workspace inspection.    |
| `TRD-583` | accepted | Truth             | Aligned market intelligence truth without autonomy gain.   |
| `TRD-584` | accepted | Roadmap           | Routed market-intelligence work after workspace MVP.       |
| `TRD-585` | accepted | Inventory schema  | Planned local artifact inventory fields for workspace.     |
| `TRD-586` | accepted | Note sources      | Planned manual note source links for workspace.            |
| `TRD-587` | accepted | Stale refs        | Planned local stale-reference negative cases.              |
| `TRD-588` | accepted | Control copy      | Audited Command Center copy for blocked semantics.         |
| `TRD-589` | accepted | Inventory         | Implemented local artifact inventory contract.             |
| `TRD-590` | accepted | Note model        | Implemented manual operator note contract.                 |
| `TRD-591` | accepted | Negative cases    | Added fail-closed inventory and note coverage.             |
| `TRD-592` | accepted | Workspace MVP     | Rendered one local research case end-to-end.               |
| `TRD-593` | accepted | Market input      | Implemented sourced market-intelligence input model.       |
| `TRD-594` | accepted | News events       | Implemented local news/event scanner contract.             |
| `TRD-595` | accepted | Signal candidate  | Implemented evidence-only signal candidate contract.       |
| `TRD-596` | accepted | Red flags         | Implemented sourced red-flag blocker evidence contract.    |
| `TRD-597` | accepted | Scenario draft    | Implemented draft-only scenario recommendation model.      |
| `TRD-598` | accepted | Risk review       | Implemented risk-gated recommendation review contract.     |
| `TRD-599` | accepted | Workspace         | Rendered read-only market-intelligence workspace panel.    |
| `TRD-600` | accepted | Simulation link   | Linked recommendation candidate to local simulation only.  |
| `TRD-601` | accepted | Visual QA         | Added workspace visual QA assertions.                      |
| `TRD-602` | accepted | Source links      | Added local source-link drilldown display.                 |
| `TRD-603` | accepted | Inventory UI      | Rendered artifact inventory records in workspace.          |
| `TRD-604` | accepted | Operator note     | Rendered manual operator note evidence in workspace.       |
| `TRD-605` | accepted | Blocker check     | Added market-intelligence blocker checkpoint.              |
| `TRD-606` | accepted | Red flag QA       | Verified red-flag blocker evidence display and copy.       |
| `TRD-607` | accepted | Gap intake        | Selected missing-state and reference-integrity hardening.  |
| `TRD-608` | accepted | Empty states      | Added neutral local states for absent workspace records.   |
| `TRD-609` | accepted | Evidence guard    | Added scenario-reference consistency validation.           |
| `TRD-610` | accepted | Runtime refresh   | Preserved workspace panels during metadata refresh.        |
| `TRD-611` | accepted | Mobile QA         | Verified narrow-screen scenario readability.               |
| `TRD-612` | accepted | Keyboard QA       | Added visible hash-target focus behavior.                  |
| `TRD-613` | accepted | Copy pass         | Reduced repetition while retaining limitations.            |
| `TRD-614` | accepted | Scope regression  | Expanded unsafe scenario-copy rejection coverage.          |
| `TRD-615` | accepted | Source grouping   | Grouped inputs, risk controls, and provenance.             |
| `TRD-616` | accepted | Checkpoint        | Closed the market-workspace display lane.                  |
| `TRD-617` | accepted | Authorization     | Authorized bounded hardening of the existing simulator.    |
| `TRD-618` | accepted | Account contract  | Added deterministic local paper-account invariants.        |
| `TRD-619` | accepted | Lifecycle         | Constrained manual local simulation state transitions.     |
| `TRD-620` | accepted | Risk controls     | Added locked, fail-closed local risk-limit evaluation.     |
| `TRD-621` | accepted | Fill model        | Added explicit deterministic fill, fee, and cost evidence. |
| `TRD-622` | accepted | Input integrity   | Blocked duplicate and stale simulation candidates.         |
| `TRD-623` | accepted | Event journal     | Added immutable hash-chained local simulation events.      |
| `TRD-624` | accepted | Reconciliation    | Added fail-closed local account-state drift detection.     |
| `TRD-625` | accepted | Negative coverage | Rejected unsafe simulator boundary mutations.              |
| `TRD-626` | accepted | Checkpoint        | Closed the simulator contract/control foundation lane.     |
| `TRD-627` | accepted | Authorization     | Authorized bounded pure paper-account state reduction.     |
| `TRD-628` | accepted | Position reducer  | Added deterministic position accounting.                   |
| `TRD-629` | accepted | Account reducer   | Added cash, fee, and equity accounting.                    |
| `TRD-630` | accepted | Lifecycle reducer | Required manual local recording transition evidence.       |
| `TRD-631` | accepted | Risk integration  | Blocked mutation after any risk breach.                    |
| `TRD-632` | accepted | Fill integration  | Applied explicit deterministic fill-cost evidence.         |
| `TRD-633` | accepted | Journal integrity | Validated hash chain and exactly-once append.              |
| `TRD-634` | accepted | Reconciliation    | Froze mutation when account or journal state drifted.      |
| `TRD-635` | accepted | Scenario          | Proved deterministic synthetic end-to-end reduction.       |
| `TRD-636` | accepted | Checkpoint        | Authorized a read-only simulator evidence workspace lane.  |

## Current Operator Commands

| Command                                                                                           | Purpose                                                 | Expected local result                                            |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| `pnpm inspect:gate0-dry-run`                                                                      | Inspect default clear dry-run scenario.                 | Redacted JSON with `inspect_status: clear`.                      |
| `pnpm inspect:gate0-dry-run -- --help`                                                            | Print local inspect command help.                       | Usage text with static scenario keys and Gate 0 boundary.        |
| `pnpm inspect:gate0-dry-run -- -h`                                                                | Print local inspect command help.                       | Usage text with static scenario keys and Gate 0 boundary.        |
| `pnpm inspect:gate0-dry-run -- --scenario friction`                                               | Inspect blocked-friction dry-run scenario.              | Redacted JSON with `inspect_status: friction_found`.             |
| `pnpm inspect:gate0-dry-run -- --scenario other`                                                  | Verify invalid scenario handling.                       | Nonzero exit with bounded local usage text and no stack trace.   |
| `pnpm snapshot:gate0-progress`                                                                    | Write local progress snapshot.                          | Markdown snapshot under `ops/runtime/progress/`.                 |
| `pnpm check:gate0-evidence-index`                                                                 | Check evidence-index drift.                             | Local evidence-index drift check passes.                         |
| `pnpm check:gate1-contracts`                                                                      | Check Gate 1 contract control records.                  | Local Gate 1 contract guard passes.                              |
| `pnpm check:gate0-name`                                                                           | Check TraderFrame product-name consistency.             | Local project-name check passes.                                 |
| `pnpm check:gate0-docs-coverage`                                                                  | Check operator docs coverage drift.                     | Local docs coverage check passes.                                |
| `pnpm check:gate0-snapshot`                                                                       | Check generated progress snapshot freshness.            | Local freshness check passes.                                    |
| `pnpm check:gate0-tracklist`                                                                      | Check accepted packet ledger alignment.                 | Local consistency check passes.                                  |
| `pnpm check:gate0-reviews`                                                                        | Check assignment and review-record coverage.            | Local review coverage check passes.                              |
| `pnpm check:gate0-agents`                                                                         | Check agent manifest and reference drift.               | Local agent manifest guard passes.                               |
| `pnpm check:gate0-source-links`                                                                   | Check duplicate tracklist source links.                 | Local source-link duplicate guard passes.                        |
| `pnpm check:gate0-tracklist-sections`                                                             | Check tracklist section sizes.                          | Local tracklist section length guard passes.                     |
| `pnpm check:repo-hygiene`                                                                         | Check repository hygiene drift.                         | Local repository hygiene guard passes.                           |
| `pnpm check:gate0-ci-evidence`                                                                    | Check remote CI evidence freshness.                     | Manual CI evidence freshness guard passes.                       |
| `pnpm check:gate0-command-center`                                                                 | Check command center evidence freshness.                | Local command center freshness guard passes.                     |
| `pnpm check:gate0-command-center-render`                                                          | Check command center static render contract.            | Local command center render contract passes.                     |
| `pnpm check:market-workspace`                                                                     | Check scenario and evidence reference consistency.      | Local market workspace consistency guard passes.                 |
| `pnpm check:gate0-skills`                                                                         | Check project skill governance and intake.              | Local skill governance guard passes.                             |
| `pnpm check:gate0-skill-routing`                                                                  | Check project skill routing matrix.                     | Local skill routing guard passes.                                |
| `pnpm check:gate0`                                                                                | Refresh snapshot and run the local Gate 0 guard suite.  | Local guard suite passes.                                        |
| `pnpm verify:gate0`                                                                               | Run Gate 0 guards and quality checks.                   | Full local verification passes.                                  |
| `pnpm test:ci`                                                                                    | Run tests in stable single-worker CI mode.              | 79 files and 548 tests pass deterministically.                   |
| `pnpm validate:gate0`                                                                             | Scan for blocked scope terms outside allowlisted paths. | `Gate 0 validation passed.`                                      |
| `pnpm preview:web`                                                                                | Serve the static command center locally.                | Local host preview serves `apps/web`.                            |
| `pnpm refresh:gate0-ci-evidence -- --run <id> --packet <TRD-id> --after <TRD-id> --record <path>` | Refresh local CI evidence from a successful run.        | Writes local evidence record, index row, and dashboard metadata. |

## Next Queue

| Rank | Packet    | Status | Goal                                | Acceptance focus                                      |
| ---- | --------- | ------ | ----------------------------------- | ----------------------------------------------------- |
| 1    | `TRD-637` | queued | Simulator workspace authorization.  | Permit read-only local evidence display only.         |
| 2    | `TRD-638` | queued | Simulator workspace data adapter.   | Adapt one deterministic local result for display.     |
| 3    | `TRD-639` | queued | Paper-account summary panel.        | Show synthetic balances with limitations adjacent.    |
| 4    | `TRD-640` | queued | Position and equity evidence panel. | Show accounting before and after without claims.      |
| 5    | `TRD-641` | queued | Lifecycle evidence timeline.        | Show manual transition and operator ownership.        |
| 6    | `TRD-642` | queued | Risk and candidate guard panel.     | Keep blockers visible beside mutation evidence.       |
| 7    | `TRD-643` | queued | Fill-cost evidence panel.           | Show spread, slippage, fee, and model limitations.    |
| 8    | `TRD-644` | queued | Journal and reconciliation panel.   | Show integrity and readonly-emergency posture.        |
| 9    | `TRD-645` | queued | Workspace boundary and access QA.   | Prove no controls, forms, routes, or misleading copy. |
| 10   | `TRD-646` | queued | Simulator workspace checkpoint.     | Decide the next bounded product gap.                  |

## Post-TRD-592 Market Intelligence Roadmap

No market-intelligence recommendation may appear without evidence, source references, confidence,
red flags, invalidation, risk review, and operator decision requirement.

| Packet    | Status   | Goal                                            | Boundary                                                     |
| --------- | -------- | ----------------------------------------------- | ------------------------------------------------------------ |
| `TRD-593` | accepted | Market Intelligence Input Model.                | Source-linked local inputs only; no execution route.         |
| `TRD-594` | accepted | News/Event Scanner Contract.                    | Event records only; no external action or alert selling.     |
| `TRD-595` | accepted | Signal Candidate Contract.                      | Candidate evidence only; no buy/sell command.                |
| `TRD-596` | accepted | Red Flag Engine.                                | Warning and blocker evidence only.                           |
| `TRD-597` | accepted | Scenario Recommendation Model.                  | Scenario drafts only; no certainty or profit claim.          |
| `TRD-598` | accepted | Risk-Gated Recommendation Review.               | Risk review required before operator consideration.          |
| `TRD-599` | accepted | Market Intelligence Workspace.                  | Read-only inspection workspace for sourced scenarios.        |
| `TRD-600` | accepted | Paper Simulation From Recommendation Candidate. | Local paper-simulation candidate only; no external dispatch. |
| `TRD-601` | accepted | Strategy workspace visual QA.                   | Evidence and limitations remain adjacent.                    |
| `TRD-602` | accepted | Workspace source-link drilldown.                | Checked-in local paths only.                                 |
| `TRD-603` | accepted | Artifact inventory UI integration.              | Local traceability without output channels.                  |
| `TRD-604` | accepted | Operator note UI integration.                   | Manual display-only note evidence.                           |
| `TRD-605` | accepted | Market intelligence blocker checkpoint.         | Blocked scope remains explicit.                              |
| `TRD-606` | accepted | Red flag visual QA.                             | Blocker evidence remains non-actionable.                     |
| `TRD-607` | accepted | Market workspace gap intake.                    | Concrete inspection gap only.                                |
| `TRD-608` | accepted | Scenario empty-state handling.                  | Missing records remain neutral and local.                    |
| `TRD-609` | accepted | Recommendation evidence consistency guard.      | Scenario references match local evidence.                    |
| `TRD-610` | accepted | Workspace runtime preservation.                 | Runtime metadata refresh preserves panels.                   |
| `TRD-611` | accepted | Market workspace mobile QA.                     | Dense panels remain readable at narrow widths.               |
| `TRD-612` | accepted | Market workspace keyboard QA.                   | Hash targets receive visible focus.                          |
| `TRD-613` | accepted | Scenario copy minimization.                     | Shorter copy retains limitations.                            |
| `TRD-614` | accepted | Blocked-scope regression expansion.             | Unsafe action language remains rejected.                     |
| `TRD-615` | accepted | Market source grouping.                         | Inputs, controls, and provenance are distinct.               |
| `TRD-616` | accepted | Market workspace checkpoint.                    | Display lane closed without scope promotion.                 |

## Rejected For Now

| Area                                    | Status           | Reason                                                                               |
| --------------------------------------- | ---------------- | ------------------------------------------------------------------------------------ |
| UI expansion                            | rejected_for_now | Product breadth must not outrun trust in the core decision loop.                     |
| Broker integration                      | rejected_for_now | External account connectivity remains blocked at Gate 2 planning.                    |
| Live execution                          | rejected_for_now | No live execution path is allowed at Gate 2 planning.                                |
| External or account execution mechanics | rejected_for_now | Local deterministic simulation may proceed; broker/account dispatch remains blocked. |
| AI buy/sell prediction                  | rejected_for_now | The system validates evidence and risk review; it does not make prediction claims.   |
| Report export or publishing             | rejected_for_now | Current artifacts remain local and operational.                                      |
| Approval scoring                        | rejected_for_now | Local scores must not become approval semantics.                                     |
| Readiness scoring                       | rejected_for_now | Readiness implies later-phase eligibility, which is not authorized.                  |
| Performance or profitability claims     | rejected_for_now | Strategy claims remain outside the current control-plane scope.                      |
| Risk-gate loosening                     | rejected_for_now | Risk gates can only be tightened or preserved under current scope.                   |

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
- Gate remains `G2_PAPER_TRADING`.
- Scope remains `paper_simulation_planning_only`.

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
- Gate 1 transition authorization: `docs/operations/GATE1_TRANSITION_AUTHORIZATION.md`
- Gate 1 operating gate model activation: `docs/operations/GATE1_OPERATING_GATE_MODEL_ACTIVATION.md`
- Gate 1 stable CI test command: `docs/operations/GATE1_STABLE_CI_TEST_COMMAND.md`
- Gate 1 dependency audit and upgrade plan:
  `docs/operations/GATE1_DEPENDENCY_AUDIT_AND_UPGRADE_PLAN.md`
- Gate 1 dependency upgrade execution: `docs/operations/GATE1_DEPENDENCY_UPGRADE_EXECUTION.md`
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
- Remote CI evidence refresh after skill library closeout:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_LIBRARY_CLOSEOUT.md`
- Command center CI run record refresh after skill library closeout:
  `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_LIBRARY_CLOSEOUT.md`
- Command center hash navigation state:
  `docs/operations/GATE0_COMMAND_CENTER_HASH_NAVIGATION_STATE.md`
- GitHub Actions Node 24 action upgrade:
  `docs/operations/GATE0_GITHUB_ACTIONS_NODE24_ACTION_UPGRADE.md`
- Remote CI evidence after Node 24 action upgrade:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md`
- Command center CI run refresh after Node 24 action upgrade:
  `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md`
- Command center CI evidence refresh after TRD-230 push:
  `docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH_AFTER_TRD230_PUSH.md`
- Latest-push evidence index confirmation:
  `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX_LATEST_PUSH_CONFIRMATION.md`
- CI evidence count expectations:
  `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_COUNT_EXPECTATIONS.md`
- Command center last verified commit:
  `docs/operations/GATE0_COMMAND_CENTER_LAST_VERIFIED_COMMIT.md`
- Source-link duplicate check: `docs/operations/GATE0_SOURCE_LINK_DUPLICATE_CHECK.md`
- Tracklist section length guard: `docs/operations/GATE0_TRACKLIST_SECTION_LENGTH_GUARD.md`
- Tracklist source-link index: `docs/operations/GATE0_TRACKLIST_SOURCE_LINK_INDEX.md`
- Command center visual recheck after TRD-231:
  `docs/operations/GATE0_COMMAND_CENTER_VISUAL_RECHECK_AFTER_TRD231.md`
- Maintenance backlog re-rank: `docs/operations/GATE0_MAINTENANCE_BACKLOG_RERANK.md`
- Gate 1 blocker recheck: `docs/operations/GATE1_READINESS_BLOCKER_RECHECK.md`
- Remote CI evidence refresh after TRD-240 push:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD240_PUSH.md`
- Command center CI metadata refresh after TRD-241:
  `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD241.md`
- Remote CI evidence refresh after TRD-242 push:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD242_PUSH.md`
- Command center CI metadata refresh after TRD-243:
  `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD243.md`
- Command center local runtime snapshot:
  `docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SNAPSHOT.md`
- Command center local auto-refresh: `docs/operations/GATE0_COMMAND_CENTER_LOCAL_AUTO_REFRESH.md`
- Remote CI evidence refresh after TRD-246 push:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD246_PUSH.md`
- Command center CI metadata refresh after TRD-247:
  `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD247.md`
- Remote CI evidence refresh after TRD-248 push:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD248_PUSH.md`
- Command center CI metadata refresh after TRD-249:
  `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD249.md`
- Remote CI evidence refresh after TRD-250 push:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD250_PUSH.md`
- Command center CI metadata refresh after TRD-251:
  `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD251.md`
- Remote CI evidence refresh after TRD-252 push:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD252_PUSH.md`
- Command center CI metadata refresh after TRD-253:
  `docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD253.md`
- Command center runtime schema contract:
  `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_SCHEMA_CONTRACT.md`
- Command center runtime endpoint response contract:
  `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_ENDPOINT_RESPONSE_CONTRACT.md`
- Command center local runtime security boundary:
  `docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SECURITY_BOUNDARY.md`
- Gate 0 CI evidence refresh helper: `docs/operations/GATE0_CI_EVIDENCE_REFRESH_HELPER.md`
- Gate 0 CI evidence refresh loop pause: `docs/operations/GATE0_CI_EVIDENCE_REFRESH_LOOP_PAUSE.md`
- TraderFrame brand alignment: `docs/operations/GATE0_TRADERFRAME_BRAND_ALIGNMENT.md`
- Remote CI evidence refresh after TRD-257 push:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD257_PUSH.md`
- Remote CI evidence refresh after TRD-258 push:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD258_PUSH.md`
- Remote CI evidence refresh after TRD-259 push:
  `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD259_PUSH.md`

## Source Of Truth Links Continued

- Gate 1 directional PnL contract: `docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT.md`
- Gate 1 directional PnL contract tests: `docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT_TESTS.md`
- Gate 1 directional PnL fixtures: `docs/operations/GATE1_DIRECTIONAL_PNL_FIXTURES.md`
- Gate 1 directional PnL negative cases:
  `docs/operations/GATE1_DIRECTIONAL_PNL_FIXTURE_NEGATIVE_CASES.md`
- Gate 1 directional PnL guard indexing:
  `docs/operations/GATE1_DIRECTIONAL_PNL_GUARD_INDEXING_HARDENING.md`
- Gate 1 cross-currency PnL plan: `docs/operations/GATE1_CROSS_CURRENCY_PNL_CONTRACT_PLAN.md`
- Gate 1 cross-currency fixture:
  `docs/operations/GATE1_CROSS_CURRENCY_CONVERSION_FIXTURE_CONTRACT.md`
- Gate 1 JPY precision fixture: `docs/operations/GATE1_JPY_PAIR_PRECISION_FIXTURE_CONTRACT.md`
- Gate 1 PnL cost consistency guard: `docs/operations/GATE1_PNL_COST_MODEL_CONSISTENCY_GUARD.md`
- Gate 1 backtest result to PnL evidence reference:
  `docs/operations/GATE1_BACKTEST_RESULT_TO_PNL_EVIDENCE_REFERENCE_CONTRACT.md`
- Gate 1 PnL evidence bundle schema plan: `docs/operations/GATE1_PNL_EVIDENCE_BUNDLE_SCHEMA_PLAN.md`
- Gate 1 PnL evidence bundle fixtures: `docs/operations/GATE1_PNL_EVIDENCE_BUNDLE_FIXTURES.md`
- Gate 1 backtest evidence integrity review:
  `docs/operations/GATE1_BACKTEST_EVIDENCE_INTEGRITY_REVIEW.md`
- Gate 1 PnL evidence bundle negative cases:
  `docs/operations/GATE1_PNL_EVIDENCE_BUNDLE_NEGATIVE_CASES.md`
- Gate 1 PnL bundle guard indexing: `docs/operations/GATE1_PNL_BUNDLE_GUARD_INDEXING_HARDENING.md`
- Gate 1 PnL bundle docs/source links:
  `docs/operations/GATE1_PNL_BUNDLE_DOCS_SOURCE_LINK_COVERAGE.md`
- Gate 1 historical data OHLC bid/ask column plan:
  `docs/operations/GATE1_HISTORICAL_DATA_OHLC_BID_ASK_COLUMN_PLAN.md`
- Gate 1 historical data bid/ask fixture:
  `docs/operations/GATE1_HISTORICAL_DATA_BID_ASK_FIXTURE_CONTRACT.md`
- Gate 1 spread assumption to bid/ask alignment:
  `docs/operations/GATE1_SPREAD_ASSUMPTION_TO_BID_ASK_EVIDENCE_ALIGNMENT.md`
- Gate 1 candle timing and timezone integrity:
  `docs/operations/GATE1_CANDLE_TIMING_AND_TIMEZONE_INTEGRITY_PLAN.md`
- Gate 1 lookahead-bias blocker: `docs/operations/GATE1_LOOKAHEAD_BIAS_BLOCKER_CONTRACT.md`
- Gate 1 same-candle stop/target ambiguity:
  `docs/operations/GATE1_SAME_CANDLE_STOP_TARGET_AMBIGUITY_PLAN.md`
- Gate 1 backtest assumption risk register:
  `docs/operations/GATE1_BACKTEST_ASSUMPTION_RISK_REGISTER.md`
- Gate 1 backtest assumption risk register negative cases:
  `docs/operations/GATE1_BACKTEST_ASSUMPTION_RISK_REGISTER_NEGATIVE_CASES.md`
- Gate 1 risk register guard indexing:
  `docs/operations/GATE1_RISK_REGISTER_GUARD_INDEXING_HARDENING.md`
- Gate 1 bad-assumption fixture cases: `docs/operations/GATE1_BAD_ASSUMPTION_FIXTURE_CASES.md`
- Gate 1 backtest run assembly contract: `docs/operations/GATE1_BACKTEST_RUN_ASSEMBLY_CONTRACT.md`
- Gate 1 metric report evidence-only contract:
  `docs/operations/GATE1_METRIC_REPORT_EVIDENCE_ONLY_CONTRACT.md`
- Gate 1 reproducibility comparison hardening:
  `docs/operations/GATE1_REPRODUCIBILITY_COMPARISON_HARDENING.md`
- Gate 1 operator decision event contract:
  `docs/operations/GATE1_OPERATOR_DECISION_EVENT_CONTRACT.md`
- Gate 1 completion criteria draft: `docs/operations/GATE1_COMPLETION_CRITERIA_DRAFT.md`
- Gate 2 blocker audit: `docs/operations/GATE2_BLOCKER_AUDIT.md`
- Gate 1 source link and guard coverage recheck:
  `docs/operations/GATE1_SOURCE_LINK_AND_GUARD_COVERAGE_RECHECK.md`
- Gate 1 backtest run assembly negative cases:
  `docs/operations/GATE1_BACKTEST_RUN_ASSEMBLY_NEGATIVE_CASES.md`
- Gate 1 metric report evidence negative cases:
  `docs/operations/GATE1_METRIC_REPORT_EVIDENCE_NEGATIVE_CASES.md`
- Gate 1 operator decision event negative cases:
  `docs/operations/GATE1_OPERATOR_DECISION_EVENT_NEGATIVE_CASES.md`
- Gate 1 completion criteria source-link hardening:
  `docs/operations/GATE1_COMPLETION_CRITERIA_SOURCE_LINK_HARDENING.md`
- Gate 2 blocker guard coverage: `docs/operations/GATE2_BLOCKER_GUARD_COVERAGE.md`
- Gate 1 missing-candle bad data fixture plan:
  `docs/operations/GATE1_MISSING_CANDLE_BAD_DATA_FIXTURE_PLAN.md`
- Gate 1 stale data blocker contract plan:
  `docs/operations/GATE1_STALE_DATA_BLOCKER_CONTRACT_PLAN.md`
- Gate 1 duplicate signal blocker planning:
  `docs/operations/GATE1_DUPLICATE_SIGNAL_BLOCKER_PLANNING_RECORD.md`
- Gate 1 strategy parameter immutability guard plan:
  `docs/operations/GATE1_STRATEGY_PARAMETER_IMMUTABILITY_GUARD_PLAN.md`
- Gate 1 evidence bundle assembly review: `docs/operations/GATE1_EVIDENCE_BUNDLE_ASSEMBLY_REVIEW.md`
- Gate 1 backtest assembly guard index recheck:
  `docs/operations/GATE1_BACKTEST_ASSEMBLY_GUARD_INDEX_RECHECK.md`
- Gate 1 metric report guard index recheck:
  `docs/operations/GATE1_METRIC_REPORT_GUARD_INDEX_RECHECK.md`
- Gate 1 operator decision guard index recheck:
  `docs/operations/GATE1_OPERATOR_DECISION_GUARD_INDEX_RECHECK.md`
- Gate 1 missing-candle fixture contract: `docs/operations/GATE1_MISSING_CANDLE_FIXTURE_CONTRACT.md`
- Gate 1 stale-data blocker contract: `docs/operations/GATE1_STALE_DATA_BLOCKER_CONTRACT.md`
- Gate 1 duplicate-signal blocker contract:
  `docs/operations/GATE1_DUPLICATE_SIGNAL_BLOCKER_CONTRACT.md`
- Gate 1 parameter immutability guard contract:
  `docs/operations/GATE1_PARAMETER_IMMUTABILITY_GUARD_CONTRACT.md`
- Gate 1 evidence bundle summary contract:
  `docs/operations/GATE1_EVIDENCE_BUNDLE_SUMMARY_CONTRACT.md`
- Gate 1 completion blocker recheck: `docs/operations/GATE1_COMPLETION_BLOCKER_RECHECK.md`
- Gate 1 control-plane checkpoint: `docs/operations/GATE1_CONTROL_PLANE_CHECKPOINT.md`
- Gate 1 skill default gate alignment: `docs/operations/GATE1_SKILL_DEFAULT_GATE_ALIGNMENT.md`
- Gate 1 command naming migration plan: `docs/operations/GATE1_COMMAND_NAMING_MIGRATION_PLAN.md`
- Gate 1 blocked evidence docs coverage recheck:
  `docs/operations/GATE1_BLOCKED_EVIDENCE_DOCS_COVERAGE_RECHECK.md`
- Gate 1 evidence blocker aggregate guard:
  `docs/operations/GATE1_EVIDENCE_BLOCKER_AGGREGATE_GUARD.md`
- Gate 1 fixture mutation negative cases: `docs/operations/GATE1_FIXTURE_MUTATION_NEGATIVE_CASES.md`
- Gate 1 snapshot column completeness guard:
  `docs/operations/GATE1_SNAPSHOT_COLUMN_COMPLETENESS_GUARD.md`
- Gate 1 stale data threshold policy: `docs/operations/GATE1_STALE_DATA_THRESHOLD_POLICY.md`
- Gate 1 parameter hash provenance record:
  `docs/operations/GATE1_PARAMETER_HASH_PROVENANCE_RECORD.md`
- Gate 1 duplicate signal fingerprint contract:
  `docs/operations/GATE1_DUPLICATE_SIGNAL_FINGERPRINT_CONTRACT.md`
- Gate 1 real historical data adapter blockers:
  `docs/operations/GATE1_REAL_HISTORICAL_DATA_ADAPTER_BLOCKERS.md`
- Gate 1 skill eval phase alignment recheck:
  `docs/operations/GATE1_SKILL_EVAL_PHASE_ALIGNMENT_RECHECK.md`
- Gate 1 command alias compatibility plan:
  `docs/operations/GATE1_COMMAND_ALIAS_COMPATIBILITY_PLAN.md`
- Gate 1 skill guard naming recheck: `docs/operations/GATE1_SKILL_GUARD_NAMING_RECHECK.md`
- Gate 1 blocker aggregate negative fixture set:
  `docs/operations/GATE1_BLOCKER_AGGREGATE_NEGATIVE_FIXTURE_SET.md`
- Gate 1 OHLC mid-price limitation record:
  `docs/operations/GATE1_OHLC_MID_PRICE_LIMITATION_RECORD.md`
- Gate 1 historical data adapter boundary:
  `docs/operations/GATE1_HISTORICAL_DATA_ADAPTER_BOUNDARY.md`
- Gate 1 data-provider provenance fields: `docs/operations/GATE1_DATA_PROVIDER_PROVENANCE_FIELDS.md`
- Gate 1 stale-data policy source-link recheck:
  `docs/operations/GATE1_STALE_DATA_POLICY_SOURCE_LINK_RECHECK.md`
- Gate 1 parameter hash canonicalization plan:
  `docs/operations/GATE1_PARAMETER_HASH_CANONICALIZATION_PLAN.md`
- Gate 1 duplicate signal fingerprint negative cases:
  `docs/operations/GATE1_DUPLICATE_SIGNAL_FINGERPRINT_NEGATIVE_CASES.md`
- Gate 1 blocker expansion checkpoint: `docs/operations/GATE1_BLOCKER_EXPANSION_CHECKPOINT.md`
- Gate 1 adapter authorization blocker inventory:
  `docs/operations/GATE1_ADAPTER_AUTHORIZATION_BLOCKER_INVENTORY.md`
- Gate 1 adapter fixture import contract plan:
  `docs/operations/GATE1_ADAPTER_FIXTURE_IMPORT_CONTRACT_PLAN.md`
- Gate 1 duplicate signal source-link recheck:
  `docs/operations/GATE1_DUPLICATE_SIGNAL_SOURCE_LINK_RECHECK.md`
- Gate 1 parameter hash negative cases plan:
  `docs/operations/GATE1_PARAMETER_HASH_NEGATIVE_CASES_PLAN.md`
- Gate 1 provider license review checklist:
  `docs/operations/GATE1_PROVIDER_LICENSE_REVIEW_CHECKLIST.md`
- Gate 1 command alias docs coverage recheck:
  `docs/operations/GATE1_COMMAND_ALIAS_DOCS_COVERAGE_RECHECK.md`
- Gate 1 skill metadata guard index record:
  `docs/operations/GATE1_SKILL_METADATA_GUARD_INDEX_RECORD.md`
- Gate 1 imported snapshot quarantine policy:
  `docs/operations/GATE1_IMPORTED_SNAPSHOT_QUARANTINE_POLICY.md`
- Gate 1 blocker checkpoint coverage recheck:
  `docs/operations/GATE1_BLOCKER_CHECKPOINT_COVERAGE_RECHECK.md`
- Gate 1 adapter-readiness blocker checkpoint:
  `docs/operations/GATE1_ADAPTER_READINESS_BLOCKER_CHECKPOINT.md`
- Gate 1 adapter blocker source-link recheck:
  `docs/operations/GATE1_ADAPTER_BLOCKER_SOURCE_LINK_RECHECK.md`
- Gate 1 imported snapshot schema authority:
  `docs/operations/GATE1_IMPORTED_SNAPSHOT_SCHEMA_AUTHORITY.md`
- Gate 1 provider credential exclusion policy:
  `docs/operations/GATE1_PROVIDER_CREDENTIAL_EXCLUSION_POLICY.md`
- Gate 1 quarantine policy coverage recheck:
  `docs/operations/GATE1_QUARANTINE_POLICY_COVERAGE_RECHECK.md`
- Gate 1 adapter fixture negative cases plan:
  `docs/operations/GATE1_ADAPTER_FIXTURE_NEGATIVE_CASES_PLAN.md`
- Gate 1 data-retention limitation record:
  `docs/operations/GATE1_DATA_RETENTION_LIMITATION_RECORD.md`
- Gate 1 provider license checklist coverage recheck:
  `docs/operations/GATE1_PROVIDER_LICENSE_CHECKLIST_COVERAGE_RECHECK.md`
- Gate 1 adapter audit-log boundary: `docs/operations/GATE1_ADAPTER_AUDIT_LOG_BOUNDARY.md`
- Gate 1 adapter blocker checkpoint recheck:
  `docs/operations/GATE1_ADAPTER_BLOCKER_CHECKPOINT_RECHECK.md`
- Gate 1 adapter planning freeze checkpoint:
  `docs/operations/GATE1_ADAPTER_PLANNING_FREEZE_CHECKPOINT.md`
- Gate 1 post-adapter freeze lane selection:
  `docs/operations/GATE1_POST_ADAPTER_FREEZE_LANE_SELECTION.md`
- Gate 1 guard command doc alignment recheck:
  `docs/operations/GATE1_GUARD_COMMAND_DOC_ALIGNMENT_RECHECK.md`
- Gate 1 contract guard schema validation hardening recheck:
  `docs/operations/GATE1_CONTRACT_GUARD_SCHEMA_VALIDATION_HARDENING_RECHECK.md`
- Gate 1 readiness blocker language recheck:
  `docs/operations/GATE1_READINESS_BLOCKER_LANGUAGE_RECHECK.md`
- Gate 1 command-center wording audit: `docs/operations/GATE1_COMMAND_CENTER_WORDING_AUDIT.md`
- Gate 1 review artifact aging policy draft:
  `docs/operations/GATE1_REVIEW_ARTIFACT_AGING_POLICY_DRAFT.md`
- Gate 1 source-link map consistency recheck:
  `docs/operations/GATE1_SOURCE_LINK_MAP_CONSISTENCY_RECHECK.md`
- Gate 1 blocked-scope scanner review: `docs/operations/GATE1_BLOCKED_SCOPE_SCANNER_REVIEW.md`
- Gate 1 operator handoff freshness review:
  `docs/operations/GATE1_OPERATOR_HANDOFF_FRESHNESS_REVIEW.md`
- Gate 1 maintenance checkpoint: `docs/operations/GATE1_MAINTENANCE_CHECKPOINT.md`
- Gate 1 maintenance gap intake: `docs/operations/GATE1_MAINTENANCE_GAP_INTAKE.md`
- Gate 1 tracklist queue discipline recheck:
  `docs/operations/GATE1_TRACKLIST_QUEUE_DISCIPLINE_RECHECK.md`
- Gate 1 command-center next-action pause wording:
  `docs/operations/GATE1_COMMAND_CENTER_NEXT_ACTION_PAUSE_WORDING.md`
- Gate 1 review aging policy source-link recheck:
  `docs/operations/GATE1_REVIEW_AGING_POLICY_SOURCE_LINK_RECHECK.md`
- Gate 1 scanner blocked-term sample audit:
  `docs/operations/GATE1_SCANNER_BLOCKED_TERM_SAMPLE_AUDIT.md`
- Gate 1 docs stale-reference sweep: `docs/operations/GATE1_DOCS_STALE_REFERENCE_SWEEP.md`
- Gate 1 maintenance stop-condition checkpoint:
  `docs/operations/GATE1_MAINTENANCE_STOP_CONDITION_CHECKPOINT.md`
- Gate 1 evidence freshness churn guard review:
  `docs/operations/GATE1_EVIDENCE_FRESHNESS_CHURN_GUARD_REVIEW.md`
- Gate 1 brand handoff isolation review: `docs/operations/GATE1_BRAND_HANDOFF_ISOLATION_REVIEW.md`
- Gate 1 maintenance closeout checkpoint: `docs/operations/GATE1_MAINTENANCE_CLOSEOUT_CHECKPOINT.md`
- Gate 1 closeout evidence review: `docs/operations/GATE1_CLOSEOUT_EVIDENCE_REVIEW.md`
- Gate 1 acceptance criteria audit: `docs/operations/GATE1_ACCEPTANCE_CRITERIA_AUDIT.md`
- Gate 2 readiness assessment packet: `docs/operations/GATE2_READINESS_ASSESSMENT_PACKET.md`
- Gate 2 blocker inventory: `docs/operations/GATE2_BLOCKER_INVENTORY.md`
- Gate 2 autonomy gate delta review: `docs/operations/GATE2_AUTONOMY_GATE_DELTA_REVIEW.md`
- Gate 2 financial risk gate delta review:
  `docs/operations/GATE2_FINANCIAL_RISK_GATE_DELTA_REVIEW.md`
- Gate 2 credential boundary assessment: `docs/operations/GATE2_CREDENTIAL_BOUNDARY_ASSESSMENT.md`
- Gate 2 execution-scope prohibition review:
  `docs/operations/GATE2_EXECUTION_SCOPE_PROHIBITION_REVIEW.md`
- Gate 2 assessment QA/security review: `docs/operations/GATE2_ASSESSMENT_QA_SECURITY_REVIEW.md`
- Gate 1 closeout recommendation: `docs/operations/GATE1_CLOSEOUT_RECOMMENDATION.md`
- Gate 1 closeout signoff packet: `docs/operations/GATE1_CLOSEOUT_SIGNOFF_PACKET.md`
- Gate 2 authorization criteria draft: `docs/operations/GATE2_AUTHORIZATION_CRITERIA_DRAFT.md`
- Gate 2 risk-owner authorization checklist:
  `docs/operations/GATE2_RISK_OWNER_AUTHORIZATION_CHECKLIST.md`
- Gate 2 autonomy-owner authorization checklist:
  `docs/operations/GATE2_AUTONOMY_OWNER_AUTHORIZATION_CHECKLIST.md`
- Gate 2 QA/security authorization checklist:
  `docs/operations/GATE2_QA_SECURITY_AUTHORIZATION_CHECKLIST.md`
- Gate 2 implementation prohibition note: `docs/operations/GATE2_IMPLEMENTATION_PROHIBITION_NOTE.md`
- Gate 2 operator decision authority review:
  `docs/operations/GATE2_OPERATOR_DECISION_AUTHORITY_REVIEW.md`
- Gate 1 final verification record: `docs/operations/GATE1_FINAL_VERIFICATION_RECORD.md`
- Gate movement decision packet draft: `docs/operations/GATE_MOVEMENT_DECISION_PACKET_DRAFT.md`
- Gate 1 signoff recommendation: `docs/operations/GATE1_SIGNOFF_RECOMMENDATION.md`
- Gate 2 operator gate decision intake: `docs/operations/GATE2_OPERATOR_GATE_DECISION_INTAKE.md`
- Gate 1 pause exit packet: `docs/operations/GATE1_PAUSE_EXIT_PACKET.md`
- Gate 1 material gap intake result: `docs/operations/GATE1_MATERIAL_GAP_INTAKE_RESULT.md`
- Gate 2 brand handoff workstream decision:
  `docs/operations/GATE2_BRAND_HANDOFF_WORKSTREAM_DECISION.md`
- Gate 2 movement request intake: `docs/operations/GATE2_MOVEMENT_REQUEST_INTAKE.md`
- Gate 2 movement approval routing: `docs/operations/GATE2_MOVEMENT_APPROVAL_ROUTING.md`
- Gate 2 movement dry-run checklist: `docs/operations/GATE2_MOVEMENT_DRY_RUN_CHECKLIST.md`
- Gate 2 planning hold note: `docs/operations/GATE2_PLANNING_HOLD_NOTE.md`
- Gate 2 command-center planning sync: `docs/operations/GATE2_COMMAND_CENTER_PLANNING_SYNC.md`
- Gate 2 operator next-decision checkpoint:
  `docs/operations/GATE2_OPERATOR_NEXT_DECISION_CHECKPOINT.md`
- Gate 2 simulated-order record plan: `docs/operations/GATE2_SIMULATED_ORDER_RECORD_PLAN.md`
- Gate 2 simulation state boundary plan: `docs/operations/GATE2_SIMULATION_STATE_BOUNDARY_PLAN.md`
- Gate 2 no-external-account guard plan: `docs/operations/GATE2_NO_EXTERNAL_ACCOUNT_GUARD_PLAN.md`
- Gate 2 credential exclusion guard plan: `docs/operations/GATE2_CREDENTIAL_EXCLUSION_GUARD_PLAN.md`
- Gate 2 simulated fill assumption plan: `docs/operations/GATE2_SIMULATED_FILL_ASSUMPTION_PLAN.md`
- Gate 2 risk review event plan: `docs/operations/GATE2_RISK_REVIEW_EVENT_PLAN.md`
- Gate 2 operator action log plan: `docs/operations/GATE2_OPERATOR_ACTION_LOG_PLAN.md`
- Gate 2 negative fixture plan: `docs/operations/GATE2_NEGATIVE_FIXTURE_PLAN.md`
- Gate 2 command-center planning extension:
  `docs/operations/GATE2_COMMAND_CENTER_PLANNING_EXTENSION.md`
- Gate 2 implementation readiness review: `docs/operations/GATE2_IMPLEMENTATION_READINESS_REVIEW.md`
- Gate 2 contract implementation packet: `docs/operations/GATE2_CONTRACT_IMPLEMENTATION_PACKET.md`
- Gate 2 simulated-order record contract: `docs/operations/GATE2_SIMULATED_ORDER_RECORD_CONTRACT.md`
- Gate 2 simulation state contract: `docs/operations/GATE2_SIMULATION_STATE_CONTRACT.md`
- Gate 2 risk review event contract: `docs/operations/GATE2_RISK_REVIEW_EVENT_CONTRACT.md`
- Gate 2 operator action log contract: `docs/operations/GATE2_OPERATOR_ACTION_LOG_CONTRACT.md`
- Gate 2 simulated fill assumption contract:
  `docs/operations/GATE2_SIMULATED_FILL_ASSUMPTION_CONTRACT.md`
- Gate 2 synthetic fixture set: `docs/operations/GATE2_SYNTHETIC_FIXTURE_SET.md`
- Gate 2 negative contract tests: `docs/operations/GATE2_NEGATIVE_CONTRACT_TESTS.md`
- Gate 2 contract guard indexing update: `docs/operations/GATE2_CONTRACT_GUARD_INDEXING_UPDATE.md`
- Gate 2 contract checkpoint: `docs/operations/GATE2_CONTRACT_CHECKPOINT.md`
- Gate 2 mechanics planning packet: `docs/operations/GATE2_MECHANICS_PLANNING_PACKET.md`
- Gate 2 local simulation engine boundary plan:
  `docs/operations/GATE2_LOCAL_SIMULATION_ENGINE_BOUNDARY_PLAN.md`
- Gate 2 simulation input assembly plan: `docs/operations/GATE2_SIMULATION_INPUT_ASSEMBLY_PLAN.md`
- Gate 2 simulation output artifact plan: `docs/operations/GATE2_SIMULATION_OUTPUT_ARTIFACT_PLAN.md`
- Gate 2 simulation replay determinism plan:
  `docs/operations/GATE2_SIMULATION_REPLAY_DETERMINISM_PLAN.md`
- Gate 2 simulation failure mode plan: `docs/operations/GATE2_SIMULATION_FAILURE_MODE_PLAN.md`
- Gate 2 command-center mechanics planning copy:
  `docs/operations/GATE2_COMMAND_CENTER_MECHANICS_PLANNING_COPY.md`
- Gate 2 mechanics implementation blocker review:
  `docs/operations/GATE2_MECHANICS_IMPLEMENTATION_BLOCKER_REVIEW.md`
- Gate 2 contract source-link recheck: `docs/operations/GATE2_CONTRACT_SOURCE_LINK_RECHECK.md`
- Gate 2 mechanics planning checkpoint: `docs/operations/GATE2_MECHANICS_PLANNING_CHECKPOINT.md`
- Gate 2 mechanics implementation packet: `docs/operations/GATE2_MECHANICS_IMPLEMENTATION_PACKET.md`
- Gate 2 local simulation engine pure function:
  `docs/operations/GATE2_LOCAL_SIMULATION_ENGINE_PURE_FUNCTION.md`
- Gate 2 simulation input assembler: `docs/operations/GATE2_SIMULATION_INPUT_ASSEMBLER.md`
- Gate 2 simulation output artifact builder:
  `docs/operations/GATE2_SIMULATION_OUTPUT_ARTIFACT_BUILDER.md`
- Gate 2 replay determinism guard: `docs/operations/GATE2_REPLAY_DETERMINISM_GUARD.md`
- Gate 2 failure mode fixtures and tests: `docs/operations/GATE2_FAILURE_MODE_FIXTURES_AND_TESTS.md`
- Gate 2 command-center mechanics evidence view:
  `docs/operations/GATE2_COMMAND_CENTER_MECHANICS_EVIDENCE_VIEW.md`
- Gate 2 mechanics scanner boundary update:
  `docs/operations/GATE2_MECHANICS_SCANNER_BOUNDARY_UPDATE.md`
- Gate 2 mechanics source-link guard recheck:
  `docs/operations/GATE2_MECHANICS_SOURCE_LINK_GUARD_RECHECK.md`
- Gate 2 mechanics implementation checkpoint:
  `docs/operations/GATE2_MECHANICS_IMPLEMENTATION_CHECKPOINT.md`
- Gate 2 post-mechanics blocker review: `docs/operations/GATE2_POST_MECHANICS_BLOCKER_REVIEW.md`
- Gate 2 mechanics operator handoff note: `docs/operations/GATE2_MECHANICS_OPERATOR_HANDOFF_NOTE.md`
- Gate 2 mechanics closure audit: `docs/operations/GATE2_MECHANICS_CLOSURE_AUDIT.md`
- Gate 2 next gap intake: `docs/operations/GATE2_NEXT_GAP_INTAKE.md`
- Gate 2 command-center post-mechanics wording audit:
  `docs/operations/GATE2_COMMAND_CENTER_POST_MECHANICS_WORDING_AUDIT.md`
- Gate 2 mechanics docs stale-reference sweep:
  `docs/operations/GATE2_MECHANICS_DOCS_STALE_REFERENCE_SWEEP.md`
- Gate 2 mechanics guard aging review: `docs/operations/GATE2_MECHANICS_GUARD_AGING_REVIEW.md`
- Gate 2 paper simulation limitation register:
  `docs/operations/GATE2_PAPER_SIMULATION_LIMITATION_REGISTER.md`
- Gate 2 operator workflow dry-run plan: `docs/operations/GATE2_OPERATOR_WORKFLOW_DRY_RUN_PLAN.md`
- Gate 2 no-expansion recheck: `docs/operations/GATE2_NO_EXPANSION_RECHECK.md`
- Gate 2 brand handoff isolation recheck: `docs/operations/GATE2_BRAND_HANDOFF_ISOLATION_RECHECK.md`
- Gate 2 maintenance checkpoint: `docs/operations/GATE2_MAINTENANCE_CHECKPOINT.md`
- Gate 2 pause-or-proceed recommendation: `docs/operations/GATE2_PAUSE_OR_PROCEED_RECOMMENDATION.md`
- Gate 2 read-only frontend app-shell scope assessment:
  `docs/operations/GATE2_READ_ONLY_FRONTEND_APP_SHELL_SCOPE_ASSESSMENT.md`
- Gate 2 frontend evidence panel requirements draft:
  `docs/operations/GATE2_FRONTEND_EVIDENCE_PANEL_REQUIREMENTS_DRAFT.md`

## Source Of Truth Links Continued 2

- Gate 2 frontend information architecture plan:
  `docs/operations/GATE2_FRONTEND_INFORMATION_ARCHITECTURE_PLAN.md`
- Gate 2 frontend route boundary map: `docs/operations/GATE2_FRONTEND_ROUTE_BOUNDARY_MAP.md`
- Gate 2 evidence panel data contract plan:
  `docs/operations/GATE2_EVIDENCE_PANEL_DATA_CONTRACT_PLAN.md`
- Gate 2 limitation panel copy contract: `docs/operations/GATE2_LIMITATION_PANEL_COPY_CONTRACT.md`
- Gate 2 risk panel copy contract: `docs/operations/GATE2_RISK_PANEL_COPY_CONTRACT.md`
- Gate 2 operator workflow panel contract:
  `docs/operations/GATE2_OPERATOR_WORKFLOW_PANEL_CONTRACT.md`
- Gate 2 frontend no-action-control guard plan:
  `docs/operations/GATE2_FRONTEND_NO_ACTION_CONTROL_GUARD_PLAN.md`
- Gate 2 frontend accessibility baseline plan:
  `docs/operations/GATE2_FRONTEND_ACCESSIBILITY_BASELINE_PLAN.md`
- Gate 2 frontend visual hierarchy direction:
  `docs/operations/GATE2_FRONTEND_VISUAL_HIERARCHY_DIRECTION.md`
- Gate 2 frontend implementation readiness blocker audit:
  `docs/operations/GATE2_FRONTEND_IMPLEMENTATION_READINESS_BLOCKER_AUDIT.md`
- Gate 2 frontend skill lens intake: `docs/operations/GATE2_FRONTEND_SKILL_LENS_INTAKE.md`
- Gate 2 read-only frontend implementation packet draft:
  `docs/operations/GATE2_READ_ONLY_FRONTEND_IMPLEMENTATION_PACKET_DRAFT.md`
- Gate 2 frontend no-action-control test plan:
  `docs/operations/GATE2_FRONTEND_NO_ACTION_CONTROL_TEST_PLAN.md`
- Gate 2 frontend local data adapter plan:
  `docs/operations/GATE2_FRONTEND_LOCAL_DATA_ADAPTER_PLAN.md`
- Gate 2 frontend panel component inventory:
  `docs/operations/GATE2_FRONTEND_PANEL_COMPONENT_INVENTORY.md`
- Gate 2 frontend navigation shell implementation packet:
  `docs/operations/GATE2_FRONTEND_NAVIGATION_SHELL_IMPLEMENTATION_PACKET.md`
- Gate 2 frontend evidence panel implementation packet:
  `docs/operations/GATE2_FRONTEND_EVIDENCE_PANEL_IMPLEMENTATION_PACKET.md`
- Gate 2 frontend risk limitation panel packet:
  `docs/operations/GATE2_FRONTEND_RISK_LIMITATION_PANEL_PACKET.md`
- Gate 2 frontend workflow panel implementation packet:
  `docs/operations/GATE2_FRONTEND_WORKFLOW_PANEL_IMPLEMENTATION_PACKET.md`
- Gate 2 frontend accessibility verification packet:
  `docs/operations/GATE2_FRONTEND_ACCESSIBILITY_VERIFICATION_PACKET.md`
- Gate 2 frontend implementation go/no-go checkpoint:
  `docs/operations/GATE2_FRONTEND_IMPLEMENTATION_GO_NO_GO_CHECKPOINT.md`
- Gate 2 frontend shell build packet: `docs/operations/GATE2_FRONTEND_SHELL_BUILD_PACKET.md`
- Gate 2 frontend no-action-control guard implementation:
  `docs/operations/GATE2_FRONTEND_NO_ACTION_CONTROL_GUARD_IMPLEMENTATION.md`
- Gate 2 read-only frontend shell implementation:
  `docs/operations/GATE2_READ_ONLY_FRONTEND_SHELL_IMPLEMENTATION.md`
- Gate 2 frontend rendered shell visual QA:
  `docs/operations/GATE2_FRONTEND_RENDERED_SHELL_VISUAL_QA.md`
- Gate 2 frontend evidence panel implementation:
  `docs/operations/GATE2_FRONTEND_EVIDENCE_PANEL_IMPLEMENTATION.md`
- Gate 2 frontend risk limitation panel implementation:
  `docs/operations/GATE2_FRONTEND_RISK_LIMITATION_PANEL_IMPLEMENTATION.md`
- Gate 2 frontend workflow panel implementation:
  `docs/operations/GATE2_FRONTEND_WORKFLOW_PANEL_IMPLEMENTATION.md`
- Gate 2 frontend docs/source-link panel implementation:
  `docs/operations/GATE2_FRONTEND_DOCS_SOURCE_LINK_PANEL_IMPLEMENTATION.md`
- Gate 2 frontend responsive polish pass: `docs/operations/GATE2_FRONTEND_RESPONSIVE_POLISH_PASS.md`
- Gate 2 frontend accessibility verification run:
  `docs/operations/GATE2_FRONTEND_ACCESSIBILITY_VERIFICATION_RUN.md`
- Gate 2 frontend guard evidence recheck: `docs/operations/GATE2_FRONTEND_GUARD_EVIDENCE_RECHECK.md`
- Gate 2 frontend implementation checkpoint:
  `docs/operations/GATE2_FRONTEND_IMPLEMENTATION_CHECKPOINT.md`
- Gate 2 frontend operator review pass: `docs/operations/GATE2_FRONTEND_OPERATOR_REVIEW_PASS.md`
- Gate 2 frontend evidence detail expansion plan:
  `docs/operations/GATE2_FRONTEND_EVIDENCE_DETAIL_EXPANSION_PLAN.md`
- Gate 2 frontend limitation copy audit: `docs/operations/GATE2_FRONTEND_LIMITATION_COPY_AUDIT.md`
- Gate 2 frontend source-link grouping polish:
  `docs/operations/GATE2_FRONTEND_SOURCE_LINK_GROUPING_POLISH.md`
- Gate 2 frontend runtime refresh UX review:
  `docs/operations/GATE2_FRONTEND_RUNTIME_REFRESH_UX_REVIEW.md`
- Gate 2 frontend mobile visual QA recheck:
  `docs/operations/GATE2_FRONTEND_MOBILE_VISUAL_QA_RECHECK.md`
- Gate 2 frontend keyboard navigation QA recheck:
  `docs/operations/GATE2_FRONTEND_KEYBOARD_NAVIGATION_QA_RECHECK.md`
- Gate 2 frontend blocked-copy regression pack:
  `docs/operations/GATE2_FRONTEND_BLOCKED_COPY_REGRESSION_PACK.md`
- Gate 2 frontend handoff note: `docs/operations/GATE2_FRONTEND_HANDOFF_NOTE.md`
- Gate 2 frontend lane closeout checkpoint:
  `docs/operations/GATE2_FRONTEND_LANE_CLOSEOUT_CHECKPOINT.md`
- Gate 2 paper-simulation UI gap intake: `docs/operations/GATE2_PAPER_SIMULATION_UI_GAP_INTAKE.md`
- Gate 2 simulation evidence detail contract plan:
  `docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_CONTRACT_PLAN.md`
- Gate 2 operator workflow evidence card plan:
  `docs/operations/GATE2_OPERATOR_WORKFLOW_EVIDENCE_CARD_PLAN.md`
- Gate 2 risk-review panel data contract plan:
  `docs/operations/GATE2_RISK_REVIEW_PANEL_DATA_CONTRACT_PLAN.md`
- Gate 2 local simulation artifact summary plan:
  `docs/operations/GATE2_LOCAL_SIMULATION_ARTIFACT_SUMMARY_PLAN.md`
- Gate 2 failure-mode evidence panel plan:
  `docs/operations/GATE2_FAILURE_MODE_EVIDENCE_PANEL_PLAN.md`
- Gate 2 source-link density follow-up review:
  `docs/operations/GATE2_SOURCE_LINK_DENSITY_FOLLOW_UP_REVIEW.md`
- Gate 2 frontend no-account-connector recheck:
  `docs/operations/GATE2_FRONTEND_NO_ACCOUNT_CONNECTOR_RECHECK.md`
- Gate 2 frontend-to-simulation handoff packet:
  `docs/operations/GATE2_FRONTEND_TO_SIMULATION_HANDOFF_PACKET.md`
- Gate 2 next implementation checkpoint: `docs/operations/GATE2_NEXT_IMPLEMENTATION_CHECKPOINT.md`
- Gate 2 simulation evidence detail schema draft:
  `docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_DRAFT.md`
- Gate 2 simulation evidence detail negative cases:
  `docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_NEGATIVE_CASES.md`
- Gate 2 operator workflow evidence fixture plan:
  `docs/operations/GATE2_OPERATOR_WORKFLOW_EVIDENCE_FIXTURE_PLAN.md`
- Gate 2 risk-review panel fixture plan: `docs/operations/GATE2_RISK_REVIEW_PANEL_FIXTURE_PLAN.md`
- Gate 2 local artifact summary fixture plan:
  `docs/operations/GATE2_LOCAL_ARTIFACT_SUMMARY_FIXTURE_PLAN.md`
- Gate 2 failure-mode evidence fixture plan:
  `docs/operations/GATE2_FAILURE_MODE_EVIDENCE_FIXTURE_PLAN.md`
- Gate 2 simulation evidence source-link map plan:
  `docs/operations/GATE2_SIMULATION_EVIDENCE_SOURCE_LINK_MAP_PLAN.md`
- Gate 2 frontend evidence detail display packet:
  `docs/operations/GATE2_FRONTEND_EVIDENCE_DETAIL_DISPLAY_PACKET.md`
- Gate 2 evidence contract guard update plan:
  `docs/operations/GATE2_EVIDENCE_CONTRACT_GUARD_UPDATE_PLAN.md`
- Gate 2 simulation evidence checkpoint: `docs/operations/GATE2_SIMULATION_EVIDENCE_CHECKPOINT.md`
- Gate 2 simulation evidence schema implementation packet:
  `docs/operations/GATE2_SIMULATION_EVIDENCE_SCHEMA_IMPLEMENTATION_PACKET.md`
- Gate 2 simulation evidence detail schema implementation:
  `docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_IMPLEMENTATION.md`
- Gate 2 simulation evidence detail schema tests:
  `docs/operations/GATE2_SIMULATION_EVIDENCE_DETAIL_SCHEMA_TESTS.md`
- Gate 2 operator workflow evidence fixture implementation:
  `docs/operations/GATE2_OPERATOR_WORKFLOW_EVIDENCE_FIXTURE_IMPLEMENTATION.md`
- Gate 2 risk review fixture implementation:
  `docs/operations/GATE2_RISK_REVIEW_FIXTURE_IMPLEMENTATION.md`
- Gate 2 local artifact summary fixture implementation:
  `docs/operations/GATE2_LOCAL_ARTIFACT_SUMMARY_FIXTURE_IMPLEMENTATION.md`
- Gate 2 failure mode fixture implementation:
  `docs/operations/GATE2_FAILURE_MODE_FIXTURE_IMPLEMENTATION.md`
- Gate 2 evidence source-link map implementation:
  `docs/operations/GATE2_EVIDENCE_SOURCE_LINK_MAP_IMPLEMENTATION.md`
- Gate 2 evidence contract guard implementation:
  `docs/operations/GATE2_EVIDENCE_CONTRACT_GUARD_IMPLEMENTATION.md`
- Gate 2 evidence implementation checkpoint:
  `docs/operations/GATE2_EVIDENCE_IMPLEMENTATION_CHECKPOINT.md`
- Gate 2 evidence detail display implementation packet:
  `docs/operations/GATE2_EVIDENCE_DETAIL_DISPLAY_IMPLEMENTATION_PACKET.md`
- Gate 2 evidence detail local data adapter update:
  `docs/operations/GATE2_EVIDENCE_DETAIL_LOCAL_DATA_ADAPTER_UPDATE.md`
- Gate 2 evidence detail panel component: `docs/operations/GATE2_EVIDENCE_DETAIL_PANEL_COMPONENT.md`
- Gate 2 evidence detail risk adjacency pass:
  `docs/operations/GATE2_EVIDENCE_DETAIL_RISK_ADJACENCY_PASS.md`
- Gate 2 evidence detail no-action-control tests:
  `docs/operations/GATE2_EVIDENCE_DETAIL_NO_ACTION_CONTROL_TESTS.md`
- Gate 2 evidence detail source-link rendering:
  `docs/operations/GATE2_EVIDENCE_DETAIL_SOURCE_LINK_RENDERING.md`
- Gate 2 evidence detail mobile visual QA:
  `docs/operations/GATE2_EVIDENCE_DETAIL_MOBILE_VISUAL_QA.md`
- Gate 2 evidence detail keyboard accessibility QA:
  `docs/operations/GATE2_EVIDENCE_DETAIL_KEYBOARD_ACCESSIBILITY_QA.md`
- Gate 2 evidence detail Command Center sync:
  `docs/operations/GATE2_EVIDENCE_DETAIL_COMMAND_CENTER_SYNC.md`
- Gate 2 evidence detail display checkpoint:
  `docs/operations/GATE2_EVIDENCE_DETAIL_DISPLAY_CHECKPOINT.md`

## Source Of Truth Links Continued 3

- Command center app: `apps/web/index.html`, `apps/web/src/main.js`,
  `apps/web/src/command-center-data.js`, `apps/web/src/styles.css`
- Command center guardrail tests: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Command center preview script: `scripts/preview-web.ts`
- Command center runtime data builder: `scripts/build-command-center-runtime-data.ts`
- Command center preview script tests:
  `packages/fixtures/tests/gate0-command-center-preview-script.test.ts`
- Command center runtime data tests:
  `packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`
- Command center freshness guard script: `scripts/check-gate0-command-center-freshness.ts`
- Command center freshness guard tests:
  `packages/fixtures/tests/gate0-command-center-freshness-check.test.ts`
- Command center render contract script: `scripts/check-gate0-command-center-render-contract.ts`
- Command center render contract tests:
  `packages/fixtures/tests/gate0-command-center-render-contract.test.ts`
- Skill governance guard script: `scripts/check-gate0-skill-governance.ts`
- Skill governance guard tests: `packages/fixtures/tests/gate0-skill-governance.test.ts`
- Trader product reviewer skill: `skills/trader-product-reviewer/SKILL.md`
- TraderFrame copy reviewer skill: `skills/traderframe-copy-reviewer/SKILL.md`
- TraderFrame frontend engineer skill: `skills/traderframe-frontend-engineer/SKILL.md`
- TraderFrame marketing strategy reviewer skill:
  `skills/traderframe-marketing-strategy-reviewer/SKILL.md`
- TraderFrame visual product designer skill: `skills/traderframe-visual-product-designer/SKILL.md`
- Trading forex domain expert skill: `skills/trading-forex-domain-expert/SKILL.md`
- CI evidence freshness guard script: `scripts/check-gate0-ci-evidence-freshness.ts`
- CI evidence freshness guard tests:
  `packages/fixtures/tests/gate0-ci-evidence-freshness-check.test.ts`
- Source-link duplicate guard script: `scripts/check-gate0-source-link-duplicates.ts`
- Source-link duplicate guard tests: `packages/fixtures/tests/gate0-source-link-duplicates.test.ts`
- Tracklist section length guard script: `scripts/check-gate0-tracklist-section-length.ts`
- Tracklist section length guard tests:
  `packages/fixtures/tests/gate0-tracklist-section-length.test.ts`
- GitHub CI workflow source: `.github/workflows/gate0-verify.yml`
- GitHub Actions runtime guard script: `scripts/check-gate0-github-actions-runtime.ts`
- GitHub Actions runtime guard tests: `packages/fixtures/tests/gate0-github-actions-runtime.test.ts`
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
- Gate 2 paper simulation contract source:
  `packages/contracts/src/gate2-paper-simulation-contracts.ts`
- Gate 2 paper simulation contract tests:
  `packages/contracts/tests/gate2-paper-simulation-contracts.test.ts`
- Gate 2 paper simulation fixture source: `packages/fixtures/src/gate2-paper-simulation-fixtures.ts`
- Gate 2 paper simulation fixture tests:
  `packages/fixtures/tests/gate2-paper-simulation-fixtures.test.ts`
- Gate 2 local simulation engine source: `packages/core/src/gate2-local-simulation-engine.ts`
- Gate 2 local simulation engine tests: `packages/core/tests/gate2-local-simulation-engine.test.ts`
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
- Guard and quality suite command source: `package.json`
- Inspect command contract: `docs/operations/GATE0_INSPECT_COMMAND_CONTRACT.md`
- Docs coverage drift guard script: `scripts/check-gate0-docs-coverage.ts`
- Project-name guard: `scripts/check-gate0-project-name.ts`
- Gate scanner: `scripts/validate-gate0.ts`
