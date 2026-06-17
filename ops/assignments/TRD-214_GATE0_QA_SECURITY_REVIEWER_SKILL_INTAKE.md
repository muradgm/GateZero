# TRD-214 Gate 0 QA Security Reviewer Skill Intake

## Goal

Add `gatezero-qa-security-reviewer` as a governed project-local skill for reviewing validation
integrity, scanner coverage, secrets exposure, blocked-scope checks, artifact freshness, and QA
evidence.

## Allowed Scope

- Add `skills/gatezero-qa-security-reviewer/`.
- Add explicit skill metadata requiring explicit invocation.
- Add eval fixtures for phase-aware QA/security behavior.
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

- `skills/gatezero-qa-security-reviewer/SKILL.md`.
- `skills/gatezero-qa-security-reviewer/agents/openai.yaml`.
- `skills/gatezero-qa-security-reviewer/evals/evals.json`.
- Updated `scripts/check-gate0-skill-governance.ts`.
- Updated `packages/fixtures/tests/gate0-skill-governance.test.ts`.
- `docs/operations/GATE0_QA_SECURITY_REVIEWER_SKILL_INTAKE.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- The skill contains `G0_RESEARCH`, `research_only`, `At Gate 0`, `future-phase`, and `blockers`.
- The skill metadata contains `allow_implicit_invocation: false`.
- The skill governance guard checks the new skill.
- `pnpm check:gate0-skills` passes.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
