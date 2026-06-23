# TRD-467 Frontend Evidence Panel Requirements Draft

## Goal

Draft requirements for future read-only frontend evidence panels.

## Scope

- Current gate: `G2_PAPER_TRADING`.
- Current scope: `paper_simulation_planning_only`.
- Surface: evidence panels, limitation panels, risk panels, operator workflow panels, and
  source-link panels.

## Blocked Scope

- No execution controls, broker controls, account controls, credentials, automated actions,
  directional prediction, approval/readiness claims, or profitability claims.

## Required Outputs

- Frontend evidence panel requirements draft.
- QA/security, risk, and orchestrator reviews.
- Tracklist/index updates.

## Acceptance Criteria

- Requirements remain read-only and evidence-first.
- Panel requirements are not a build authorization.
- Next queue is refreshed for future bounded frontend planning work.

## Source Links

- Report: `docs/operations/GATE2_FRONTEND_EVIDENCE_PANEL_REQUIREMENTS_DRAFT.md`
- QA/security review: `ops/runtime/reviews/TRD-467_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-467_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-467_ORCHESTRATOR_ACCEPTANCE.md`
