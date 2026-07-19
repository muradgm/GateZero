# TRD-608 Scenario Review Empty-State Handling

Status: accepted

## Goal

Keep absent scenario, risk-review, simulation, artifact, and operator-note records neutral and
local.

## Scope

- Render explicit local empty states without advice, failure alarm, or action semantics.
- Preserve the workspace layout when optional records are absent.

## Blocked Scope

- Remote loading, external accounts, credentials, action controls, readiness language, and claims.

## Acceptance

Accepted when each missing record family has a clear, non-actionable local empty state.
