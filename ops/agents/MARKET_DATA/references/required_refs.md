# MARKET_DATA References

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

### 5. pandas Time Series User Guide

- Type: `data-analysis`
- URL/path: `https://pandas.pydata.org/docs/user_guide/timeseries.html`
- Use it for: Timestamp, resampling, missing data, and time-series transformations.

### 6. NumPy Documentation

- Type: `numerical-computing`
- URL/path: `https://numpy.org/doc/`
- Use it for: Base numerical operations, arrays, random generators, and reproducible computations.

### 7. QuantConnect Data Library Docs

- Type: `market-data`
- URL/path:
  `https://www.quantconnect.com/docs/v2/writing-algorithms/securities/asset-classes/us-equity/requesting-data`
- Use it for: Reference for symbol, resolution, adjusted data, subscriptions, and asset-class data
  patterns.

### 8. Alpaca Market Data API Docs

- Type: `market-data-api`
- URL/path: `https://docs.alpaca.markets/docs/market-data-api`
- Use it for: Practical API reference for bars, trades, quotes, and data boundaries.

### 9. scikit-learn TimeSeriesSplit

- Type: `validation`
- URL/path:
  `https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html`
- Use it for: Data splits must respect time ordering; never random split time series for strategy
  validation.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.

## GateZero Adapted Internal Docs

- `docs/operations/DATA_HANDLING.md`
- `docs/engineering/QUALIFICATION_BENCHMARK.md`
