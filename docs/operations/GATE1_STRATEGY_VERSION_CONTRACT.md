# Gate 1 Strategy Version Contract

## Purpose

This document records the local schema-only strategy version contract added for future Gate 1
historical backtest references.

It does not implement strategy logic, recommend action, approve a strategy, move gates, or make
performance claims.

## Implemented Contract

- Source: `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- Test: `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- Schema: `Gate1StrategyVersionContractSchema`

## Boundary Fields

- `financial_gate`: `G1_BACKTESTING`
- `scope`: `historical_backtesting_only`
- `contract_authority`: `schema_only`
- `produces_action_recommendation`: `false`
- `external_access`: `false`
- `execution_path`: `false`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Planning doc: `docs/operations/GATE1_STRATEGY_VERSION_CONTRACT_PLAN.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-158_GATE1_STRATEGY_VERSION_CONTRACT_IMPLEMENTATION.md`
- Reviews: `ops/runtime/reviews/TRD-158_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-158_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-158_ORCHESTRATOR_ACCEPTANCE.md`
