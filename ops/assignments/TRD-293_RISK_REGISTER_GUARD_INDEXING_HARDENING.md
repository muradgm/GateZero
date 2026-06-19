# TRD-293 Risk Register Guard Indexing Hardening

## Goal

Harden the Gate 1 contract guard so risk-register negative-case coverage cannot silently drift.

## Scope

- Index the risk-register and risk-register negative-case docs in the Gate 1 guard.
- Add a guard check for the risk-register negative contract test names.
- Add guard test coverage for missing risk-register negative tests.
- Update docs, tracklist, command-center data, and review records.

## Blocked Scope

- No broker integration.
- No paper or live execution.
- No autonomous execution.
- No AI buy/sell prediction.
- No strategy approval, readiness, promotion, profitability, or performance claims.
- No risk-gate loosening.

## Acceptance Criteria

- `pnpm check:gate1-contracts` fails closed if a required risk-register negative test is missing.
- `pnpm check:gate1-contracts` passes with current indexed docs and tests.
- `pnpm verify:gate0` passes.
