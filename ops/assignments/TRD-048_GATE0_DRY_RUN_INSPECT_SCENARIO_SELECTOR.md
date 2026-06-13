# TRD-048: Gate 0 Dry-Run Inspect Scenario Selector

## Objective

Add a local scenario selector to the Gate 0 dry-run inspect command so operators can inspect the
clear and friction fixtures.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Add static scenario keys for the existing dry-run fixtures.
- Keep `clear` as the default inspect scenario.
- Add a `--scenario friction` CLI path.
- Update tests for selector behavior.
- Update the dry-run walkthrough.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Blocked Scope

- Live trading.
- Broker integration.
- Autonomous execution.
- AI buy/sell prediction.
- Real or paper market order placement.
- Broker API key handling.
- External persistence services.
- API routes or UI flows.
- Report export or publishing workflows.
- Raw bundle output expansion.
- Strategy approval language.
- Readiness claims.
- Strategy profitability or performance claims.
- Risk-gate loosening.

## Required Outputs

- Updated `packages/fixtures/src/gate0-dry-run-scenario.ts`
- Updated `packages/fixtures/tests/gate0-dry-run-scenario.test.ts`
- Updated `scripts/inspect-gate0-dry-run.ts`
- Updated `docs/operations/GATE0_DRY_RUN_WALKTHROUGH.md`
- `ops/runtime/reviews/TRD-048_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-048_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-048_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Inspect command defaults to the clear scenario.
- Inspect command supports `--scenario friction`.
- Selector exposes only static local scenario keys.
- Tests cover selector defaults, explicit keys, and invalid keys.
- Walkthrough documents the selector.
- Output remains redacted and local-only.
- Full validation passes.

## Validation Commands

- `pnpm inspect:gate0-dry-run`
- `pnpm inspect:gate0-dry-run -- --scenario friction`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
