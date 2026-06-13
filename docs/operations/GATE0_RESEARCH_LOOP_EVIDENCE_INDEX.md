# Gate 0 Research Loop Evidence Index

## Purpose

The research loop evidence index provides a local reference list for the protected decision-loop
artifacts in a Gate 0 review bundle.

It is a traceability aid only. It does not change strategy state, risk state, maturity state,
operator decisions, gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this index only to locate local evidence references. Do not use it as strategy approval,
readiness review, performance evidence, profitability evidence, deployment approval, product
expansion approval, or future-phase eligibility.

## Protected Loop Entries

The local index follows this order:

1. Strategy idea.
2. Data snapshot.
3. Backtest.
4. Metric report.
5. Risk review.
6. Operator decision.
7. Outcome logged.
8. Learning event.

## Local Sources

- Schema: `packages/contracts/src/research-loop-evidence-index.ts`
- Fixture: `packages/fixtures/src/gate0-research-loop-evidence-index.ts`
- Tests: `packages/contracts/tests/research-loop-evidence-index.test.ts`,
  `packages/fixtures/tests/gate0-research-loop-evidence-index.test.ts`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Implementation packet: `docs/operations/GATE0_EVIDENCE_INDEX_IMPLEMENTATION_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-093_GATE0_EVIDENCE_INDEX_DOCUMENTATION.md`
- Reviews: `ops/runtime/reviews/TRD-093_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-093_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-093_ORCHESTRATOR_ACCEPTANCE.md`
