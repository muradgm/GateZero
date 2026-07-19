# TRD-589 Gate 2 Local Artifact Inventory Contract

Status: accepted

## Goal

Implement the local artifact inventory contract needed by the Strategy Review Workspace.

## Scope

- Artifact id, type, local path, source category, linked research case, evidence detail, optional
  risk review, freshness, limitation notes, redaction status, blocked-scope flags, and timestamps.
- Local `ops/` and `docs/` paths only.

## Blocked Scope

- Export destinations, cloud sync, account artifacts, credentials, execution records, final
  recommendations, approval claims, and performance claims.

## Acceptance

Accepted when the schema, fixtures, and negative cases validate local evidence-file inventory only.
