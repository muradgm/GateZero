# Gate 1 Fees And Slippage Assumption Contract

## Purpose

This document records the local schema-only fees and slippage assumption contract added for future
backtest honesty.

It does not interpret results, promote a strategy, model execution, move gates, or make performance
claims.

## Implemented Contract

- Source: `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- Test: `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- Schema: `Gate1FeesAndSlippageAssumptionContractSchema`

## Boundary Fields

- `financial_gate`: `G1_BACKTESTING`
- `scope`: `historical_backtesting_only`
- `contract_authority`: `schema_only`
- `external_access`: `false`
- `execution_path`: `false`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Planning doc: `docs/operations/GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_PLAN.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet:
  `ops/assignments/TRD-159_GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_CONTRACT_IMPLEMENTATION.md`
- Reviews: `ops/runtime/reviews/TRD-159_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-159_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-159_ORCHESTRATOR_ACCEPTANCE.md`
