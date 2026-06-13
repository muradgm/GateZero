# Gate 0 Evidence Index Fixture

## Purpose

This document records the synthetic local fixture for the Gate 0 research loop evidence index.

The fixture is synthetic and deterministic. It does not contain real market data, real orders,
broker references, credentials, strategy performance claims, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this fixture only to validate local evidence-index behavior. Do not use it as strategy approval,
readiness review, performance evidence, profitability evidence, deployment approval, product
expansion approval, or future-phase eligibility.

## Fixture Summary

| Fixture                                 | Source                                                        |
| --------------------------------------- | ------------------------------------------------------------- |
| `gate0ResearchLoopEvidenceIndexFixture` | `packages/fixtures/src/gate0-research-loop-evidence-index.ts` |

The fixture derives its artifact references from the existing synthetic dry-run review bundle.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Fixture source: `packages/fixtures/src/gate0-research-loop-evidence-index.ts`
- Dry-run fixture: `packages/fixtures/src/gate0-dry-run-scenario.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-091_GATE0_EVIDENCE_INDEX_FIXTURE.md`
- Reviews: `ops/runtime/reviews/TRD-091_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-091_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-091_ORCHESTRATOR_ACCEPTANCE.md`
