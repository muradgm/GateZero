# TRD-015: Local Review Bundle Summaries

## Objective

Add deterministic, claim-neutral summaries for persisted Gate 0 strategy review bundles so an
operator can inspect evidence coverage and risk status locally.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Summarize already-validated local review bundle records.
- Produce structured summaries with stable field order.
- Include Gate 0 status, artifact IDs, data snapshot metadata, metric values, warnings, risk
  findings, operator decision, outcome, learning flags, and trace hash metadata.
- Add guarded summary helpers that reuse local query utilities.
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
- Strategy profitability or performance claims.
- Risk-gate loosening.

## Required Outputs

- `packages/core/src/local-review-bundle-summary.ts`
- Summary tests for deterministic output, claim-neutral scope, query integration, guarded query
  integration, empty results, and tamper propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Summaries are generated only from validated local review bundle records.
- Summaries preserve Gate 0 Research Only framing.
- Summaries do not infer advice, predictions, readiness, or performance claims.
- Summary query helpers reuse the validated local query/read path.
- Guarded summary helpers reuse safe local storage path enforcement.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
