# TRD-265 Gate 1 Operating Gate Model Activation

## Goal

Activate the current operating model as `G1_BACKTESTING` with `historical_backtesting_only` scope.

## Allowed Scope

- Update current gate/scope constants and contract tests.
- Update Gate 1 historical backtest contract literals and fixtures.
- Update Gate 1 contract guard expectations.
- Update read-only command-center gate display.
- Update progress snapshot gate/scope rendering.
- Add operating record and acceptance reviews.

## Blocked Scope

- Broker integration.
- Paper or live execution.
- Real or simulated order placement.
- Autonomous execution.
- AI buy/sell prediction.
- Credentials or account identifiers.
- Strategy approval, readiness, promotion, profitability, or performance claims.
- External publishing.
- Risk-gate loosening.

## Acceptance Criteria

- Current gate is `G1_BACKTESTING`.
- Current scope is `historical_backtesting_only`.
- Gate 1 contracts require no external access and no execution path.
- Gate 1 backtest results remain evidence-only and reject approval/performance claims.
- Command center remains read-only.
- Full local verification passes.

## Next Packet

`TRD-266 Stable CI Test Command`.
