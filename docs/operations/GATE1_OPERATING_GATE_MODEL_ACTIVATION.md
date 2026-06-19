# Gate 1 Operating Gate Model Activation

## Purpose

This record activates TraderFrame's current operating model as Gate 1 historical backtesting.

## Current Operating State

```text
G1_BACKTESTING
historical_backtesting_only
```

## Boundary

Gate 1 permits local, reproducible historical-data backtesting evidence only.

Blocked:

- broker integration
- paper or live execution
- real or simulated order placement
- autonomous execution
- AI buy/sell prediction
- broker credentials or account identifiers
- strategy approval, readiness, promotion, profitability, or performance claims
- external report publishing
- risk-gate loosening

## Implementation Notes

- `packages/contracts/src/gate.ts` exposes the current operating gate and scope.
- Gate 1 historical backtest contracts use `G1_BACKTESTING` and `historical_backtesting_only`.
- Existing Gate 0 records remain historical records and are not rewritten as Gate 1 evidence.
- The command center displays Gate 1 status while remaining read-only.
- The progress snapshot reads the current gate/scope from the tracklist.

## Validation

Run:

```powershell
pnpm check:gate1-contracts
pnpm verify:gate0
```

## Source Links

- Source packet: `ops/assignments/TRD-265_GATE1_OPERATING_GATE_MODEL_ACTIVATION.md`
- QA/security review: `ops/runtime/reviews/TRD-265_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-265_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-265_ORCHESTRATOR_ACCEPTANCE.md`
- Gate contract: `packages/contracts/src/gate.ts`
- Gate 1 contracts: `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- Gate 1 fixtures: `packages/fixtures/src/gate1-historical-backtest-fixtures.ts`
- Gate 1 guard: `scripts/check-gate1-contracts.ts`
- Command center data: `apps/web/src/command-center-data.js`
- Progress snapshot generator: `scripts/generate-gate0-progress-snapshot.ts`
