# Gate 1 Entry Criteria Definition

## Purpose

This document defines what must be true before GateZero can request Gate 1 Backtesting work.

It is a planning criteria record only. It does not move the project out of `G0_RESEARCH`, authorize
backtest implementation, authorize trading, authorize broker integration, or loosen risk gates.

## Current Gate

GateZero remains at:

```text
G0_RESEARCH
```

## Gate 1 Minimum From Governance

Gate 1 allows historical-data backtesting only.

Governance requires:

- Deterministic strategy version.
- Reproducible data input.
- Fees and slippage model.
- Immutable backtest record.

## Additional Entry Criteria

Before any Gate 1 implementation packet is issued, all of the following must be documented:

- Strategy versioning contract.
- Historical data snapshot contract.
- Backtest input fixture boundary.
- Backtest result schema.
- Fees and slippage assumption model.
- Immutable backtest record format.
- Reproducibility check.
- No broker, order, paper execution, live execution, AI prediction, or strategy-claim scope.
- QA_SECURITY and RISK review responsibilities.
- `pnpm verify:gate0` passing at the time of request.

## Explicit Non-Readiness

Meeting these criteria would only permit a future request for Gate 1 planning or implementation
review. It would not prove strategy performance, profitability, approval, paper-trading readiness,
live-trading readiness, or product readiness.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-144_GATE1_ENTRY_CRITERIA_DEFINITION.md`
- Reviews: `ops/runtime/reviews/TRD-144_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-144_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-144_ORCHESTRATOR_ACCEPTANCE.md`
