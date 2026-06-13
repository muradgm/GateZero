# TRD-033: Local Gate 0 Package Integrity History Aggregate

## Objective

Create a deterministic in-memory aggregate utility for local Gate 0 package integrity results using
status distribution and check counts only.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept a list of existing local Gate 0 package integrity results.
- Report aggregate status, result counts, status distribution, check totals, and latest result
  timestamp.
- Include redacted integrity result references containing timestamps, statuses, and counts only.
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

- `packages/core/src/local-gate0-review-state-package-integrity-aggregate.ts`
- Export from `packages/core/src/index.ts`
- Tests for empty aggregation, consistent-only aggregation, mixed-status aggregation, redacted
  shape, and invalid input behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Aggregate output preserves `G0_RESEARCH` and `research_only`.
- Aggregate utility accepts only valid local Gate 0 package integrity results.
- Aggregate utility includes status distribution, timestamps, and counts only.
- Aggregate utility does not include review identifiers, strategy identifiers, trace identifiers,
  issue IDs, or raw rows.
- Aggregate utility does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
