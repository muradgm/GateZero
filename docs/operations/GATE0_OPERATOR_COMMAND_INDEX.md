# Gate 0 Operator Command Index

## Purpose

This index lists the current local operator commands for GateZero Gate 0 work.

It is a reference only. It does not change strategy state, risk state, maturity state, operator
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

All commands in this index are local commands. Do not use command success as strategy approval,
readiness review, performance evidence, profitability evidence, deployment approval, or future-phase
eligibility.

## Inspect Commands

| Command                                             | Purpose                                    | Expected local result                                          |
| --------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| `pnpm inspect:gate0-dry-run`                        | Inspect default clear dry-run scenario.    | Redacted JSON with `inspect_status: clear`.                    |
| `pnpm inspect:gate0-dry-run -- --help`              | Print inspect command help.                | Usage text with static scenario keys and Gate 0 boundary.      |
| `pnpm inspect:gate0-dry-run -- -h`                  | Print inspect command help alias.          | Usage text with static scenario keys and Gate 0 boundary.      |
| `pnpm inspect:gate0-dry-run -- --scenario friction` | Inspect blocked-friction dry-run scenario. | Redacted JSON with `inspect_status: friction_found`.           |
| `pnpm inspect:gate0-dry-run -- --scenario other`    | Verify invalid scenario handling.          | Nonzero exit with bounded local usage text and no stack trace. |

## Operating Record Commands

| Command                                  | Purpose                                      | Expected local result                             |
| ---------------------------------------- | -------------------------------------------- | ------------------------------------------------- |
| `pnpm snapshot:gate0-progress`           | Write the local progress snapshot.           | Markdown snapshot under `ops/runtime/progress/`.  |
| `pnpm check:gate0-evidence-index`        | Check evidence-index drift.                  | Local evidence-index drift check passes.          |
| `pnpm check:gate0-name`                  | Check GateZero project-name consistency.     | Local project-name check passes.                  |
| `pnpm check:gate0-docs-coverage`         | Check operator docs coverage drift.          | Local docs coverage check passes.                 |
| `pnpm check:gate0-snapshot`              | Check generated progress snapshot freshness. | Snapshot latest packet and record counts align.   |
| `pnpm check:gate0-tracklist`             | Check accepted packet ledger alignment.      | Accepted records and tracklist ledger rows align. |
| `pnpm check:gate0-reviews`               | Check assignment and review-record coverage. | Assignment and review record counts align.        |
| `pnpm check:gate0-agents`                | Check agent manifest and reference drift.    | Local agent manifest guard passes.                |
| `pnpm check:repo-hygiene`                | Check repository hygiene drift.              | Local repository hygiene guard passes.            |
| `pnpm check:gate0-ci-evidence`           | Check remote CI evidence freshness.          | Manual CI evidence freshness guard passes.        |
| `pnpm check:gate0-command-center`        | Check command center evidence freshness.     | Local command center freshness guard passes.      |
| `pnpm check:gate0-command-center-render` | Check command center render contract.        | Local render contract check passes.               |
| `pnpm check:gate0-skills`                | Check project skill governance.              | Local skill governance guard passes.              |
| `pnpm check:gate1-contracts`             | Check Gate 1 contract control records.       | Local Gate 1 contract guard passes.               |
| `pnpm check:gate0`                       | Run the local Gate 0 guard suite.            | Gate 0 guard suite passes.                        |
| `pnpm verify:gate0`                      | Run Gate 0 guards and quality checks.        | Full local verification passes.                   |

## Quality Commands

| Command               | Purpose                                         | Expected local result     |
| --------------------- | ----------------------------------------------- | ------------------------- |
| `pnpm lint`           | Run static lint checks.                         | Lint passes.              |
| `pnpm format:check`   | Check Prettier formatting for configured files. | Format check passes.      |
| `pnpm typecheck`      | Run TypeScript type checking.                   | Typecheck passes.         |
| `pnpm test`           | Run the test suite.                             | All tests pass.           |
| `pnpm validate:gate0` | Scan for blocked Gate 0 scope terms.            | Gate 0 validation passes. |

## Recommended Local Sequence

Run this sequence before recording ORCHESTRATOR acceptance for a packet that changes local command,
tracker, or docs behavior:

```powershell
pnpm verify:gate0
```

Add inspect commands when the packet changes inspect behavior, fixtures, or operator review docs.

## Escalation

Escalate to QA_SECURITY if any command introduces external access, credential handling, raw payload
leakage, UI/API surface, report publishing, or stack traces for invalid input.

Escalate to RISK if any command or document implies approval, readiness, profitability, performance,
gate movement, risk limit changes, strategy state changes, or later-phase eligibility.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-060_GATE0_OPERATOR_COMMAND_INDEX.md`
- Reviews: `ops/runtime/reviews/TRD-060_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-060_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-060_ORCHESTRATOR_ACCEPTANCE.md`
- Command sources: `package.json`, `scripts/inspect-gate0-dry-run.ts`,
  `scripts/generate-gate0-progress-snapshot.ts`, `scripts/check-gate0-project-name.ts`,
  `scripts/check-gate0-docs-coverage.ts`, `scripts/check-gate0-evidence-index-drift.ts`,
  `scripts/check-gate0-progress-snapshot-freshness.ts`,
  `scripts/check-gate0-tracklist-consistency.ts`, `scripts/check-gate0-review-coverage.ts`,
  `scripts/check-gate0-agent-manifest.ts`, `scripts/check-repo-hygiene.ts`,
  `scripts/check-gate0-ci-evidence-freshness.ts`, `scripts/check-gate0-command-center-freshness.ts`,
  `scripts/check-gate0-command-center-render-contract.ts`, `scripts/check-gate1-contracts.ts`,
  `scripts/check-gate0-skill-governance.ts`, `scripts/validate-gate0.ts`
- Validation command audit: `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`
- Command index coverage check: `docs/operations/GATE0_COMMAND_INDEX_COVERAGE_CHECK.md`
