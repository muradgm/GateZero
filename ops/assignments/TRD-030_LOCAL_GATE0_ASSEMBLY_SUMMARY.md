# TRD-030: Local Gate 0 Assembly Summary

## Objective

Create a deterministic in-memory redacted summary for local Gate 0 review state assemblies using
counts and statuses only.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept an existing local Gate 0 review state assembly.
- Summarize assembly status, generation timestamps, review counts, threshold counts, issue counts,
  and comparison counts.
- Exclude review identifiers, strategy identifiers, trace identifiers, issue IDs, and raw
  issue/check rows.
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

- `packages/core/src/local-gate0-review-state-assembly-summary.ts`
- Export from `packages/core/src/index.ts`
- Tests for current-only summary, comparison summary, blocked summary, redaction shape, and invalid
  input behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Summary preserves `G0_RESEARCH` and `research_only`.
- Summary accepts only valid local Gate 0 review state assemblies.
- Summary includes counts and statuses only.
- Summary does not include review identifiers, strategy identifiers, trace identifiers, or issue
  IDs.
- Summary does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
