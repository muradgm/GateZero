# Gate 2 Movement Request Intake

TRD-407 converts operator approval into a formal gate movement request.

## Request

- From: `G1_BACKTESTING`.
- To: `G2_PAPER_TRADING` planning authorization.
- Scope: `paper_simulation_planning_only`.
- Implementation: blocked until a separate contract-first packet is accepted.

## Required Approval Evidence

- Operator decision record.
- Financial-risk review.
- Autonomy review.
- QA/security review.
- Orchestrator acceptance.

## Source Links

- Source packet: `ops/assignments/TRD-407_GATE_MOVEMENT_REQUEST_INTAKE.md`
- Reviews: `ops/runtime/reviews/TRD-407_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-407_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-407_ORCHESTRATOR_ACCEPTANCE.md`
