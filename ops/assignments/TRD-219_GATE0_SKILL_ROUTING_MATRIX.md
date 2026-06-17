# TRD-219 Gate 0 Skill Routing Matrix

## Goal

Add a governed matrix that tells Orchestrator which project skill lens to use for each important
Gate 0 decision type.

## Allowed Scope

- Add `docs/operations/GATE0_SKILL_ROUTING_MATRIX.md`.
- Update docs, tracker, progress snapshot, and command center.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

No live trading, broker integration, paper execution, autonomous execution, AI prediction, approval
or readiness semantics, performance claims, marketing claims, or risk-gate loosening.

## Acceptance Criteria

- Matrix names all governed skills and decision lanes.
- Matrix preserves `G0_RESEARCH` and `research_only`.
- `pnpm verify:gate0` passes.
