# Gate 0 Name Check Coverage Check

## Purpose

This check verifies that the Gate 0 name-check coverage audit matches the current local project-name
script coverage.

It is a documentation check only. It does not change command behavior, strategy state, risk state,
maturity state, operator decisions, gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this check only to verify local name-check coverage. Do not use name coverage as strategy
approval, readiness review, performance evidence, profitability evidence, deployment approval, or
future-phase eligibility.

## Coverage Result

| Coverage area         | Expected condition                                      | Status |
| --------------------- | ------------------------------------------------------- | ------ |
| Display name          | Required display name is `GateZero`.                    | Pass   |
| Package name          | Required package name is `gatezero`.                    | Pass   |
| Previous display name | Previous display name content is rejected.              | Pass   |
| Previous package name | Previous package name content and paths are rejected.   | Pass   |
| Checked extensions    | Audit lists current checked text extensions.            | Pass   |
| Ignored directories   | Audit lists current ignored generated/dependency paths. | Pass   |
| Regression tests      | Audit references current local regression tests.        | Pass   |

## Findings

No blocking name-check coverage gaps were found.

The name-check coverage audit matches the current local script and regression test coverage.

## Maintenance Rule

Update this check when the project-name script, checked extensions, ignored directories, required
identity fields, or regression tests change. Do not use this check to authorize execution, strategy
promotion, product launch, risk-gate movement, or later-phase operation.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Name-check script: `scripts/check-gate0-project-name.ts`
- Name-check tests: `packages/fixtures/tests/gate0-project-name-check.test.ts`
- Name-check coverage audit: `docs/operations/GATE0_NAME_CHECK_COVERAGE_AUDIT.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-069_GATE0_NAME_CHECK_COVERAGE_CHECK.md`
- Reviews: `ops/runtime/reviews/TRD-069_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-069_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-069_ORCHESTRATOR_ACCEPTANCE.md`
