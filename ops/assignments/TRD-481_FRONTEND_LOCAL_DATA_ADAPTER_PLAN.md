# TRD-481 Frontend Local Data Adapter Plan

## Goal

Plan the read-only frontend data adapter so future UI work uses local static/runtime data only.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.
- Work type: adapter planning only.

## Required Outputs

- Local data adapter plan.
- QA/security, risk, and orchestrator review records.
- Tracker and guard coverage updates.

## Acceptance Criteria

- No external services, accounts, credentials, broker data, live routes, or execution paths.
- Data source remains `apps/web/src/command-center-data.js` plus local runtime snapshot only.
- Future adapters must expose read-only state for evidence, risk, limitations, workflow, and docs.
- `pnpm verify:gate0` passes.

## Source Links

- Report: `docs/operations/GATE2_FRONTEND_LOCAL_DATA_ADAPTER_PLAN.md`
- Tracklist: `ops/runtime/tracklist.md`
