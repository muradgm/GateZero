# TRD-415 No-External-Account Guard Plan

## Goal

Plan guard coverage that blocks external account routes before any Gate 2 implementation packet.

## Scope

- Identify disallowed external account patterns.
- Require guard coverage before implementation.
- Keep all planned checks local and deterministic.

## Blocked

- No external account connector.
- No account identifiers.
- No secrets or credential path.
- No integration setup.

## Acceptance

- Guard plan exists.
- QA_SECURITY review confirms the plan preserves local-only behavior.
