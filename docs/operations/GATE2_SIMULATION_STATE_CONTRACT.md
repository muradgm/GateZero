# Gate 2 Simulation State Contract

TRD-425 adds the Gate 2 simulation state contract schema.

## Required Boundaries

- Local planning states only.
- Operator required.
- Automated transition disabled.
- Rollback gate fixed to `G1_BACKTESTING`.
- Voided states cannot return to recorded simulation evidence.

## Source Links

- Source packet: `ops/assignments/TRD-425_SIMULATION_STATE_CONTRACT_SCHEMA.md`
- Reviews: `ops/runtime/reviews/TRD-425_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-425_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-425_ORCHESTRATOR_ACCEPTANCE.md`
