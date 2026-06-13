# ORCHESTRATOR References

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

### 5. NIST AI Risk Management Framework 1.0

- Type: `standard`
- URL/path: `https://www.nist.gov/itl/ai-risk-management-framework`
- Use it for: Govern-map-measure-manage framing for AI-assisted, high-consequence workflows.

### 6. NIST Cybersecurity Framework 2.0

- Type: `standard`
- URL/path: `https://www.nist.gov/cyberframework`
- Use it for: Security governance model for systems handling broker keys, account data, and
  sensitive logs.

### 7. Google SRE Book - Monitoring Distributed Systems

- Type: `sre`
- URL/path: `https://sre.google/sre-book/monitoring-distributed-systems/`
- Use it for: Incident visibility, alerting philosophy, and interruption-worthy signals.

### 8. QuantConnect LEAN Engine Docs

- Type: `trading-engine`
- URL/path: `https://www.quantconnect.com/docs/v2/lean-engine/getting-started`
- Use it for: Reference architecture for research, backtesting, and live-trading separation.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.
