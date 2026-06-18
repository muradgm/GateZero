# TRD-255 Command Center Runtime Schema Contract

## Goal

Add a runtime schema contract for the local command-center JSON payload and validate the runtime
data builder against that contract.

## Allowed Scope

- Add a command-center runtime data schema under `packages/contracts`.
- Export the schema from the contracts package.
- Validate `scripts/build-command-center-runtime-data.ts` output with the schema.
- Add focused schema tests and runtime-builder schema coverage.
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

- `packages/contracts/src/command-center-runtime-data.ts`.
- Updated `packages/contracts/src/index.ts`.
- Updated `scripts/build-command-center-runtime-data.ts`.
- `packages/contracts/tests/command-center-runtime-data.test.ts`.
- Updated `packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`.
- `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_SCHEMA_CONTRACT.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Runtime command-center payload is validated by a strict schema.
- Schema rejects malformed run identifiers, non-success CI state, and stale accepted-record counts.
- Runtime boundary schema keeps the endpoint local and non-executing.
- Command-center freshness checks pass.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
