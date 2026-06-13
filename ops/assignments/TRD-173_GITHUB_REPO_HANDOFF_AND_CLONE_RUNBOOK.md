# TRD-173: GitHub Repo Handoff And Clone Runbook

## Objective

Document the private GitHub repository handoff path so a future operator can clone, install, verify,
and preserve Gate 0 boundaries without changing product scope.

## Scope

Allowed:

- Record clone, install, verification, and triage steps.
- Reference the private canonical GitHub repository.
- Keep all commands local and research-only.

Blocked:

- Deployment, environment provisioning, broker credentials, external execution, autonomous
  workflows, AI prediction, or strategy performance claims.

## Required Output

- `docs/operations/GATE0_GITHUB_REPO_HANDOFF_AND_CLONE_RUNBOOK.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Runbook states the repo is private.
- Runbook includes `pnpm install --frozen-lockfile` and `pnpm verify:gate0`.
- Runbook describes failure triage without loosening gates.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- GitHub remote: `https://github.com/muradgm/GateZero.git`
- Verification command source: `package.json`
