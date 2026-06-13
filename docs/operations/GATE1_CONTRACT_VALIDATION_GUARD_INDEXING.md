# Gate 1 Contract Validation Guard Indexing

## Purpose

This document records indexing for the local Gate 1 contract guard and the current schema-only
contract chain.

It does not move GateZero out of `G0_RESEARCH`, run backtests, add external access, publish reports,
approve strategies, or make performance claims.

## Indexed Command

```powershell
pnpm check:gate1-contracts
```

## Indexed Artifacts

- `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- `packages/fixtures/src/gate1-historical-backtest-fixtures.ts`
- `packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts`
- `scripts/check-gate1-contracts.ts`
- `packages/fixtures/tests/gate1-contract-guard.test.ts`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Planning doc: `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_PLAN.md`
- Guard doc: `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-165_GATE1_CONTRACT_VALIDATION_GUARD_INDEXING.md`
- Reviews: `ops/runtime/reviews/TRD-165_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-165_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-165_ORCHESTRATOR_ACCEPTANCE.md`
