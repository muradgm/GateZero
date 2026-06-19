# Gate 1 Cross-Currency Conversion Fixture Contract

## Purpose

Record the synthetic cross-currency PnL fixture.

## Fixture

- Source: `packages/fixtures/src/gate1-historical-backtest-fixtures.ts`
- Fixture: `gate1CrossCurrencyDirectionalPnlFixture`
- Instrument: `EURGBP`
- Quote currency: `GBP`
- Account currency: `USD`

## Boundary

The fixture is schema-only synthetic evidence. It is not market evidence, strategy approval, or
permission to trade.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-275_CROSS_CURRENCY_CONVERSION_FIXTURE_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-275_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-275_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-275_ORCHESTRATOR_ACCEPTANCE.md`
