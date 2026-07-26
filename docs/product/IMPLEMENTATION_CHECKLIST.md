# Trading Intelligence Command Center Implementation Checklist

## Working agreement

This checklist tracks product increments rather than generating one governance packet per small
change. Historical `TRD-*` records remain available for audit, but this branch is organized around
working milestones and measurable exit criteria.

## M1 — Source-of-truth consolidation

- [x] Update root README to describe the current operating state.
- [x] Add a concise current roadmap.
- [x] Add a concise release-status document.
- [x] Define the Evidence-Gated Setup Review vertical slice.
- [ ] Add a canonical runtime status contract.
- [ ] Generate frontend status metadata from the canonical contract.
- [ ] Remove manually duplicated test, packet, CI, and commit counts.
- [ ] Split snapshot generation from validation.
- [ ] Add gate-neutral `validate` and `verify` commands.
- [ ] Keep existing Gate 0 commands temporarily as compatibility aliases.
- [ ] Archive historical tracklist narration away from the active roadmap.
- [ ] Add a consistency check across README, release status, runtime status, and UI gate values.

## M2 — Package and application boundaries

- [ ] Add `packages/application`.
- [ ] Add package manifests and export maps to workspace packages where missing.
- [ ] Replace relative cross-package source imports with workspace imports.
- [ ] Add protected-loop application services.
- [ ] Add explicit transition errors and tests.

## M3 — Setup Review domain

- [ ] Add `SetupReviewDecision`.
- [ ] Add `MarketContext` and timeframe snapshots.
- [ ] Add `TradeThesis`.
- [ ] Add supporting and contradicting evidence collections.
- [ ] Add `StrategyEvidenceSummary`.
- [ ] Add mandatory `InvalidationPlan`.
- [ ] Add `RiskPlan`.
- [ ] Add `PortfolioImpact`.
- [ ] Add explainable `EvidenceQualityAssessment`.
- [ ] Add state-machine transitions and invariants.
- [ ] Add fixtures for `REJECT`, `WATCH`, and `PAPER_SIMULATE`.

## M4 — Backtest and risk correctness

- [ ] Add focused moving-average index tests.
- [ ] Add next-candle execution timing tests.
- [ ] Use fill-adjusted notional in no-leverage checks.
- [ ] Include entry commission in capital sufficiency.
- [ ] Add conservative liquidation-equity evidence.
- [ ] Add strategy plugin boundary.
- [ ] Add sample-sufficiency fields.
- [ ] Add regime coverage fields.
- [ ] Add out-of-sample posture.
- [ ] Add parameter-sensitivity posture.

## M5 — Decision-first frontend

- [ ] Introduce a maintainable application shell.
- [ ] Add Market Overview.
- [ ] Add Candidate Queue.
- [ ] Add Setup Review workspace.
- [ ] Show supporting and contradicting evidence side by side.
- [ ] Add invalidation, risk, and portfolio-impact panels.
- [ ] Add explicit decision reasons.
- [ ] Move repository health into a secondary System Health area.
- [ ] Remove unsafe rendering paths before untrusted content is accepted.
- [ ] Add browser-level accessibility and workflow tests.

## M6 — Outcome learning

- [ ] Freeze the decision-time evidence bundle.
- [ ] Record simulation outcome separately.
- [ ] Compare expected and observed behavior.
- [ ] Record thesis, evidence, timing, and risk errors.
- [ ] Create immutable learning events.
- [ ] Add outcome and learning history to the Setup Review.

## Explicitly deferred

- [ ] Broker or exchange integration.
- [ ] Live orders.
- [ ] External paper order routing.
- [ ] Autonomous execution.
- [ ] Unreviewed AI directional decisions.
- [ ] Generic confidence scores without calibration.
- [ ] Performance or readiness claims.
