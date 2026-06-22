# TRD-424 Simulated-Order Record Contract Schema

## Goal

Add the Gate 2 local simulated-order record contract schema.

## Scope

- Require `G2_PAPER_TRADING`.
- Require `paper_simulation_planning_only`.
- Require no external account, no credentials, no live route, no automated action, and no execution
  path.

## Blocked

- No runtime mechanics.
- No external route.
- No approval or performance claims.

## Acceptance

- Schema exists and is exported.
- Negative tests reject boundary mutations.
