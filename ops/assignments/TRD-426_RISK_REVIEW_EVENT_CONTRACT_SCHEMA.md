# TRD-426 Risk Review Event Contract Schema

## Goal

Add the Gate 2 risk review event contract schema.

## Scope

- Require reviewer role, severity, disposition, and operator acknowledgement.
- Require blocking issues for blocked dispositions.
- Preserve no approval, performance, or execution semantics.

## Blocked

- No automated risk approval.
- No strategy promotion.
- No risk-gate loosening.

## Acceptance

- Schema exists and is exported.
- Negative tests cover missing blockers and claim mutations.
