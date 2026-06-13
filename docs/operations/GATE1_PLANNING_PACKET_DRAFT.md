# Gate 1 Planning Packet Draft

## Purpose

This is a draft planning packet for a future Gate 1 historical-backtesting workstream.

It is non-authorizing. It does not move GateZero out of `G0_RESEARCH`, implement backtesting, add
broker integration, add paper or live execution, add AI prediction, publish reports, or make
strategy performance claims.

## Draft Goal

Prepare a future Gate 1 packet that can define historical backtesting contracts and fixtures without
execution capability.

## Required Agents

- ORCHESTRATOR: bounds the packet and acceptance criteria.
- PM: confirms product scope stays focused on the protected research loop.
- QUANT: defines reproducibility and historical-data requirements without performance claims.
- RISK: confirms controls and blocked scope.
- QA_SECURITY: confirms local-only behavior and no secret, broker, or external execution path.
- BACKEND: may later implement contracts only after authorization.

## Draft Allowed Scope

- Historical-data snapshot contract planning.
- Deterministic strategy-version contract planning.
- Backtest input and output schema planning.
- Fees and slippage model planning.
- Immutable backtest record planning.
- Reproducibility check planning.

## Draft Blocked Scope

- Live trading.
- Paper trading.
- Broker integration.
- Broker API key handling.
- Market order placement.
- Autonomous execution.
- AI buy or sell prediction.
- Strategy performance, profitability, approval, or readiness claims.
- External publishing.
- Risk-gate loosening.

## Draft Acceptance Criteria

A future Gate 1 packet must:

- Keep active operation at the approved gate.
- Reference Gate 1 entry criteria.
- Define all files in allowed scope before implementation.
- Include QA_SECURITY and RISK reviews.
- Pass `pnpm verify:gate0` before any transition request.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Gate 1 entry criteria: `docs/operations/GATE1_ENTRY_CRITERIA_DEFINITION.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-145_GATE1_PLANNING_PACKET_DRAFT.md`
- Reviews: `ops/runtime/reviews/TRD-145_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-145_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-145_ORCHESTRATOR_ACCEPTANCE.md`
