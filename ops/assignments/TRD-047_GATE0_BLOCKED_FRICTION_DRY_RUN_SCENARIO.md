# TRD-047: Gate 0 Blocked-Friction Dry-Run Scenario

## Objective

Add a second synthetic Gate 0 dry-run fixture that intentionally creates one local friction category
for inspect-result testing.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Add a synthetic fixture for a blocked local review path.
- Keep the fixture deterministic, local-only, and revision-oriented.
- Reuse existing Gate 0 bundle content where possible.
- Add tests proving the blocked fixture produces one friction category.
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
- Updated `packages/core/tests/gate0-dry-run-inspect-result.test.ts`
- `ops/runtime/reviews/TRD-047_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-047_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-047_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Blocked fixture is synthetic and deterministic.
- Blocked fixture preserves `G0_RESEARCH`.
- Blocked fixture preserves `research_only` behavior through the inspect result.
- Blocked fixture does not change risk limits or autonomy.
- Inspect-result tests prove exactly one local friction category is produced.
- No external service, UI, API route, credential handling, execution path, or report publishing path
  is added.
- Full validation passes.

## Validation Commands

- `pnpm inspect:gate0-dry-run`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
