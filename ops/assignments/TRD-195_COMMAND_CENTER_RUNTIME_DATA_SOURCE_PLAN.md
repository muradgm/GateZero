# TRD-195: Command Center Runtime Data Source Plan

## Objective

Plan how the command center can later read Gate 0 artifacts without expanding scope.

## Scope

Allowed:

- Define local artifact inputs and prohibited data sources.
- Keep the current implementation static.

Blocked:

- Runtime external access, broker data, account credentials, execution routes, prediction, strategy
  claims, readiness semantics, or risk-gate loosening.

## Required Output

- `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_DATA_SOURCE_PLAN.md`

## Acceptance Criteria

- The plan keeps all data local and read-only.
- The plan treats tracklist and review records as operating evidence.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
