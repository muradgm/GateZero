# Gate 0 Maintenance Intake Checklist

## Purpose

This checklist determines whether a discovered issue qualifies as a bounded Gate 0 maintenance
packet.

It is an intake checklist only. It does not authorize trading, broker integration, autonomous
execution, AI prediction, product expansion, external publishing, later-phase movement, or risk-gate
loosening.

## Checklist

A candidate qualifies only when all answers are yes:

- The issue is local to the Gate 0 control plane.
- The issue names a specific failing command, document, review record, tracker row, source link, or
  guard.
- The proposed repair keeps Gate 0 at `G0_RESEARCH` and `research_only`.
- The proposed repair does not add product, execution, prediction, broker, publishing, readiness, or
  strategy-claim behavior.
- The packet can include QA_SECURITY, RISK, and ORCHESTRATOR review records.
- `pnpm verify:gate0` can validate the completed repair.

## Reject For Now

Reject or defer candidates that are feature ideas, roadmap expansion, broker work, execution work,
prediction work, strategy promotion, report publishing, or later-phase preparation.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Verification failure triage: `docs/operations/GATE0_VERIFICATION_FAILURE_TRIAGE_TEMPLATE.md`
- Source packet: `ops/assignments/TRD-139_GATE0_MAINTENANCE_INTAKE_CHECKLIST.md`
- Reviews: `ops/runtime/reviews/TRD-139_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-139_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-139_ORCHESTRATOR_ACCEPTANCE.md`
