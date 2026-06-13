# LEARNING References

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

### 5. GateZero Learning System

- Type: `internal`
- URL/path: `../../learning/LEARNING_SYSTEM.md`
- Use it for: Defines safe learning boundaries: learn from mistakes but never bypass risk controls.

### 6. GateZero Postmortem Template

- Type: `internal`
- URL/path: `../../learning/POSTMORTEM_TEMPLATE.md`
- Use it for: Standard format for incident/mistake analysis.

### 7. NIST AI Risk Management Framework 1.0

- Type: `standard`
- URL/path: `https://www.nist.gov/itl/ai-risk-management-framework`
- Use it for: Structured AI risk lifecycle; useful for learning-governance controls.

### 8. Google SRE Book - Postmortem Culture

- Type: `sre`
- URL/path: `https://sre.google/sre-book/postmortem-culture/`
- Use it for: Blameless incident review patterns adapted to trading mistakes.

### 9. CFTC AI Trading Bots Advisory

- Type: `regulatory-warning`
- URL/path: `https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/AITradingBots.html`
- Use it for: Learning must never convert market wins into false confidence or guaranteed-return
  claims.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.

## GateZero Adapted Internal Docs

- `docs/product/SUCCESS_METRICS.md`
- `docs/engineering/DECISION_LOOP_HARDENING_ROADMAP.md`
- `docs/operations/DATA_HANDLING.md`
