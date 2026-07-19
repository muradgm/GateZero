# TRD-618 Deterministic Paper Account Contract

Status: accepted

## Goal

Define a strict local paper-account record for cash, marked positions, equity, and journal state.

## Acceptance

- Equity reconciles to cash and marked position values.
- Position instruments are unique and position count is exact.
- Leverage is fixed at one and every external or execution boundary is blocked.
