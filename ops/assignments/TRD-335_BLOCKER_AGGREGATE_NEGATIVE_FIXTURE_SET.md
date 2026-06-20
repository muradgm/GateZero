# TRD-335 Blocker Aggregate Negative Fixture Set

## Goal

Expand aggregate blocker guard coverage beyond missing blocker references.

## Scope

- Detect duplicate blocker references.
- Detect unexpected aggregate reference count changes.
- Keep all blockers evidence-unusable.

## Blocked

- No completion override.
- No approval or performance language.

## Acceptance

- Guard tests fail on duplicate or expanded blocker references.
- Gate 1 contract guard passes with valid fixtures.
