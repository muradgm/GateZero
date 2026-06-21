# TRD-368 Review Artifact Aging Policy Draft

## Goal

Draft a policy for when old review artifacts need refresh without creating review churn.

## Scope

- Define refresh triggers for reviews.
- Define non-triggers that should not create bookkeeping loops.
- Keep review artifacts as operating evidence only.

## Blocked

- No automatic review regeneration.
- No CI evidence refresh loop.
- No approval or readiness semantics.

## Acceptance

- Review artifact aging policy draft exists and is source-linked.
- Policy avoids recurring churn.
- `pnpm verify:gate0` passes.
