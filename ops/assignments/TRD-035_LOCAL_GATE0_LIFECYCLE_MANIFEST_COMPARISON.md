# TRD-035: Local Gate 0 Lifecycle Manifest Comparison

## Objective

Create a deterministic in-memory comparison utility for two local Gate 0 lifecycle manifests using
component-count, status, presence, and summary-count changes only.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept two existing local Gate 0 lifecycle manifests.
- Report manifest status change and component-count deltas.
- Compare summary comparison presence, integrity aggregate presence, summary counts, integrity
  counts, and manifest check counts.
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

- `packages/core/src/local-gate0-review-state-lifecycle-manifest-comparison.ts`
- Export from `packages/core/src/index.ts`
- Tests for unchanged manifests, changed statuses/counts, presence transitions, redacted shape, and
  invalid input behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Comparison output preserves `G0_RESEARCH` and `research_only`.
- Comparison utility accepts only valid local Gate 0 lifecycle manifests.
- Comparison utility includes status changes, presence changes, and counts only.
- Comparison utility does not include review identifiers, strategy identifiers, trace identifiers,
  issue IDs, or raw rows.
- Comparison utility does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
