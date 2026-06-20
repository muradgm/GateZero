# TRD-360 Adapter Audit Log Boundary

## Goal

Draft the audit-log boundary for future adapter-related events.

## Scope

- Define future audit fields at a planning level.
- Require redaction and no raw credential logging.
- Keep all audit-log behavior non-implemented.

## Blocked

- No adapter audit writer.
- No raw provider payload storage.
- No credentials or account identifiers.
- No execution workflow.

## Acceptance

- Adapter audit-log boundary record exists.
- QA_SECURITY confirms it is planning-only and redaction-oriented.
- `pnpm verify:gate0` passes.
