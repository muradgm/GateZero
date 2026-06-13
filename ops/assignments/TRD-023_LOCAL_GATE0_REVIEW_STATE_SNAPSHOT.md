# TRD-023: Local Gate 0 Review State Snapshot

## Objective

Create a deterministic in-memory local Gate 0 review state snapshot that composes existing
protected-loop diagnostics, diagnostic aggregation, checklist scoring totals, and artifact inventory
totals from validated local review records.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Build a strict local snapshot object for queried persisted Gate 0 review records.
- Reuse existing local review bundle query/read paths.
- Reuse existing protected-loop diagnostics and diagnostic aggregation.
- Reuse existing local operator checklist scoring.
- Reuse existing artifact inventory creation.
- Include redacted review references only.
- Add query and guarded query helpers.
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

- `packages/core/src/local-gate0-review-state-snapshot.ts`
- Export from `packages/core/src/index.ts`
- Tests for snapshot composition, empty query results, guarded query behavior, and tamper
  propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Snapshot preserves `G0_RESEARCH` and `research_only`.
- Snapshot derives from validated local review records only.
- Snapshot composes diagnostics, diagnostic aggregate, checklist score aggregate, and artifact
  inventory totals.
- Snapshot status is descriptive only and does not change review or strategy state.
- Snapshot includes only local identifiers in review references.
- Query helpers reuse validated local query/read paths.
- Guarded helpers reuse safe local storage path enforcement.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
