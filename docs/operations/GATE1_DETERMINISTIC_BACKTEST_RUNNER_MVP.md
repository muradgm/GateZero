# Gate 1 Deterministic Historical Backtest Runner MVP

## Purpose

TRD-757 closes the gap between TraderFrame's historical backtest contracts and executable research
evidence. It adds one reference runner, not a general strategy engine.

TraderFrame remains at `G2_PAPER_TRADING` with `paper_simulation_planning_only` authority. This
component operates inside the narrower `G1_BACKTESTING` and `historical_backtesting_only` boundary.

## Reference Method

- Input is a checked-in sequence of daily bid/ask OHLC candles.
- The strategy is one frozen, long-only moving-average crossover.
- A signal is calculated from closes through the prior completed candle.
- Entry and exit occur at the next candle open.
- Entry uses ask prices and exit uses bid prices.
- Commission and slippage are explicit structured inputs.
- A final open position is closed on the last available candle for deterministic evidence assembly.
- The runner permits at most one position and rejects notional above available equity.

## Reproducibility

Canonical serialization and SHA-256 hashes bind:

- the complete input
- candle content
- frozen strategy logic
- the complete output excluding its own hash

Re-running the same input must produce a deeply equal result. Integrity validation recalculates the
input and output hashes; stored-hash edits and payload edits fail closed.

## Browser Evidence

`apps/web/src/backtest-run-evidence.js` is generated from the validated fixture. The Strategy Review
Workspace displays identifiers, observation and trade counts, cost application, reproducibility,
hashes, and limitations.

Return percentages, win probability, trade attractiveness, recommendations, and execution controls
are intentionally absent. Metrics remain available only as local research evidence in the validated
runtime result.

## Limitations

- Synthetic checked-in candles are not real-market evidence.
- One strategy and one cadence are implemented.
- No corporate actions, financing, tax, liquidity model, partial fills, or intrabar execution model
  is represented.
- The result does not approve, rank, or promote a strategy.
- No network, provider, account, credential, broker, or order path exists.

## Validation

```text
pnpm check:backtest-evidence
pnpm typecheck
pnpm test:ci
pnpm verify:gate0
```

TRD-758 remains the next product packet: one local read-only Intelligence Brief MVP.
