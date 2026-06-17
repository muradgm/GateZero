# Gate 0 Source-Link Duplicate Check

## Purpose

This record documents the local guard that detects duplicate paths in the tracklist source-of-truth
link section.

## Guard

| Field          | Value                                                          |
| -------------- | -------------------------------------------------------------- |
| Command        | `pnpm check:gate0-source-links`                                |
| Script         | `scripts/check-gate0-source-link-duplicates.ts`                |
| Tests          | `packages/fixtures/tests/gate0-source-link-duplicates.test.ts` |
| Suite coverage | Included in `pnpm check:gate0`                                 |
| Scope          | Local tracklist source-of-truth link section only              |

## Boundary

The guard does not crawl remote links, call external services, change evidence semantics, or
authorize product expansion. It only prevents duplicate local source-path references from degrading
the control plane.

## Source Links

- Source packet: `ops/assignments/TRD-235_SOURCE_LINK_DUPLICATE_CHECK.md`
- Reviews: `ops/runtime/reviews/TRD-235_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-235_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-235_ORCHESTRATOR_ACCEPTANCE.md`
- Guard script: `scripts/check-gate0-source-link-duplicates.ts`
- Guard tests: `packages/fixtures/tests/gate0-source-link-duplicates.test.ts`
- Command source: `package.json`
- Tracker: `ops/runtime/tracklist.md`
