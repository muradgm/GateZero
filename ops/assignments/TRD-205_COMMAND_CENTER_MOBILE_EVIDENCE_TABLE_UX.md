# TRD-205: Command Center Mobile Evidence Table UX

## Objective

Improve mobile readability for the command-center evidence table.

## Scope

Allowed:

- Add mobile evidence row labels.
- Add responsive table-card styling.
- Add static coverage for the labels.

Blocked:

- New product features, external data, execution controls, broker integration, prediction, strategy
  claims, readiness semantics, approval semantics, or risk-gate loosening.

## Required Output

- Updated `apps/web/src/main.js`
- Updated `apps/web/src/styles.css`
- `docs/operations/GATE0_COMMAND_CENTER_MOBILE_EVIDENCE_TABLE_UX.md`

## Acceptance Criteria

- Mobile evidence rows expose label/value structure.
- Desktop table remains intact.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
