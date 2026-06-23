# TRD-468 Frontend Information Architecture Plan

## Goal

Plan TraderFrame's future read-only frontend information architecture before any build packet.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.
- Surface: navigation model, screen groups, evidence hierarchy, and blocked UI affordances.

## Blocked Scope

- No implementation, broker integration, account connectivity, credentials, execution controls,
  autonomous actions, AI buy/sell prediction, approval labels, readiness labels, or performance
  claims.

## Required Outputs

- Information architecture plan.
- QA/security, risk, and orchestrator review records.
- Tracker, docs index, command-center, and guard-index updates.

## Acceptance Criteria

- Navigation is evidence-first and read-only.
- Risk and limitations are visible before any operator decision surface.
- Next task remains frontend route boundary map.

## Source Links

- Report: `docs/operations/GATE2_FRONTEND_INFORMATION_ARCHITECTURE_PLAN.md`
- QA/security review: `ops/runtime/reviews/TRD-468_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-468_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-468_ORCHESTRATOR_ACCEPTANCE.md`
