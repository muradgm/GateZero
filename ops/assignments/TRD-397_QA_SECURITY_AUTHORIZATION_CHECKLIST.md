# TRD-397 QA/Security Authorization Checklist

## Goal

Draft QA/security authorization requirements for any future gate movement.

## Scope

- Identify scanner, secrets, validation, and evidence requirements.
- Keep requirements future-facing.
- Preserve current blocked-scope posture.

## Blocked

- No scanner allowlist expansion.
- No credentials.
- No provider, broker, execution, autonomy, or prediction path.

## Acceptance

- QA/security checklist exists.
- Secrets and scanner posture remain unchanged.
- `pnpm verify:gate0` passes.
