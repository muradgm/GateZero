# Gate 1 Directional PnL Guard Indexing Hardening

## Purpose

Record guard indexing hardening for the directional PnL schema and fixtures.

## Indexed Coverage

- `Gate1DirectionalPnlContractSchema`
- `gate1LongDirectionalPnlFixture`
- `gate1ShortDirectionalPnlFixture`
- `gate1CrossCurrencyDirectionalPnlFixture`
- `gate1JpyPrecisionDirectionalPnlFixture`
- `gate1PnlEvidenceReferenceFixture`
- `gate1PnlEvidenceBundleFixture`

## Boundary

The guard checks local source, docs, and fixture integrity only. It does not run market logic,
approve strategies, publish results, or add execution paths.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Guard source: `scripts/check-gate1-contracts.ts`
- Source packet: `ops/assignments/TRD-273_DIRECTIONAL_PNL_GUARD_INDEXING_HARDENING.md`
- Reviews: `ops/runtime/reviews/TRD-273_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-273_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-273_ORCHESTRATOR_ACCEPTANCE.md`
