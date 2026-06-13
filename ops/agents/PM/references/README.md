# PM References

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

### 5. CFTC Customer Advisory: AI Won't Turn Trading Bots into Money Machines

- Type: `regulatory-warning`
- URL/path: `https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/AITradingBots.html`
- Use it for: Keeps product language honest; no guaranteed return or magic AI positioning.

### 6. SEC Investor.gov AI and Investment Fraud Alert

- Type: `regulatory-warning`
- URL/path:
  `https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/artificial-intelligence-fraud`
- Use it for: Prevents AI-washing, hype claims, and misleading product copy.

### 7. FINRA AI and Investment Fraud Alert

- Type: `regulatory-warning`
- URL/path: `https://www.finra.org/investors/insights/artificial-intelligence-and-investment-fraud`
- Use it for: Frames retail-investor safety warnings and scam-pattern detection.

### 8. NIST AI Risk Management Framework 1.0

- Type: `standard`
- URL/path: `https://www.nist.gov/itl/ai-risk-management-framework`
- Use it for: Helps PM define safer acceptance criteria for AI-assisted features.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.
