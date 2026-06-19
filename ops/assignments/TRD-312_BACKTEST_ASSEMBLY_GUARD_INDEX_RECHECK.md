# TRD-312 Backtest Assembly Guard Index Recheck

## Goal

Recheck that Gate 1 backtest run assembly schemas, fixtures, tests, docs, and source links remain
indexed by the local Gate 1 contract guard.

## Acceptance Criteria

- Guard indexing includes the assembly source, docs, and tests.
- No execution, approval, readiness, or performance-claim semantics are introduced.
- `pnpm check:gate1-contracts` and `pnpm verify:gate0` pass.
