# Gate 1 Stale Data Blocker Contract

## Purpose

Define a schema-only Gate 1 blocker proving that stale historical snapshots cannot become usable
evidence.

## Contract Behavior

- `Gate1StaleDataBlockerContractSchema` requires `G1_BACKTESTING`.
- Scope is `historical_backtesting_only`.
- A stale reason and max-age policy are required.
- `blocker_status` must be `blocked`.
- `evidence_usable` must be `false`.

## Boundary

This contract is local validation evidence only. It does not create live data access, broker access,
paper execution, readiness labels, or strategy approval.

## Source Links

- Source packet: `ops/assignments/TRD-316_STALE_DATA_BLOCKER_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-316_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-316_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-316_ORCHESTRATOR_ACCEPTANCE.md`
