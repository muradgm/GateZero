# Gate 2 Simulation State Boundary Plan

TRD-414 defines future simulation state boundaries before implementation.

## Allowed Planning States

- `planned`
- `review_required`
- `risk_blocked`
- `operator_rejected`
- `simulation_recorded`
- `voided`

## Disallowed Transitions

- Any transition that reaches an external account.
- Any transition triggered without operator action.
- Any transition that implies live execution.
- Any transition that treats validation as strategy approval.

## Rollback

If a state boundary becomes ambiguous, the project rolls back to Gate 1 maintenance.

## Source Links

- Source packet: `ops/assignments/TRD-414_GATE2_SIMULATION_STATE_BOUNDARY_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-414_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-414_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-414_ORCHESTRATOR_ACCEPTANCE.md`
