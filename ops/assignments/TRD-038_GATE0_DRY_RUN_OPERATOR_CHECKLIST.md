# TRD-038: Gate 0 Dry-Run Operator Checklist

## Objective

Create a deterministic local operator checklist for Gate 0 dry-run scenario bundles, using only
local component statuses and protected-loop checks.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept a synthetic Gate 0 dry-run scenario bundle and expected protected-loop steps.
- Check Gate 0 scope, protected-loop order, canonical trace hashes, revision-only risk state,
  operator outcome alignment, and learning boundary.
- Return local checklist statuses and counts only.
- Add strict schemas and focused tests using the accepted TRD-037 dry-run fixture.
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

- `packages/core/src/gate0-dry-run-operator-checklist.ts`
- Export from `packages/core/src/index.ts`
- Tests for accepted fixture checklist, mismatched loop order, trace hash mismatch, redacted output
  shape, and invalid bundle behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Checklist output preserves `G0_RESEARCH` and `research_only`.
- Checklist validates the accepted dry-run fixture without adding execution scope.
- Checklist includes check statuses and counts only.
- Checklist does not include review identifiers, strategy identifiers beyond the local bundle
  reference, trace payloads, issue IDs, or raw rows.
- Checklist does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
