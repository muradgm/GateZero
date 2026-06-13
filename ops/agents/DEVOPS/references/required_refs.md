# DEVOPS References

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

### 5. Docker Documentation

- Type: `containers`
- URL/path: `https://docs.docker.com/`
- Use it for: Local/prod environment packaging and repeatability.

### 6. Docker Compose Documentation

- Type: `local-orchestration`
- URL/path: `https://docs.docker.com/compose/`
- Use it for: Local stack for API, worker, quant engine, DB, Redis, observability.

### 7. OpenTelemetry Documentation

- Type: `observability`
- URL/path: `https://opentelemetry.io/docs/`
- Use it for: Unified metrics, traces, and logs.

### 8. Google SRE Book - Monitoring Distributed Systems

- Type: `sre`
- URL/path: `https://sre.google/sre-book/monitoring-distributed-systems/`
- Use it for: Alerting rules, pages vs tickets, production signal quality.

### 9. NIST Cybersecurity Framework 2.0

- Type: `security-framework`
- URL/path: `https://www.nist.gov/cyberframework`
- Use it for: Operational security lifecycle and response/recovery posture.

## Agent usage rules

When producing a plan, review, or implementation decision, cite the internal truth/gate file that
controls the decision and the external reference that supports the technical domain when applicable.

## GateZero Adapted Internal Docs

- `docs/operations/DEPLOYMENT.md`
- `docs/operations/ENV_VARS.md`
- `docs/operations/PUSH_DISCIPLINE.md`
