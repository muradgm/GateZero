# TRD-162: Gate 1 Reproducibility Check Contract Implementation

## Objective

Implement a schema-only reproducibility check contract for future historical backtest evidence use.

## Scope

Allowed:

- Add local schema fields for source references, engine version, input hash, expected output hash,
  rerun output hash, environment label, reproducibility status, and evidence usability.
- Block evidence use unless reproducibility status is reproduced.

Blocked:

- Backtest reruns, external data access, strategy approval, performance claims, execution paths, or
  gate movement.

## Required Output

- `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- `docs/operations/GATE1_REPRODUCIBILITY_CHECK_CONTRACT.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Schema validates reproduced checks.
- Schema rejects mismatched hashes that claim reproduced status.
- Gate 0 verification remains passing.

## Source Links

- Planning doc: `docs/operations/GATE1_REPRODUCIBILITY_CHECK_PLAN.md`
- Assignment authority:
  `ops/assignments/TRD-156_GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
