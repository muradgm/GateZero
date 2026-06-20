# TRD-323 Gate Command Naming Migration Plan

## Goal

Plan how legacy `gate0` command names remain operator-compatible while TraderFrame operates at
`G1_BACKTESTING`.

## Scope

- Document the command naming gap.
- Keep all existing command behavior local and evidence-only.
- Defer command renaming until an explicit compatibility packet exists.

## Blocked

- No broker commands.
- No paper or live execution commands.
- No readiness, approval, or promotion semantics.

## Acceptance

- A source-linked operation doc exists.
- QA, RISK, and ORCHESTRATOR reviews accept the plan.
