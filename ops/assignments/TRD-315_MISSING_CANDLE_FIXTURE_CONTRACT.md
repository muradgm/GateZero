# TRD-315 Missing Candle Fixture Contract

## Goal

Add a Gate 1 schema-only contract and fixture proving that missing historical candles block evidence
use.

## Acceptance Criteria

- Missing-candle fixtures require `blocked` evidence state.
- Attempts to mark missing-candle evidence usable fail validation.
- No broker, execution, paper trading, prediction, or approval path is added.
- `pnpm check:gate1-contracts` and `pnpm verify:gate0` pass.
