# TRD-208 Gate 0 Skill Governance Review

## Goal

Adopt the two local GateZero project skills as governed review lenses while preserving Gate 0:
Research Only.

## Allowed Scope

- Revise `skills/trader-product-reviewer/` for GateZero phase-aware product review.
- Revise `skills/trading-forex-domain-expert/` for GateZero phase-aware domain review.
- Add explicit skill metadata under each skill's `agents/openai.yaml`.
- Add a local skill governance guard and tests.
- Update validation, tracker, docs, and command-center records.

## Blocked Scope

- No live trading.
- No broker integration.
- No paper order mechanics.
- No autonomous execution.
- No AI buy/sell prediction.
- No strategy approval or readiness semantics.
- No performance or profitability claims.
- No risk-gate loosening.

## Required Outputs

- Phase-aware project skills under `skills/`.
- `scripts/check-gate0-skill-governance.ts`.
- `packages/fixtures/tests/gate0-skill-governance.test.ts`.
- `docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.
- Updated tracker, docs index, command index, validation audit, and command center data.

## Acceptance Criteria

- Skill files explicitly name `G0_RESEARCH` and `research_only`.
- Skill metadata requires explicit invocation.
- Gate 0 scanner treats `skills/` as controlled review references only.
- `pnpm check:gate0-skills` passes.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
