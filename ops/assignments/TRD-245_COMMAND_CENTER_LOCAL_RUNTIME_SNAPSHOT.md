# TRD-245 Command Center Local Runtime Snapshot

## Goal

Add a local runtime snapshot builder and preview endpoint so the command center can read current
Gate 0 operating records without external service calls.

## Allowed Scope

- Add a local runtime data builder that reads tracker, review records, and remote evidence index.
- Add a local preview endpoint under `127.0.0.1`.
- Add focused tests for runtime snapshot behavior.
- Update tracker, docs index, artifact map, and source links.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No browser-side GitHub polling.
- No external API calls.
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

- `scripts/build-command-center-runtime-data.ts`.
- Updated `scripts/preview-web.ts`.
- `packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`.
- `docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SNAPSHOT.md`.

## Acceptance Criteria

- Runtime snapshot is derived from local repo records only.
- Preview endpoint stays same-origin and local.
- Focused tests pass.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- `pnpm verify:gate0` passes.

## Next Agent

QA_SECURITY review, then RISK review, then ORCHESTRATOR acceptance.
