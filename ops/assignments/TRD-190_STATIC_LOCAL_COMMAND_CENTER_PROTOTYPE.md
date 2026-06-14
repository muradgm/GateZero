# TRD-190: Static Local Command Center Prototype

## Objective

Build the initial static Gate 0 command center prototype in `apps/web`.

## Scope

Allowed:

- Add local HTML, JavaScript, and CSS.
- Render Gate 0 operating health, protected loop, risk boundaries, evidence freshness, and docs.
- Keep the app static and read-only.

Blocked:

- Server routes, external APIs, login, broker integration, execution actions, AI prediction, market
  prices, strategy leaderboards, readiness badges, approval badges, or performance claims.

## Required Output

- `apps/web/index.html`
- `apps/web/src/main.js`
- `apps/web/src/styles.css`
- Updated `apps/web/README.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Prototype opens as a local static page.
- Prototype shows Gate 0 status and research-only scope.
- Prototype exposes no execution or prediction affordance.
- Gate 0 verification remains passing.

## Source Links

- Web app: `apps/web/`
- Current tracker: `ops/runtime/tracklist.md`
