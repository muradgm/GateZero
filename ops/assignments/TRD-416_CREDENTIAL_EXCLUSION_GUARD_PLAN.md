# TRD-416 Credential Exclusion Guard Plan

## Goal

Plan Gate 2 credential exclusion before any implementation work begins.

## Scope

- Define forbidden credential classes.
- Require scanner and review treatment for future implementation packets.
- Preserve local-only simulation planning.

## Blocked

- No API keys.
- No tokens.
- No account secrets.
- No environment-variable handling for external services.

## Acceptance

- Credential exclusion plan exists.
- QA_SECURITY and RISK reviews confirm no credential surface was added.
