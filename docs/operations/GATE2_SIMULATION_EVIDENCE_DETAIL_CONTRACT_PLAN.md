# Gate 2 Simulation Evidence Detail Contract Plan

TRD: TRD-512

## Plan

Simulation evidence detail should be modeled as local read-only records containing source artifact,
run context, assumption references, blocker references, and reproducibility notes.

## Boundary

The contract must not carry permission, readiness, approval, or performance-claim fields.

## Source Links

- `ops/assignments/TRD-512_SIMULATION_EVIDENCE_DETAIL_CONTRACT_PLAN.md`
- `packages/contracts/src/gate2-paper-simulation-contracts.ts`
- `packages/fixtures/src/gate2-paper-simulation-fixtures.ts`
