# TRD-314 Operator Decision Guard Index Recheck

## Goal

Recheck that Gate 1 operator decision event schemas, fixtures, tests, docs, and source links remain
indexed by the local Gate 1 contract guard.

## Acceptance Criteria

- Operator decision records preserve operator authority and risk review.
- Guard indexing covers the operator decision event contract and negative tests.
- `pnpm check:gate1-contracts` and `pnpm verify:gate0` pass.
