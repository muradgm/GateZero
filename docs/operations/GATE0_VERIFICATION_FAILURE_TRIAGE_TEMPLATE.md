# Gate 0 Verification Failure Triage Template

## Purpose

This template records the minimum information needed when `pnpm verify:gate0` fails.

It is a local triage aid only. It does not authorize trading, broker integration, autonomous
execution, AI prediction, product expansion, external publishing, later-phase movement, or risk-gate
loosening.

## Template

```text
Packet candidate:
First failing command:
Observed message:
Affected local artifact:
Expected local state:
Bounded maintenance gap:
Proposed repair:
Blocked expansion risk:
Required validation:
```

## Use Rule

Capture only the first failing command first. Do not turn one failure into a broad workstream. If a
repair is needed, open the smallest Gate 0 maintenance packet that fixes the failing local control.

## Blocked Interpretations

A failed verification run does not justify UI expansion, broker integration, live or paper
execution, AI prediction, strategy claims, publishing, readiness scoring, or risk-gate changes.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Verification runbook: `docs/operations/GATE0_FINAL_OPERATOR_VERIFICATION_RUNBOOK.md`
- Source packet: `ops/assignments/TRD-138_GATE0_VERIFICATION_FAILURE_TRIAGE_TEMPLATE.md`
- Reviews: `ops/runtime/reviews/TRD-138_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-138_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-138_ORCHESTRATOR_ACCEPTANCE.md`
