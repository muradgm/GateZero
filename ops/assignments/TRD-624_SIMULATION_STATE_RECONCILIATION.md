# TRD-624 Simulation State Reconciliation

Status: accepted

## Goal

Detect drift between expected and observed local paper-account state.

## Acceptance

- Journal tail, equity, and open-position count are compared.
- Any mismatch requires a readonly emergency posture.
- Account identity mismatch fails before reconciliation.
