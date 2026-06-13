# FRONTEND References

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

### 5. React Documentation

- Type: `frontend-framework`
- URL/path: `https://react.dev/`
- Use it for: Canonical reference for component design, state, effects, and UI composition.

### 6. Vite Documentation

- Type: `frontend-build`
- URL/path: `https://vite.dev/guide/`
- Use it for: Build tool, dev server, bundling, env handling.

### 7. WAI Accessibility Guidelines Overview

- Type: `accessibility`
- URL/path: `https://www.w3.org/WAI/standards-guidelines/`
- Use it for: Risk warnings, charts, controls, and approval actions must be accessible.

### 8. Playwright Best Practices

- Type: `e2e-testing`
- URL/path: `https://playwright.dev/docs/best-practices`
- Use it for: User-facing test strategy for dashboard flows and dangerous-action confirmations.

### 9. TradingView Lightweight Charts Docs

- Type: `charting`
- URL/path: `https://tradingview.github.io/lightweight-charts/`
- Use it for: Lightweight financial charts for candles, equity curves, drawdowns, and overlays.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.

## GateZero Adapted Internal Docs

- `docs/product/UI_DIRECTION.md`
- `docs/product/SUCCESS_METRICS.md`
