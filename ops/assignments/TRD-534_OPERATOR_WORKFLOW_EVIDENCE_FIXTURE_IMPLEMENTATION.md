# TRD-534 Operator Workflow Evidence Fixture Implementation

Status: accepted

## Goal

Represent operator workflow evidence references inside the local simulation evidence detail fixture.

## Scope

- Add workflow evidence card identifiers to the fixture.
- Keep operator authority manual and explicit.
- Avoid action controls or automated decisions.

## Blocked Scope

- Dispatch buttons, execution controls, decision automation, or wording that replaces the operator.

## Acceptance

Accepted when the fixture parses against the contract and keeps `operator_required: true`.
