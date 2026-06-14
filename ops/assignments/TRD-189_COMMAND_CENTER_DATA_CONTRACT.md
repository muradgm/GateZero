# TRD-189: Command Center Data Contract

## Objective

Define the static data contract for the initial Gate 0 command center.

## Scope

Allowed:

- Define display-only fields for gate, scope, latest packet, verification, CI evidence, review
  coverage, protected-loop steps, boundary items, next actions, and docs.
- Keep data static and local.

Blocked:

- Market data feeds, broker credentials, order state, strategy rankings, AI recommendations,
  readiness scores, approval scores, or external APIs.

## Required Output

- `docs/operations/GATE0_COMMAND_CENTER_DATA_CONTRACT.md`
- `apps/web/src/command-center-data.js`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Contract fields are display-only.
- Contract contains no execution controls.
- Gate 0 verification remains passing.

## Source Links

- Data source: `apps/web/src/command-center-data.js`
- Current tracker: `ops/runtime/tracklist.md`
