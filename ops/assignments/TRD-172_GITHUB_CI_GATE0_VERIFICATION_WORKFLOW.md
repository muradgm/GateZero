# TRD-172: GitHub CI Gate 0 Verification Workflow

## Objective

Add a GitHub Actions workflow that runs the existing Gate 0 verification suite on push and pull
request events for `main`.

## Scope

Allowed:

- Add a root GitHub Actions workflow for local-quality verification.
- Use existing package-manager, lint, format, typecheck, guard, and test commands.
- Keep CI read-only with no secrets or deploy steps.

Blocked:

- Deployment, broker access, live trading, paper execution, autonomous execution, AI prediction,
  credential handling, strategy claims, or risk-gate loosening.

## Required Output

- `.github/workflows/gate0-verify.yml`
- `docs/operations/GATE0_GITHUB_CI_VERIFICATION_WORKFLOW.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Workflow uses `pnpm verify:gate0`.
- Workflow is scoped to `push` and `pull_request` for `main`.
- Workflow does not request secrets or write permissions.
- Gate 0 verification remains passing locally.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Command source: `package.json`
- Workflow: `.github/workflows/gate0-verify.yml`
