# TRD-040: Gate 0 Dry-Run Friction Report

## Objective

Create a deterministic local friction report for Gate 0 dry-run checklist summaries using redacted
status refs, blocked item IDs, and static friction categories only.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept an existing Gate 0 dry-run checklist summary.
- Return report status, item counts, blocked item IDs, and friction categories.
- Preserve `G0_RESEARCH` and `research_only`.
- Use static categories mapped from checklist item IDs.
- Add strict schemas and focused tests using the accepted TRD-037 fixture, TRD-038 checklist
  utility, and TRD-039 summary utility.
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

- `packages/core/src/gate0-dry-run-friction-report.ts`
- Export from `packages/core/src/index.ts`
- Tests for clear report, friction report, redacted output shape, invalid summary behavior, and
  report count invariants.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Report output preserves `G0_RESEARCH` and `research_only`.
- Report accepts only valid Gate 0 dry-run checklist summaries.
- Report includes report status, item counts, blocked item IDs, and friction categories only.
- Report does not include raw bundle payloads, trace payloads, metric payloads, issue IDs, evidence
  strings, advice, readiness claims, or raw rows.
- Report does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
