# TRD-596 Red Flag Engine

Status: accepted

## Goal

Implement a Gate 2 red-flag engine contract that turns sourced market-intelligence risks into
blocker evidence.

## Scope

- Linked research case.
- Market-intelligence input, news/event, and signal-candidate refs.
- Red flag category, severity, blocker status, evidence refs, invalidation conditions, and
  limitation notes.
- Explicit risk review and operator decision requirements.

## Blocked Scope

- Final recommendations, action routes, automated decisions, account access, execution paths,
  approval claims, readiness claims, certainty claims, performance claims, and risk-gate loosening.

## Acceptance

Accepted when red flags remain sourced blocker evidence only and tests reject incoherent blocker
state, skipped review, route creation, and final recommendation state.
