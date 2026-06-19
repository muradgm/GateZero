# TRD-268 Dependency Upgrade Execution

## Goal

Patch the vulnerable development tooling identified in TRD-267 and verify that the local GateZero
guard and test posture remains stable.

## Allowed Scope

- Upgrade vulnerable test tooling dependencies.
- Add the minimum dependency pin or override needed to resolve audit findings.
- Refresh the lockfile.
- Run audit and deterministic CI-style tests.
- Update tracker, command-center metadata, and review records.

## Blocked Scope

- Product behavior changes.
- Broker integration.
- Paper or live execution.
- Autonomous trading.
- AI buy/sell prediction.
- Broker credentials or account identifiers.
- Strategy approval, readiness, profitability, or performance claims.
- Risk-gate loosening.

## Required Outputs

- Updated `package.json`.
- Updated `pnpm-lock.yaml`.
- Dependency upgrade documentation.
- QA_SECURITY review.
- RISK review.
- ORCHESTRATOR acceptance.

## Acceptance Criteria

- `pnpm audit --audit-level low` reports no known vulnerabilities.
- `pnpm test:ci` passes.
- Gate remains `G1_BACKTESTING`.
- Scope remains `historical_backtesting_only`.
- No blocked-scope behavior or language is introduced.

## Next Packet

`TRD-269 Directional PnL Correctness Contract`.
