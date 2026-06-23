# TRD-491 Read-Only Frontend Shell Implementation

## Goal

Implement the first local read-only TraderFrame frontend shell.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.
- Work type: local frontend implementation.

## Acceptance Criteria

- Shell renders Overview, Evidence, Limitations, Risk, Workflow, and Docs sections.
- Data remains local static/runtime only.
- No action controls, external accounts, credentials, live routes, autonomous actions, AI
  prediction, approval, readiness, or performance-claim surfaces.
- `pnpm verify:gate0` passes.

## Source Links

- Report: `docs/operations/GATE2_READ_ONLY_FRONTEND_SHELL_IMPLEMENTATION.md`
- Tracklist: `ops/runtime/tracklist.md`
