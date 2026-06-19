# Gate 1 Bad Assumption Fixture Cases

## Purpose

Record synthetic bad-assumption fixture coverage for Gate 1 backtest evidence.

## Coverage

- Mid-price fill assumptions remain open risk.
- Cost omission remains open risk.
- Bad assumptions are represented as risk evidence, not approval.

## Boundary

This is local fixture coverage only. It does not run live data, connect to external accounts, place
orders, predict trade direction, or make strategy performance claims.

## Source Links

- Source packet: `ops/assignments/TRD-294_BAD_ASSUMPTION_FIXTURE_CASES.md`
- Reviews: `ops/runtime/reviews/TRD-294_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-294_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-294_ORCHESTRATOR_ACCEPTANCE.md`
