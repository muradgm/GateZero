# TRD-427 Operator Action Log Contract Schema

## Goal

Add the Gate 2 operator action log contract schema.

## Scope

- Preserve human operator authority.
- Require redaction posture.
- Reject automation and sensitive payload storage.

## Blocked

- No automated action.
- No external dispatch.
- No sensitive payload persistence.

## Acceptance

- Schema exists and is exported.
- Negative tests cover automation and sensitive-payload mutations.
