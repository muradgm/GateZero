# Gate 0 Maintenance Backlog Rerank

## Purpose

This record re-ranks the Gate 0 maintenance backlog after the latest CI evidence, source-link, and
tracklist guard hardening.

## Rerank

| Rank | Item                                       | Status | Reason                                                    |
| ---- | ------------------------------------------ | ------ | --------------------------------------------------------- |
| 1    | Refresh CI evidence after this push        | queued | Needed only after local changes are pushed.               |
| 2    | Recheck command center metadata after push | queued | Keep static display aligned to remote evidence.           |
| 3    | Wait for a concrete control gap            | paused | Avoid broad expansion while Gate 0 remains research-only. |

## Boundary

The backlog remains maintenance-first. UI expansion, broker integration, live or paper execution, AI
prediction, approval scoring, readiness scoring, performance claims, marketing claims, and risk-gate
loosening remain rejected for now.

## Source Links

- Source packet: `ops/assignments/TRD-239_MAINTENANCE_BACKLOG_RERANK.md`
- Reviews: `ops/runtime/reviews/TRD-239_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-239_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-239_ORCHESTRATOR_ACCEPTANCE.md`
- Tracker: `ops/runtime/tracklist.md`
- Next scope recommendation:
  `docs/operations/GATE0_NEXT_SCOPE_RECOMMENDATION_AFTER_SKILL_LIBRARY.md`
