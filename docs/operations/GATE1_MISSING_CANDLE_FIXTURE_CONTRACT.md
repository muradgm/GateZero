# Gate 1 Missing Candle Fixture Contract

## Purpose

Define a schema-only Gate 1 fixture proving that missing historical candles block evidence use.

## Contract Behavior

- `Gate1MissingCandleBadDataFixtureContractSchema` requires `G1_BACKTESTING`.
- Scope is `historical_backtesting_only`.
- `blocker_status` must be `blocked`.
- `evidence_usable` must be `false`.
- Approval, performance, external access, and execution paths are impossible.

## Boundary

This contract is a local historical-data quality blocker. It does not fetch data, connect to a
broker, place orders, recommend trades, or approve strategy quality.

## Source Links

- Source packet: `ops/assignments/TRD-315_MISSING_CANDLE_FIXTURE_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-315_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-315_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-315_ORCHESTRATOR_ACCEPTANCE.md`
