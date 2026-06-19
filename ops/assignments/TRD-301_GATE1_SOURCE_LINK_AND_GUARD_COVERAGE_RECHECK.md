# TRD-301 Gate 1 Source Link And Guard Coverage Recheck

## Goal

Recheck Gate 1 source links and guard coverage after the TRD-292 through TRD-300 batch.

## Scope

- Run focused source-link and guard checks.
- Record the recheck as an accepted control-plane packet.
- Expand the next Gate 1 queue based on the current evidence-control gaps.

## Blocked Scope

- No broker integration.
- No paper or live execution.
- No autonomous execution.
- No AI buy/sell prediction.
- No strategy approval, readiness, promotion, profitability, or performance claims.
- No risk-gate loosening.

## Acceptance Criteria

- Gate 1 contract guard passes.
- Source-link duplicate guard passes.
- Tracklist section-length guard passes.
- Docs coverage guard passes.
- `pnpm verify:gate0` passes.
