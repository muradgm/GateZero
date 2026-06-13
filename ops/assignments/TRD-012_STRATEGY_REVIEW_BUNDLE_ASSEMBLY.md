# TRD-012: Strategy Review Bundle Assembly

## Objective

Create a Gate 0 research-only strategy review bundle that assembles the protected decision loop
artifacts into one validated packet:

Strategy Idea -> Data Snapshot -> Backtest -> Metric Report -> Risk Review -> Operator Decision ->
Outcome Logged -> Learning Event

## Required Agents

- ORCHESTRATOR
- BACKEND
- RISK
- QUANT
- QA_SECURITY

## Allowed Scope

- Add a contract for a strategy review bundle.
- Add a core helper that validates, hash-checks, and freezes a strategy review bundle.
- Add focused unit tests for cross-artifact consistency, trace linkage, risk gating, and
  research-only scope.
- Add Phase 0 review/acceptance notes.

## Blocked Scope

- Live trading.
- Broker integration.
- Autonomous execution.
- AI buy/sell prediction.
- Real or paper market order placement.
- Broker API key handling.
- Strategy profitability or performance claims.
- Risk-gate loosening.
- UI or route expansion.

## Required Outputs

- `packages/contracts/src/strategy-review-bundle.ts`
- `packages/core/src/strategy-review-bundle.ts`
- Contract and core tests.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Bundle is restricted to `G0_RESEARCH`.
- Bundle requires all protected-loop artifacts.
- Bundle rejects mismatched strategy IDs, strategy versions, data metadata, metric report
  references, outcome linkage, learning linkage, and trace artifact references.
- Bundle rejects risk-blocked packets that attempt to record a paper candidate.
- Core helper rejects trace hash tampering and freezes accepted bundles.
- Gate 0 validation remains green.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
