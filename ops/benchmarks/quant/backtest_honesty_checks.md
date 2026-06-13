# Quant Benchmark — Backtest Honesty

A backtest is unacceptable if it:

- omits fees
- omits slippage
- uses future data
- changes strategy rules after seeing results without recording a new version
- hides losing trades
- reports return without drawdown
- reports win rate without average win/loss
- uses unrealistic fills
- cherry-picks only favorable periods

Required outputs:

- trade list
- equity curve data
- drawdown curve data
- metric summary
- data source metadata
- strategy version
- verdict
