# TRD-354 Imported Snapshot Schema Authority

## Goal

Draft schema authority rules for any future imported historical snapshot fixture.

## Scope

- Define which Gate 1 contracts would govern future imported snapshot fixtures.
- Require local validation before any imported snapshot can be treated as evidence.
- Keep this as planning and governance only.

## Blocked

- No file import implementation.
- No provider adapter.
- No external data fetching.
- No credentials or execution path.

## Acceptance

- Schema authority record exists and is source-linked.
- Boundaries remain `G1_BACKTESTING` and `historical_backtesting_only`.
- `pnpm verify:gate0` passes.
