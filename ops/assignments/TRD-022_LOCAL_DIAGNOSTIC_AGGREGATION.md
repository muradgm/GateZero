# TRD-022: Local Diagnostic Aggregation

## Objective

Create deterministic in-memory aggregation for local protected-loop diagnostics across persisted
Gate 0 reviews.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Aggregate diagnostic statuses across validated local diagnostics.
- Count complete, needs-review, and blocked diagnostics.
- Aggregate artifact coverage, checklist item counts, and redaction finding counts.
- Add query and guarded query helpers that reuse existing local diagnostic query/read paths.
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

- `packages/core/src/local-protected-loop-diagnostic-aggregate.ts`
- Tests for aggregate counts, empty aggregation, query integration, guarded query integration, and
  tamper propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Aggregates preserve `G0_RESEARCH` and `research_only`.
- Aggregates count diagnostic statuses without changing diagnostics.
- Query helpers reuse the validated local diagnostic/query/read path.
- Guarded helpers reuse safe local storage path enforcement.
- Aggregates do not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
