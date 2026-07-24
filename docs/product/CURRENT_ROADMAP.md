# TraderFrame Current Roadmap

## Purpose

This document is the current product roadmap. It intentionally stays small, outcome-oriented, and
separate from the historical `TRD-*` packet ledger.

## Product objective

Build a Trading Intelligence Command Center that helps an operator identify, evaluate, reject,
watch, or paper-simulate market setups using traceable evidence and explicit risk constraints.

## Core wedge

```text
No trade without evidence. No execution without risk approval.
```

## Current user

The primary user is a serious individual trader or research operator who needs a disciplined way to
turn market observations into reviewable, reproducible, risk-bounded decisions.

## Current milestone

### Evidence-Gated Setup Review MVP

Deliver one complete vertical slice for one instrument and one strategy family:

```text
Market Candidate
  -> Market Context
  -> Research Case
  -> Supporting and Contradicting Evidence
  -> Deterministic Backtest Evidence
  -> Invalidation and Risk Plan
  -> Operator Decision
  -> Paper Simulation
  -> Outcome
  -> Learning Event
```

Allowed operator decisions:

- `REJECT`
- `WATCH`
- `PAPER_SIMULATE`

## Milestone sequence

### M1 — Source-of-truth consolidation

Outcome: the repository has one accurate current state and one current roadmap.

- Align README, product status, command names, and gate language.
- Separate generated snapshots from validation commands.
- Generate volatile runtime metadata from one canonical status contract.
- Move the historical packet list out of the active planning path.
- Preserve all existing boundaries and compatibility commands during migration.

Exit criteria:

- README, release status, runtime status, and UI report the same operating gate and scope.
- Validation does not silently regenerate the evidence it is intended to check.
- Current roadmap contains no historical packet narration.

### M2 — Application spine

Outcome: one application service owns progression through the protected decision loop.

Target modules:

```text
packages/application/
  src/
    create-research-case.ts
    build-market-context.ts
    assemble-setup-review.ts
    run-strategy-evidence.ts
    request-risk-review.ts
    record-operator-decision.ts
    record-paper-simulation.ts
    record-outcome.ts
    create-learning-event.ts
```

Exit criteria:

- The UI and scripts do not manually assemble protected-loop state.
- Every state transition is validated and audit-linked.
- Invalid transitions fail with explicit domain errors.

### M3 — Setup Review domain

Outcome: one canonical aggregate connects context, evidence, risk, decision, and learning.

- Define `MarketContext`.
- Define `TradeThesis`.
- Define supporting and contradicting evidence references.
- Define mandatory invalidation.
- Define risk budget and portfolio impact.
- Define bounded recommendation outcomes.
- Define decision rationale and limitations.

Exit criteria:

- A setup cannot reach `PAPER_SIMULATE` without mandatory evidence, invalidation, and risk fields.
- Missing or stale evidence produces `WATCH` or `REJECT`, never an implied approval.

### M4 — Deterministic evidence hardening

Outcome: historical evidence is correct enough to support the setup review.

- Add explicit moving-average index tests.
- Include fill-adjusted capital usage in exposure checks.
- Distinguish mark-to-market equity from conservative liquidation equity.
- Add strategy-plugin boundaries without adding optimization authority.
- Add sample sufficiency, regime, and out-of-sample limitation fields.

Exit criteria:

- Signal timing is proven by focused test fixtures.
- Capital and cost invariants use actual simulated fills.
- Strategy evidence exposes limitations beside metrics.

### M5 — Decision-first command center

Outcome: the frontend leads with market decisions, not repository health.

Primary navigation:

```text
Market Overview
Candidate Queue
Setup Review
Evidence
Risk and Exposure
Decision Record
Outcome and Learning
System Health
```

Exit criteria:

- The operator can complete the entire Setup Review MVP from one coherent workspace.
- Every conclusion links to evidence.
- Contradicting evidence and limitations remain visually adjacent to the decision.
- System health is available but secondary.

### M6 — Outcome learning

Outcome: TraderFrame compares the original thesis with the observed result without rewriting history.

- Freeze the decision-time evidence bundle.
- Record outcome separately.
- Compare expected and observed invalidation, excursion, risk, and result.
- Create a structured learning event.

Exit criteria:

- Historical decisions remain immutable.
- Learning records can reference mistakes in thesis, evidence, timing, or risk.

## Deferred scope

The following remain out of scope until a separate authorization decision:

- broker and exchange connections;
- live or external paper order routing;
- autonomous execution;
- unreviewed AI buy/sell decisions;
- generic confidence scores without calibration evidence;
- performance or readiness claims;
- real-time alert infrastructure;
- broad indicator or provider expansion before the vertical slice is proven.

## Product success signal

The MVP succeeds when another operator can inspect one setup and answer:

1. Why was this candidate considered?
2. What supports it?
3. What contradicts it?
4. What invalidates it?
5. What is the risk and exposure impact?
6. Why was it rejected, watched, or paper-simulated?
7. What was learned from the outcome?
