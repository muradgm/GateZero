# TRD-034: Local Gate 0 State Package Lifecycle Manifest

## Objective

Create a deterministic in-memory lifecycle manifest utility for local Gate 0 state package
components using component presence, linked timestamps, statuses, and counts only.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept an existing current local Gate 0 assembly summary.
- Optionally accept an existing local Gate 0 assembly summary comparison.
- Accept an existing local Gate 0 package integrity result.
- Optionally accept an existing local Gate 0 package integrity aggregate.
- Check component presence and timestamp/status links across supplied components.
- Return redacted component counts, check statuses, timestamps, and summary counts only.
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

- `packages/core/src/local-gate0-review-state-lifecycle-manifest.ts`
- Export from `packages/core/src/index.ts`
- Tests for summary-only manifests, comparison/integrity linked manifests, aggregate-linked
  manifests, mismatched component behavior, redacted shape, and invalid input behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Manifest output preserves `G0_RESEARCH` and `research_only`.
- Manifest utility accepts only valid local Gate 0 summaries, comparisons, integrity results, and
  integrity aggregates.
- Manifest utility includes component presence, linked timestamps, statuses, and counts only.
- Manifest utility does not include review identifiers, strategy identifiers, trace identifiers,
  issue IDs, or raw rows.
- Manifest utility does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
