# TRD-539 Evidence Contract Guard Implementation

Status: accepted

## Goal

Update the contract guard so the new Gate 2 simulation evidence detail contract cannot drift.

## Scope

- Require the new schema name.
- Require the new fixture name.
- Require the new negative-test snippets.
- Require the new implementation docs.

## Blocked Scope

- Broad allowlists, skipped validation, stale tracker references, or loosened blocked-scope checks.

## Acceptance

Accepted when `pnpm check:gate1-contracts` passes with the new artifact count.
