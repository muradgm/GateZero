# TRD-016: Local Summary Redaction Policy Checks

## Objective

Add local redaction policy checks for review bundle summaries so GateZero can identify fields that
must remain inside local operator review.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Define local-only summary field policy metadata.
- Check one or more already-generated local review bundle summaries.
- Check summaries returned by existing local query helpers.
- Add guarded check helpers that reuse safe local storage path enforcement.
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

- `packages/core/src/local-review-bundle-redaction.ts`
- Redaction policy tests for local review context, non-local review context, batch checks, query
  integration, guarded query integration, and tamper propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Redaction checks operate only on local summary objects or summaries produced by existing local
  query helpers.
- Local operator review context returns no redaction findings.
- Non-local review context identifies local-only fields deterministically.
- Query helpers reuse the validated local summary/query/read path.
- Guarded helpers reuse safe local storage path enforcement.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
