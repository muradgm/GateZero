# TRD-178: GitHub Actions Node Runtime Deprecation Review

## Objective

Record the GitHub Actions warning that JavaScript actions running on Node.js 20 are deprecated and
identify the bounded Gate 0 response.

## Scope

Allowed:

- Capture the warning observed on the Gate 0 Verification workflow.
- Document the difference between GitHub action runtime and project Node runtime.
- Recommend a workflow-only mitigation.

Blocked:

- Dependency churn beyond the CI workflow, deployment, broker access, credential handling, live
  trading, paper execution, autonomous execution, AI prediction, strategy claims, or risk-gate
  loosening.

## Required Output

- `docs/operations/GATE0_GITHUB_ACTIONS_NODE_RUNTIME_DEPRECATION_REVIEW.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Review identifies the warning source and affected workflow.
- Review keeps Gate 0 Research Only boundaries intact.
- Review recommends no product expansion.

## Source Links

- CI workflow: `.github/workflows/gate0-verify.yml`
- Current tracker: `ops/runtime/tracklist.md`
