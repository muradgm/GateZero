# TRD-191: Command Center No-Execution Guardrails

## Objective

Add explicit guardrails and tests that keep the command center from becoming an execution or
prediction surface.

## Scope

Allowed:

- Add static surface tests for command center data and mount files.
- Document blocked command center affordances.
- Preserve scanner and Gate 0 verification behavior.

Blocked:

- Broker connection controls, trade actions, paper/live execution controls, buy/sell prompts,
  readiness scoring, approval scoring, or strategy performance claims.

## Required Output

- `packages/fixtures/tests/gate0-command-center-data.test.ts`
- `docs/operations/GATE0_COMMAND_CENTER_NO_EXECUTION_GUARDRAILS.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Test verifies Gate 0 status and research-only scope are present.
- Test rejects trading-action language in app data.
- Gate 0 verification remains passing.

## Source Links

- Data source: `apps/web/src/command-center-data.js`
- Test source: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
