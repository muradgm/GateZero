# TRD-493 Frontend Evidence Panel Implementation

## Goal

Implement read-only evidence panel rendering with nearby limitation context.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.

## Acceptance Criteria

- Evidence rows render local verification, CI, agent, and review coverage signals.
- Evidence panel remains read-only.
- Limitations render near evidence.
- `pnpm verify:gate0` passes.

## Source Links

- Report: `docs/operations/GATE2_FRONTEND_EVIDENCE_PANEL_IMPLEMENTATION.md`
- Tracklist: `ops/runtime/tracklist.md`
