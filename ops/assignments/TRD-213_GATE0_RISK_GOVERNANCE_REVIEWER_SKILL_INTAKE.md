# TRD-213 Gate 0 Risk Governance Reviewer Skill Intake

## Goal

Add `gatezero-risk-governance-reviewer` as a governed project-local skill for reviewing risk gates,
autonomy gates, approval-language blockers, readiness semantics, and phase-safe scope.

## Allowed Scope

- Add `skills/gatezero-risk-governance-reviewer/`.
- Add explicit skill metadata requiring explicit invocation.
- Add eval fixtures for phase-aware risk governance behavior.
- Update the local skill governance guard and tests.
- Update docs, tracker, progress snapshot, and command-center records.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No live trading.
- No broker integration.
- No paper order mechanics.
- No autonomous execution.
- No AI buy/sell prediction.
- No strategy approval or readiness semantics.
- No performance or profitability claims.
- No marketing claims.
- No risk-gate loosening.

## Required Outputs

- `skills/gatezero-risk-governance-reviewer/SKILL.md`.
- `skills/gatezero-risk-governance-reviewer/agents/openai.yaml`.
- `skills/gatezero-risk-governance-reviewer/evals/evals.json`.
- Updated `scripts/check-gate0-skill-governance.ts`.
- Updated `packages/fixtures/tests/gate0-skill-governance.test.ts`.
- `docs/operations/GATE0_RISK_GOVERNANCE_REVIEWER_SKILL_INTAKE.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- The skill contains `G0_RESEARCH`, `research_only`, `At Gate 0`, `future-phase`, and `blockers`.
- The skill metadata contains `allow_implicit_invocation: false`.
- The skill governance guard checks the new skill.
- `pnpm check:gate0-skills` passes.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
