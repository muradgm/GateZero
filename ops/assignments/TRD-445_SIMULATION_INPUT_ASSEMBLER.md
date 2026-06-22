# TRD-445 Simulation Input Assembler

## Goal

Implement a local input assembler for Gate 2 simulation mechanics.

## Scope

- Assemble contract-backed simulated order, state, risk review, operator action, and fill assumption
  records.
- Return explicit assembly blockers before engine execution.
- Keep assembled inputs local-only, deterministic, evidence-only, and no-claim.

## Blocked

- No external access, dispatch, credentials, live route, automation, prediction, or claims.

## Acceptance

- Focused tests cover successful and blocked assembly.
- QA_SECURITY, RISK, and ORCHESTRATOR reviews exist.
