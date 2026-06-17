# TRD-228 Command Center Hash Navigation State

## Goal

Fix command-center sidebar active state so direct links such as `#loop` mark the matching section as
active.

## Allowed Scope

- Update static command-center navigation state.
- Add or update render-contract tests for hash-aware navigation.
- Update tracker, docs index, artifact map, progress snapshot, and command-center metadata.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No UI expansion beyond orientation state.
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

- Updated `apps/web/src/main.js`.
- Updated command-center render contract and tests.
- `docs/operations/GATE0_COMMAND_CENTER_HASH_NAVIGATION_STATE.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- A direct hash URL can be represented by matching active navigation state.
- Navigation active state updates on hash changes.
- Command center remains static, local, read-only, and research-only.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
