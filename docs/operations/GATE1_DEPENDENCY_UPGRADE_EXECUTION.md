# Gate 1 Dependency Upgrade Execution

## Purpose

Execute the bounded dependency upgrade identified by TRD-267 while preserving the TraderFrame
GateZero control-plane boundary.

## Change Summary

- Upgraded `vitest` to `^4.1.9`.
- Added explicit `vite` `^7.2.0` as a dev dependency to satisfy Vitest 4 peer requirements on a
  patched Vite line.
- Added a narrow pnpm override for `esbuild` `^0.28.1`.
- Refreshed `pnpm-lock.yaml`.

## Validation Evidence

- `pnpm audit --audit-level low`: no known vulnerabilities found.
- `pnpm test:ci`: 71 test files passed, 356 tests passed.

## Boundary

This packet changes development tooling only. It does not add broker integration, order placement,
execution automation, credentials, strategy readiness semantics, AI buy/sell prediction, report
publishing, or performance claims.

Gate remains `G1_BACKTESTING`.

Scope remains `historical_backtesting_only`.
