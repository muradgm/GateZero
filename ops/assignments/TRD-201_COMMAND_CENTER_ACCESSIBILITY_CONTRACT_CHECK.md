# TRD-201: Command Center Accessibility Contract Check

## Objective

Add static coverage that protects the command-center accessibility baseline.

## Scope

Allowed:

- Check skip link, main target, table caption, and focus style presence.
- Keep checks local and deterministic.

Blocked:

- User accounts, external services, execution controls, prediction, approval semantics, readiness
  semantics, strategy claims, or risk-gate loosening.

## Required Output

- Updated `packages/fixtures/tests/gate0-command-center-data.test.ts`
- `docs/operations/GATE0_COMMAND_CENTER_ACCESSIBILITY_CONTRACT_CHECK.md`

## Acceptance Criteria

- Accessibility baseline controls are covered by tests.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
