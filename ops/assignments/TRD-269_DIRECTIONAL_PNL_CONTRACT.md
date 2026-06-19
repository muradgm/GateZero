# TRD-269 Directional PnL Contract

## Goal

Add a Gate 1 schema-only contract that records directional PnL evidence for long and short
historical backtest checks.

## Allowed Scope

- Add a local Zod schema for directional PnL evidence.
- Require bid/ask side semantics for long and short checks.
- Require gross, conversion, cost, and net PnL consistency.
- Preserve evidence-only and no-execution boundary fields.
- Update docs and Gate 1 contract guard indexing.

## Blocked Scope

- Live or paper execution.
- Broker integration.
- Account identifiers or credentials.
- Strategy signal generation.
- AI buy/sell prediction.
- Strategy approval, readiness, profitability, or performance claims.
- Risk-gate loosening.

## Acceptance Criteria

- Contract is schema-only.
- Long and short bid/ask semantics are explicit.
- PnL arithmetic is validated.
- No execution path or external access is introduced.
- Documentation and guard indexing are updated.

## Next Packet

`TRD-270 Directional PnL Contract Tests`.
