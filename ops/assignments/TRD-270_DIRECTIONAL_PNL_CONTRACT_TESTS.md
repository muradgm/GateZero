# TRD-270 Directional PnL Contract Tests

## Goal

Add focused regression tests for the Gate 1 schema-only directional PnL contract.

## Allowed Scope

- Test valid long and short directional PnL evidence.
- Test wrong bid/ask side rejection.
- Test gross and net math mismatch rejection.
- Test evidence-only and claim-boundary rejection.
- Update tracker, docs, and command-center metadata.

## Blocked Scope

- Backtest engine implementation.
- Trade execution.
- Broker connection.
- Credential handling.
- Strategy recommendation or approval.
- Profitability or performance claims.

## Acceptance Criteria

- Focused directional PnL tests pass.
- Gate 1 contract guard passes.
- Full local verification passes.
- Gate remains `G1_BACKTESTING`.
- Scope remains `historical_backtesting_only`.

## Next Packet

`TRD-271 Directional PnL Fixture Coverage`.
