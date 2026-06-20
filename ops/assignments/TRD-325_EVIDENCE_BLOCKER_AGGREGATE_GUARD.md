# TRD-325 Evidence Blocker Aggregate Guard

## Goal

Add a local guard that treats Gate 1 blocker fixtures as a required aggregate group.

## Scope

- Verify all required blocker IDs are referenced by the evidence bundle summary.
- Verify blocker fixtures remain evidence unusable.
- Verify the summary remains blocked and no-claim.

## Blocked

- No completion status that bypasses unresolved blockers.
- No approval, performance, or execution language.

## Acceptance

- Guard fails when a blocker reference is removed.
- Focused and full validation pass.
