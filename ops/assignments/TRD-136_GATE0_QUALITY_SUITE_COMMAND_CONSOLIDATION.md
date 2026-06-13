# TRD-136: Gate 0 Quality Suite Command Consolidation

## Objective

Add a single local command that runs the Gate 0 guard suite and the standard quality checks required
for packet acceptance.

## Scope

Allowed:

- Add a `pnpm verify:gate0` package script.
- Keep the command as a wrapper over existing local checks.
- Document the command and update operator indexes.
- Update tracker and review records.

Blocked:

- Trading guidance, broker integration, execution workflows, AI prediction, strategy performance
  claims, readiness claims, product launch claims, external publishing, or risk-gate changes.

## Required Output

- `package.json`
- `docs/operations/GATE0_QUALITY_SUITE_COMMAND_CONSOLIDATION.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.
- Updated tracker and documentation indexes.

## Acceptance Criteria

- `pnpm verify:gate0` runs `pnpm check:gate0`, `pnpm lint`, `pnpm format:check`, `pnpm typecheck`,
  and `pnpm test`.
- The command does not run external services or add product behavior.
- Gate 0 validation remains passing.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
