# Gate 0 Validation Command Audit

## Purpose

This audit maps the current Gate 0 validation commands to their accepted local checks.

It is a documentation audit only. It does not change command behavior, strategy state, risk state,
maturity state, operator decisions, gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this audit only to verify that the current validation sequence remains local, deterministic,
bounded, and traceable. Do not use command success as strategy approval, readiness review,
performance evidence, profitability evidence, deployment approval, or future-phase eligibility.

## Audited Command Set

| Command                                             | Source                                                  | Accepted local check                             | Status |
| --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------ | ------ |
| `pnpm inspect:gate0-dry-run`                        | `scripts/inspect-gate0-dry-run.ts`                      | Default clear synthetic dry-run inspect path.    | Pass   |
| `pnpm inspect:gate0-dry-run -- --help`              | `scripts/inspect-gate0-dry-run.ts`                      | Help output with static scenario keys.           | Pass   |
| `pnpm inspect:gate0-dry-run -- -h`                  | `scripts/inspect-gate0-dry-run.ts`                      | Help alias output with Gate 0 boundary.          | Pass   |
| `pnpm inspect:gate0-dry-run -- --scenario friction` | `scripts/inspect-gate0-dry-run.ts`                      | Blocked-friction synthetic dry-run inspect path. | Pass   |
| `pnpm inspect:gate0-dry-run -- --scenario other`    | `scripts/inspect-gate0-dry-run.ts`                      | Bounded invalid scenario handling.               | Pass   |
| `pnpm snapshot:gate0-progress`                      | `scripts/generate-gate0-progress-snapshot.ts`           | Local accepted-packet snapshot generation.       | Pass   |
| `pnpm check:gate0-evidence-index`                   | `scripts/check-gate0-evidence-index-drift.ts`           | Local evidence-index drift check.                | Pass   |
| `pnpm check:gate0-name`                             | `scripts/check-gate0-project-name.ts`                   | GateZero project-name consistency check.         | Pass   |
| `pnpm check:gate0-docs-coverage`                    | `scripts/check-gate0-docs-coverage.ts`                  | Local operator docs coverage drift check.        | Pass   |
| `pnpm check:gate0-snapshot`                         | `scripts/check-gate0-progress-snapshot-freshness.ts`    | Snapshot freshness against local records.        | Pass   |
| `pnpm check:gate0-tracklist`                        | `scripts/check-gate0-tracklist-consistency.ts`          | Accepted record and tracklist ledger alignment.  | Pass   |
| `pnpm check:gate0-reviews`                          | `scripts/check-gate0-review-coverage.ts`                | Assignment and review-record coverage alignment. | Pass   |
| `pnpm check:gate0-agents`                           | `scripts/check-gate0-agent-manifest.ts`                 | Agent manifest, required files, and refs align.  | Pass   |
| `pnpm check:repo-hygiene`                           | `scripts/check-repo-hygiene.ts`                         | `.gitignore` and tracked-file hygiene.           | Pass   |
| `pnpm check:gate0-ci-evidence`                      | `scripts/check-gate0-ci-evidence-freshness.ts`          | Manual remote CI evidence freshness check.       | Pass   |
| `pnpm check:gate0-command-center`                   | `scripts/check-gate0-command-center-freshness.ts`       | Local command center evidence freshness check.   | Pass   |
| `pnpm check:gate0-command-center-render`            | `scripts/check-gate0-command-center-render-contract.ts` | Local command center render contract check.      | Pass   |
| `pnpm check:gate0-skills`                           | `scripts/check-gate0-skill-governance.ts`               | Local project skill and intake governance check. | Pass   |
| `pnpm check:gate0-skill-routing`                    | `scripts/check-gate0-skill-routing.ts`                  | Local project skill routing matrix check.        | Pass   |
| `pnpm check:gate1-contracts`                        | `scripts/check-gate1-contracts.ts`                      | Gate 1 contract control-record guard.            | Pass   |
| `pnpm check:gate0-actions-runtime`                  | `scripts/check-gate0-github-actions-runtime.ts`         | GitHub Actions runtime posture check.            | Pass   |
| `pnpm preview:web`                                  | `scripts/preview-web.ts`                                | Local host static command center preview.        | Pass   |
| `pnpm check:gate0`                                  | `package.json`                                          | Snapshot refresh plus local Gate 0 guard suite.  | Pass   |
| `pnpm verify:gate0`                                 | `package.json`                                          | Gate 0 guard suite plus quality checks.          | Pass   |
| `pnpm lint`                                         | `package.json`                                          | Static lint check.                               | Pass   |
| `pnpm format:check`                                 | `package.json`                                          | Configured Prettier check.                       | Pass   |
| `pnpm typecheck`                                    | `package.json`                                          | TypeScript type check.                           | Pass   |
| `pnpm test`                                         | `package.json`                                          | Vitest suite.                                    | Pass   |
| `pnpm validate:gate0`                               | `scripts/validate-gate0.ts`                             | Gate 0 blocked-scope scanner.                    | Pass   |

