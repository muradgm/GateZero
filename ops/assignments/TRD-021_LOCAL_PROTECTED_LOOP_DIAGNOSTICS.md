# TRD-021: Local Protected-Loop Readiness Diagnostics

## Objective

Create deterministic in-memory diagnostics that combine artifact inventory, checklist score, and
redaction status for persisted Gate 0 review bundles.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Combine existing local artifact inventory, checklist scoring, and redaction checks.
- Generate one diagnostic per validated local review bundle record.
- Add query and guarded query helpers that reuse existing local bundle query/read paths.
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

- `packages/core/src/local-protected-loop-diagnostic.ts`
- Tests for one diagnostic, multiple diagnostics, query integration, guarded query integration,
  empty results, and tamper propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Diagnostics preserve `G0_RESEARCH` and `research_only`.
- Diagnostics combine artifact inventory completeness, checklist score status, and redaction finding
  count.
- Diagnostics do not infer approval, advice, readiness, forecasts, or strategy claims.
- Query helpers reuse the validated local bundle query/read path.
- Guarded helpers reuse safe local storage path enforcement.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
