# QUANT References

These references are required reading for this agent. They are curated to keep GateZero grounded in
evidence, risk control, reproducible engineering, and honest execution support.

## Reference policy

- Prefer official documentation, standards bodies, regulator advisories, and internal GateZero truth
  files.
- Do not use blog posts, influencer threads, vendor marketing, or social-media strategy claims as
  primary authority.
- If a reference conflicts with `ops/truth/RISK_RULES.md`, the stricter risk interpretation wins.
- References are for implementation guidance and review quality, not investment advice.

## Required references

### 1. GateZero Project Truth

- Type: `internal`
- URL/path: `../../truth/PROJECT_TRUTH.md`
- Use it for: Defines what the product is and is not; prevents bot/profit hype drift.

### 2. GateZero Product Wedge

- Type: `internal`
- URL/path: `../../truth/PRODUCT_WEDGE.md`
- Use it for: Locks the product promise: no trade without evidence, no execution without risk
  approval.

### 3. GateZero Risk Rules

- Type: `internal`
- URL/path: `../../truth/RISK_RULES.md`
- Use it for: Hard safety constraints that outrank feature appetite.

### 4. Financial Risk Gates

- Type: `internal`
- URL/path: `../../governance/FINANCIAL_RISK_GATES.md`
- Use it for: Defines the allowed autonomy level and promotion/rollback path.

### 5. QuantConnect LEAN Engine Docs

- Type: `trading-engine`
- URL/path: `https://www.quantconnect.com/docs/v2/lean-engine/getting-started`
- Use it for: Professional reference for research/backtesting/live boundaries and algorithm
  lifecycle.

### 6. Backtrader Documentation

- Type: `backtesting-framework`
- URL/path: `https://www.backtrader.com/docu/`
- Use it for: Strategy, indicator, analyzer, and backtest implementation patterns.

### 7. vectorbt Documentation

- Type: `backtesting-framework`
- URL/path: `https://vectorbt.dev/`
- Use it for: Fast vectorized strategy research using pandas/NumPy objects.

### 8. pandas Time Series User Guide

- Type: `data-analysis`
- URL/path: `https://pandas.pydata.org/docs/user_guide/timeseries.html`
- Use it for: Time-index handling, resampling, timezone/date functionality for market data.

### 9. scikit-learn TimeSeriesSplit

- Type: `model-validation`
- URL/path:
  `https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html`
- Use it for: Time-ordered cross-validation reference; helps avoid training on future data.

### 10. PyPortfolioOpt Documentation

- Type: `portfolio-optimization`
- URL/path: `https://pyportfolioopt.readthedocs.io/`
- Use it for: Reference for portfolio optimization, covariance, efficient frontier,
  HRP/Black-Litterman ideas.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.

## GateZero Adapted Internal Docs

- `docs/engineering/QUALIFICATION_BENCHMARK.md`
- `docs/engineering/TESTING_STRATEGY.md`
