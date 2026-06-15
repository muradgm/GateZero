# TRD-206: Command Center Source Link Grouping

## Objective

Group command-center source links by operating purpose.

## Scope

Allowed:

- Replace one flat source-link list with grouped local source links.
- Add static coverage for groups.

Blocked:

- External publishing, report export, execution support, broker integration, prediction, strategy
  claims, readiness semantics, approval semantics, or risk-gate loosening.

## Required Output

- Updated command-center data and renderer.
- `docs/operations/GATE0_COMMAND_CENTER_SOURCE_LINK_GROUPING.md`

## Acceptance Criteria

- Source links are grouped by purpose.
- All links remain local repository references.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
