# Gate 0 Command Center Last Verified Commit

## Purpose

This record documents the static command-center field that displays the last commit tied to the
latest recorded successful pushed Gate 0 Verification run.

## Field

| Field               | Value                                                                           |
| ------------------- | ------------------------------------------------------------------------------- |
| Data property       | `lastVerifiedCommit`                                                            |
| Displayed commit    | `5ab9bab`                                                                       |
| Evidence run        | `27716601329`                                                                   |
| Evidence source     | `docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH_AFTER_TRD230_PUSH.md` |
| Command-center file | `apps/web/src/command-center-data.js`                                           |
| Focused test        | `packages/fixtures/tests/gate0-command-center-data.test.ts`                     |

## Boundary

The field is a static repository evidence signal. It does not claim deployment status, strategy
fitness, trading eligibility, execution authority, or gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-234_COMMAND_CENTER_LAST_VERIFIED_COMMIT.md`
- Reviews: `ops/runtime/reviews/TRD-234_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-234_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-234_ORCHESTRATOR_ACCEPTANCE.md`
- Command center data: `apps/web/src/command-center-data.js`
- Command center tests: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Tracker: `ops/runtime/tracklist.md`
