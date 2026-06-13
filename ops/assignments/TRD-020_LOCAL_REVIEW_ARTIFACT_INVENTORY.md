# TRD-020: Local Review Artifact Inventory

## Objective

Create deterministic in-memory artifact inventories for persisted Gate 0 review bundles.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Inventory protected-loop artifact IDs in validated local review bundle records.
- Verify bundle artifact IDs match trace artifact references.
- Add query and guarded query helpers that reuse existing local bundle query/read paths.
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

- `packages/core/src/local-review-artifact-inventory.ts`
- Tests for one inventory, multiple inventories, query integration, guarded query integration,
  mismatch rejection, and tamper propagation.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Inventories preserve `G0_RESEARCH`.
- Inventories include all protected-loop artifact types.
- Inventories verify trace references match bundle artifacts.
- Query helpers reuse the validated local bundle query/read path.
- Guarded helpers reuse safe local storage path enforcement.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
