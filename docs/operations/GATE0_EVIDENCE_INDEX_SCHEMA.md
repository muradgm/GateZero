# Gate 0 Evidence Index Schema

## Purpose

This document records the local schema for the Gate 0 research loop evidence index.

The schema is local and deterministic. It references protected-loop artifact identifiers only. It
does not change strategy state, risk state, maturity state, operator decisions, gate status, product
scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this schema only to validate local evidence-index shape. Do not use schema validity as strategy
approval, readiness review, performance evidence, profitability evidence, deployment approval,
product expansion approval, or future-phase eligibility.

## Schema Summary

| Field             | Boundary                                       |
| ----------------- | ---------------------------------------------- |
| `financial_gate`  | Must be `G0_RESEARCH`.                         |
| `scope`           | Must be `research_only`.                       |
| `index_kind`      | Must be `local_research_loop_evidence_index`.  |
| `entries`         | Must follow the protected-loop artifact order. |
| `external_access` | Must be `false`.                               |
| `execution_path`  | Must be `false`.                               |

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Schema source: `packages/contracts/src/research-loop-evidence-index.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-090_GATE0_EVIDENCE_INDEX_SCHEMA.md`
- Reviews: `ops/runtime/reviews/TRD-090_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-090_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-090_ORCHESTRATOR_ACCEPTANCE.md`
