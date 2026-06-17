# TRD-229 GitHub Actions Node 24 Action Upgrade

## Goal

Upgrade the Gate 0 Verification workflow from Node 20-targeting action majors to Node 24-compatible
action majors and guard the workflow against regression.

## Allowed Scope

- Update `.github/workflows/gate0-verify.yml`.
- Add a local workflow-runtime guard and fixture tests.
- Update validation command references, tracker records, docs index, artifact map, progress
  snapshot, and command-center metadata.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No deployment.
- No live trading.
- No broker integration.
- No paper order mechanics.
- No autonomous execution.
- No AI buy/sell prediction.
- No broker API key handling.
- No strategy approval or readiness semantics.
- No performance or profitability claims.
- No marketing claims.
- No risk-gate loosening.

## Required Outputs

- `.github/workflows/gate0-verify.yml` uses Node 24-compatible official action majors.
- `scripts/check-gate0-github-actions-runtime.ts`.
- `packages/fixtures/tests/gate0-github-actions-runtime.test.ts`.
- `docs/operations/GATE0_GITHUB_ACTIONS_NODE24_ACTION_UPGRADE.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- GitHub Actions workflow uses `actions/checkout@v6`.
- GitHub Actions workflow uses `actions/setup-node@v6`.
- Legacy `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` override is removed.
- Project runtime remains pinned to Node.js 22.
- Gate 0 verification command remains `pnpm verify:gate0`.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- `pnpm verify:gate0` passes.

## Next Agent

ORCHESTRATOR acceptance after QA_SECURITY and RISK review.
