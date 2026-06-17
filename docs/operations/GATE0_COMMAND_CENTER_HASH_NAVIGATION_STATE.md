# Gate 0 Command Center Hash Navigation State

## Purpose

This record documents a command-center orientation fix: sidebar navigation now marks the section
matching the current URL hash as active.

The command center remains a static local operating surface. This fix does not add product workflow,
strategy selection, execution capability, external integration, or gate movement.

## Fix

- Adds section markers to command-center navigation links.
- Updates active navigation from `window.location.hash`.
- Listens for `hashchange` so the active sidebar item follows operator navigation.
- Adds render-contract coverage for hash-aware navigation markers and updater logic.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Do not use this orientation fix to authorize broker access, execution, AI prediction, strategy
approval, readiness claims, profitability claims, public release claims, or risk-gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-228_COMMAND_CENTER_HASH_NAVIGATION_STATE.md`
- Reviews: `ops/runtime/reviews/TRD-228_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-228_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-228_ORCHESTRATOR_ACCEPTANCE.md`
- Command center app: `apps/web/src/main.js`
- Render contract guard: `scripts/check-gate0-command-center-render-contract.ts`
- Render contract tests: `packages/fixtures/tests/gate0-command-center-render-contract.test.ts`
- Command center surface tests: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Tracker: `ops/runtime/tracklist.md`
