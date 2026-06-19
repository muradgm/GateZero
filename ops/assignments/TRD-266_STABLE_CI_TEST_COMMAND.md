# TRD-266 Stable CI Test Command

## Goal

Add `pnpm test:ci` as the stable single-worker test command used by `pnpm verify:gate0`.

## Allowed Scope

- Add `test:ci` to `package.json`.
- Update `verify:gate0` to use `test:ci`.
- Document the command in README and operations records.
- Update tracker and command-center metadata.

## Blocked Scope

- Product behavior changes.
- Broker integration.
- Execution or paper order mechanics.
- AI prediction.
- Strategy approval, readiness, profitability, or performance claims.
- Risk-gate loosening.

## Acceptance Criteria

- `pnpm test:ci` passes.
- `pnpm verify:gate0` passes.
- Command remains local validation only.

## Next Packet

`TRD-267 Dependency Audit And Upgrade Plan`.
