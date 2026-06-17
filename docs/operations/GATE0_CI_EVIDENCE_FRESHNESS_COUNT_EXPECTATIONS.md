# Gate 0 CI Evidence Freshness Count Expectations

## Purpose

This record documents the CI evidence freshness guard expectation that GitHub, remote, and command
center CI evidence records are all counted by the same local guard.

## Guard Expectation

| Field                     | Value                                                               |
| ------------------------- | ------------------------------------------------------------------- |
| Guard command             | `pnpm check:gate0-ci-evidence`                                      |
| Guard script              | `scripts/check-gate0-ci-evidence-freshness.ts`                      |
| Focused test              | `packages/fixtures/tests/gate0-ci-evidence-freshness-check.test.ts` |
| Expected record families  | GitHub CI, remote CI, command center CI                             |
| Current local expectation | `3` record-family fixture in focused test coverage                  |

## Boundary

The guard checks local evidence documents only. It does not poll GitHub, deploy software, authorize
execution, connect accounts, or create strategy approval, readiness, performance, or profitability
semantics.

## Source Links

- Source packet: `ops/assignments/TRD-233_CI_EVIDENCE_FRESHNESS_COUNT_EXPECTATIONS.md`
- Reviews: `ops/runtime/reviews/TRD-233_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-233_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-233_ORCHESTRATOR_ACCEPTANCE.md`
- Guard script: `scripts/check-gate0-ci-evidence-freshness.ts`
- Guard tests: `packages/fixtures/tests/gate0-ci-evidence-freshness-check.test.ts`
- Tracker: `ops/runtime/tracklist.md`
