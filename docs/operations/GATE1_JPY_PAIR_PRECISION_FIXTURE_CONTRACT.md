# Gate 1 JPY Pair Precision Fixture Contract

## Purpose

Record the synthetic JPY-pair precision fixture.

## Fixture

- Source: `packages/fixtures/src/gate1-historical-backtest-fixtures.ts`
- Fixture: `gate1JpyPrecisionDirectionalPnlFixture`
- Instrument: `USDJPY`
- Quote currency: `JPY`
- Account currency: `USD`

## Boundary

The fixture prevents forex-major decimal assumptions from leaking into evidence checks. It does not
add execution, account access, or strategy claims.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-276_JPY_PAIR_PRECISION_FIXTURE_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-276_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-276_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-276_ORCHESTRATOR_ACCEPTANCE.md`
