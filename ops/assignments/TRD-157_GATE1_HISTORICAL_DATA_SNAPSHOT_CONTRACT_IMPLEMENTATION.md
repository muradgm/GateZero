# TRD-157: Gate 1 Historical Data Snapshot Contract Implementation

## Objective

Implement a schema-only historical data snapshot contract for future reproducible backtest inputs.

## Scope

Allowed:

- Add or extend local contract schemas and tests.
- Require stable snapshot identity, explicit source labels, deterministic columns, date range, and
  content hash.

Blocked:

- Data ingestion, external data access, execution workflows, prediction, performance claims, or gate
  movement.

## Required Output

- `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- `docs/operations/GATE1_HISTORICAL_DATA_SNAPSHOT_CONTRACT.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Schema validates a local `G0_RESEARCH`, `research_only`, `schema_only` snapshot.
- Schema rejects missing content hash and scope escalation.
- Gate 0 verification remains passing.

## Source Links

- Planning doc: `docs/operations/GATE1_HISTORICAL_DATA_SNAPSHOT_CONTRACT_PLAN.md`
- Assignment authority:
  `ops/assignments/TRD-156_GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
