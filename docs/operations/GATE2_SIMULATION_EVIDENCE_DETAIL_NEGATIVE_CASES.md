# Gate 2 Simulation Evidence Detail Negative Cases

TRD: TRD-522

## Plan

Negative cases should reject fields that imply action, account connectivity, credentials, approval,
readiness, prediction, or performance claims. They should also reject missing source artifacts and
stale references.

## Boundary

Negative cases must tighten guard behavior before implementation.

## Source Links

- `ops/assignments/TRD-522_SIMULATION_EVIDENCE_DETAIL_NEGATIVE_CASES.md`
- `packages/contracts/tests/gate2-paper-simulation-contracts.test.ts`
- `scripts/check-gate1-contracts.ts`
