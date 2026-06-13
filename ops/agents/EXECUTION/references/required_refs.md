# EXECUTION References

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

### 5. Alpaca Trading API Docs

- Type: `broker-api`
- URL/path: `https://docs.alpaca.markets/us/docs/trading-api`
- Use it for: Account, order, position, and trading API reference.

### 6. Alpaca Paper Trading Docs

- Type: `paper-trading`
- URL/path: `https://docs.alpaca.markets/us/docs/paper-trading`
- Use it for: Paper-only testing before live trading; supports safe execution rehearsal.

### 7. Interactive Brokers API Home

- Type: `broker-api`
- URL/path: `https://www.interactivebrokers.com/campus/ibkr-api-page/ibkr-api-home/`
- Use it for: Professional broker API reference for order/account/market-data access.

### 8. IBKR API Order Types

- Type: `execution`
- URL/path: `https://www.interactivebrokers.com/campus/ibkr-api-page/order-types/`
- Use it for: Order behavior, limitations, and required fields for execution planning.

### 9. IBKR TWS Basic Orders

- Type: `execution-legacy-docs`
- URL/path: `https://interactivebrokers.github.io/tws-api/basic_orders.html`
- Use it for: Concrete examples of market/limit/stop order behavior and risk tradeoffs.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.

## GateZero Adapted Internal Docs

- `docs/operations/ENV_VARS.md`
- `docs/operations/SECURITY_BASELINE.md`
- `docs/engineering/API_CONTRACTS.md`
