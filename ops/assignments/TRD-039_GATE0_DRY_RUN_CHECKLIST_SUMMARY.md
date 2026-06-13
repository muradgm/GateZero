# TRD-039: Gate 0 Dry-Run Checklist Summary

## Objective

Create a deterministic local summary for Gate 0 dry-run operator checklists using checklist status,
item counts, and redacted item status refs only.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept an existing Gate 0 dry-run operator checklist.
- Return checklist status, item counts, item status refs, and blocked item IDs.
- Preserve `G0_RESEARCH` and `research_only`.
- Add strict schemas and focused tests using the accepted TRD-037 dry-run fixture and TRD-038
  checklist utility.
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

- `packages/core/src/gate0-dry-run-checklist-summary.ts`
- Export from `packages/core/src/index.ts`
- Tests for complete checklist summary, blocked checklist summary, redacted output shape, invalid
  checklist behavior, and summary count invariants.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Summary output preserves `G0_RESEARCH` and `research_only`.
- Summary accepts only valid Gate 0 dry-run operator checklists.
- Summary includes checklist status, item counts, item status refs, and blocked item IDs only.
- Summary does not include raw bundle payloads, trace payloads, metric payloads, issue IDs, or raw
  rows.
- Summary does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
