# TRD-031: Local Gate 0 Assembly Summary Comparison

## Objective

Create a deterministic in-memory comparison utility for two local Gate 0 assembly summaries using
counts and status changes only.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept two existing local Gate 0 assembly summaries.
- Report summary status change and count deltas.
- Compare review counts, threshold counts, issue counts, and optional comparison counts.
- Exclude review identifiers, strategy identifiers, trace identifiers, issue IDs, and raw rows.
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

- `packages/core/src/local-gate0-review-state-assembly-summary-comparison.ts`
- Export from `packages/core/src/index.ts`
- Tests for unchanged summaries, changed status/counts, optional comparison-count transitions,
  redacted shape, and invalid input behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Comparison preserves `G0_RESEARCH` and `research_only`.
- Comparison accepts only valid local Gate 0 assembly summaries.
- Comparison includes counts and status changes only.
- Comparison does not include review identifiers, strategy identifiers, trace identifiers, or issue
  IDs.
- Comparison does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
