# Gate 1 Parameter Immutability Guard Contract

## Purpose

Define a schema-only Gate 1 guard proving that strategy parameter drift blocks evidence use.

## Contract Behavior

- `Gate1StrategyParameterImmutabilityGuardContractSchema` compares expected and observed parameter
  hashes.
- The drift flag must match the hash comparison.
- Drifted parameters require `blocked` state and `evidence_usable: false`.
- Approval, performance, external access, and execution paths are impossible.

## Boundary

This guard protects reproducibility. It does not evaluate strategy quality, approve parameter sets,
or authorize paper or live execution.

## Source Links

- Source packet: `ops/assignments/TRD-318_PARAMETER_IMMUTABILITY_GUARD_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-318_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-318_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-318_ORCHESTRATOR_ACCEPTANCE.md`
