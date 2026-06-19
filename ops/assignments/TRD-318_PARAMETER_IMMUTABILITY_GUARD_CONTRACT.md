# TRD-318 Parameter Immutability Guard Contract

## Goal

Add a Gate 1 schema-only contract and fixture proving that strategy parameter drift blocks evidence
use.

## Acceptance Criteria

- Parameter drift must match expected versus observed parameter hashes.
- Drifted parameters require blocked evidence state.
- No strategy approval, readiness, or profitability claim is introduced.
- `pnpm check:gate1-contracts` and `pnpm verify:gate0` pass.
