# TRD-135: Gate 0 Guard Suite Command Consolidation

## Objective

Add a single local command that runs the existing Gate 0 guard checks together.

## Scope

Allowed:

- Add a `pnpm check:gate0` package script.
- Keep the command as a wrapper over existing local guards.
- Document the command and update operator indexes.
- Update tracker and review records.

Blocked:

- Trading guidance, broker integration, execution workflows, AI prediction, strategy performance
  claims, readiness claims, product launch claims, external publishing, or risk-gate changes.

## Required Output

- `package.json`
- `docs/operations/GATE0_GUARD_SUITE_COMMAND_CONSOLIDATION.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.
- Updated tracker and documentation indexes.

## Acceptance Criteria

- `pnpm check:gate0` refreshes the local progress snapshot and runs the local Gate 0 docs,
  tracklist, snapshot, name, evidence-index, review, and blocked-scope checks.
- The command does not run external services or add product behavior.
- Gate 0 validation remains passing.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
