# TRD-246 Command Center Local Auto Refresh

## Goal

Make the command center auto-refresh from the local runtime snapshot endpoint while preserving a
static fallback when opened without the preview server.

## Allowed Scope

- Update command-center rendering to merge local runtime snapshot data.
- Poll only the same-origin local preview endpoint.
- Preserve static fallback data.
- Add focused tests for the local refresh hook.
- Update tracker, docs index, artifact map, and source links.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No external live data fetches.
- No broker integration.
- No live trading.
- No paper order mechanics.
- No autonomous execution.
- No AI buy/sell prediction.
- No credential or token handling.
- No strategy approval or readiness semantics.
- No performance, profitability, or marketing claims.
- No risk-gate loosening.

## Required Outputs

- Updated `apps/web/src/main.js`.
- Updated `apps/web/src/command-center-data.js`.
- Updated command-center tests.
- `docs/operations/GATE0_COMMAND_CENTER_LOCAL_AUTO_REFRESH.md`.

## Acceptance Criteria

- Browser fetches only `/runtime/command-center-data.json`.
- UI re-renders local operating evidence from the runtime snapshot.
- Static fallback remains available.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
