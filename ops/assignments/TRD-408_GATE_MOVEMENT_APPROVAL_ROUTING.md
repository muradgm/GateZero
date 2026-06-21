# TRD-408 Gate Movement Approval Routing

## Goal

Route the Gate 2 planning request through financial-risk, autonomy, QA/security, and operator
decision checks.

## Scope

- Confirm required approval lanes.
- Record that internal reviewer records are required before acceptance.
- Keep the approval route separate from product implementation.

## Blocked

- No silent gate movement.
- No weakened risk controls.
- No credential intake.
- No execution automation.

## Acceptance

- Approval routing record exists.
- RISK, QA_SECURITY, and ORCHESTRATOR reviews are present.
- The route preserves operator decision authority.
