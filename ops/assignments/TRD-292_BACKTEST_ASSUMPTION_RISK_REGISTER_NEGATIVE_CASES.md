# TRD-292 Backtest Assumption Risk Register Negative Cases

## Goal

Add negative validation coverage for the Gate 1 backtest assumption risk register.

## Scope

- Add focused contract tests for invalid risk-register payloads.
- Keep the register schema-only and local.
- Update documentation, tracklist, command-center data, and review records.

## Blocked Scope

- No broker integration.
- No paper or live execution.
- No autonomous execution.
- No AI buy/sell prediction.
- No strategy approval, readiness, promotion, profitability, or performance claims.
- No risk-gate loosening.

## Acceptance Criteria

- Empty risk lists fail validation.
- Invalid severity and disposition values fail validation.
- Non-`G1_BACKTESTING` gate values and non-`historical_backtesting_only` scope values fail
  validation.
- Evidence-only and no-execution boundaries fail closed when changed.
- `pnpm verify:gate0` passes.
