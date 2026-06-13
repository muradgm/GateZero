# TRD-019: Local Checklist Completeness Scoring

## Objective

Create deterministic in-memory completeness scoring for local Gate 0 operator review checklists.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Count complete, needs-review, and blocked checklist items.
- Score one checklist or multiple checklists.
- Add query and guarded query helpers that reuse existing local checklist/query/read paths.
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

- `packages/core/src/local-operator-review-score.ts`
- Tests for single checklist scoring, aggregate scoring, empty scoring, query integration, guarded
  query integration, and tamper propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Scores preserve `G0_RESEARCH` and `research_only`.
- Scores count checklist statuses without changing checklist content.
- Aggregate scores preserve deterministic counts.
- Query helpers reuse the validated local checklist/query/read path.
- Guarded helpers reuse safe local storage path enforcement.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
