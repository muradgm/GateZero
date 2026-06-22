# TRD-447 Replay Determinism Guard

## Goal

Implement a local replay determinism guard for Gate 2 simulation mechanics.

## Scope

- Compare two local simulation results.
- Report deterministic match or mismatch with reasons.
- Keep replay checks local, evidence-only, and no-claim.

## Blocked

- No remote replay, external calls, automation, dispatch, credentials, or claims.

## Acceptance

- Focused tests cover match and mismatch paths.
- QA_SECURITY, RISK, and ORCHESTRATOR reviews exist.
