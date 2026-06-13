# Gate 0 Docs Coverage Drift Guard

## Purpose

This document records the local docs coverage drift guard added for GateZero Gate 0 operator
documentation.

The guard is local and read-only. It checks documentation coverage strings and operating-record
references only. It does not change strategy state, risk state, maturity state, operator decisions,
gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this guard only to detect local documentation coverage drift. Do not use guard success as
strategy approval, readiness review, performance evidence, profitability evidence, deployment
approval, or future-phase eligibility.

## Guard Command

```powershell
pnpm check:gate0-docs-coverage
```

## Guard Coverage

| Coverage area            | Local check                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| Docs index coverage      | Each `docs/operations/GATE0_*.md` document appears in `docs/README.md`.   |
| Source-link sections     | Each checked operations document includes `## Source Links`.              |
| Tracklist source links   | Each checked operations document appears in `ops/runtime/tracklist.md`.   |
| Artifact map coverage    | Coverage-oriented operations documents appear in the artifact map.        |
| Packet review references | Packet-backed docs reference matching QA, RISK, and ORCHESTRATOR records. |

## Locality Notes

The guard reads local markdown files and exits with bounded findings. It does not access external
services, credentials, brokers, APIs, UI routes, publishing systems, execution paths, or prediction
systems.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Guard source: `scripts/check-gate0-docs-coverage.ts`
- Guard tests: `packages/fixtures/tests/gate0-docs-coverage-check.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-078_GATE0_DOCS_COVERAGE_DRIFT_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-078_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-078_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-078_ORCHESTRATOR_ACCEPTANCE.md`
