# TraderFrame

TraderFrame is a GateZero-controlled Research-Only workspace for strategy research, reproducible
backtest evidence, risk review, operator decisions, and learning events.

Core wedge:

```text
No trade without evidence. No execution without risk approval.
```

This repository currently contains only the foundation for the protected decision loop:

```text
Strategy Idea -> Data Snapshot -> Backtest -> Metric Report -> Risk Review -> Operator Decision -> Outcome Logged -> Learning Event
```

## Gate 0 Boundary

This repo does not contain broker integration, order placement, autonomous execution, AI buy/sell
prediction, or strategy performance claims. All implementation must preserve `G0_RESEARCH` until
governance explicitly approves a future packet.

## Workspace

- `apps/web` contains the future research dashboard placeholder.
- `packages/contracts` contains runtime-validated TypeScript contracts.
- `packages/core` contains the protected decision-loop ordering model.
- `packages/validation` contains Gate 0 forbidden-scope checks.
- `scripts/validate-gate0.ts` runs the repository-level Gate 0 validation.

## Validation

Run:

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:ci
pnpm validate:gate0
```
