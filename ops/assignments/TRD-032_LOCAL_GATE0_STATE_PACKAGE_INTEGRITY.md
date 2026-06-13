# TRD-032: Local Gate 0 State Package Integrity

## Objective

Create a deterministic in-memory integrity utility for a local Gate 0 state package made from a
current assembly summary, optional baseline assembly summary, and optional assembly summary
comparison.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept an existing current local Gate 0 assembly summary.
- Optionally accept an existing baseline local Gate 0 assembly summary.
- Optionally accept an existing local Gate 0 assembly summary comparison.
- Check that optional baseline and comparison pieces are structurally coherent.
- Check that comparison timestamps, statuses, and comparison-count presence match the supplied
  summaries.
- Return redacted check statuses and counts only.
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

- `packages/core/src/local-gate0-review-state-package-integrity.ts`
- Export from `packages/core/src/index.ts`
- Tests for current-only packages, coherent baseline/comparison packages, missing comparison
  behavior, mismatched timestamps/statuses, redacted shape, and invalid input behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Integrity output preserves `G0_RESEARCH` and `research_only`.
- Integrity utility accepts only valid local Gate 0 assembly summaries and summary comparisons.
- Integrity utility includes check statuses and counts only.
- Integrity utility does not include review identifiers, strategy identifiers, trace identifiers,
  issue IDs, or raw rows.
- Integrity utility does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
