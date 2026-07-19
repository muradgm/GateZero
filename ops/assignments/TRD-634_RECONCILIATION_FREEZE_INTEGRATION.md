# TRD-634 Reconciliation Freeze Integration

Status: accepted

## Goal

Freeze local mutation when account or journal state drifts.

## Acceptance

Account reconciliation mismatch or journal-tail mismatch returns blocked evidence with unchanged
state.
