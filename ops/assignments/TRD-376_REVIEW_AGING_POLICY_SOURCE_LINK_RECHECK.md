# TRD-376 Review Aging Policy Source-Link Recheck

## Goal

Confirm the review artifact aging policy remains indexed and non-automated.

## Scope

- Recheck source links for the review aging policy.
- Confirm the policy does not create an automatic refresh loop.
- Preserve review refresh as material-change driven.

## Blocked

- No automatic review regeneration.
- No CI evidence churn.
- No approval or readiness semantics.

## Acceptance

- Source-link recheck record exists.
- Review aging policy remains non-automated.
- `pnpm verify:gate0` passes.
