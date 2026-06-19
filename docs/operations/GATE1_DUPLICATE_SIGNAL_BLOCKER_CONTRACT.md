# Gate 1 Duplicate Signal Blocker Contract

## Purpose

Define a schema-only Gate 1 blocker proving that duplicate signal fingerprints block evidence use
until deduplicated.

## Contract Behavior

- `Gate1DuplicateSignalBlockerContractSchema` requires at least two duplicate signal references.
- `blocker_status` must be `blocked`.
- `evidence_usable` must be `false`.
- The contract remains local, evidence-only, and no-claim.

## Boundary

Duplicate signal blockers do not rank trades, predict direction, approve strategies, or create any
execution route.

## Source Links

- Source packet: `ops/assignments/TRD-317_DUPLICATE_SIGNAL_BLOCKER_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-317_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-317_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-317_ORCHESTRATOR_ACCEPTANCE.md`
