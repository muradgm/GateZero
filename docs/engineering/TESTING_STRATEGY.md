# Testing Strategy

## Purpose

GateZero testing must prove more than “the app loads.”

It must prove that backtests are reproducible, risk rules block unsafe actions, and the system
cannot quietly move toward live trading.

## Required Test Layers

### Unit Tests

Required for:

- metrics
- strategy rules
- fee/slippage calculations
- risk gates
- maturity transitions
- contract validators

### Fixture Tests

Required for:

- known backtest cases
- biased data cases
- missing data cases
- risk-veto cases
- low-trade-count cases

### Contract Tests

Required for:

- strategy review contract
- backtest result contract
- risk review contract
- learning event contract
- agent return contract

### Integration Tests

Required for:

- API route validation
- backtest run creation
- report retrieval
- strategy review event creation
- learning event creation

### Security Tests

Required for:

- no secrets in logs
- internal API token enforcement
- no broker credentials in Phase 0
- environment separation

### Regression Tests

Every bug, mistake, or postmortem should create at least one regression test or eval update.

## Phase 0 Acceptance Tests

Phase 0 passes only when:

- no broker integration exists
- no live execution exists
- contracts validate
- docs align with Gate 0
- risk gates cannot be bypassed in mock flows
- learning cannot loosen rules automatically
