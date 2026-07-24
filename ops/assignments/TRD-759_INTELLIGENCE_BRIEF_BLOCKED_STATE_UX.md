# TRD-759 Intelligence Brief Blocked-State UX

Status: accepted

## Goal

Suppress scenario detail and show a clear reason when a selected local case is blocked or has no
linked brief.

## Output

- Local case selector and live availability region in the Intelligence Brief.
- Available, blocked, and unavailable fixtures.

## Acceptance

- Blocked and unavailable selections hide all `[data-brief-detail]` content.
- No blocked state creates an action route.
- Desktop and mobile presentation remain readable.

## Next

TRD-760 formalizes blocked-state reason contracts and fixtures.
