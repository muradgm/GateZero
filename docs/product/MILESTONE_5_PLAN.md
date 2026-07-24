# Milestone 5 Plan — Decision-First Command Center

## Outcome

The command center leads with market decisions and evidence, while repository health moves to a secondary operational surface.

## Primary information architecture

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

## MVP screen requirements

- Candidate identity, instrument, timestamp, session, and freshness.
- Multi-timeframe context and volatility state.
- Thesis, proposed trigger, entry zone, target, and invalidation.
- Supporting and contradicting evidence with source and limitation adjacency.
- Strategy evidence, reproducibility, sample size, regime coverage, and limitations.
- Risk budget, estimated costs, maximum loss, and projected exposure.
- Explicit `REJECT`, `WATCH`, or `PAPER_SIMULATE` decision with reasons.
- Immutable outcome and learning history once available.

## Frontend architecture

- Consume validated projections rather than importing mutable source objects directly.
- Use escaped rendering by default.
- Prohibit raw untrusted content interpolation through `innerHTML`.
- Keep domain decisions in application services, not event handlers or templates.
- Add keyboard, responsive, accessibility, and workflow-level tests.

## System Health

Keep these available under a secondary section:

- operating gate and scope;
- verification state;
- CI state;
- evidence freshness;
- review coverage;
- artifact and source-link diagnostics.

These indicators support trust but must not dominate the trader workflow.

## Exit criteria

- One operator can inspect and decide one complete Setup Review from a coherent workspace.
- Contradicting evidence and limitations cannot be hidden by default.
- No UI affordance implies live execution or trade approval.
- Untrusted text is escaped.
- The core workflow passes browser-level tests.
