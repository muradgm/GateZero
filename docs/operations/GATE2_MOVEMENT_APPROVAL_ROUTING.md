# Gate 2 Movement Approval Routing

TRD-408 records the approval routing for the Gate 2 planning lane.

## Approval Route

- Operator: approved proceeding after TRD-402.
- RISK: must confirm no risk-gate loosening and no execution surface.
- QA_SECURITY: must confirm local validation, scanner posture, and credential boundaries.
- ORCHESTRATOR: must accept only after RISK and QA_SECURITY records exist.

## Boundary

This route authorizes planning and control-plane alignment only.

## Source Links

- Source packet: `ops/assignments/TRD-408_GATE_MOVEMENT_APPROVAL_ROUTING.md`
- Reviews: `ops/runtime/reviews/TRD-408_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-408_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-408_ORCHESTRATOR_ACCEPTANCE.md`
