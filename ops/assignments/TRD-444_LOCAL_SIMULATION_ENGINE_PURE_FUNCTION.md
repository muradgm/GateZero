# TRD-444 Local Simulation Engine Pure Function

## Goal

Implement the first Gate 2 local simulation engine as a pure deterministic function.

## Scope

- Add a local-only simulation engine function in `packages/core`.
- Validate all inputs against existing Gate 2 contract schemas.
- Produce a deterministic local result artifact.
- Return explicit blocked reasons for misaligned risk, operator, state, or assumption records.
- Keep the function free of external access, dispatch, credentials, live routing, automation, and
  claims.

## Blocked

- No broker integration.
- No external account connectivity.
- No credentials or API key handling.
- No live or real order placement.
- No autonomous execution.
- No AI buy/sell prediction.
- No strategy approval, readiness, safety, deployment, performance, or profitability claims.
- No risk-gate loosening.

## Required Outputs

- `packages/core/src/gate2-local-simulation-engine.ts`
- `packages/core/tests/gate2-local-simulation-engine.test.ts`
- Export from `packages/core/src/index.ts`
- Operations report and QA/RISK/ORCHESTRATOR review records.
- Tracker, docs index, progress snapshot, and command-center alignment.

## Acceptance

- Focused local simulation engine tests pass.
- `pnpm verify:gate0` passes.
- Engine output remains evidence-only, simulation-only, local-only, deterministic, and no-claim.
- Misaligned or blocked inputs produce blocked local simulation results.
- Contract boundary mutations are rejected before producing output.
