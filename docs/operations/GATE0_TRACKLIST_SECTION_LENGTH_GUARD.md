# Gate 0 Tracklist Section Length Guard

## Purpose

This record documents the local guard that prevents large unbroken tracklist sections from becoming
hard for editors and spell checkers to process.

## Guard

| Field          | Value                                                            |
| -------------- | ---------------------------------------------------------------- |
| Command        | `pnpm check:gate0-tracklist-sections`                            |
| Script         | `scripts/check-gate0-tracklist-section-length.ts`                |
| Tests          | `packages/fixtures/tests/gate0-tracklist-section-length.test.ts` |
| Suite coverage | Included in `pnpm check:gate0`                                   |
| Scope          | Local Markdown section-size guard for `ops/runtime/tracklist.md` |

## Boundary

The guard is an editor-usability and control-plane hygiene check. It does not remove evidence,
change gate status, authorize execution, or create strategy claims.

## Source Links

- Source packet: `ops/assignments/TRD-236_TRACKLIST_SECTION_LENGTH_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-236_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-236_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-236_ORCHESTRATOR_ACCEPTANCE.md`
- Guard script: `scripts/check-gate0-tracklist-section-length.ts`
- Guard tests: `packages/fixtures/tests/gate0-tracklist-section-length.test.ts`
- Command source: `package.json`
- Tracker: `ops/runtime/tracklist.md`
