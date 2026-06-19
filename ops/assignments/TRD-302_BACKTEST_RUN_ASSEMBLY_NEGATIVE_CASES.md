# TRD-302 Backtest Run Assembly Negative Cases

## Goal

Add negative validation coverage for Gate 1 backtest run assemblies.

## Acceptance Criteria

- Unchecked assemblies fail validation.
- Claim flags fail validation.
- Wrong scope and missing evidence references fail validation.
- Gate remains `G1_BACKTESTING`.
