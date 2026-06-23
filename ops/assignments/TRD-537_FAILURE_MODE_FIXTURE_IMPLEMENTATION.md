# TRD-537 Failure Mode Fixture Implementation

Status: accepted

## Goal

Represent failure-mode evidence references inside the simulation evidence detail fixture.

## Scope

- Add failure-mode evidence references.
- Reject fresh evidence details that depend on blocked failure-mode references.
- Preserve the distinction between evidence and approval.

## Blocked Scope

- Treating failure-mode coverage as strategy readiness, safety, approval, or performance evidence.

## Acceptance

Accepted when fresh evidence with blocked failure references fails contract validation.
