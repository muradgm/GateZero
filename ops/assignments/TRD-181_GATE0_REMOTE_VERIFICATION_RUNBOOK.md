# TRD-181: Gate 0 Remote Verification Runbook

## Objective

Document how an operator checks GitHub Actions verification runs without changing GateZero's local
Gate 0 scope.

## Scope

Allowed:

- Document `gh run list`, `gh run view`, and `gh run watch`.
- Explain which fields matter for evidence records.
- Keep commands read-only.

Blocked:

- Workflow mutation, deployment, secret handling, broker integration, execution, AI prediction,
  strategy readiness claims, or risk-gate loosening.

## Required Output

- `docs/operations/GATE0_REMOTE_VERIFICATION_RUNBOOK.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Runbook shows how to inspect run status, conclusion, URL, workflow name, event, and commit SHA.
- Runbook says remote CI success is repository-quality evidence only.
- Gate 0 verification remains passing locally.

## Source Links

- CI workflow: `.github/workflows/gate0-verify.yml`
- Current tracker: `ops/runtime/tracklist.md`
