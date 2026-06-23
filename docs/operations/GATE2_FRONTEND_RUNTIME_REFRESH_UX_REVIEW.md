# Gate 2 Frontend Runtime Refresh UX Review

TRD: TRD-505

## Review

The frontend refreshes `/runtime/command-center-data.json` with `cache: "no-store"` and falls back
to checked-in data when unavailable.

## Result

- Refresh remains local-only.
- No external service, credential, broker, or account path is introduced.
- Command-center freshness remains guarded by existing checks.

## Decision

Accepted.

## Source Links

- `ops/assignments/TRD-505_FRONTEND_RUNTIME_REFRESH_UX_REVIEW.md`
- `apps/web/src/main.js`
- `scripts/build-command-center-runtime-data.ts`
