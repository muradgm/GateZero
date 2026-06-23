# Gate 2 Frontend Source-Link Grouping Polish

TRD: TRD-504

## Change

Source-link groups now show lightweight reference counts.

## Rationale

The source-link panel had grown long enough that operators needed a faster scan cue. Counts improve
orientation without adding external navigation, publishing, or action semantics.

## Validation

Render contract guard now checks for source-link group counts and heading styling.

## Decision

Accepted.

## Source Links

- `ops/assignments/TRD-504_FRONTEND_SOURCE_LINK_GROUPING_POLISH.md`
- `apps/web/src/main.js`
- `apps/web/src/styles.css`
- `scripts/check-gate0-command-center-render-contract.ts`
