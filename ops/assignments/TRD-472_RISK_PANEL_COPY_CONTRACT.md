# TRD-472 Risk Panel Copy Contract

## Goal

Define copy rules for future risk panels so risk state is visible without approval or readiness
semantics.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.
- Surface: risk panel labels, blocker copy, review status copy, and operator decision context.

## Blocked Scope

- No approval, readiness, safe-to-trade, certified, promoted, profitable, deployable, or execution
  permission language.

## Required Outputs

- Risk panel copy contract.
- QA/security, risk, and orchestrator review records.
- Tracker, docs index, command-center, and guard-index updates.

## Acceptance Criteria

- Risk copy is conservative and blocker-first.
- Operator authority is preserved.
- Next task remains operator workflow panel contract.

## Source Links

- Report: `docs/operations/GATE2_RISK_PANEL_COPY_CONTRACT.md`
- QA/security review: `ops/runtime/reviews/TRD-472_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-472_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-472_ORCHESTRATOR_ACCEPTANCE.md`
