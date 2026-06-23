# TRD-458 Mechanics Docs Stale-Reference Sweep

## Goal

Record a Gate 2 stale-reference sweep for mechanics documentation after the local mechanics lane was
accepted.

## Scope

- Current gate: `G2_PAPER_TRADING`.
- Current scope: `paper_simulation_planning_only`.
- Surface: Gate 2 mechanics docs, tracklist, command-center links, and review records.
- Output type: documentation control-plane record only.

## Blocked Scope

- No broker integration, external account connectivity, live orders, autonomous execution, AI
  buy/sell prediction, approval labels, readiness labels, performance claims, or risk-gate
  loosening.

## Required Outputs

- Stale-reference sweep record.
- QA/security, risk, and orchestrator reviews.
- Tracklist/index updates.

## Acceptance Criteria

- Stale planning-only language is framed as a documentation risk, not product permission.
- Current local mechanics are described as bounded evidence only.
- Next task remains guard aging review.

## Source Links

- Report: `docs/operations/GATE2_MECHANICS_DOCS_STALE_REFERENCE_SWEEP.md`
- QA/security review: `ops/runtime/reviews/TRD-458_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-458_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-458_ORCHESTRATOR_ACCEPTANCE.md`
