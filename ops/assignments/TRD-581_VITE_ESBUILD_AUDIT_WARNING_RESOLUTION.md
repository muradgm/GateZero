# TRD-581 Vite Esbuild Audit Warning Resolution

Status: accepted

## Goal

Resolve the low-severity Vite/esbuild audit maintenance item and verify Gate 0/GateZero controls
after the dependency update.

## Scope

- Preserve `G2_PAPER_TRADING` / `paper_simulation_planning_only` scope.
- Update only local development tooling needed to clear the audit warning.
- Keep `esbuild` pinned through the root override.
- Record dependency-audit evidence as repository health only.

## Dependency Change

- Updated root dev dependency `vite` from `^7.2.0` to `^8.1.0`.
- Preserved the root `pnpm.overrides.esbuild` pin at `^0.28.1`.
- Refreshed `pnpm-lock.yaml` to resolve Vite through `8.1.0` and esbuild through `0.28.1`.

## Blocked Scope

- Broker integration, account connection, credentials, live execution, autonomous action, AI
  prediction, approval semantics, readiness semantics, performance claims, report output, export
  controls, sharing controls, print controls, external audit services, and risk-gate loosening.

## Validation

- `pnpm audit --audit-level low`
- `pnpm test -- packages/validation/tests/forbidden-patterns.test.ts packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`
- `pnpm verify:gate0`

## Acceptance

Accepted when the audit command reports no known vulnerabilities, focused tests pass, full Gate 0
verification passes, and the command-center evidence records the maintenance item without adding any
execution or output capability.
