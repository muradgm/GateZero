# TRD-720 Explicit Revision Command

Status: accepted

## Goal

Added a bounded CLI that creates one immutable revision with an explicit operator reason.

## Boundary

Allowlisted local fields only. No editor UI, upload, external storage, account, credential, or
execution.

## Acceptance

The command rejects unknown fields, missing reasons, no-op changes, and unsafe references.
