# TRD-313 Metric Report Guard Index Recheck

## Goal

Recheck that Gate 1 metric report evidence schemas, fixtures, tests, docs, and source links remain
indexed by the local Gate 1 contract guard.

## Acceptance Criteria

- Metric report evidence remains evidence-only and limitation-backed.
- Guard indexing covers the metric report evidence contract and negative tests.
- `pnpm check:gate1-contracts` and `pnpm verify:gate0` pass.
