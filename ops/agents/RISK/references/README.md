# RISK References

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

### 5. ISO 31000:2018 Risk Management Guidelines

- Type: `standard`
- URL/path: `https://www.iso.org/standard/65694.html`
- Use it for: Risk identification, analysis, treatment, monitoring, and communication principles.

### 6. NIST AI Risk Management Framework 1.0

- Type: `standard`
- URL/path: `https://www.nist.gov/itl/ai-risk-management-framework`
- Use it for: Risk lifecycle framing for AI-assisted decision support.

### 7. CFTC AI Trading Bots Advisory

- Type: `regulatory-warning`
- URL/path: `https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/AITradingBots.html`
- Use it for: Reminds Risk Agent that AI cannot predict sudden market changes and high-return claims
  are suspicious.

### 8. IBKR Order Types / Notes & Limitations

- Type: `broker-execution`
- URL/path: `https://www.interactivebrokers.com/campus/ibkr-api-page/order-types/`
- Use it for: Order-type constraints and execution caveats must feed risk review.

### 9. Google SRE Book - Embracing Risk

- Type: `sre`
- URL/path: `https://sre.google/sre-book/embracing-risk/`
- Use it for: Useful for explicit risk budgets, although financial risk remains stricter than
  service-risk tolerance.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.
