# Financial Risk Gates

## Gate 0 — Research Only

No broker access. No paper orders. No live orders.

Allowed:

- strategy design
- data ingestion
- backtest design
- dashboard design

## Gate 1 — Backtesting

Strategy may run on historical data only.

Required:

- deterministic strategy version
- reproducible data input
- fees and slippage model
- immutable backtest record

## Gate 2 — Paper Trading

Strategy may place simulated orders only.

Required approvals:

- PM
- Quant
- Risk
- QA/Security

## Gate 3 — Supervised Live Trading

Strategy may prepare real orders, but human approval is required before execution.

Required:

- live broker adapter reviewed
- kill switch tested
- order reconciliation tested
- alerting tested
- small capital only

## Gate 4 — Limited Live Automation

Strategy may place real orders under strict fixed limits.

This gate is forbidden by default and requires explicit human approval.

## Gate 5 — Frozen

Triggered by:

- duplicate order risk
- unexplained position mismatch
- max loss breach
- stale data execution
- broker disconnect during active order flow
- strategy behavior not matching backtest logic
- QA critical failure
- Risk Officer veto

Frozen means:

- no new execution
- only diagnosis, rollback, test repair, or risk cleanup allowed

## Non-promotion rule

No agent can promote its own lane to a higher financial gate.
