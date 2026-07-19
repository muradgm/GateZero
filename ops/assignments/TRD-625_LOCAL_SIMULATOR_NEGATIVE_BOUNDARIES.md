# TRD-625 Local Simulator Negative Boundaries

Status: accepted

## Goal

Prove the simulator contracts reject unsafe account, credential, route, autonomy, and claim states.

## Acceptance

- Contract tests reject every blocked boundary mutation.
- Tests cover accounting drift, invalid transitions, optimistic fills, and unsafe reconciliation.
- Fixtures contain no real account data or secrets.
