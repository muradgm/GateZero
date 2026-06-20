# Gate 1 Evidence Blocker Aggregate Guard

The Gate 1 contract guard now validates blocked-evidence fixtures as one required aggregate.

## Guard Rules

- The evidence-bundle summary must reference missing-candle, stale-data, duplicate-signal, and
  parameter-immutability blockers.
- All referenced blocker fixtures must remain `evidence_usable: false`.
- The summary must remain blocked with no approval claim, no performance claim, and no execution
  path.

## Validation

- `pnpm check:gate1-contracts`
- Focused fixture tests for aggregate reference drift.
- Full `pnpm verify:gate0` before acceptance.

## Source Links

- Source packet: `ops/assignments/TRD-325_EVIDENCE_BLOCKER_AGGREGATE_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-325_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-325_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-325_ORCHESTRATOR_ACCEPTANCE.md`
