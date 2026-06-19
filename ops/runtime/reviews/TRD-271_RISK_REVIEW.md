# TRD-271 Risk Review

## Verdict

`accepted_for_orchestrator_review`

## Risk Assessment

Reusable long and short PnL fixtures reduce the risk of future Gate 1 tests drifting away from
correct bid/ask directionality. They do not change autonomy, execution authority, financial-risk
gates, or strategy maturity.

## Required Boundary

Synthetic PnL fixtures are not strategy evidence, profitability evidence, readiness evidence,
approval evidence, or permission to execute.

Gate remains `G1_BACKTESTING`.

Scope remains `historical_backtesting_only`.
