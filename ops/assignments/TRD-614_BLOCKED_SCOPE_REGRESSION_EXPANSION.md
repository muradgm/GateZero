# TRD-614 Blocked-Scope Regression Expansion

Status: accepted

## Goal

Expand static UI regression coverage for unsafe scenario and action language.

## Scope

- Add bounded forbidden-copy samples for immediate action, directional advice, certainty, and
  automated behavior.
- Keep test phrases within validation-only surfaces.

## Blocked Scope

- Runtime recommendation generation, action routing, credentials, external accounts, and claims.

## Acceptance

Accepted when the render guard rejects every added unsafe copy class.
