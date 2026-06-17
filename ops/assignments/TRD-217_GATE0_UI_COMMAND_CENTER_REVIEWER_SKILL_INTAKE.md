# TRD-217 Gate 0 UI Command Center Reviewer Skill Intake

## Goal

Add `gatezero-ui-command-center-reviewer` as a governed project-local skill.

## Allowed Scope

- Add the skill, metadata, and eval fixture.
- Update skill governance guard, tests, docs, tracker, progress snapshot, and command center.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

No live trading, broker integration, paper execution, autonomous execution, AI prediction, approval
or readiness semantics, performance claims, marketing claims, or risk-gate loosening.

## Acceptance Criteria

- Skill has Gate 0 boundary text and explicit invocation metadata.
- `pnpm check:gate0-skills` passes.
- `pnpm verify:gate0` passes.
