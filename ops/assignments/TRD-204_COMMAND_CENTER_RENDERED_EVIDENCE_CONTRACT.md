# TRD-204: Command Center Rendered Evidence Contract

## Objective

Add a local render-contract guard for the static command-center surface.

## Scope

Allowed:

- Check the local static app mount, labels, grouped source links, and Gate 0 copy.
- Add focused tests.
- Wire the guard into `pnpm check:gate0`.

Blocked:

- External browser services, deployment, execution support, broker integration, prediction, strategy
  claims, approval semantics, readiness semantics, or risk-gate loosening.

## Required Output

- `scripts/check-gate0-command-center-render-contract.ts`
- `packages/fixtures/tests/gate0-command-center-render-contract.test.ts`
- `docs/operations/GATE0_COMMAND_CENTER_RENDERED_EVIDENCE_CONTRACT.md`

## Acceptance Criteria

- Render contract guard passes locally.
- Guard fails on missing required static render affordances.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
