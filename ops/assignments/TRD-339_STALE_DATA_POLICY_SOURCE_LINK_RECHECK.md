# TRD-339 Stale Data Policy Source Link Recheck

## Goal

Recheck source links for stale-data policy records after blocker expansion.

## Scope

- Confirm stale-data policy docs are indexed.
- Keep stale snapshots blocked pending review.
- Preserve local-only validation.

## Blocked

- No live freshness polling.
- No provider adapter.

## Acceptance

- Source-linked recheck doc exists.
- Gate 1 contract guard remains green.
