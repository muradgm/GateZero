# Gate 0 CI Failure Triage Guardrail

## Purpose

This guardrail defines the safe response to failed Gate 0 CI runs.

The goal is to fix root causes without weakening GateZero's local controls.

## Triage Order

1. Identify the failing command from the CI log.
2. Reproduce the failing command locally.
3. Fix the source issue or documentation drift.
4. Rerun `pnpm verify:gate0`.
5. Record evidence only after checks pass.

## Blocked Responses

Do not respond to CI failure by:

- Removing failing checks.
- Weakening forbidden-pattern scanners.
- Adding broad allowlists.
- Marking risk failures as acceptable.
- Changing approval, readiness, profitability, or execution semantics.
- Adding secrets, broker access, deployment, or execution paths.

## Escalation

Escalate to QA_SECURITY for secret, scanner, formatting, dependency, permission, or
forbidden-pattern failures.

Escalate to RISK for any wording or artifact that implies approval, readiness, profitability,
performance, execution, or gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-182_GATE0_CI_FAILURE_TRIAGE_GUARDRAIL.md`
- Reviews: `ops/runtime/reviews/TRD-182_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-182_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-182_ORCHESTRATOR_ACCEPTANCE.md`
- Existing failure template: `docs/operations/GATE0_VERIFICATION_FAILURE_TRIAGE_TEMPLATE.md`
- CI workflow: `.github/workflows/gate0-verify.yml`
- Tracker: `ops/runtime/tracklist.md`
