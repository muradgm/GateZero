# GateZero App Roadmap

## Purpose

This roadmap defines the app-focused sequence for GateZero while keeping the protected
strategy-review loop ahead of product breadth.

Two truths must stay visible at the same time:

- the workspace can eventually become broad
- the core trading-risk loop must become trustworthy first

## Protected Product Loop

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

Everything outside this loop is secondary until the loop is measurable and trustworthy.

## Roadmap Rules

### Rule 1

Do not let app shell breadth outrun research and risk quality.

### Rule 2

Do not let visual polish replace backtest honesty.

### Rule 3

Every new surface must answer one obvious operator question in under 5 seconds.

### Rule 4

Learning must show observed data only: backtest results, operator decisions, paper outcomes,
overrides, mistakes, and repeated failure patterns.

### Rule 5

Settings should change real risk and review behavior, not exist as decorative control panels.

## Phase 0 — Foundation

Goal:

- establish repo skeleton, docs, gates, contracts, agent workflow, and research-only boundaries.

Allowed:

- product truth
- risk rules
- strategy maturity model
- basic workspace shell
- placeholder contracts
- test scaffolding

Blocked:

- live trading
- broker integration
- AI prediction
- autonomous execution

## Phase 1 — Backtesting Proof

Goal:

- run one deterministic strategy on historical data and generate a reproducible report.

Deliverables:

- data fixture ingestion
- strategy interface
- one simple baseline strategy
- backtest result contract
- metrics calculation
- immutable run record
- report page

## Phase 2 — Quality and Risk Hardening

Goal:

- make backtest reports more honest and harder to misuse.

Deliverables:

- fees and slippage models
- drawdown analysis
- bias warnings
- strategy review template
- risk-review verdict
- QA fixtures
- regression tests

## Phase 3 — Paper Trading Preparation

Goal:

- prepare for simulated execution only after Phase 1 and 2 are stable.

Deliverables:

- paper account model
- simulated order lifecycle
- event journal
- paper-trading readiness gate
- learning event trigger

## Phase 4 — Supervised Execution, Future Only

Goal:

- design broker adapter boundaries without enabling real trading by default.

Deliverables:

- broker adapter interface
- execution readiness contract
- kill-switch policy implementation
- human approval flow
- tiny-capital live-readiness checklist

## Explicitly Not Now

- leverage
- options
- crypto leverage
- high-frequency trading
- social sentiment trading
- public SaaS
- mobile app
- autonomous risk changes
- AI-generated buy/sell decisions
