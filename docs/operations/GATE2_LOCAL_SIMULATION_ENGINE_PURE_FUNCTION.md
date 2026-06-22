# Gate 2 Local Simulation Engine Pure Function

TRD-444 implements the first local-only Gate 2 simulation engine function.

## Decision

The simulation engine is a pure local function. It validates Gate 2 contract-backed inputs and
returns a deterministic local result artifact. It does not connect to external systems, dispatch
actions, hold credentials, route live activity, automate operator decisions, or make performance or
readiness claims.

## Implemented Surface

- Source: `packages/core/src/gate2-local-simulation-engine.ts`
- Tests: `packages/core/tests/gate2-local-simulation-engine.test.ts`
- Export: `packages/core/src/index.ts`

## Behavior

- Parses all inputs through existing Gate 2 contract schemas.
- Records a local simulation result only when risk review, operator action, state transition, and
  fill assumption records align.
- Returns `blocked_local_simulation` with explicit reasons when inputs are incomplete, still under
  review, mismatched, or blocked.
- Builds a deterministic replay key from stable local identifiers and decisions.
- Preserves all boundary flags as false for external access, execution paths, credentials, live
  routes, and automation.

## Validation

- `pnpm vitest run packages/core/tests/gate2-local-simulation-engine.test.ts`
- `pnpm typecheck`
- `pnpm verify:gate0`

## Source Links

- Source packet: `ops/assignments/TRD-444_LOCAL_SIMULATION_ENGINE_PURE_FUNCTION.md`
- Reviews: `ops/runtime/reviews/TRD-444_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-444_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-444_ORCHESTRATOR_ACCEPTANCE.md`
- Source: `packages/core/src/gate2-local-simulation-engine.ts`
- Tests: `packages/core/tests/gate2-local-simulation-engine.test.ts`
