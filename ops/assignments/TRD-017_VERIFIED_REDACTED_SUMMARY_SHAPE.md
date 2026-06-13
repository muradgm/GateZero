# TRD-017: Verified Redacted Summary Shape

## Objective

Create an in-memory, claim-neutral redacted summary shape that omits fields marked local-only by the
TRD-016 redaction policy.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Define a strict runtime schema for redacted review bundle summaries.
- Convert local review bundle summaries into redacted in-memory summary objects.
- Verify that local-only policy fields are absent.
- Add query and guarded query helpers that reuse existing local summary/query/read paths.
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
- Report export or publishing workflows.
- Strategy profitability or performance claims.
- Risk-gate loosening.

## Required Outputs

- `packages/core/src/local-review-bundle-redacted-summary.ts`
- Tests for strict shape validation, omitted local-only fields, query integration, guarded query
  integration, empty results, and tamper propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Redacted summaries preserve `G0_RESEARCH` and `research_only`.
- Redacted summaries omit every field path marked local-only by TRD-016.
- Runtime schema rejects extra local-only fields.
- Query helpers reuse the validated local summary/query/read path.
- Guarded helpers reuse safe local storage path enforcement.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
