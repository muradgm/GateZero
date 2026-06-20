# TRD-355 Provider Credential Exclusion Policy

## Goal

Document that provider credentials remain excluded from the current Gate 1 scope.

## Scope

- Explicitly block API keys, tokens, account identifiers, and provider secrets.
- Require future credential work to use a separate later-phase authorization packet.
- Keep current data work synthetic or locally documented only.

## Blocked

- No credential files.
- No environment-variable contract for providers.
- No account connection.
- No broker or order workflow.

## Acceptance

- Credential exclusion policy exists and is guard-visible.
- QA_SECURITY confirms no credential handling was added.
- `pnpm verify:gate0` passes.