## Coverage Notes

- Inspect commands cover help, default clear, friction, and invalid-input paths.
- Operating record commands cover progress snapshot generation, evidence-index drift, docs coverage
  drift, snapshot freshness, project-name consistency, tracklist consistency, review coverage, agent
  manifest drift, repository hygiene, manual CI evidence freshness, command center evidence
  freshness, command center render-contract coverage, project skill and intake governance, GitHub
  Actions runtime posture, the Gate 1 contract guard, and the consolidated Gate 0 guard suite.
- The verification command covers the Gate 0 guard suite plus lint, formatting, type checking, and
  tests.
- Quality commands cover lint, formatting, type checking, tests, and Gate 0 boundary scanning.
- The accepted latest suite result is 66 test files and 335 tests passing.

## Locality Notes

The audited commands are local repository commands. They do not add:

- External service access.
- Credential handling.
- Broker API handling.
- UI or API route surface.
- Report export or publishing.
- Live or paper order mechanics.
- Strategy approval, readiness, profitability, performance, or future-phase claims.

## Maintenance Rule

Update this audit when a later Gate 0 packet adds, removes, renames, or changes a validation
command. Do not use this audit to authorize execution, strategy promotion, risk-gate movement,
product launch, or later-phase operation.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Validation rules: `ops/validation/VALIDATION_RULES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Command index: `docs/operations/GATE0_OPERATOR_COMMAND_INDEX.md`
- Command index coverage check: `docs/operations/GATE0_COMMAND_INDEX_COVERAGE_CHECK.md`
- Validation audit coverage check: `docs/operations/GATE0_VALIDATION_AUDIT_COVERAGE_CHECK.md`
- Validation command coverage recheck:
  `docs/operations/GATE0_VALIDATION_COMMAND_COVERAGE_RECHECK.md`
- Evidence index validation recheck: `docs/operations/GATE0_EVIDENCE_INDEX_VALIDATION_RECHECK.md`
- Evidence index drift guard: `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md`
- Review coverage drift guard: `docs/operations/GATE0_REVIEW_COVERAGE_DRIFT_GUARD.md`
- Agent manifest drift guard: `docs/operations/GATE0_AGENT_MANIFEST_DRIFT_GUARD.md`
- Repo hygiene guard: `docs/operations/GATE0_REPO_HYGIENE_GUARD.md`
- CI evidence freshness guard: `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_GUARD_IMPLEMENTATION.md`
- Command center evidence freshness guard:
  `docs/operations/GATE0_COMMAND_CENTER_EVIDENCE_FRESHNESS_GUARD.md`
- Command center rendered evidence contract:
  `docs/operations/GATE0_COMMAND_CENTER_RENDERED_EVIDENCE_CONTRACT.md`
- Skill governance review: `docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md`
- Skill library intake policy: `docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md`
- Skill routing matrix: `docs/operations/GATE0_SKILL_ROUTING_MATRIX.md`
- Skill routing guard: `docs/operations/GATE0_SKILL_ROUTING_GUARD.md`
- GitHub Actions runtime upgrade: `docs/operations/GATE0_GITHUB_ACTIONS_NODE24_ACTION_UPGRADE.md`
- Guard suite command consolidation: `docs/operations/GATE0_GUARD_SUITE_COMMAND_CONSOLIDATION.md`
- Name check coverage audit: `docs/operations/GATE0_NAME_CHECK_COVERAGE_AUDIT.md`
- Gate 1 contract guard: `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md`
- Source packet: `ops/assignments/TRD-063_GATE0_VALIDATION_COMMAND_AUDIT.md`
- Reviews: `ops/runtime/reviews/TRD-063_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-063_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-063_ORCHESTRATOR_ACCEPTANCE.md`
