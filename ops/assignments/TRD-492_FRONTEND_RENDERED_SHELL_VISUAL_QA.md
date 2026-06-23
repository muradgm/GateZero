# TRD-492 Frontend Rendered Shell Visual QA

## Goal

Verify the rendered frontend shell on desktop and mobile-sized viewports.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.
- Work type: rendered visual QA.

## Acceptance Criteria

- App loads without a framework error overlay.
- Desktop and mobile layouts show meaningful content.
- Navigation, evidence, limitations, risk, workflow, and docs surfaces are visible.
- No action-control language appears.
- `pnpm verify:gate0` passes.

## Source Links

- Report: `docs/operations/GATE2_FRONTEND_RENDERED_SHELL_VISUAL_QA.md`
- Tracklist: `ops/runtime/tracklist.md`
