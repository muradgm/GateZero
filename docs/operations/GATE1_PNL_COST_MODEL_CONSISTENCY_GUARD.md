# Gate 1 PnL Cost Model Consistency Guard

## Purpose

Record declared-cost consistency coverage for PnL evidence.

## Guarded Rule

Net account-currency PnL must equal gross account-currency PnL minus total declared account-currency
costs.

## Implementation

- Schema validation: `Gate1DirectionalPnlContractSchema`
- Bundle status: `declared_cost_consistency_status`
- Rejection: PnL evidence bundles fail unless cost consistency is `checked`.

## Boundary

This is arithmetic evidence validation only. It does not model future fills, account state,
execution, or strategy quality.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-277_PNL_COST_MODEL_CONSISTENCY_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-277_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-277_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-277_ORCHESTRATOR_ACCEPTANCE.md`
