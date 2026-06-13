# Gate 1 Fees And Slippage Assumption Plan

## Purpose

This plan defines the future cost-assumption requirements for Gate 1 historical backtesting.

It is non-authorizing. It does not implement metrics, run backtests, produce performance results, or
make profitability claims.

## Required Future Fields

- Assumption id.
- Fee model type.
- Commission amount or formula.
- Spread assumption.
- Slippage model type.
- Slippage amount or formula.
- Currency.
- Asset class scope.
- Effective date range.
- Rationale.
- Source label.

## Validation Requirements

- Fees must be explicit.
- Slippage must be explicit.
- Zero-cost assumptions must require an explicit rationale.
- Currency and asset scope must be declared.
- Backtest records must reference one cost-assumption id.

## Blocked Assumptions

- No hidden zero-fee backtests.
- No missing slippage.
- No profitability interpretation.
- No strategy promotion.
- No broker execution model.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Gate 1 criteria: `docs/operations/GATE1_ENTRY_CRITERIA_DEFINITION.md`
- Contract assignment packet:
  `docs/operations/GATE1_HISTORICAL_BACKTEST_CONTRACT_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-149_GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-149_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-149_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-149_ORCHESTRATOR_ACCEPTANCE.md`
