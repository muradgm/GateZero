# TRD-776 Authoring Recovery And Conflict Handling

Status: accepted

## Goal

Recover valid local records and block malformed, stale, or older revisions.

## Acceptance

- Invalid JSON and invalid contracts fail closed.
- Brief-hash mismatch is blocked.
- Older revisions cannot silently replace active state.
