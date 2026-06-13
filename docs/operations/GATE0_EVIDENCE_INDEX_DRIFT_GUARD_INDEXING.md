# Gate 0 Evidence Index Drift Guard Indexing

## Purpose

This document records local indexing for the evidence-index drift guard.

It is an indexing note only. It does not change strategy state, risk state, maturity state, operator
decisions, gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this indexing note only to locate local guard records. Do not use indexing as strategy approval,
readiness review, performance evidence, profitability evidence, deployment approval, product
expansion approval, or future-phase eligibility.

## Indexed Records

| Record type      | Path or command                                                    |
| ---------------- | ------------------------------------------------------------------ |
| Package command  | `pnpm check:gate0-evidence-index`                                  |
| Guard source     | `scripts/check-gate0-evidence-index-drift.ts`                      |
| Guard tests      | `packages/fixtures/tests/gate0-evidence-index-drift-check.test.ts` |
| Command index    | `docs/operations/GATE0_OPERATOR_COMMAND_INDEX.md`                  |
| Validation audit | `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`                |
| Artifact map     | `docs/operations/GATE0_ERGONOMICS_ARTIFACT_MAP.md`                 |
| Current tracker  | `ops/runtime/tracklist.md`                                         |

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Guard docs: `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-102_GATE0_EVIDENCE_INDEX_DRIFT_GUARD_INDEXING.md`
- Reviews: `ops/runtime/reviews/TRD-102_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-102_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-102_ORCHESTRATOR_ACCEPTANCE.md`
