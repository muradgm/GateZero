# Gate 0 GitHub Actions Node Runtime Deprecation Review

## Purpose

This review records the warning emitted by GitHub Actions after the Gate 0 Verification workflow ran
successfully on `main`.

The warning concerns GitHub JavaScript action runtime. It does not indicate a failure in GateZero's
local TypeScript, tests, contracts, or Gate 0 guards.

## Observed Warning

GitHub Actions warned that `actions/checkout@v4` and `actions/setup-node@v4` are running on Node.js
20 action runtime and that GitHub is deprecating that runtime.

## Decision

Use a workflow-level environment flag to opt JavaScript actions into Node.js 24 action runtime while
keeping GateZero's project runtime on Node.js 22.

This is the smallest bounded mitigation because it avoids dependency churn, keeps the existing
verification command, and does not alter product code.

## Boundary

This review does not authorize deployment, broker access, execution, AI prediction, strategy
approval, risk approval, performance claims, or gate advancement.

## Source Links

- Source packet: `ops/assignments/TRD-178_GITHUB_ACTIONS_NODE_RUNTIME_DEPRECATION_REVIEW.md`
- Reviews: `ops/runtime/reviews/TRD-178_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-178_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-178_ORCHESTRATOR_ACCEPTANCE.md`
- CI workflow: `.github/workflows/gate0-verify.yml`
- Tracker: `ops/runtime/tracklist.md`
