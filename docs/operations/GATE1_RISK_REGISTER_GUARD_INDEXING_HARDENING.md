# Gate 1 Risk Register Guard Indexing Hardening

## Purpose

Require the Gate 1 contract guard to index backtest assumption risk-register negative cases.

## Guard Requirements

- The guard must require the risk-register source document.
- The guard must require the risk-register negative-case document.
- The guard must require the guard-hardening document.
- The guard must verify the contract test file contains risk-register negative-case tests.
- The guard must fail closed when any indexed risk-register negative test is missing.

## Boundary

This is local validation hardening only. It does not run backtests, approve strategies, predict
trade direction, connect to external accounts, or create an execution path.

## Source Links

- Source packet: `ops/assignments/TRD-293_RISK_REGISTER_GUARD_INDEXING_HARDENING.md`
- Reviews: `ops/runtime/reviews/TRD-293_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-293_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-293_ORCHESTRATOR_ACCEPTANCE.md`
