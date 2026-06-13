# TRD-037: Gate 0 Dry-Run Scenario Fixture

## Objective

Create one deterministic synthetic Gate 0 dry-run scenario fixture that exercises the protected loop
end to end as local research evidence only.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Add a synthetic fixture that includes strategy idea, data snapshot, backtest result, metric
  report, risk review, operator decision, outcome log, learning event, and canonical trace.
- Keep the scenario deterministic and contract-validated.
- Use a revise outcome to avoid implying execution readiness.
- Add tests that verify the protected-loop order, bundle contract validity, canonical trace hashes,
  Gate 0 scope, and local research-only outcome.
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
- Strategy profitability or performance claims.
- Readiness scoring or approval scoring.
- Risk-gate loosening.

## Required Outputs

- `packages/fixtures/src/gate0-dry-run-scenario.ts`
- Export from `packages/fixtures/src/index.ts`
- Tests for protected-loop order, bundle contract validity, canonical trace hashes, Gate 0 scope,
  revise outcome, and fixture determinism.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Fixture preserves `G0_RESEARCH`.
- Fixture is deterministic.
- Fixture validates through the strategy review bundle contract.
- Fixture trace validates through canonical trace hash checks.
- Fixture exercises the full protected-loop event order.
- Fixture does not imply approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
