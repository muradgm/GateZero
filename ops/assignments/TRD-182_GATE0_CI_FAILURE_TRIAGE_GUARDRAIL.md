# TRD-182: Gate 0 CI Failure Triage Guardrail

## Objective

Add a bounded triage guardrail for future CI failures so operators fix root causes without weakening
Gate 0 controls.

## Scope

Allowed:

- Document safe CI failure triage order.
- State escalation rules for QA_SECURITY and RISK.
- Preserve existing guard commands.

Blocked:

- Removing failing checks to get green CI, loosening scanners, adding broad allowlists, changing
  risk gates, deployment, broker access, execution, AI prediction, or strategy claims.

## Required Output

- `docs/operations/GATE0_CI_FAILURE_TRIAGE_GUARDRAIL.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Guardrail blocks check removal as a first response.
- Guardrail routes security/secret issues to QA_SECURITY.
- Guardrail routes approval/readiness/risk wording to RISK.
- Gate 0 verification remains passing locally.

## Source Links

- Existing failure template: `docs/operations/GATE0_VERIFICATION_FAILURE_TRIAGE_TEMPLATE.md`
- CI workflow: `.github/workflows/gate0-verify.yml`
- Current tracker: `ops/runtime/tracklist.md`
