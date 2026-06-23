# TRD-533 Simulation Evidence Schema Tests

Status: accepted

## Goal

Add required and negative contract tests for the Gate 2 simulation evidence detail schema.

## Scope

- Validate required local references.
- Reject missing source artifacts.
- Reject action, account, credential, live-route, automation, approval, and performance-claim
  mutations.

## Blocked Scope

- Test cases that imply the schema can approve a strategy, place an order, connect accounts, or
  certify trading outcomes.

## Acceptance

Accepted when the focused Gate 2 contract tests pass.
