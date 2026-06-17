# TRD-224 Gate 0 Skill Usage Handoff Note

## Goal

Provide a concise operator handoff for choosing the correct project-local skill lens on future Gate
0 maintenance work.

## Allowed Scope

- Add skill selection guidance for current reviewer lanes.
- Link the routing matrix and accepted skill library.
- Update tracker, docs index, artifact map, and progress records.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No new product workflow.
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

- `docs/operations/GATE0_SKILL_USAGE_HANDOFF_NOTE.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- The handoff gives clear selection rules without expanding scope.
- The handoff links to the routing matrix and skill governance review.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
