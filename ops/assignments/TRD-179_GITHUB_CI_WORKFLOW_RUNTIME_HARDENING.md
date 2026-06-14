# TRD-179: GitHub CI Workflow Runtime Hardening

## Objective

Apply the minimal workflow hardening change for the GitHub Actions Node runtime deprecation warning.

## Scope

Allowed:

- Update `.github/workflows/gate0-verify.yml`.
- Keep project runtime on Node.js 22.
- Opt GitHub JavaScript actions into Node.js 24 action runtime using the environment flag surfaced
  by GitHub Actions.

Blocked:

- Changing product code, changing risk behavior, adding deploys, adding secrets, broker access,
  execution paths, AI prediction, strategy claims, or risk-gate loosening.

## Required Output

- Updated `.github/workflows/gate0-verify.yml`
- `docs/operations/GATE0_GITHUB_CI_WORKFLOW_RUNTIME_HARDENING.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Workflow still runs `pnpm verify:gate0`.
- Workflow remains read-only.
- Local Gate 0 verification passes.

## Source Links

- CI workflow: `.github/workflows/gate0-verify.yml`
- Deprecation review: `docs/operations/GATE0_GITHUB_ACTIONS_NODE_RUNTIME_DEPRECATION_REVIEW.md`
- Current tracker: `ops/runtime/tracklist.md`
