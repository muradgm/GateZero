# Gate 0 Evidence Index Tests

## Purpose

This document records deterministic tests for the Gate 0 research loop evidence index.

The tests verify local schema and fixture behavior only. They do not change strategy state, risk
state, maturity state, operator decisions, gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use these tests only to verify local evidence-index behavior. Do not use test success as strategy
approval, readiness review, performance evidence, profitability evidence, deployment approval,
product expansion approval, or future-phase eligibility.

## Test Coverage

| Test file                                                            | Coverage                                                             |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `packages/contracts/tests/research-loop-evidence-index.test.ts`      | Schema pass, protected-loop order, blocked external/execution flags. |
| `packages/fixtures/tests/gate0-research-loop-evidence-index.test.ts` | Fixture validity, artifact order, deterministic reads.               |

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Contract tests: `packages/contracts/tests/research-loop-evidence-index.test.ts`
- Fixture tests: `packages/fixtures/tests/gate0-research-loop-evidence-index.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-092_GATE0_EVIDENCE_INDEX_TESTS.md`
- Reviews: `ops/runtime/reviews/TRD-092_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-092_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-092_ORCHESTRATOR_ACCEPTANCE.md`
