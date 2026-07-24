# TRD-760 Brief Blocked-State Contracts And Fixtures

Status: accepted

## Goal

Define deterministic availability statuses and reason codes for intelligence briefs.

## Output

- `Gate2IntelligenceBriefAvailabilitySchema`
- Available, stale-source blocked, and no-linked-brief unavailable fixtures.

## Acceptance

- Available state requires one linked brief and visible scenarios.
- Blocked and unavailable states suppress scenarios and reject authority flags.

## Next

TRD-761 adds manual local research-case selection.
