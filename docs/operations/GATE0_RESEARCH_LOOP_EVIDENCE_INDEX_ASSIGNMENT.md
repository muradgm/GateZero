# Gate 0 Research Loop Evidence Index Assignment

## Purpose

This note defines a bounded future assignment for a local research-loop evidence index.

It is an assignment note only. It does not implement an index, change command behavior, strategy
state, risk state, maturity state, operator decisions, gate status, product scope, or execution
capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this assignment only to bound a future local evidence-index implementation. Do not use it as
strategy approval, readiness review, performance evidence, profitability evidence, deployment
approval, product expansion approval, or future-phase eligibility.

## Future Assignment Bounds

| Area              | Allowed future scope                                   | Blocked scope               |
| ----------------- | ------------------------------------------------------ | --------------------------- |
| Evidence index    | Local artifact references for protected-loop evidence. | External persistence.       |
| Source references | Local docs, fixtures, reviews, and package records.    | Broker/API connections.     |
| Output shape      | Local markdown or JSON with deterministic fields.      | Published reports.          |
| Semantics         | Traceability and completeness only.                    | Approval/readiness scoring. |
| Gate status       | Preserve `G0_RESEARCH` and `research_only`.            | Gate movement.              |

## Required Future Reviews

Any future implementation must include QA_SECURITY, RISK, and ORCHESTRATOR review records before
acceptance.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Evidence index proposal: `docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_PROPOSAL.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-087_GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_ASSIGNMENT.md`
- Reviews: `ops/runtime/reviews/TRD-087_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-087_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-087_ORCHESTRATOR_ACCEPTANCE.md`
