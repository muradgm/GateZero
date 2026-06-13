# TRD-014: Local Review Bundle Query Utilities

## Objective

Add local-only query utilities for persisted Gate 0 strategy review bundles.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Read existing local review bundle NDJSON records through the TRD-013 validated read path.
- Filter by strategy review bundle ID, trace ID, strategy ID, and strategy version.
- Add guarded query helpers that reuse path-safe local audit log resolution and lock guarding.
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

- `packages/core/src/local-review-bundle-query.ts`
- Query tests for exact filters, combined filters, empty results, malformed query rejection, guard
  path enforcement, and tamper propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Queries only read local persisted review bundle records.
- Queries reuse validated record parsing and hash verification.
- Guarded queries reuse safe relative path and `.ndjson` enforcement.
- Query results preserve log order.
- No query helper creates execution, prediction, route, UI, broker, or credential scope.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
