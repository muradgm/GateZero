# TRD-169: Gate 1 Contract Guard Schema Validation Hardening

## Objective

Harden the Gate 1 contract guard so it validates parsed schemas and fixtures, not only source text.

## Scope

Allowed:

- Import Gate 1 schemas and fixtures into the guard.
- Parse the fixture set through the contract schemas.
- Add bounded tests proving source text alone is insufficient.

Blocked:

- Backtest execution, external market data, broker access, report publishing, strategy approval,
  performance claims, or risk-gate loosening.

## Required Output

- Updated `scripts/check-gate1-contracts.ts`
- Updated `packages/fixtures/tests/gate1-contract-guard.test.ts`
- `docs/operations/GATE1_CONTRACT_GUARD_SCHEMA_VALIDATION_HARDENING.md`

## Acceptance Criteria

- The guard fails when fixtures violate contract boundaries.
- The default fixture set validates successfully.
- Gate 0 verification remains passing.

## Source Links

- Guard source: `scripts/check-gate1-contracts.ts`
- Guard tests: `packages/fixtures/tests/gate1-contract-guard.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
