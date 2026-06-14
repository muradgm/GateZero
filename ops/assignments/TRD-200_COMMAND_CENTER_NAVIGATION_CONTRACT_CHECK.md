# TRD-200: Command Center Navigation Contract Check

## Objective

Add static coverage that keeps command-center navigation aligned with rendered sections.

## Scope

Allowed:

- Check nav labels and section ids.
- Keep checks local and deterministic.

Blocked:

- New product flows, external links as authority, broker integration, execution support, prediction,
  approval semantics, readiness semantics, or risk-gate loosening.

## Required Output

- Updated `packages/fixtures/tests/gate0-command-center-data.test.ts`
- `docs/operations/GATE0_COMMAND_CENTER_NAVIGATION_CONTRACT_CHECK.md`

## Acceptance Criteria

- Navigation labels map to rendered local sections.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
