# Gate 0 Maintenance Backlog Rerank

## Purpose

This record aligns the Gate 0 maintenance backlog with the accepted CI evidence refresh loop pause.

The backlog no longer queues CI evidence refresh or command-center metadata refresh work merely
because a push created a new passing remote run.

## Rerank

| Rank | Item                            | Status | Reason                                                    |
| ---- | ------------------------------- | ------ | --------------------------------------------------------- |
| 1    | Wait for a concrete control gap | paused | Avoid broad expansion while Gate 0 remains research-only. |

## CI Evidence Rule

Do not refresh CI evidence just because the previous control-plane packet produced a new passing
remote run. Use the refresh helper only when a meaningful Gate 0 maintenance, audit, handoff, or
incident need requires that remote proof to be captured locally.

The current unrecorded remote run after the pause-control push is acceptable under
`docs/operations/GATE0_CI_EVIDENCE_REFRESH_LOOP_PAUSE.md`.

## Boundary

The backlog remains maintenance-first. UI expansion, broker integration, live or paper execution, AI
prediction, approval scoring, readiness scoring, performance claims, marketing claims, and risk-gate
loosening remain rejected for now.

## Source Links

- Source packet: `ops/assignments/TRD-262_MAINTENANCE_BACKLOG_PAUSE_ALIGNMENT.md`
- Previous source packet: `ops/assignments/TRD-239_MAINTENANCE_BACKLOG_RERANK.md`
- QA review: `ops/runtime/reviews/TRD-262_QA_SECURITY_REVIEW.md`
- RISK review: `ops/runtime/reviews/TRD-262_RISK_REVIEW.md`
- ORCHESTRATOR acceptance: `ops/runtime/reviews/TRD-262_ORCHESTRATOR_ACCEPTANCE.md`
- Tracker: `ops/runtime/tracklist.md`
- Next scope recommendation:
  `docs/operations/GATE0_NEXT_SCOPE_RECOMMENDATION_AFTER_SKILL_LIBRARY.md`
- CI evidence refresh loop pause: `docs/operations/GATE0_CI_EVIDENCE_REFRESH_LOOP_PAUSE.md`
