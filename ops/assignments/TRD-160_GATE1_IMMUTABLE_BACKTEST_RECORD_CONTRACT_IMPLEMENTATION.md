# TRD-160: Gate 1 Immutable Backtest Record Contract Implementation

## Objective

Implement a schema-only immutable backtest record contract for future reproducible evidence
tracking.

## Scope

Allowed:

- Add local schema fields for immutable record id, referenced inputs, engine version, input/output
  hashes, reproducibility status, validation status, and operator note.
- Reject self-revisions.

Blocked:

- Backtest execution, report publishing, strategy approval, performance claims, external
  integration, or gate movement.

## Required Output

- `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- `docs/operations/GATE1_IMMUTABLE_BACKTEST_RECORD_CONTRACT.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Schema validates immutable record references and hashes.
- Schema rejects self-revision and scope escalation.
- Gate 0 verification remains passing.

## Source Links

- Planning doc: `docs/operations/GATE1_IMMUTABLE_BACKTEST_RECORD_PLAN.md`
- Assignment authority:
  `ops/assignments/TRD-156_GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
