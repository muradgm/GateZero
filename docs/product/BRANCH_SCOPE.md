# Branch Scope: Trading Intelligence Command Center

Branch: `feature/trading-intelligence-command-center`

## Goal

Evolve TraderFrame from a control-plane-heavy research repository into a decision-first trading
intelligence product while preserving deterministic evidence, risk review, operator authority, and
all execution boundaries.

## Included

- source-of-truth and command consolidation;
- package-boundary and application-layer improvements;
- Evidence-Gated Setup Review domain;
- deterministic backtest and exposure correctness fixes;
- decision-first command-center frontend;
- outcome and learning workflow;
- focused tests, accessibility, and security hardening.

## Excluded

- broker connectivity;
- live or external paper order routing;
- account credentials;
- autonomous execution;
- unreviewed AI directional decisions;
- profitability and readiness claims.

## Delivery strategy

Use six working milestones defined in `CURRENT_ROADMAP.md`. Prefer cohesive product increments over a
large number of small governance packets. Open and maintain a draft pull request until the complete
vertical slice and validation suite are ready for review.
