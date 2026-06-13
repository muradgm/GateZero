# GateZero Decision-Loop Hardening Roadmap

## North Star

> GateZero's next phase is disciplined system hardening around the strategy decision loop: making
> every strategy review observable, explainable, measurable, and risk-bounded before expanding
> toward paper or live execution.

## Product Identity

GateZero is:

> a personal trading research, risk-control, and execution-support system.

The protected loop is:

```text
Strategy Idea
-> Data Snapshot
-> Backtest
-> Metric Report
-> Risk Review
-> Operator Decision
-> Paper / Reject / Revise
-> Outcome Logged
-> Learning Event
```

## Resolved Scope Rules

- Paper trading is future-supported but secondary until research/backtesting is trustworthy.
- Live execution remains blocked until strategy maturity, risk, QA, and human approval gates pass.
- Learning must use observed evidence only: backtests, paper outcomes, operator overrides, rule
  violations, and postmortems.
- No new first-class product surfaces should be added unless they strengthen the protected loop.

## Priority Order

### P0 — Core quality

Must be strong:

- backtest honesty
- metric correctness
- risk review clarity
- bias detection
- reproducibility

### P1 — Decision infrastructure

Must be built before breadth:

- `StrategyReviewDecisionEvent`
- operator traceability
- review history
- backtest run immutability
- risk verdict tracking

### P2 — Product tightening

Strengthen the operator loop:

- strategy workspace clarity
- backtest report clarity
- risk panel clarity
- rejected strategy visibility
- learning journal usefulness

### P3 — Supporting systems

Useful but secondary:

- paper-trading simulation
- broker adapter design
- notifications
- richer analytics

### P4 — Future expansion

Explicitly not now:

- autonomous live trading
- multi-user team workflows
- public SaaS
- copy-trading/social trading
- fully automated portfolio control

## Phase 0 — Freeze Breadth

Rule:

- no live trading
- no broker credentials
- no AI prediction
- no autonomous order execution
- no new broad app chapters

Allowed work:

- quality
- reliability
- observability
- operator-speed improvements
- decision traceability
- strategy review contracts

## Phase 1 — Engineering Stabilization

Goal:

- make the repo stable and predictable.

Deliverables:

- pnpm-only workspace discipline
- clear package ownership
- green build/test/typecheck/lint
- Docker Compose local setup
- environment variable documentation
- no secret leakage

## Phase 2 — Decision Trace and Observability

Goal:

- make strategy review outcomes traceable and inspectable.

Deliverables:

- strategy decision event contract
- backtest run event contract
- risk review event contract
- learning event contract
- audit log view

## Phase 3 — Benchmark Expansion

Goal:

- measure strategy review and metric behavior against known fixtures.

Deliverables:

- benchmark strategy cases
- biased-backtest fixtures
- fee/slippage fixtures
- bad-data fixtures
- risk-veto fixtures

## Phase 4 — Paper Trading Readiness

Goal:

- prepare simulated execution after research quality is proven.

Deliverables:

- paper trading gate
- simulated order lifecycle
- paper outcome reporting
- mistake ledger integration
