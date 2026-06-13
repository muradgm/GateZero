# Gate 1 Fixture Boundary Plan

## Purpose

This plan defines fixture boundaries for future Gate 1 historical backtest contract tests.

It is non-authorizing. It does not add real market data, fetch external data, implement strategy
signals, run backtests, or make performance claims.

## Fixture Rules

- Fixtures must be synthetic or explicitly source-labeled.
- Fixture time ranges must be short, deterministic, and documented.
- Fixtures must not be presented as market evidence.
- Fixtures must not include broker data or broker secrets.
- Fixtures must include expected valid and invalid examples.

## Required Future Fixture Types

- Historical data snapshot fixture.
- Strategy version fixture.
- Fees and slippage assumption fixture.
- Immutable backtest record fixture.
- Backtest result fixture.
- Reproducibility mismatch fixture.

## Blocked Use

Fixtures cannot be used for strategy claims, profitability interpretation, production reporting,
paper-trading requests, or live-trading requests.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Gate 1 criteria: `docs/operations/GATE1_ENTRY_CRITERIA_DEFINITION.md`
- Contract assignment packet:
  `docs/operations/GATE1_HISTORICAL_BACKTEST_CONTRACT_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-153_GATE1_FIXTURE_BOUNDARY_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-153_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-153_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-153_ORCHESTRATOR_ACCEPTANCE.md`
