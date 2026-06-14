# TRD-202: Command Center Preview Script Contract Check

## Objective

Add contract coverage for the local command-center preview script.

## Scope

Allowed:

- Refactor preview script into import-safe helpers.
- Test host, port, root route, static asset path, and traversal boundary behavior.

Blocked:

- Public deployment, external hosting, authentication, broker integration, execution support,
  prediction, approval semantics, readiness semantics, or risk-gate loosening.

## Required Output

- Updated `scripts/preview-web.ts`
- `packages/fixtures/tests/gate0-command-center-preview-script.test.ts`
- `docs/operations/GATE0_COMMAND_CENTER_PREVIEW_SCRIPT_CONTRACT_CHECK.md`

## Acceptance Criteria

- Preview contract tests pass.
- Preview remains local host only.
- Gate remains `G0_RESEARCH`.

## Source Links

- Preview script: `scripts/preview-web.ts`
- Tracker: `ops/runtime/tracklist.md`
