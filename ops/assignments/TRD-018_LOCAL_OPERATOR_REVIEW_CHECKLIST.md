# TRD-018: Local Operator Review Checklist

## Objective

Create deterministic in-memory checklist items from local and redacted review bundle summaries for
Gate 0 operator review.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Generate local in-memory checklist objects from validated summaries.
- Cross-check local and redacted summaries before checklist creation.
- Add query and guarded query helpers that reuse existing local summary/query/read paths.
- Add focused tests and review notes.

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
- Risk-gate loosening.

## Required Outputs

- `packages/core/src/local-operator-review-checklist.ts`
- Tests for deterministic checklist output, local/redacted mismatch rejection, query integration,
  guarded query integration, empty results, and tamper propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Checklist objects preserve `G0_RESEARCH` and `research_only`.
- Checklist creation verifies local and redacted summaries are aligned.
- Checklist items do not infer advice, readiness, forecasts, or strategy claims.
- Query helpers reuse the validated local summary/query/read path.
- Guarded helpers reuse safe local storage path enforcement.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
