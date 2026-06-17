# Gate 0 GitHub Actions Annotation Follow-Up Watch

## Purpose

This record tracks the GitHub Actions runtime annotation after GateZero opted JavaScript actions
into Node.js 24 action runtime.

## Historical Observation

The workflow still reports that `actions/checkout@v4` and `actions/setup-node@v4` target Node.js 20,
but GitHub now forces them to run on Node.js 24.

Current upstream tags observed on 2026-06-14:

| Action               | Current workflow | Newer observed tag |
| -------------------- | ---------------- | ------------------ |
| `actions/checkout`   | `v4`             | `v6.0.3`           |
| `actions/setup-node` | `v4`             | `v6.4.0`           |

## Resolution

TRD-229 upgrades the workflow to `actions/checkout@v6` and `actions/setup-node@v6` and removes the
legacy runtime override.

## Decision

This watch packet did not perform the major-version action upgrade. The dedicated follow-up packet
`TRD-229` now owns the upgrade and regression guard.

## Boundary

This watch item is CI maintenance only. It does not authorize deployment, broker access, execution,
AI prediction, strategy approval, readiness claims, profitability claims, or gate advancement.

## Source Links

- Source packet: `ops/assignments/TRD-183_GITHUB_ACTIONS_ANNOTATION_FOLLOW_UP_WATCH.md`
- Reviews: `ops/runtime/reviews/TRD-183_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-183_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-183_ORCHESTRATOR_ACCEPTANCE.md`
- Runtime hardening record: `docs/operations/GATE0_GITHUB_CI_WORKFLOW_RUNTIME_HARDENING.md`
- Upgrade record: `docs/operations/GATE0_GITHUB_ACTIONS_NODE24_ACTION_UPGRADE.md`
- Tracker: `ops/runtime/tracklist.md`
