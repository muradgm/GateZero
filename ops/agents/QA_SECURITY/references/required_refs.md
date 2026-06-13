# QA_SECURITY References

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

### 5. OWASP ASVS

- Type: `security-standard`
- URL/path: `https://owasp.org/www-project-application-security-verification-standard/`
- Use it for: Verification requirements for web/API security controls.

### 6. OWASP Top 10

- Type: `security-reference`
- URL/path: `https://owasp.org/www-project-top-ten/`
- Use it for: Common web risks to check in reviews and tests.

### 7. NIST Cybersecurity Framework 2.0

- Type: `security-framework`
- URL/path: `https://www.nist.gov/cyberframework`
- Use it for: Govern/identify/protect/detect/respond/recover security model.

### 8. pytest Documentation

- Type: `testing`
- URL/path: `https://docs.pytest.org/`
- Use it for: Python test framework for quant engine and data validation.

### 9. Playwright Documentation

- Type: `e2e-testing`
- URL/path: `https://playwright.dev/`
- Use it for: Browser testing for approval flows, risk warnings, and read-only/live-mode boundaries.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.

## GateZero Adapted Internal Docs

- `docs/engineering/TESTING_STRATEGY.md`
- `docs/operations/SECURITY_BASELINE.md`
- `docs/engineering/API_CONTRACTS.md`
