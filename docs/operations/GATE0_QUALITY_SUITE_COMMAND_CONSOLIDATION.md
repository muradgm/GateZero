# Gate 0 Quality Suite Command Consolidation

## Purpose

This record documents the consolidated local Gate 0 verification command.

It is an operator ergonomics improvement only. It does not authorize trading, broker integration,
autonomous execution, AI prediction, product expansion, external publishing, later-phase movement,
or risk-gate loosening.

## Command

```powershell
pnpm verify:gate0
```

## Included Checks

The command runs:

- `pnpm check:gate0`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`

## Boundary

The command is local and deterministic. It does not call external services, handle broker secrets,
place orders, publish reports, approve strategies, score readiness, or change risk gates.

## Operator Use

Use this command before ORCHESTRATOR acceptance when a packet changes source code, tests,
documentation indexes, tracker state, review records, or Gate 0 guard behavior.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-136_GATE0_QUALITY_SUITE_COMMAND_CONSOLIDATION.md`
- Reviews: `ops/runtime/reviews/TRD-136_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-136_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-136_ORCHESTRATOR_ACCEPTANCE.md`
- Command source: `package.json`
