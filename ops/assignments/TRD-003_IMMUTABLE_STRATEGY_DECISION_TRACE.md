# TRD-003 - Immutable Strategy Review Decision Trace

## Assigned Agent

`BACKEND`

Mandatory review agents: `QA_SECURITY`, `RISK`

## Objective

Add a Gate 0 contract and core helper for immutable strategy review decision traces.

The trace must make the protected decision loop observable, ordered, and tamper-evident without
adding persistence, broker integration, paper execution, live execution, AI prediction, or strategy
promotion.

## Current Financial Gate

`G0_RESEARCH`

## Product Wedge Relevance

Supports:

```text
No trade without evidence. No execution without risk approval.
```

The trace records the evidence path from strategy idea through learning event so reviews cannot
silently skip data, metrics, risk review, or operator decision.

## Allowed Files

- `packages/contracts/src/strategy-decision-trace.ts`
- `packages/contracts/src/index.ts`
- `packages/contracts/tests/strategy-decision-trace.test.ts`
- `packages/core/src/strategy-decision-trace.ts`
- `packages/core/src/index.ts`
- `packages/core/tests/strategy-decision-trace.test.ts`
- `ops/assignments/TRD-003_IMMUTABLE_STRATEGY_DECISION_TRACE.md`
- `ops/runtime/reviews/TRD-003_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-003_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-003_ORCHESTRATOR_ACCEPTANCE.md`

## Blocked Files

- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- broker integration files
- live trading files
- paper execution files
- broker secret handling
- strategy promotion records

## Source Truth Files

- `ops/truth/PROJECT_TRUTH.md`
- `ops/truth/PRODUCT_WEDGE.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `ops/governance/AUTONOMY_GATES.md`
- `docs/engineering/SENIOR_TECHNICAL_LEAD_REMEDIATION_BRIEF.md`
- `docs/engineering/DECISION_LOOP_HARDENING_ROADMAP.md`
- `docs/engineering/API_CONTRACTS.md`

## Required Contract

Create `StrategyDecisionTraceSchema` with:

- `trace_id`
- `strategy_id`
- `strategy_version`
- `financial_gate` fixed to `G0_RESEARCH`
- `append_only` fixed to `true`
- `events` covering the protected loop in exact order
- event sequence numbers starting at 1
- event references to recorded loop artifacts
- `previous_event_hash` chain
- `event_hash`
- `created_at`
- optional `sealed_at`

The schema must reject:

- missing loop steps
- reordered loop steps
- skipped sequence numbers
- broken hash chains
- non-Gate-0 financial gates
- `append_only: false`

## Required Core Helper

Create a helper that:

- validates a trace through the runtime schema
- returns a deeply frozen trace object
- does not persist data
- does not compute trading decisions
- does not promote strategy maturity

## Required Tests

Add tests proving:

- a valid trace parses
- reordered events are rejected
- broken hash chains are rejected
- `append_only: false` is rejected
- non-Gate-0 financial gates are rejected
- the core helper returns frozen nested trace data

## Required Validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Done When

- Trace contract exists and is exported.
- Core helper exists and is exported.
- Tests cover valid and invalid traces.
- Full validation passes.
- Gate remains `G0_RESEARCH`.
