# TRD-271 Directional PnL Fixtures

## Goal

Add reusable synthetic long and short directional PnL fixtures for the Gate 1 schema-only PnL
contract.

## Allowed Scope

- Add parsed synthetic long and short PnL fixtures.
- Validate fixtures against `Gate1DirectionalPnlContractSchema`.
- Extend fixture tests for direction, bid/ask side, and net PnL values.
- Extend Gate 1 contract guard fixture coverage.
- Update tracker, docs, and command-center metadata.

## Blocked Scope

- Backtest engine implementation.
- Broker integration.
- Paper or live execution.
- Order placement or order lifecycle modeling.
- Credential handling.
- AI buy/sell prediction.
- Strategy approval, readiness, profitability, or performance claims.

## Acceptance Criteria

- Long and short directional PnL fixtures parse successfully.
- Fixture tests pass.
- Gate 1 contract guard passes.
- Full local verification passes.
- Gate remains `G1_BACKTESTING`.
- Scope remains `historical_backtesting_only`.

## Next Packet

`TRD-272 Directional PnL Fixture Negative Cases`.
