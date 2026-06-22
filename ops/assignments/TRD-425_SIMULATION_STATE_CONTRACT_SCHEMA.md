# TRD-425 Simulation State Contract Schema

## Goal

Add the Gate 2 simulation state contract schema.

## Scope

- Define local planning states.
- Require operator action and rollback to Gate 1.
- Reject automated or incoherent transitions.

## Blocked

- No state machine implementation.
- No external dispatch.
- No autonomous transition.

## Acceptance

- Schema exists and is exported.
- Tests cover state boundary failures.
