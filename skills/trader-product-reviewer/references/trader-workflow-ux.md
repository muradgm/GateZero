# Trader Workflow UX Reference

Use this reference when reviewing trader workflows, chart ergonomics, action flows, decision
clarity, and live-session usability.

## Contents

- Trader Personas
- Primary Workflows
- Trust Signals
- Decision Hierarchy
- Chart And Data UX
- Order Ticket UX
- Workflow Friction Checklist

## Trader Personas

Identify the likely user:

- **Discretionary intraday trader**: Needs speed, chart clarity, hotkeys, alerts, and fast order
  modification.
- **Swing trader**: Needs planning, watchlists, multi-timeframe context, alerts, and portfolio
  exposure.
- **Systematic trader**: Needs strategy state, reproducibility, logs, backtests, and monitoring.
- **Beginner trader**: Needs safer defaults, clearer labels, warnings, and educational framing.
- **Risk manager**: Needs exposure, drawdown, account state, concentration, and auditability.

Do not judge all trading UIs by the same density. Intraday tools can be denser than beginner
planning tools.

## Primary Workflows

Map the app against the workflows it claims to support:

1. Scan markets.
2. Select symbol.
3. Analyze chart or signal.
4. Plan trade.
5. Size position.
6. Submit order.
7. Monitor open position.
8. Modify stop or target.
9. Exit trade.
10. Journal and review.

For each workflow, check whether the trader can answer:

- What symbol am I acting on?
- Is this live, demo, delayed, simulated, or historical?
- What is the current bid/ask/spread?
- What is my position or planned position?
- What is my risk if I am wrong?
- What will happen if I click this action?
- Has the broker accepted, rejected, filled, or canceled the order?

## Trust Signals

A trader-facing UI should surface:

- Data source
- Broker/account connection status
- Live, demo, paper, delayed, simulated, or backtest mode
- Last quote timestamp
- Market open/closed/session state
- Spread
- Order status
- Sync or reconnect status
- Calculation assumptions when relevant

Trust-killing patterns:

- No timestamps on prices or signals.
- Same visual treatment for live and simulated data.
- Filled state shown before broker confirmation.
- Signal cards with no explanation or invalidation condition.
- Backtest metrics shown without costs, date range, trade count, or assumptions.

## Decision Hierarchy

The interface should prioritize:

1. Current symbol and mode.
2. Price, spread, and freshness.
3. Position or planned trade.
4. Risk, stop, size, exposure, and margin.
5. Entry, target, reward, and potential profit.
6. Supporting analysis, indicators, notes, and news.

Potential profit should not visually dominate risk. Active risk should remain visible while
planning, entering, and monitoring trades.

## Chart And Data UX

Check:

- Timeframe switching is fast and predictable.
- Current candle is distinguishable from closed candles when relevant.
- Price scale and time scale are readable.
- Crosshair, order lines, stops, targets, and annotations are precise.
- Indicators do not crowd the chart.
- Open positions and pending orders are visually distinct.
- Empty, loading, stale, and error states do not look like valid data.
- Important labels fit at small widths and do not overlap candles or actions.

For multi-timeframe tools, the UI should make the active timeframe and signal timeframe
unmistakable.

## Order Ticket UX

If the app includes order entry, verify:

- Symbol, direction, account, and mode are visible.
- Buy and sell states are unmistakable.
- Quantity, lot size, risk, stop, target, margin, and estimated costs update together.
- Invalid values are blocked before submission.
- Dangerous changes require confirmation.
- Duplicate submission is prevented.
- Rejected orders are shown clearly with recovery guidance.
- Modifying and canceling orders has clear state feedback.

Critical issue: a trader can submit an order without noticing wrong symbol, wrong side, wrong
account, wrong lot size, missing stop, or live-vs-demo mismatch.

## Workflow Friction Checklist

- Count clicks from signal to planned trade.
- Count clicks from open position to stop modification.
- Check whether the trader must mentally calculate risk.
- Check whether important values live on different screens.
- Check whether warnings appear before the action.
- Check whether the app remains usable during fast price updates.
- Check whether mobile layouts hide critical risk context.
- Check whether keyboard shortcuts or fast actions are safe and discoverable if present.
