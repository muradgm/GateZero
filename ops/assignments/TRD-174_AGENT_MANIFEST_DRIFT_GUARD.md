# TRD-174: Agent Manifest Drift Guard

## Objective

Add an executable local guard that verifies `ops/AGENTS_MANIFEST.json`, agent folders, required
agent files, eval JSON, and local agent references remain aligned.

## Scope

Allowed:

- Add a local TypeScript guard script.
- Add focused unit tests for manifest/folder/reference drift.
- Wire the guard into `pnpm check:gate0`.

Blocked:

- Agent autonomy expansion, broker integration, execution actions, prediction features, new product
  authority, or risk-gate loosening.

## Required Output

- `scripts/check-gate0-agent-manifest.ts`
- `packages/fixtures/tests/gate0-agent-manifest-check.test.ts`
- `docs/operations/GATE0_AGENT_MANIFEST_DRIFT_GUARD.md`
- Updated `package.json`.

## Acceptance Criteria

- Guard fails on manifest/folder mismatch.
- Guard fails on missing required agent files.
- Guard fails on unresolved local references.
- Guard passes against the current canonical repo.

## Source Links

- Agent manifest: `ops/AGENTS_MANIFEST.json`
- Agent root: `ops/agents/`
- Current tracker: `ops/runtime/tracklist.md`
