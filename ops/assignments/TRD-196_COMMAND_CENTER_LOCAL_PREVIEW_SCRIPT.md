# TRD-196: Command Center Local Preview Script

## Objective

Add a repeatable local preview command for the static command center.

## Scope

Allowed:

- Add a local static server script bound to `127.0.0.1`.
- Add a package script for operator preview.

Blocked:

- Public deployment, external hosting, authentication, broker integration, execution routes,
  prediction, or risk-gate loosening.

## Required Output

- `scripts/preview-web.ts`
- `pnpm preview:web`
- `docs/operations/GATE0_COMMAND_CENTER_LOCAL_PREVIEW_SCRIPT.md`

## Acceptance Criteria

- Preview serves `apps/web` only.
- Preview is local host only.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
