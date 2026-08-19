# TraderFrame Current Roadmap

## Purpose

This document is the current product roadmap. It intentionally stays small, outcome-oriented, and separate from the historical `TRD-*` packet ledger.

Historical packet records remain useful for audit history, but they are not the active product plan.

## Product objective

Build a Trading Intelligence Command Center that helps an operator identify, evaluate, reject, watch, or paper-simulate market setups using traceable evidence and explicit risk constraints.

TraderFrame should learn from market-reader and indicator-style products where they help traders see context faster, but it must not become a signal-selling, prediction-confidence, leverage, or automation product.

## Core wedge

```text
No trade without evidence. No execution without risk approval.
```

Secondary promise:

```text
Read the market. Frame the risk. Decide with evidence.
```

## Current user

The primary user is a serious individual trader or research operator who needs a disciplined way to turn market observations into reviewable, reproducible, risk-bounded decisions.

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

`PAPER_SIMULATE` authorizes only a local deterministic simulation record. It is not approval to trade, connect a broker, route an order, or claim market readiness.

## Current branch policy

`main` is the source of truth for product direction.

Branches may be kept only if they provide one of the following:

- current Trading Intelligence Command Center work;
- source-of-truth reconciliation work;
- validated decision-trace work;
- evidence-gated experience work;
- current brand work that does not reintroduce stale gate language.

Branches that still describe the product as `G0_RESEARCH`, use the old strategy-only loop, or conflict with this roadmap should not be merged wholesale. Extract useful code only after reconciling naming, gate language, and product boundaries.

## Milestone sequence

### M1 — Source-of-truth consolidation

Outcome: the repository has one accurate current state and one current roadmap.

- Align README, product status, command names, and gate language.
- Separate generated snapshots from validation commands.
- Generate volatile runtime metadata from one canonical status contract.
- Move the historical packet list out of the active planning path.
- Preserve all existing boundaries and compatibility commands during migration.
- Reconcile active branches against `main`; delete or archive stale branches after useful work is extracted.

Exit criteria:

- README, release status, runtime status, and UI report the same operating gate and scope.
- Validation does not silently regenerate the evidence it is intended to check.
- Current roadmap contains no historical packet narration.
- Branches with stale `G0_RESEARCH` or old product-loop language are removed or explicitly marked obsolete.

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
- Include market-reader concepts only as evidence-backed observations, not as trade commands.

Exit criteria:

- A setup cannot reach `PAPER_SIMULATE` without mandatory evidence, invalidation, and risk fields.
- Missing or stale evidence produces `WATCH` or `REJECT`, never an implied approval.
- Market structure, news, event, sentiment, or volatility inputs remain source-linked and limitation-aware.

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

### M7 — Market intelligence inputs

Outcome: TraderFrame can ingest and display market-reader inputs as evidence, not as unreviewed signals.

Candidate input families:

- market structure observations;
- multi-timeframe context;
- liquidity, sweep, or key-level observations;
- volatility state;
- source-linked news and event references;
- source-linked sentiment or breadth inputs;
- red-flag detection;
- signal-candidate records;
- risk-gated scenario recommendation drafts.

Exit criteria:

- No market-intelligence recommendation appears without evidence, source references, confidence, red flags, invalidation, risk review, and operator decision requirement.
- Market intelligence can produce only `REJECT`, `WATCH`, or `PAPER_SIMULATE` candidates.
- Recommendation language remains bounded and cannot become live buy/sell instruction text.

## Deferred scope

The following remain out of scope until a separate authorization decision:

- broker and exchange connections;
- live or external paper order routing;
- autonomous execution;
- unreviewed AI buy/sell decisions;
- generic confidence scores without calibration evidence;
- performance or readiness claims;
- real-time alert infrastructure;
- broad indicator or provider expansion before the vertical slice is proven;
- leverage workflows;
- social or community signal feeds;
- report, share, print, or publishing channels.

## Product success signal

The MVP succeeds when another operator can inspect one setup and answer:

1. Why was this candidate considered?
2. What supports it?
3. What contradicts it?
4. What invalidates it?
5. What is the risk and exposure impact?
6. Why was it rejected, watched, or paper-simulated?
7. What was learned from the outcome?

## Next implementation move

Proceed in this order:

1. Clean branch state: keep `main` and only strategically active work branches; delete or archive stale branches after confirming no unique useful work remains.
2. Complete source-of-truth consolidation and current roadmap alignment.
3. Build the Evidence-Gated Setup Review MVP as the first decision-first vertical slice.
4. Only after the setup review is usable, layer market-intelligence inputs into the workflow through contracts, red flags, scenario drafts, and risk-gated operator decisions.