# TRD-316 Stale Data Blocker Contract

## Goal

Add a Gate 1 schema-only contract and fixture proving that stale historical data snapshots cannot
become usable evidence.

## Acceptance Criteria

- Stale data blockers require blocked evidence state and freshness rationale.
- Attempts to mark stale data evidence usable fail validation.
- No execution, account, prediction, or approval scope is added.
- `pnpm check:gate1-contracts` and `pnpm verify:gate0` pass.
