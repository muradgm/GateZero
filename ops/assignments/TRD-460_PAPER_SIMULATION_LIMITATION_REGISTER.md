# TRD-460 Paper Simulation Limitation Register

## Goal

Create a current limitation register for Gate 2 local paper-simulation evidence before product or
frontend expansion.

## Scope

- Current gate: `G2_PAPER_TRADING`.
- Current scope: `paper_simulation_planning_only`.
- Surface: limitations, assumptions, blocked claims, and operator caveats.

## Blocked Scope

- No performance claims, readiness claims, approval labels, live execution, broker integration,
  external accounts, credentials, autonomous action, AI prediction, or risk-gate loosening.

## Required Outputs

- Paper-simulation limitation register.
- QA/security, risk, and orchestrator reviews.
- Tracklist/index updates.

## Acceptance Criteria

- Limitations are explicit and conservative.
- Simulation evidence cannot be read as trade permission.
- Next task remains operator workflow dry-run plan.

## Source Links

- Report: `docs/operations/GATE2_PAPER_SIMULATION_LIMITATION_REGISTER.md`
- QA/security review: `ops/runtime/reviews/TRD-460_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-460_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-460_ORCHESTRATOR_ACCEPTANCE.md`
