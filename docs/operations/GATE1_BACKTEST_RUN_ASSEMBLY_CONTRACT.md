# Gate 1 Backtest Run Assembly Contract

## Purpose

Record the schema-only contract that assembles a Gate 1 backtest evidence run from its required
parts.

## Required Parts

- Strategy version.
- Historical data snapshot.
- Fees and slippage assumption.
- Immutable backtest record.
- Backtest result.
- PnL evidence bundle.
- Assumption risk register.
- Reproducibility check.

## Boundary

The assembly is evidence-only and requires checked status. It cannot approve a strategy, create an
execution path, or make performance claims.

## Source Links

- Source packet: `ops/assignments/TRD-295_BACKTEST_RUN_ASSEMBLY_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-295_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-295_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-295_ORCHESTRATOR_ACCEPTANCE.md`
