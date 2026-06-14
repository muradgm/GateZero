# Gate 0 GitHub CI Verification Workflow

## Purpose

This record documents the GitHub Actions workflow added for the private GateZero repository.

The workflow runs the existing local Gate 0 verification command:

```powershell
pnpm verify:gate0
```

It does not deploy, publish, execute trades, connect to brokers, handle broker credentials, or
increase autonomy.

## Workflow

- File: `.github/workflows/gate0-verify.yml`
- Trigger: `push` and `pull_request` for `main`
- Permissions: read-only repository contents
- Project runtime: Node.js 22 with pnpm
- GitHub JavaScript action runtime: opted into Node.js 24 with `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`
- Verification: `pnpm install --frozen-lockfile`, then `pnpm verify:gate0`

## Boundary

This workflow is a repository-quality gate only. A passing CI run is not strategy approval, risk
approval, execution readiness, profitability evidence, or gate advancement.

## Source Links

- Source packet: `ops/assignments/TRD-172_GITHUB_CI_GATE0_VERIFICATION_WORKFLOW.md`
- Reviews: `ops/runtime/reviews/TRD-172_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-172_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-172_ORCHESTRATOR_ACCEPTANCE.md`
- Command source: `package.json`
- Tracker: `ops/runtime/tracklist.md`
