# First Implementation Packet

## 1. Implementation Goal

Initialize the GateZero project as a Gate 0 Research-Only monorepo.

The implementation must create the repo foundation for the protected decision loop:

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

This packet does not authorize real trading, paper trading, broker integration, autonomous
execution, or AI prediction.

Task ID: `TRD-001`

Assigned implementation agent: `BACKEND`

Mandatory review agents: `QA_SECURITY`, `RISK`

Current financial gate: `G0_RESEARCH`

Current autonomy gate: `Gate B - Bounded Execution`

## 2. Product Truth Constraints

GateZero is a personal trading research, risk-control, and execution-support system.

The implementation must preserve:

- No trade without evidence.
- No execution without risk approval.
- Engineering quality does not imply market edge.
- No strategy may place real trades.
- No strategy may promote itself.
- No product breadth may outrun trust in the core decision loop.
- Current gate remains `G0_RESEARCH`.

Controlling files:

- `ops/truth/PROJECT_TRUTH.md`
- `ops/truth/PRODUCT_WEDGE.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `ops/governance/AUTONOMY_GATES.md`
- `docs/engineering/SENIOR_TECHNICAL_LEAD_REMEDIATION_BRIEF.md`
- `docs/engineering/DECISION_LOOP_HARDENING_ROADMAP.md`
- `docs/engineering/API_CONTRACTS.md`
- `docs/engineering/CODING_STANDARDS.md`
- `docs/engineering/TESTING_STRATEGY.md`

## 3. Allowed Scope

Codex may initialize:

- monorepo folder structure
- package/workspace configuration
- baseline README files
- runtime-validated contract schemas
- test setup
- lint/typecheck/format setup
- research-only internal contract stubs
- docs that describe Gate 0 boundaries
- fixtures for non-market synthetic examples
- validation scripts that scan for blocked trading patterns

Allowed domains:

- strategy idea records
- data snapshot metadata
- backtest result contract definitions
- metric report contract definitions
- strategy review decision event definitions
- risk review contract definitions
- operator decision contract definitions
- outcome log contract definitions
- learning event contract definitions
- explicit error semantics for validation, risk, phase, security, and unsupported-scope failures

## 4. Blocked Scope

Codex must not create or modify anything that enables:

- live trading
- paper trading execution
- broker integration
- broker API clients
- broker secrets
- order placement
- market orders
- autonomous execution
- AI buy/sell prediction
- live signal generation
- strategy profitability claims
- strategy promotion
- risk-gate loosening
- leverage, margin, options, or hidden execution paths

Blocked folder/file names include:

- `broker/`
- `brokers/`
- `execution/`
- `orders/`
- `live/`
- `paper-trading/`
- `autotrade/`
- `signals/`
- `predictions/`
- `.env`
- broker API key handling files

Blocked dependencies include:

- broker SDKs
- live market execution SDKs
- AI trading signal packages
- packages whose primary purpose is order routing or broker execution

## 5. Repo Structure

Create this research-only monorepo structure:

```text
GateZero/
  README.md
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  eslint.config.js
  prettier.config.js

  apps/
    web/
      README.md

  packages/
    contracts/
      README.md
      src/
        index.ts
        schemas.ts
        errors.ts
        gate.ts
        strategy-maturity.ts
        strategy-idea.ts
        data-snapshot.ts
        backtest-result.ts
        metric-report.ts
        strategy-review-decision-event.ts
        risk-review.ts
        operator-decision.ts
        outcome-log.ts
        learning-event.ts
      tests/

    core/
      README.md
      src/
        index.ts
        protected-decision-loop.ts
      tests/

    validation/
      README.md
      src/
        forbidden-patterns.ts
      tests/

  docs/
    README.md

  scripts/
    validate-gate0.ts
