# TRD-199: Command Center CI Run Freshness Guard

## Objective

Extend the command-center freshness guard to check displayed CI run evidence.

## Scope

Allowed:

- Compare local command-center CI run display with the local remote-verification evidence index.
- Add focused tests.

Blocked:

- Live GitHub fetching, external service calls, deployment checks, execution support, prediction,
  strategy claims, approval semantics, readiness semantics, or risk-gate loosening.

## Required Output

- Updated `scripts/check-gate0-command-center-freshness.ts`
- Updated `packages/fixtures/tests/gate0-command-center-freshness-check.test.ts`
- `docs/operations/GATE0_COMMAND_CENTER_CI_RUN_FRESHNESS_GUARD.md`

## Acceptance Criteria

- Guard fails when command-center CI run evidence is stale.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
