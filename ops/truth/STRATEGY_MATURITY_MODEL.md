# Strategy Maturity Model

## Level 0 — Idea

Strategy exists only as a hypothesis.

Allowed:

- discussion
- pseudocode
- rough research notes

Blocked:

- backtest claims
- paper trading
- live trading

## Level 1 — Implemented Research Strategy

Strategy is coded and unit-tested.

Requirements:

- deterministic rules
- strategy interface compliance
- no broker access
- unit tests for signal logic

## Level 2 — Backtested Strategy

Strategy has reproducible backtests.

Requirements:

- historical data source recorded
- fees included
- slippage included
- trade list stored
- metrics stored
- no lookahead bias detected

## Level 3 — Risk-Reviewed Strategy

Risk Officer has reviewed failure modes.

Requirements:

- max drawdown visible
- position sizing documented
- failure conditions documented
- rejection criteria documented

## Level 4 — Paper-Trading Candidate

Strategy may run in paper trading.

Requirements:

- PM approval
- Risk approval
- QA/Security approval
- environment separation
- monitoring enabled

## Level 5 — Supervised Live Candidate

Strategy may suggest or request real trades, but human approval is required.

Requirements:

- paper evidence
- broker adapter tested
- kill switch tested
- execution reconciliation tested

## Level 6 — Limited Live Automation

Strategy may place small live trades under fixed limits.

This is not allowed until the system has extensive evidence and explicit human approval.
