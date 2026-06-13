# Gate 1 Reproducibility Check Plan

## Purpose

This plan defines the future reproducibility checks required before a historical backtest can be
used as evidence.

It is non-authorizing. It does not implement a runner, fetch data, generate metrics, publish
reports, approve strategies, or make performance claims.

## Required Future Inputs

- Strategy version id.
- Historical data snapshot id.
- Fees and slippage assumption id.
- Backtest engine version.
- Input hash.
- Expected output hash.
- Rerun output hash.
- Environment label.

## Required Future Checks

- Same inputs produce the same output hash.
- Mismatched hashes produce a blocked reproducibility status.
- Missing input hashes block evidence use.
- Environment labels are explicit.
- Reproducibility status is recorded separately from performance metrics.

## Blocked Use

Non-reproducible backtests cannot be used for strategy promotion, readiness claims, performance
claims, paper-trading requests, or live-trading requests.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Gate 1 criteria: `docs/operations/GATE1_ENTRY_CRITERIA_DEFINITION.md`
- Contract assignment packet:
  `docs/operations/GATE1_HISTORICAL_BACKTEST_CONTRACT_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-152_GATE1_REPRODUCIBILITY_CHECK_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-152_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-152_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-152_ORCHESTRATOR_ACCEPTANCE.md`
