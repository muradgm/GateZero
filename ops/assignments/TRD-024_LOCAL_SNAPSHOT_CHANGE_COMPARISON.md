# TRD-024: Local Snapshot Change Comparison

## Objective

Create a deterministic in-memory comparison utility for two local Gate 0 review state snapshots.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Compare two existing local Gate 0 review state snapshots.
- Report status changes without interpreting them as approval or readiness.
- Report numeric deltas for review counts, diagnostic counts, checklist counts, artifact inventory
  counts, and redaction finding counts.
- Report added, removed, and retained local review references.
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

- `packages/core/src/local-gate0-review-state-snapshot-comparison.ts`
- Export from `packages/core/src/index.ts`
- Tests for unchanged, changed, added, removed, retained, and schema-guarded comparison behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Comparison preserves `G0_RESEARCH` and `research_only`.
- Comparison accepts only valid local Gate 0 review state snapshots.
- Comparison reports descriptive deltas only.
- Comparison does not infer approval, advice, readiness, forecasts, or strategy claims.
- Review reference changes include only local identifiers.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
