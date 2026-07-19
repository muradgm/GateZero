# TRD-610 Workspace Runtime Preservation Recheck

Status: accepted

## Goal

Ensure runtime metadata refresh preserves strategy-review and market-intelligence workspace panels.

## Scope

- Preserve both normalized workspace records during local runtime refresh.
- Add regression assertions for the preservation path.

## Blocked Scope

- External polling, remote market feeds, account routes, credentials, or action paths.

## Acceptance

Accepted when runtime refresh changes operating metadata without removing scenario panels.
