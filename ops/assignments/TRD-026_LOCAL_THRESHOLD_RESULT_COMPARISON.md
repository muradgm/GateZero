# TRD-026: Local Threshold Result Comparison

## Objective

Create a deterministic in-memory comparison utility for two local Gate 0 evidence threshold results.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Compare two existing local Gate 0 evidence threshold results.
- Report status changes without interpreting them as approval or readiness.
- Report count deltas for met, needs-review, blocked, check, and review-record counts.
- Report per-check observed count, threshold count, pass/fail, and status changes.
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

- `packages/core/src/local-protected-loop-evidence-threshold-comparison.ts`
- Export from `packages/core/src/index.ts`
- Tests for unchanged, changed status, per-check deltas, added/removed check coverage, and invalid
  input behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Comparison preserves `G0_RESEARCH` and `research_only`.
- Comparison accepts only valid local Gate 0 evidence threshold results.
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
