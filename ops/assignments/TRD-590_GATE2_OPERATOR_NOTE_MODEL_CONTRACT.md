# TRD-590 Gate 2 Operator Note Model Contract

Status: accepted

## Goal

Implement the manual operator note model contract for workspace evidence review.

## Scope

- Manual entry.
- Linked research case, evidence detail, artifacts, and source refs.
- Limitation and redaction fields.
- Explicit `decision_performed: false`.

## Blocked Scope

- Automated action, decision performance, account routing, external sources, sensitive payload
  storage, approval semantics, and performance claims.

## Acceptance

Accepted when the schema and tests prove notes are manual, local, source-linked, and
non-decisioning.
