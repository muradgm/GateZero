# TRD-188: Gate 0 Command Center Scope And Boundary

## Objective

Define the permitted scope for an initial Gate 0 command center.

## Scope

Allowed:

- Build a read-only local control-plane dashboard.
- Show gate status, verification status, CI evidence, review coverage, risk boundaries, and source
  links.
- Keep the surface focused on operating health.

Blocked:

- UI for trade selection, broker integration, paper or live execution, AI buy/sell prediction,
  strategy performance claims, readiness labels, approval semantics, marketing claims, or risk-gate
  loosening.

## Required Output

- `docs/operations/GATE0_COMMAND_CENTER_SCOPE_AND_BOUNDARY.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Scope defines command center as read-only and local-first.
- Scope blocks execution, prediction, broker, and readiness affordances.
- Gate 0 verification remains passing.

## Source Links

- Web app: `apps/web/`
- Current tracker: `ops/runtime/tracklist.md`
