# TRD-358 Data Retention Limitation Record

## Goal

Record data-retention limitations before any provider or imported-data work is authorized.

## Scope

- Document retention constraints for future historical data snapshots.
- Require provider license and privacy review before retention rules become implementation.
- Keep the record planning-only.

## Blocked

- No storage implementation.
- No external provider download.
- No secrets, accounts, or broker connectivity.

## Acceptance

- Retention limitation record exists and is indexed.
- Risk review confirms no data-retention implementation was added.
- `pnpm verify:gate0` passes.
