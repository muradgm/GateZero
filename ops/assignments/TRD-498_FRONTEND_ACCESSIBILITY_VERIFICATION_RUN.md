# TRD-498 Frontend Accessibility Verification Run

## Goal

Run accessibility verification for the read-only frontend shell.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.

## Acceptance Criteria

- Shell includes skip link, main landmark, keyboard navigation, focus states, table captions, and
  mobile labels.
- No inaccessible action controls are introduced.
- `pnpm verify:gate0` passes.

## Source Links

- Report: `docs/operations/GATE2_FRONTEND_ACCESSIBILITY_VERIFICATION_RUN.md`
- Tracklist: `ops/runtime/tracklist.md`
