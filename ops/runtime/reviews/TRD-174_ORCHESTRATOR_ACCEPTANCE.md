# TRD-174 ORCHESTRATOR Acceptance

## Decision

`accepted`

## Accepted Output

- `scripts/check-gate0-agent-manifest.ts`
- `packages/fixtures/tests/gate0-agent-manifest-check.test.ts`
- `docs/operations/GATE0_AGENT_MANIFEST_DRIFT_GUARD.md`
- Updated `package.json`

## Acceptance Notes

The guard is wired into `pnpm check:gate0` and keeps agent registry drift visible before acceptance.

## Gate

`G0_RESEARCH`
