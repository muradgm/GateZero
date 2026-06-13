# TRD-025: Local Evidence Completeness Thresholds

## Objective

Create deterministic in-memory threshold checks for local Gate 0 protected-loop evidence
completeness.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Evaluate an existing local Gate 0 review state snapshot against a supplied threshold profile.
- Check review record count, trace artifact coverage, incomplete artifact inventories, blocked
  checklist counts, blocked diagnostic counts, and redaction finding counts.
- Return descriptive check statuses only: met, needs_review, or blocked.
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

- `packages/core/src/local-protected-loop-evidence-thresholds.ts`
- Export from `packages/core/src/index.ts`
- Tests for all-met, needs-review, blocked, profile schema validation, and snapshot schema
  validation behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Threshold checks preserve `G0_RESEARCH` and `research_only`.
- Threshold checks accept only a valid local Gate 0 review state snapshot.
- Threshold checks accept only a valid local threshold profile.
- Threshold checks are descriptive only.
- Threshold checks do not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
