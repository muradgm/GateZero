# TRD-256 Command Center Runtime Endpoint Response Contract

## Goal

Add a response-level contract test for the local preview server route
`/runtime/command-center-data.json`.

## Allowed Scope

- Add a focused preview-server response test for the runtime command-center endpoint.
- Validate the returned JSON payload with `CommandCenterRuntimeDataSchema`.
- Verify local response headers for JSON content type and no-store caching.
- Update command-center fallback metadata, tracker, progress snapshot, docs index, and artifact map.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No external service lookup in the browser app beyond the same-origin local runtime endpoint.
- No deployment status claim.
- No live trading.
- No broker integration.
- No paper order mechanics.
- No autonomous execution.
- No AI buy/sell prediction.
- No broker API key handling.
- No strategy approval or readiness semantics.
- No performance, profitability, or marketing claims.
- No risk-gate loosening.

## Required Outputs

- Updated `packages/fixtures/tests/gate0-command-center-preview-script.test.ts`.
- `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_ENDPOINT_RESPONSE_CONTRACT.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Preview server runtime endpoint returns HTTP 200.
- Runtime endpoint returns `application/json; charset=utf-8`.
- Runtime endpoint returns `Cache-Control: no-store`.
- Runtime endpoint payload validates with `CommandCenterRuntimeDataSchema`.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
