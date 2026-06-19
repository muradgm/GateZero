# Gate 1 Directional PnL Contract

## Purpose

This document records the schema-only directional PnL contract for Gate 1 historical backtesting.

The contract captures the minimum evidence needed to check long and short PnL directionality without
adding strategy execution, order placement, broker connectivity, or performance claims.

## Implemented Contract

- Source: `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- Schema: `Gate1DirectionalPnlContractSchema`

## Required Semantics

- Long checks enter on `ask` and exit on `bid`.
- Short checks enter on `bid` and exit on `ask`.
- Gross quote-currency PnL must match directional price movement times quantity and contract size.
- Gross account-currency PnL must match declared conversion from quote currency.
- Net account-currency PnL must subtract declared costs from gross account-currency PnL.

## Boundary Fields

- `financial_gate`: `G1_BACKTESTING`
- `scope`: `historical_backtesting_only`
- `contract_authority`: `schema_only`
- `evidence_only`: `true`
- `approval_claim`: `false`
- `performance_claim`: `false`
- `external_access`: `false`
- `execution_path`: `false`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Forex reference: `skills/trading-forex-domain-expert/references/forex-market-mechanics.md`
- Backtest reference: `skills/trading-forex-domain-expert/references/execution-risk-backtesting.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-269_DIRECTIONAL_PNL_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-269_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-269_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-269_ORCHESTRATOR_ACCEPTANCE.md`
