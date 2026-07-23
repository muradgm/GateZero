# TRD-711 No-Overwrite Guard

Status: accepted

## Goal

Used atomic create-only writes to protect existing case files.

## Boundary

Local checked-in draft creation only. No UI form, upload, external storage, account, credential,
execution, automation, prediction, claim, overwrite, or gate change.

## Acceptance

Template, path, no-overwrite, parser, catalog, CLI, and repository checks pass.
