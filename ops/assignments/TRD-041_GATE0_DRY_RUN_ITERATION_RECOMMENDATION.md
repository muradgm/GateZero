# TRD-041: Gate 0 Dry-Run Iteration Recommendation

## Objective

Create a deterministic local iteration recommendation for Gate 0 dry-run friction reports using
static categories, blocked item refs, and local review action labels only.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept an existing Gate 0 dry-run friction report.
- Return recommendation status, blocked item IDs, friction category refs, and static local review
  action labels.
- Preserve `G0_RESEARCH` and `research_only`.
- Use operational labels only, such as `rebuild_expected_loop_order` and `rebuild_canonical_trace`.
- Add strict schemas and focused tests using the accepted TRD-037 fixture, TRD-038 checklist
  utility, TRD-039 summary utility, and TRD-040 friction report utility.
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

- `packages/core/src/gate0-dry-run-iteration-recommendation.ts`
- Export from `packages/core/src/index.ts`
- Tests for clear recommendation, friction recommendation, redacted output shape, invalid report
  behavior, and recommendation count invariants.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Recommendation output preserves `G0_RESEARCH` and `research_only`.
- Recommendation accepts only valid Gate 0 dry-run friction reports.
- Recommendation includes recommendation status, blocked item IDs, friction category refs, and
  static local review action labels only.
- Recommendation does not include raw bundle payloads, trace payloads, metric payloads, issue IDs,
  evidence strings, advice, readiness claims, or raw rows.
- Recommendation does not infer approval, trading advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
