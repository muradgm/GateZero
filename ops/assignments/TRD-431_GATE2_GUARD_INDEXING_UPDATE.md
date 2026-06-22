# TRD-431 Gate 2 Guard Indexing Update

## Goal

Index the Gate 2 contract docs, source files, fixtures, and tests in the local guard.

## Scope

- Extend the contract guard artifact list.
- Require Gate 2 schemas, fixtures, and negative test snippets.
- Keep guard behavior local and deterministic.

## Blocked

- No scanner weakening.
- No missing source links.
- No unreviewed guard coverage.

## Acceptance

- Guard checks Gate 2 contract artifacts.
- Focused guard tests pass.
