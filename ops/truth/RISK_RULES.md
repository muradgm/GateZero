# Risk Rules

This file outranks normal product preference.

If PM says useful, Quant says promising, Frontend says clean, Backend says working, and Risk says
unsafe, the task is blocked.

## Absolute prohibitions in early phases

- No real broker orders.
- No leverage.
- No options.
- No margin.
- No auto-changing risk limits.
- No strategy self-promotion.
- No AI-generated live buy/sell decisions.
- No hidden execution path.
- No frontend access to broker secrets.

## Required risk controls before any paper trading

- max position size
- max daily loss
- max weekly loss
- max drawdown threshold
- max open positions
- stale data check
- duplicate signal check
- strategy version lock
- immutable run record
- paper/live environment separation

## Required controls before any live trading

- human approval mode
- kill switch
- broker adapter test coverage
- order idempotency
- partial-fill handling
- rejected-order handling
- disconnected-broker handling
- market-closed handling
- post-order reconciliation
- alerting for every order event
- readonly emergency mode

## Default personal-risk starting limits

These are placeholders, not financial advice:

- risk per trade: <= 0.25% of allocated trading capital
- max daily loss: <= 1.0%
- max weekly loss: <= 3.0%
- max strategy drawdown before review: <= 5.0%
- max leverage: 1x
- max open positions: 3

The operator may adjust these only through explicit risk review.
