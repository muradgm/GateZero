# TRD-197: Command Center Evidence Freshness Guard

## Objective

Prevent the static command center from drifting behind Gate 0 operating evidence.

## Scope

Allowed:

- Add a local freshness check for command center packet, validation, and review coverage evidence.
- Add focused tests.
- Wire the guard into `pnpm check:gate0`.

Blocked:

- External evidence fetching, deployment checks, strategy performance claims, execution support,
  prediction, approval semantics, or risk-gate loosening.

## Required Output

- `scripts/check-gate0-command-center-freshness.ts`
- `packages/fixtures/tests/gate0-command-center-freshness-check.test.ts`
- `docs/operations/GATE0_COMMAND_CENTER_EVIDENCE_FRESHNESS_GUARD.md`

## Acceptance Criteria

- Guard fails on stale latest packet evidence.
- Guard fails on stale validation evidence.
- Guard fails on stale review coverage evidence.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
