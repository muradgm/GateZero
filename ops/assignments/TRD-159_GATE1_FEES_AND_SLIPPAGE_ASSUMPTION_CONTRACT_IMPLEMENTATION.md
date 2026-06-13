# TRD-159: Gate 1 Fees And Slippage Assumption Contract Implementation

## Objective

Implement a schema-only fees and slippage assumption contract for future backtest honesty.

## Scope

Allowed:

- Add local schema fields for fee model, commission, spread assumption, slippage model, currency,
  asset scope, effective dates, rationale, and source label.
- Require an explicit rationale for zero-cost assumptions.

Blocked:

- Performance interpretation, strategy promotion, execution modeling, external integration, or gate
  movement.

## Required Output

- `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- `docs/operations/GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_CONTRACT.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Schema validates explicit fees and slippage assumptions.
- Schema rejects weak zero-cost rationale.
- Gate 0 verification remains passing.

## Source Links

- Planning doc: `docs/operations/GATE1_FEES_AND_SLIPPAGE_ASSUMPTION_PLAN.md`
- Assignment authority:
  `ops/assignments/TRD-156_GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
