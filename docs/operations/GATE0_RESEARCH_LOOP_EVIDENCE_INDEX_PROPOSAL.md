# Gate 0 Research Loop Evidence Index Proposal

## Purpose

This proposal describes a possible local evidence index for protected-loop artifacts.

It is a proposal only. It does not implement an index, change command behavior, strategy state, risk
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

Use this proposal only to plan a local evidence-index artifact. Do not use it as strategy approval,
readiness review, performance evidence, profitability evidence, deployment approval, product
expansion approval, or future-phase eligibility.

## Proposed Index Shape

| Index area        | Proposed local reference type                             | Boundary                |
| ----------------- | --------------------------------------------------------- | ----------------------- |
| Strategy idea     | Local idea identifier and source note.                    | Research only.          |
| Data snapshot     | Local snapshot id, quality check reference, and metadata. | No live feed.           |
| Backtest artifact | Local fixture or result reference.                        | No profitability claim. |
| Metric report     | Deterministic metric summary reference.                   | No performance claim.   |
| Risk review       | Local risk review reference.                              | No approval semantics.  |
| Operator decision | Local operator outcome reference.                         | No execution path.      |
| Learning event    | Local learning note reference.                            | No automation.          |

## Proposal Constraints

A future implementation packet should keep the evidence index:

- Local and deterministic.
- Read-only unless explicitly writing a local markdown or JSON artifact.
- Free of external service access.
- Free of broker, execution, prediction, approval, readiness, profitability, and performance
  semantics.
- Subordinate to `G0_RESEARCH` and `research_only`.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Operator boundary review: `docs/operations/GATE0_OPERATOR_BOUNDARY_REVIEW.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-086_GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_PROPOSAL.md`
- Reviews: `ops/runtime/reviews/TRD-086_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-086_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-086_ORCHESTRATOR_ACCEPTANCE.md`
