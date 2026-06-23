# Gate 2 Frontend Keyboard Navigation QA Recheck

TRD: TRD-507

## Change

Active hash navigation now exposes `aria-current="page"` and removes it from inactive navigation
links.

## Review

The shell keeps the skip link, visible focus styling, semantic landmarks, and hash-aware section
navigation.

## Decision

Accepted.

## Source Links

- `ops/assignments/TRD-507_FRONTEND_KEYBOARD_NAVIGATION_QA_RECHECK.md`
- `apps/web/src/main.js`
- `apps/web/src/styles.css`
