# Gate 0 Evidence Index Drift Guard Proposal

## Purpose

This proposal defines a future local drift guard for evidence-index artifacts.

It is a proposal only. It does not implement a command, change schema behavior, change fixture
behavior, change test behavior, change strategy state, risk state, maturity state, operator
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

Use this proposal only to bound a possible future local drift guard. Do not use it as strategy
approval, readiness review, performance evidence, profitability evidence, deployment approval,
product expansion approval, or future-phase eligibility.

## Proposed Future Guard

A future evidence-index drift guard should verify that:

- Evidence-index docs are listed in `docs/README.md`.
- Evidence-index docs are linked from `ops/runtime/tracklist.md`.
- Evidence-index implementation sources are represented in the artifact map.
- Evidence-index operator docs include `## Source Links`.
- Evidence-index packet-backed docs reference QA_SECURITY, RISK, and ORCHESTRATOR review records.
- The frozen evidence-index surface remains local and non-authorizing.

## Proposed Non-Goals

The future guard must not:

- Add live trading or paper order mechanics.
- Add broker integration or broker API key handling.
- Add autonomous execution.
- Add AI buy/sell prediction.
- Add external persistence.
- Add UI, API routes, or report publishing.
- Add strategy approval, readiness, profitability, or performance claims.
- Loosen any risk gate.

## Proposed Acceptance Focus

A future implementation packet should pass local tests and validation while keeping the guard
deterministic, repository-local, and limited to evidence-index drift detection.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Evidence index freeze note: `docs/operations/GATE0_EVIDENCE_INDEX_FREEZE_NOTE.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-098_GATE0_EVIDENCE_INDEX_DRIFT_GUARD_PROPOSAL.md`
- Reviews: `ops/runtime/reviews/TRD-098_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-098_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-098_ORCHESTRATOR_ACCEPTANCE.md`
