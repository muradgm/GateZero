# TRD-166: Gate 1 Guard Command Doc Alignment

## Objective

Align operator command and validation audit documentation with the existing Gate 1 contract guard.

## Scope

Allowed:

- Add `pnpm check:gate1-contracts` to local command documentation.
- Link the guard script and guard document from validation docs.

Blocked:

- Gate movement, backtest execution, external access, broker integration, paper execution, strategy
  approval, performance claims, or risk-gate loosening.

## Required Output

- Updated `docs/operations/GATE0_OPERATOR_COMMAND_INDEX.md`
- Updated `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`
- `docs/operations/GATE1_GUARD_COMMAND_DOC_ALIGNMENT.md`

## Acceptance Criteria

- The guard command is discoverable in operator command docs.
- Validation audit includes the guard command and source.
- Gate 0 verification remains passing.

## Source Links

- Guard doc: `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md`
- Guard source: `scripts/check-gate1-contracts.ts`
- Current tracker: `ops/runtime/tracklist.md`
