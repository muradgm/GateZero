# TRD-623 Immutable Simulation Event Journal

Status: accepted

## Goal

Record deterministic local lifecycle evidence in an append-only hash chain.

## Acceptance

- Sequence increments exactly once per append.
- Journal identity and previous-event hash are preserved.
- Append returns frozen new state without mutating prior input.
