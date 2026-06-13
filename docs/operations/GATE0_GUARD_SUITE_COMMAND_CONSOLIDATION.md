# Gate 0 Guard Suite Command Consolidation

## Purpose

This record documents the consolidated local Gate 0 guard command.

It is an operator ergonomics improvement only. It does not authorize trading, broker integration,
autonomous execution, AI prediction, product expansion, external publishing, later-phase movement,
or risk-gate loosening.

## Command

```powershell
pnpm check:gate0
```

## Included Checks

The command runs:

- `pnpm snapshot:gate0-progress`
- `pnpm check:gate0-docs-coverage`
- `pnpm check:gate0-tracklist`
- `pnpm check:gate0-snapshot`
- `pnpm check:gate0-name`
- `pnpm check:gate0-evidence-index`
- `pnpm check:gate0-reviews`
- `pnpm validate:gate0`

## Boundary

The command is local and deterministic. It refreshes the local progress snapshot before checking
freshness. It does not call external services, handle broker secrets, place orders, publish reports,
approve strategies, score readiness, or change risk gates.

## Operator Use

Use this command for a quick Gate 0 guard sweep. Continue running `pnpm lint`, `pnpm format:check`,
`pnpm typecheck`, and `pnpm test` when a packet changes source code, tests, or formatting-sensitive
files.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-135_GATE0_GUARD_SUITE_COMMAND_CONSOLIDATION.md`
- Reviews: `ops/runtime/reviews/TRD-135_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-135_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-135_ORCHESTRATOR_ACCEPTANCE.md`
- Command source: `package.json`
