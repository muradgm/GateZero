# Gate 0 CI Evidence Refresh Loop Pause

## Purpose

This record pauses automatic follow-up CI evidence refreshes when the only new remote run exists
because the previous packet recorded CI evidence.

The helper added in `TRD-258` works and remains available. The control here is about operator
judgment: do not create a new evidence-refresh packet solely to record the run created by the last
evidence-refresh packet.

## Current Gate

```text
G0_RESEARCH
research_only
```

## Operating Rule

Use `pnpm refresh:gate0-ci-evidence` when a meaningful Gate 0 change needs remote verification
evidence captured in the local operating record.

Do not use the helper merely because a new passing run exists after an evidence-only metadata
refresh. A latest unrecorded passing run is acceptable when the previous recorded run already proves
the last meaningful control-plane change and there is no audit, handoff, or maintenance reason to
advance the evidence index.

## Decision Test

Before recording a new CI run, answer these checks:

| Check                                                                    | Action                    |
| ------------------------------------------------------------------------ | ------------------------- |
| Did the push change code, guards, contracts, operating docs, or reviews? | Recording may be useful.  |
| Is the push only the result of recording the previous CI run?            | Pause; do not refresh.    |
| Does an audit, handoff, or incident require the latest remote proof?     | Record with a new packet. |
| Would recording this run trigger another evidence-only follow-up run?    | Pause; avoid churn.       |

## Command-Center Posture

The command center may advance its latest accepted packet to the pause-control packet while leaving
the latest recorded CI run unchanged. That is intentional. CI evidence is remote verification
evidence, not product progress, deployment authority, strategy readiness, or execution permission.

## Boundary

This control does not add execution behavior, broker integration, autonomous action, prediction,
strategy approval, performance claims, or risk-gate changes. It keeps remote evidence as local
repository verification only.

## QA Notes

- Local verification remains the required acceptance basis.
- CI success remains remote repository evidence only.
- The evidence index should advance only when there is a concrete reason.
- Stale-by-one remote runs caused by evidence bookkeeping are allowed under this pause rule.

## Source Links

- Source packet: `ops/assignments/TRD-261_CI_EVIDENCE_REFRESH_LOOP_PAUSE.md`
- QA review: `ops/runtime/reviews/TRD-261_QA_SECURITY_REVIEW.md`
- RISK review: `ops/runtime/reviews/TRD-261_RISK_REVIEW.md`
- ORCHESTRATOR acceptance: `ops/runtime/reviews/TRD-261_ORCHESTRATOR_ACCEPTANCE.md`
- Helper record: `docs/operations/GATE0_CI_EVIDENCE_REFRESH_HELPER.md`
- Remote evidence index: `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`
- Current tracker: `ops/runtime/tracklist.md`
