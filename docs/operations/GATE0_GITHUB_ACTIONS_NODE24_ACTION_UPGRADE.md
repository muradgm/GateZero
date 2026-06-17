# Gate 0 GitHub Actions Node 24 Action Upgrade

## Purpose

This record documents the bounded GitHub Actions action-major upgrade for the Gate 0 Verification
workflow.

The change removes the lingering GitHub Actions annotation caused by official action majors that
still targeted the older JavaScript action runtime.

## Change

The workflow now uses:

```yaml
- uses: actions/checkout@v6
- uses: actions/setup-node@v6
```

The previous workflow-level `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` override was removed because the
selected action majors are already Node 24-compatible.

## Runtime Boundary

GateZero's project runtime remains:

```yaml
node-version: "22"
```

The action runtime upgrade is CI maintenance only. It does not change local product behavior,
contracts, strategy logic, risk review, data handling, command-center scope, or any Gate 0 operating
boundary.

## Guard

The local guard `pnpm check:gate0-actions-runtime` verifies that:

- `actions/checkout@v6` is present.
- `actions/setup-node@v6` is present.
- The project runtime remains Node.js 22.
- `pnpm verify:gate0` remains the remote verification command.
- The legacy runtime override and old v4 action majors are absent.

## Boundary

This packet does not authorize deployment, broker access, execution, paper order mechanics,
autonomous execution, AI prediction, strategy approval, readiness claims, profitability claims,
marketing claims, credential handling, or gate advancement.

## Source Links

- Source packet: `ops/assignments/TRD-229_GITHUB_ACTIONS_NODE24_ACTION_UPGRADE.md`
- Reviews: `ops/runtime/reviews/TRD-229_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-229_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-229_ORCHESTRATOR_ACCEPTANCE.md`
- CI workflow: `.github/workflows/gate0-verify.yml`
- Runtime guard: `scripts/check-gate0-github-actions-runtime.ts`
- Runtime guard tests: `packages/fixtures/tests/gate0-github-actions-runtime.test.ts`
- Follow-up watch: `docs/operations/GATE0_GITHUB_ACTIONS_ANNOTATION_FOLLOW_UP_WATCH.md`
- Tracker: `ops/runtime/tracklist.md`
