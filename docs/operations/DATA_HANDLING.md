# Data Handling

## Purpose

This document defines how GateZero handles market data, strategy data, backtest results, risk
reviews, and learning events.

## Data Classes

| Class           | Examples                         | Rule                                            |
| --------------- | -------------------------------- | ----------------------------------------------- |
| Market data     | candles, prices, volumes         | Store source, timestamp, timezone, adjustments. |
| Strategy config | parameters, version, rules       | Immutable per backtest run.                     |
| Backtest result | metrics, trades, equity curve    | Reproducible and linked to data snapshot.       |
| Risk review     | vetoes, warnings, limits         | Cannot be overwritten silently.                 |
| Learning event  | mistakes, overrides, postmortems | Must be reviewed before becoming a rule.        |
| Secrets         | API keys, broker tokens          | Never stored in normal data tables or logs.     |

## Market Data Rules

Every market dataset must define:

- source
- symbol/universe
- timeframe
- timezone
- start and end date
- missing data behavior
- corporate action policy, if stocks are used
- whether data is adjusted or raw

## Backtest Data Rules

A backtest result is invalid unless it records:

- strategy version
- data snapshot reference
- fee model
- slippage model
- starting capital
- position sizing rule
- risk assumptions

## Learning Data Rules

Learning data must remain factual.

It may record:

- what happened
- what was expected
- what failed
- what was changed
- who approved the change

It may not automatically:

- loosen a risk rule
- promote a strategy
- change live execution behavior
- increase capital exposure

## Retention

Rejected strategies should not be deleted casually. They are useful evidence.

Mistake and postmortem records should be retained because repeated failures are part of the learning
system.
