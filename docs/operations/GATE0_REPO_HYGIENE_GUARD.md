# Gate 0 Repo Hygiene Guard

## Purpose

This guard keeps generated files, local caches, logs, build outputs, and environment files out of
the tracked GateZero repository.

Command:

```powershell
pnpm check:repo-hygiene
```

## Checks

- Required `.gitignore` entries exist for dependencies, build output, coverage, caches, logs, and
  environment files.
- Tracked files do not include generated directories, cache directories, logs, `.env` files, or
  TypeScript build info.

## Boundary

This guard is repository hygiene only. It does not scan broker accounts, handle secrets, deploy,
trade, or change GateZero's operating gate.

## Source Links

- Source packet: `ops/assignments/TRD-175_REPO_HYGIENE_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-175_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-175_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-175_ORCHESTRATOR_ACCEPTANCE.md`
- Guard script: `scripts/check-repo-hygiene.ts`
- Guard tests: `packages/fixtures/tests/repo-hygiene-check.test.ts`
- Command source: `package.json`
- Tracker: `ops/runtime/tracklist.md`
