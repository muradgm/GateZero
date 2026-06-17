# TRD-220 Gate 0 Skill Routing Guard

## Goal

Add a local guard and tests for the Gate 0 skill routing matrix.

## Allowed Scope

- Add `scripts/check-gate0-skill-routing.ts`.
- Add `packages/fixtures/tests/gate0-skill-routing.test.ts`.
- Add `pnpm check:gate0-skill-routing` to the Gate 0 guard suite.
- Update docs, tracker, progress snapshot, and command center.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

No live trading, broker integration, paper execution, autonomous execution, AI prediction, approval
or readiness semantics, performance claims, marketing claims, or risk-gate loosening.

## Acceptance Criteria

- Guard passes for the current matrix.
- Guard fails for missing skills or missing decision lanes.
- `pnpm verify:gate0` passes.
