# Gate 0 GitHub CI Workflow Runtime Hardening

## Purpose

This record documents the bounded GitHub Actions runtime hardening applied to the Gate 0
Verification workflow.

## Change

The workflow now sets:

```yaml
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"
```

This opts GitHub JavaScript actions into Node.js 24 action runtime. It does not change GateZero's
project runtime, which remains Node.js 22 in the workflow.

## Expected Verification

The workflow continues to run:

```powershell
pnpm verify:gate0
```

## Boundary

This is CI maintenance only. It does not add deploys, secrets, broker access, execution paths,
prediction features, strategy claims, or risk-gate changes.

## Source Links

- Source packet: `ops/assignments/TRD-179_GITHUB_CI_WORKFLOW_RUNTIME_HARDENING.md`
- Reviews: `ops/runtime/reviews/TRD-179_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-179_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-179_ORCHESTRATOR_ACCEPTANCE.md`
- CI workflow: `.github/workflows/gate0-verify.yml`
- Deprecation review: `docs/operations/GATE0_GITHUB_ACTIONS_NODE_RUNTIME_DEPRECATION_REVIEW.md`
- Tracker: `ops/runtime/tracklist.md`
