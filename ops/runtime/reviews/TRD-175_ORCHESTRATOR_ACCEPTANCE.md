# TRD-175 ORCHESTRATOR Acceptance

## Decision

`accepted`

## Accepted Output

- `scripts/check-repo-hygiene.ts`
- `packages/fixtures/tests/repo-hygiene-check.test.ts`
- `docs/operations/GATE0_REPO_HYGIENE_GUARD.md`
- Updated `package.json`

## Acceptance Notes

The guard is wired into `pnpm check:gate0` and keeps local/generated files from entering the
repository unnoticed.

## Gate

`G0_RESEARCH`
