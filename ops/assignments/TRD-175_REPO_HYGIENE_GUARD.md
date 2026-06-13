# TRD-175: Repo Hygiene Guard

## Objective

Add an executable local guard that checks `.gitignore` coverage and prevents generated, local,
cache, log, and environment files from becoming tracked repo artifacts.

## Scope

Allowed:

- Add a local TypeScript repo-hygiene guard.
- Add focused tests for missing ignore entries and blocked tracked files.
- Wire the guard into `pnpm check:gate0`.

Blocked:

- Secret handling, broker API key handling, deployment, execution features, prediction features, or
  risk-gate loosening.

## Required Output

- `scripts/check-repo-hygiene.ts`
- `packages/fixtures/tests/repo-hygiene-check.test.ts`
- `docs/operations/GATE0_REPO_HYGIENE_GUARD.md`
- Updated `package.json`.

## Acceptance Criteria

- Guard fails when required `.gitignore` entries are missing.
- Guard fails when generated/local files are tracked.
- Guard passes against the current canonical repo.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Git ignore file: `.gitignore`
- Command source: `package.json`