```

## 6. Required Files

Required root files:

- `README.md`
- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `eslint.config.js`
- `prettier.config.js`

Required package files:

- `packages/contracts/src/index.ts`
- `packages/contracts/src/schemas.ts`
- `packages/contracts/src/errors.ts`
- `packages/contracts/src/gate.ts`
- `packages/contracts/src/strategy-maturity.ts`
- `packages/contracts/src/strategy-idea.ts`
- `packages/contracts/src/data-snapshot.ts`
- `packages/contracts/src/backtest-result.ts`
- `packages/contracts/src/metric-report.ts`
- `packages/contracts/src/strategy-review-decision-event.ts`
- `packages/contracts/src/risk-review.ts`
- `packages/contracts/src/operator-decision.ts`
- `packages/contracts/src/outcome-log.ts`
- `packages/contracts/src/learning-event.ts`
- `packages/core/src/protected-decision-loop.ts`
- `packages/validation/src/forbidden-patterns.ts`
- `scripts/validate-gate0.ts`

## 7. Required Docs

Docs must state that the repo is Gate 0 Research Only.

Required docs:

- root `README.md`
- `apps/web/README.md`
- `packages/contracts/README.md`
- `packages/core/README.md`
- `packages/validation/README.md`

Docs must not contain profit, win-rate, alpha, guaranteed return, or AI trading bot claims except
when explicitly quoting blocked scope.

## 8. Required Contracts

Contracts must model the decision loop without enabling execution.

Every contract must have:

- TypeScript type exports
- runtime schema validation
- at least one positive contract test
- at least one negative contract test for invalid input

Use `zod` unless there is a clear reason to choose another schema library.

Required contract concepts:

- `FinancialGate = "G0_RESEARCH"`
- `StrategyMaturityLevel`
- `RiskVerdict`
- `StrategyIdea`
- `DataSnapshot`
- `BacktestResult`
- `MetricReport`
- `StrategyReviewDecisionEvent`
- `RiskReview`
- `OperatorDecision`
- `OutcomeLog`
- `LearningEvent`
- `ContractValidationError`
- `DataQualityError`
- `RiskBlockedError`
- `PhaseBlockedError`
- `SecurityBlockedError`
- `UnsupportedScopeError`

Risk verdict states must include:

- `blocked_by_risk`
- `requires_revision`
- `research_only`
- `paper_candidate`

Phase 0 must not create or permit:

- `live_candidate`
- `supervised_live_candidate`
- `limited_live_automation`

Backtest result contracts must include:

- strategy version
- data source/version
- symbol/universe
- date range
- timeframe
- fee model
- slippage model
- starting capital
- position sizing rule
- parameters
- trade list
- equity curve data
- drawdown curve data
- metric summary
- generated warnings
- verdict

Risk review must include fields aligned with `ops/contracts/risk_review_contract.json`, including:

- `strategy_id`
- `strategy_version`
- `financial_gate_requested`
- `approved`
- `blocking_findings`
- `required_controls`
- `max_position_size_pct`
- `max_daily_loss_pct`
- `max_weekly_loss_pct`
- `max_drawdown_before_freeze_pct`
- `kill_switch_required`
- `human_approval_required`

For this packet, `financial_gate_requested` must remain `G0_RESEARCH`.

`StrategyReviewDecisionEvent` must bind together:

- strategy idea reference
- data snapshot reference
- backtest result reference
- metric report reference
- risk review reference
- operator decision reference
- maturity level
- assumptions
- risk flags
- final research-only verdict

## 9. Required Tests

Tests must verify:

- contracts only allow `G0_RESEARCH`
- runtime schemas reject malformed contract payloads
- protected decision loop order is preserved
- `StrategyReviewDecisionEvent` cannot omit assumptions or risk flags
- risk review can block a strategy
- risk verdict cannot be `live_candidate` in Phase 0
- operator decision cannot imply execution
- learning event cannot increase risk or autonomy
- forbidden pattern scanner catches broker/order/execution terms
- forbidden pattern scanner supports explicit allowlisted paths for governance docs and test
  fixtures
- docs or source do not contain blocked implementation paths outside the allowlist

## 10. Security Requirements

Security requirements:

- no `.env` files
- no broker secrets
- no API key handling
- no external broker SDKs
- no order endpoints
- no hidden execution path
- no frontend access to secrets
- no dependency that exists primarily for broker execution

Add a validation check for forbidden terms such as:

- `placeOrder`
- `submitOrder`
- `broker`
- `alpaca`
- `interactive brokers`
- `live trade`
- `paper order`
- `buy signal`
- `sell signal`
- `autonomous execution`

The scanner must allow these terms only in explicit allowlisted locations:

- `ops/truth/`
- `ops/governance/`
- `ops/benchmarks/`
- `ops/contracts/`
- `docs/`
- validation tests that assert blocked behavior

## 11. Risk Requirements

Risk requirements:

- Risk authority must remain blocking.
- No agent or package may promote financial gates.
- No strategy may self-promote.
- No metric may be reported without drawdown context in contract design.
- Backtest contracts must include fees, slippage, data source metadata, strategy version, trade
  list, equity curve, drawdown curve, and verdict.
- Outcome logs must preserve reject/revise decisions, not only favorable results.
- Learning events must not modify risk limits or autonomy levels.
- Risk decisions must be modeled as hard state, not advisory copy.

## 12. Acceptance Criteria

Accepted only if:

- repo structure is initialized
- all required files exist
- package scripts run
- lint passes
- format check passes
- tests pass
- typecheck passes
- Gate 0 validation passes
- no blocked files or folders exist
- no broker, execution, paper trading, live trading, or AI prediction path exists
- docs preserve product truth
- contracts represent the protected decision loop
- contracts use runtime schema validation
- strategy review decision event exists and is tested
- risk review can block progress
- no strategy performance claims are introduced

## 13. Validation Commands

Codex must provide and run:

```powershell
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

