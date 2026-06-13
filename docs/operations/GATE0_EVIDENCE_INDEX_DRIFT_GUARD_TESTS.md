# Gate 0 Evidence Index Drift Guard Tests

## Purpose

This document records local tests for the evidence-index drift guard.

The tests are local and deterministic. They do not change strategy state, risk state, maturity
state, operator decisions, gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use these tests only to verify local guard behavior. Do not use test success as strategy approval,
readiness review, performance evidence, profitability evidence, deployment approval, product
expansion approval, or future-phase eligibility.

## Test Coverage

| Test area                | Coverage                                                      |
| ------------------------ | ------------------------------------------------------------- |
| Aligned records          | Guard passes when docs, sources, commands, and tracker align. |
| Bounded drift findings   | Guard reports missing docs, sources, command, and index rows. |
| Packet review references | Guard reports missing QA, RISK, or ORCHESTRATOR references.   |

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Guard source: `scripts/check-gate0-evidence-index-drift.ts`
- Guard tests: `packages/fixtures/tests/gate0-evidence-index-drift-check.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-101_GATE0_EVIDENCE_INDEX_DRIFT_GUARD_TESTS.md`
- Reviews: `ops/runtime/reviews/TRD-101_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-101_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-101_ORCHESTRATOR_ACCEPTANCE.md`
