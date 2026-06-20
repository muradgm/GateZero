# TRD-328 Stale Data Threshold Policy

## Goal

Draft a Gate 1 stale-data threshold policy for historical snapshots without live data access.

## Scope

- Define local review expectations for snapshot age.
- Keep stale-data blockers evidence-unusable until reviewed.
- Avoid provider-specific automation.

## Blocked

- No live freshness polling.
- No external market data calls.
- No override path that loosens blockers.

## Acceptance

- Policy doc is source-linked and indexed.
- Reviews confirm no expansion beyond historical backtesting.
