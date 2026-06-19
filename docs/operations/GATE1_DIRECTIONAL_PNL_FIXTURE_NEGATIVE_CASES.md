# Gate 1 Directional PnL Fixture Negative Cases

## Purpose

Record negative fixture coverage for directional PnL evidence.

## Coverage

- Wrong bid/ask side by trade direction.
- Gross quote-currency PnL mismatch.
- Net account-currency PnL mismatch.
- Evidence-only and claim-boundary rejection.

## Validation

`packages/contracts/tests/gate1-historical-backtest-contracts.test.ts` covers the negative cases.

## Boundary

Schema validation only. No backtest engine, strategy recommendation, external account connection,
order route, or performance claim is added.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-272_DIRECTIONAL_PNL_FIXTURE_NEGATIVE_CASES.md`
- Reviews: `ops/runtime/reviews/TRD-272_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-272_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-272_ORCHESTRATOR_ACCEPTANCE.md`
