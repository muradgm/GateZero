# TRD-209 Gate 0 Skill Library Intake

## Goal

Define a governed intake policy for future project-local GateZero skills while keeping GateZero at
Gate 0: Research Only.

## Allowed Scope

- Add a skill library intake policy under `docs/operations/`.
- Extend the local skill governance guard to require the intake policy.
- Extend skill governance tests for the intake policy.
- Update tracker, docs index, validation audit, command index, ergonomics map, and command-center
  data.
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
- No bulk import of unreviewed skills.

## Required Outputs

- `docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md`.
- Updated `scripts/check-gate0-skill-governance.ts`.
- Updated `packages/fixtures/tests/gate0-skill-governance.test.ts`.
- Updated docs, tracker, progress snapshot, and command-center data.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- The intake policy explicitly keeps GateZero at `G0_RESEARCH` and `research_only`.
- The policy blocks bulk skill dumping and future-phase capability skills.
- `pnpm check:gate0-skills` verifies the policy exists and contains required intake controls.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
