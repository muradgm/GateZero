# Execution, Risk, And Backtesting Reference

Use this reference when reviewing order handling, broker integration, market data, simulation,
backtesting, and strategy correctness.

## Contents

- Order Lifecycle
- Broker Integration
- Market Data Integrity
- Strategy And Indicator Correctness
- Backtesting And Simulation Validity
- Reliability And Auditability
- Review Checklist

## Order Lifecycle

A trading app should model order states explicitly:

```text
draft -> submitted -> accepted/rejected -> partially_filled -> filled -> modified/canceled/expired -> closed
```

Check handling for:

- Market, limit, stop, and stop-limit orders
- Stop-loss and take-profit attachment
- One-cancels-other behavior
- Order modification
- Partial fills
- Rejections and error codes
- Expiration
- Duplicate submission prevention
- Reconnect and state reconciliation

High-risk bug: displaying an order as active, filled, or canceled based only on optimistic local
state without broker confirmation.

## Broker Integration

Broker-connected products should account for:

- API rate limits and retry behavior
- Idempotency or duplicate-order protection
- Server time vs. client time
- Symbol availability and session status
- Account mode: netting vs. hedging
- Trade permission changes
- Connection loss during order submission
- Reconciliation after reconnect
- Broker-side validation for stops, minimum distance, margin, and volume

Review whether secrets, tokens, and credentials are protected. Broker credentials and API keys must
not be exposed in client bundles, logs, analytics, screenshots, or error reports.

## Market Data Integrity

Check:

- Quote freshness and stale-data detection
- Bid/ask availability
- Candle construction rules
- Timezone and session alignment
- Missing candle handling
- Weekend gaps and holiday closures
- Duplicate ticks or out-of-order ticks
- Vendor symbol normalization
- Historical data revisions
- Data source clearly labeled in the UI

For multi-timeframe strategies, ensure higher-timeframe candles are only used after they close
unless live partial-candle behavior is intentional and labeled.

## Strategy And Indicator Correctness

Review:

- Indicator warmup periods
- Repainting indicators
- Candle-close vs. live-candle signal timing
- Multi-timeframe synchronization
- Duplicate signal prevention
- Position state persistence
- Entry and exit precedence
- Conflicting rules
- Strategy parameters recorded with results

Lookahead bias often appears when code uses a current candle's final high, low, or close before that
candle would have completed in real time.

## Backtesting And Simulation Validity

Backtests should define:

- Data source and timeframe
- Start and end date
- Timezone
- Spread model
- Commission model
- Swap or financing model
- Slippage model
- Fill model
- Position sizing model
- Margin model
- Out-of-sample period
- Randomness seed, if any

Common invalid assumptions:

- Filling entries, stops, and targets at impossible prices.
- Resolving same-candle stop and target in the favorable order.
- Ignoring spread in both entry and exit.
- Using current broker symbol metadata for historical periods without noting the limitation.
- Running optimization and reporting only the best parameter set.
- Reporting CAGR, Sharpe, max drawdown, and win rate without trade count and exposure.

## Reliability And Auditability

Trading systems need traceability:

- Persist order requests, broker responses, timestamps, and state changes.
- Log calculation inputs for position size, margin, and P/L.
- Keep an immutable trade history for broker-connected workflows.
- Separate user-facing errors from internal diagnostic logs.
- Provide recovery paths for reconnects, failed submissions, and stale local state.

## Review Checklist

- Can the app recover after a disconnect during order submission?
- Can a user accidentally submit the same order twice?
- Does local state reconcile with broker state?
- Are order triggers based on the correct side of bid/ask?
- Are rejected orders visible and explained?
- Is every backtest result reproducible from stored inputs?
- Does simulation model spread, commission, slippage, and swap?
- Are live, demo, delayed, and historical modes clearly separated?
- Are market-data timestamps visible and meaningful?
- Are dangerous assumptions documented in the UI or report?
