# TRD-377 Scanner Blocked-Term Sample Audit

## Goal

Audit blocked-term examples without changing scanner behavior.

## Scope

- Record representative blocked-scope term classes.
- Keep the scanner allowlist unchanged.
- Confirm validation remains local repository validation only.

## Blocked

- No scanner allowlist expansion.
- No broker, provider credential, execution, autonomous, or prediction capability.

## Acceptance

- Scanner sample audit exists.
- QA_SECURITY confirms no scanner behavior changed.
- `pnpm verify:gate0` passes.
