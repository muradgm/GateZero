# TRD-428 Simulated Fill Assumption Schema

## Goal

Add the Gate 2 simulated fill assumption contract schema.

## Scope

- Record local fill assumptions as limitations.
- Require spread, slippage, cost, latency, and same-candle policy fields.
- Reject performance claims.

## Blocked

- No fill engine.
- No live market route.
- No readiness or performance language.

## Acceptance

- Schema exists and is exported.
- Negative tests require limitation notes.
