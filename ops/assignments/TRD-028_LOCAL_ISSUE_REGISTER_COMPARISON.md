# TRD-028: Local Issue Register Comparison

## Objective

Create a deterministic in-memory comparison utility for two local Gate 0 protected-loop issue
registers.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Compare two existing local Gate 0 issue registers.
- Report register status changes without interpreting them as approval or readiness.
- Report issue count, needs-review count, and blocked count deltas.
- Report added, removed, retained, and changed issue checks by check ID.
- Preserve local issue IDs as references only.
- Add strict schemas and focused tests.
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

- `packages/core/src/local-protected-loop-issue-register-comparison.ts`
- Export from `packages/core/src/index.ts`
- Tests for unchanged, changed status/counts, added issues, removed issues, retained issues, and
  invalid input behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Comparison preserves `G0_RESEARCH` and `research_only`.
- Comparison accepts only valid local Gate 0 issue registers.
- Comparison reports descriptive deltas only.
- Comparison does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
