# TRD-522 Simulation Evidence Detail Negative Cases

Status: accepted

## Goal

Plan negative cases for simulation evidence detail records.

## Scope

- Reject action, account, credential, approval, readiness, and claim-like fields.
- Require missing-source and stale-reference failure cases.
- Keep validation local.

## Blocked Scope

- Guard loosening, allowlist expansion, external data paths, and execution semantics.

## Acceptance

Accepted when the negative-case plan rejects blocked fields before implementation.