If `pnpm install` cannot run because dependencies are unavailable, Codex must still provide the
scripts and explain what was not executed.

## 14. Done When

Done when GateZero has a clean Gate 0 Research-Only monorepo foundation that supports the protected
decision loop through runtime-validated contracts, docs, tests, and validation, while introducing no
execution capability and no increase in financial or autonomy gate.

## 15. Codex Prompt

You are Codex implementing the first GateZero repo foundation.

Task ID: `TRD-001`

Assigned Agent: `BACKEND` with mandatory `QA_SECURITY` and `RISK` review after implementation.

Objective: Initialize the GateZero Gate 0 Research-Only Monorepo.

Read first:

- `ops/truth/PROJECT_TRUTH.md`
- `ops/truth/PRODUCT_WEDGE.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `ops/governance/AUTONOMY_GATES.md`
- `ops/core/03_ASSIGNMENT_PACKET.md`
- `ops/core/04_QA_RISK_GATE.md`
- `ops/benchmarks/quant/backtest_honesty_checks.md`
- `ops/benchmarks/risk/risk_review_checks.md`
- `ops/contracts/risk_review_contract.json`
- `docs/engineering/SENIOR_TECHNICAL_LEAD_REMEDIATION_BRIEF.md`
- `docs/engineering/DECISION_LOOP_HARDENING_ROADMAP.md`
- `docs/engineering/API_CONTRACTS.md`
- `docs/engineering/CODING_STANDARDS.md`
- `docs/engineering/TESTING_STRATEGY.md`

Implement only the allowed scope in this packet.

Hard constraints:

- No live trading.
- No broker integration.
- No paper trading execution.
- No autonomous execution.
- No AI buy/sell prediction.
- No real market orders.
- No broker API key handling.
- No strategy profitability claims.
- No risk-gate loosening.

Create the monorepo structure, runtime-validated research-only contracts, protected decision-loop
model, Gate 0 validation script, docs, and tests.

Run:

```powershell
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

Return using `ops/contracts/agent_return_contract.json`, including files changed, validation
performed, benchmarks used, risk notes, open questions, blocked_by, and recommended next step.
