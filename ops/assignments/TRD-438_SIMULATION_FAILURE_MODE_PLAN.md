# TRD-438 Simulation Failure Mode Plan

## Goal

Plan Gate 2 simulation failure modes and rollback behavior.

## Scope

- Define blocker categories for missing evidence, missing risk review, missing operator action,
  credential attempts, external route attempts, live route attempts, and nondeterministic replay.
- Require rollback to Gate 1 maintenance or Gate 2 planning hold.

## Blocked

- No failure handler implementation.
- No automatic recovery.
- No external action.

## Acceptance

- Failure mode plan exists.
- Blocked states remain conservative and local.
