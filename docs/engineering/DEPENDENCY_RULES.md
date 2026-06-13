# Dependency Rules

## Purpose

This document keeps GateZero dependencies deliberate.

Trading systems become fragile when strategy, UI, data, and execution concerns are tangled.

## Ownership Rules

- UI dependencies belong in `apps/web` or shared UI packages.
- API dependencies belong in `apps/api`.
- Quant dependencies belong in `services/quant-engine`.
- Risk calculation code belongs in `packages/risk` or quant modules, not UI components.
- Broker dependencies are forbidden in Phase 0.

## Forbidden In Phase 0

- broker SDKs
- exchange SDKs
- live market-order clients
- auto-trading packages
- secret-manager integration for broker credentials
- social sentiment execution packages

## Allowed In Phase 0

- validation libraries
- test libraries
- chart libraries for reports
- local database drivers
- local queue libraries only if needed
- Python quant/data libraries for research

## Dependency Acceptance

Before adding a dependency, answer:

1. What problem does this solve?
2. Which package owns it?
3. Does it increase execution risk?
4. Does it introduce live trading capability?
5. How will it be tested?

If it touches execution or broker capability, Risk and QA must approve.
