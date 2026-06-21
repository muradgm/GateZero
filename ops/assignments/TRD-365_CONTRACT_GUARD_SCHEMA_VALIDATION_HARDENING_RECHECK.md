# TRD-365 Contract Guard Schema Validation Hardening Recheck

## Goal

Recheck Gate 1 contract guard schema validation hardening expectations.

## Scope

- Confirm the guard still validates local schemas and synthetic fixtures.
- Plan future hardening expectations without adding new capability.
- Keep this as a control-plane recheck.

## Blocked

- No new schema capability.
- No imported data parser.
- No provider, credential, execution, or autonomy path.

## Acceptance

- Schema validation hardening recheck exists and is indexed.
- Gate 1 remains historical-backtesting-only.
- `pnpm verify:gate0` passes.
