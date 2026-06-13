# GateZero Senior Technical Lead Remediation Brief

## Purpose

This brief converts GateZero's operating truth into an execution-ready hardening plan.

The goal is to fix the highest-risk workflow integrity problems first, then tighten API and data
boundaries, then reduce maintainability drag.

This is not a feature roadmap. It is a stability and trust-hardening brief.

## Current Verdict

Build carefully.

The immediate problem is not “more trading features.”

The immediate problem is workflow trust:

- backtest results can mislead if assumptions are hidden
- risk verdicts can be bypassed if not modeled as hard gates
- future execution can become unsafe if order lifecycle is not explicit
- learning can become dangerous if it changes risk posture automatically

## Executive Priority Order

1. Strategy review integrity
2. Backtest reproducibility
3. Risk gate enforcement
4. Data quality boundary
5. Learning-event governance
6. API/security baseline
7. UI clarity and operator trust

## Workstream 1: Strategy Review Integrity

### Why this is first

If GateZero says a strategy is acceptable when its evidence is weak, the operator cannot trust the
workspace.

That breaks the core product promise.

### Recommendation

Near-term:

- every strategy review must produce a structured verdict
- every verdict must include evidence, assumptions, risk flags, and maturity level
- risk veto must be first-class and not a text note

Longer-term:

- move strategy review, risk review, paper outcome, and learning event into a proper event-sourced
  decision trace.

### Acceptance Criteria

- every reviewed strategy has a recorded review event
- every review event includes assumptions and risk flags
- a risk veto blocks promotion
- rejected strategies remain visible with reasons

## Workstream 2: Backtest Reproducibility

### Problem

Backtest results are dangerous when configuration, data, and assumptions are not fully captured.

### Recommendation

Every backtest run must store:

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
- generated metrics
- warnings

### Acceptance Criteria

- the same run can be reproduced from stored config
- metrics are recalculated in tests from fixtures
- fee/slippage assumptions are never optional

## Workstream 3: Risk Gate Enforcement

### Recommendation

Risk decisions must be modeled as hard state, not advisory copy.

The system must support:

- `blocked_by_risk`
- `requires_revision`
- `research_only`
- `paper_candidate`

No Phase 0 output may create `live_candidate`.

## Workstream 4: Learning Governance

### Recommendation

Learning must improve future reviews, tests, and warnings.

Learning must not:

- increase risk limits
- remove human approval
- promote strategy maturity
- enable execution
- loosen gates

## Workstream 5: API Trust Boundary

### Recommendation

Even in an internal system, product-changing routes should have an explicit internal boundary before
serious data or execution support is added.

## Done When

- strategy review contract exists
- backtest result contract exists
- risk review contract exists
- learning event contract exists
- QA validation checklist exists
- all Phase 0 docs agree on Gate 0 research-only scope
