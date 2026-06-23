# TRD-480 Frontend No-Action-Control Test Plan

## Goal

Define the no-action-control test plan required before any TraderFrame read-only frontend build is
accepted.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.
- Work type: test planning only.
- Primary lenses:
  - `traderframe-frontend-engineer`
  - `traderframe-copy-reviewer`

## Required Test Coverage

- Blocked button labels.
- Blocked form labels and placeholder text.
- Blocked route names and navigation labels.
- Blocked empty-state copy.
- Blocked panel titles and status badges.
- Blocked menu and command-palette entries.
- Blocked data keys that could render action controls later.

## Blocked Scope

- No frontend implementation.
- No broker integration, account connectivity, credential handling, live execution, autonomous
  execution, AI buy/sell prediction, order controls, approval labels, readiness labels,
  profitability claims, public performance claims, or risk-gate loosening.

## Required Outputs

- Frontend no-action-control test plan record.
- QA/security, risk, and orchestrator review records.
- Tracklist, docs index, command-center, and guard coverage updates.
- Validation evidence.

## Acceptance Criteria

- Test plan names blocked UI text classes.
- Test plan names allowed replacement copy classes.
- Test plan requires negative fixture coverage before implementation acceptance.
- Test plan requires scanner or test coverage for app data and rendered UI.
- Gate remains `G2_PAPER_TRADING`.
- Scope remains `paper_simulation_planning_only`.
- Full local verification passes.

## Source Links

- Report: `docs/operations/GATE2_FRONTEND_NO_ACTION_CONTROL_TEST_PLAN.md`
- QA/security review: `ops/runtime/reviews/TRD-480_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-480_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-480_ORCHESTRATOR_ACCEPTANCE.md`
- Tracklist: `ops/runtime/tracklist.md`
