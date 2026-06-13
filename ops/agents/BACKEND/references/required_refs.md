# BACKEND References

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

### 5. PostgreSQL Official Documentation

- Type: `database`
- URL/path: `https://www.postgresql.org/docs/`
- Use it for: Source of truth for transactions, constraints, indexes, isolation, and data integrity.

### 6. Node.js Official Documentation

- Type: `runtime`
- URL/path: `https://nodejs.org/docs/latest/api/`
- Use it for: Runtime, async behavior, streams, process handling, and security-sensitive APIs.

### 7. Fastify Documentation

- Type: `api-framework`
- URL/path: `https://fastify.dev/docs/latest/`
- Use it for: High-performance Node API patterns, validation, hooks, plugins.

### 8. OWASP ASVS

- Type: `security-standard`
- URL/path: `https://owasp.org/www-project-application-security-verification-standard/`
- Use it for: Requirements for authentication, session, validation, logging, and secure API
  controls.

### 9. OpenTelemetry Documentation

- Type: `observability`
- URL/path: `https://opentelemetry.io/docs/`
- Use it for: Tracing, metrics, and logs for API/worker observability.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.

## GateZero Adapted Internal Docs

- `docs/engineering/API_CONTRACTS.md`
- `docs/engineering/CODING_STANDARDS.md`
- `docs/engineering/DEPENDENCY_RULES.md`
