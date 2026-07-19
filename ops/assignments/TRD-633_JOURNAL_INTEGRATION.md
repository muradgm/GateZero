# TRD-633 Journal Integration

Status: accepted

## Goal

Append each accepted local mutation exactly once to a validated hash chain.

## Acceptance

Sequence, prior hash, payload hash, journal identity, and event-ID uniqueness are enforced before
append.
